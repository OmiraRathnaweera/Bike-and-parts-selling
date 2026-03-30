package com.mj.backend.service;

import com.mj.backend.dto.BikeDTO;
import com.mj.backend.dto.BikeRequestDTO;
import com.mj.backend.dto.BikeSpecsDTO;
import com.mj.backend.model.Bike;
import com.mj.backend.model.BikeColor;
import com.mj.backend.model.BikeSpecGroup;
import com.mj.backend.model.BikeSpecRow;
import com.mj.backend.repository.BikeColorRepo;
import com.mj.backend.repository.BikeRepo;
import com.mj.backend.repository.BikeSpecGroupRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BikeService {

    @Autowired private BikeRepo       bikeRepo;
    @Autowired private BikeSpecGroupRepo groupRepo;
    @Autowired private BikeColorRepo  colorRepo;  // new

    // DTO mappers

    private BikeDTO toDTO(Bike b) {
        BikeDTO dto = new BikeDTO();
        dto.setId(b.getId());
        dto.setName(b.getName());
        dto.setTagline(b.getTagline());
        dto.setCategory(b.getCategory());
        dto.setPrice(b.getPrice());
        dto.setColor(b.getColor());
        dto.setSlug(b.getSlug());
        dto.setStock(b.isStock());
        dto.setSpecPower(b.getSpecPower());
        dto.setSpecTorque(b.getSpecTorque());
        dto.setSpecEngine(b.getSpecEngine());
        dto.setImage(b.getImage());

        dto.setColors(mapColorDTOs(b));

        return dto;
    }

    private BikeSpecsDTO toSpecsDTO(Bike b) {
        BikeSpecsDTO dto = new BikeSpecsDTO();
        dto.setId(b.getId());
        dto.setName(b.getName());
        dto.setTagline(b.getTagline());
        dto.setCategory(b.getCategory());
        dto.setPrice(b.getPrice());
        dto.setColor(b.getColor());
        dto.setSlug(b.getSlug());
        dto.setStock(b.isStock());
        dto.setSpecPower(b.getSpecPower());
        dto.setSpecTorque(b.getSpecTorque());
        dto.setSpecEngine(b.getSpecEngine());
        dto.setImage(b.getImage());

        // Colour variants
        dto.setColors(mapSpecColorDTOs(b));

        // Spec groups
        List<BikeSpecGroup> groups =
                groupRepo.findByBikeIdOrderByDisplayOrderAsc(b.getId());

        List<BikeSpecsDTO.GroupDTO> groupDTOs = groups.stream().map(g -> {
            List<BikeSpecsDTO.RowDTO> rowDTOs = g.getRows().stream()
                    .map(r -> new BikeSpecsDTO.RowDTO(
                            r.getId(), r.getLabel(), r.getValue(), r.getDisplayOrder()))
                    .collect(Collectors.toList());
            return new BikeSpecsDTO.GroupDTO(
                    g.getId(), g.getTitle(), g.getDisplayOrder(), rowDTOs);
        }).collect(Collectors.toList());

        dto.setGroups(groupDTOs);
        return dto;
    }

    private List<BikeDTO.ColorDTO> mapColorDTOs(Bike b) {
        if (b.getColors() == null || b.getColors().isEmpty()) {
            BikeDTO.ColorDTO single = new BikeDTO.ColorDTO(b.getColor(), b.getImage());
            return List.of(single);
        }
        return b.getColors().stream()
                .map(c -> new BikeDTO.ColorDTO(c.getHex(), c.getImage()))
                .collect(Collectors.toList());
    }

    private List<BikeSpecsDTO.ColorDTO> mapSpecColorDTOs(Bike b) {
        if (b.getColors() == null || b.getColors().isEmpty()) {
            BikeSpecsDTO.ColorDTO single = new BikeSpecsDTO.ColorDTO(b.getColor(), b.getImage());
            return List.of(single);
        }
        return b.getColors().stream()
                .map(c -> new BikeSpecsDTO.ColorDTO(c.getHex(), c.getImage()))
                .collect(Collectors.toList());
    }

    // Public API

    // GET all bikes
    public List<BikeDTO> getAllBikes() {
        return bikeRepo.findAllByOrderByIdAsc()
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    // GET by category
    public List<BikeDTO> getBikesByCategory(String category) {
        return bikeRepo.findByCategoryIgnoreCaseOrderByIdAsc(category)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    // GET full specs by slug (public — BikeSpecs page)
    public Optional<BikeSpecsDTO> getSpecsBySlug(String slug) {
        return bikeRepo.findBySlug(slug).map(this::toSpecsDTO);
    }

    // GET full specs by id (admin edit form)
    public Optional<BikeSpecsDTO> getSpecsById(Long id) {
        return bikeRepo.findById(id).map(this::toSpecsDTO);
    }

    // CREATE
    @Transactional
    public BikeSpecsDTO createBike(BikeRequestDTO req) {
        if (bikeRepo.existsBySlug(req.getSlug()))
            throw new IllegalArgumentException(
                    "Slug '" + req.getSlug() + "' already exists.");

        Bike bike = new Bike();
        applyFields(bike, req);
        bike = bikeRepo.save(bike);

        saveColors(bike, req.getColors(), req.getColor(), req.getImage());
        saveGroups(bike, req.getGroups());

        return toSpecsDTO(bikeRepo.findById(bike.getId()).orElseThrow());
    }

    // UPDATE
    @Transactional
    public Optional<BikeSpecsDTO> updateBike(Long id, BikeRequestDTO req) {
        return bikeRepo.findById(id).map(bike -> {
            if (bikeRepo.existsBySlugAndIdNot(req.getSlug(), id))
                throw new IllegalArgumentException(
                        "Slug '" + req.getSlug() + "' already in use.");

            applyFields(bike, req);

            // Colour variants
            bike.getColors().clear();
            bikeRepo.saveAndFlush(bike);
            saveColors(bike, req.getColors(), req.getColor(), req.getImage());

            // Spec groups
            bike.getSpecGroups().clear();
            bikeRepo.saveAndFlush(bike);
            saveGroups(bike, req.getGroups());

            return toSpecsDTO(bikeRepo.findById(id).orElseThrow());
        });
    }

    // TOGGLE STOCK
    @Transactional
    public Optional<BikeDTO> toggleStock(Long id) {
        return bikeRepo.findById(id).map(bike -> {
            bike.setStock(!bike.isStock());
            return toDTO(bikeRepo.save(bike));
        });
    }

    // DELETE
    @Transactional
    public boolean deleteBike(Long id) {
        return bikeRepo.findById(id).map(bike -> {
            // through JPA before the parent row is removed.
            bike.getColors().clear();
            bike.getSpecGroups().clear();
            bikeRepo.saveAndFlush(bike);
            bikeRepo.delete(bike);
            return true;
        }).orElse(false);
    }

    // Private helpers
    private void applyFields(Bike bike, BikeRequestDTO req) {
        bike.setName(req.getName());
        bike.setTagline(req.getTagline());
        bike.setCategory(req.getCategory().toUpperCase());
        bike.setPrice(req.getPrice());
        bike.setSlug(req.getSlug());
        bike.setStock(req.isStock());
        bike.setSpecPower(req.getSpecPower());
        bike.setSpecTorque(req.getSpecTorque());
        bike.setSpecEngine(req.getSpecEngine());

        String primaryHex   = req.getColor();
        String primaryImage = req.getImage();

        if (req.getColors() != null && !req.getColors().isEmpty()) {
            BikeRequestDTO.ColorRequest first = req.getColors().get(0);
            if (first.getHex() != null && !first.getHex().isBlank())
                primaryHex = first.getHex();
            if (first.getImage() != null && !first.getImage().isBlank())
                primaryImage = first.getImage();
        }

        bike.setColor(primaryHex);
        if (primaryImage != null && !primaryImage.isBlank())
            bike.setImage(primaryImage);
    }

    private void saveColors(Bike bike,
                            List<BikeRequestDTO.ColorRequest> colorReqs,
                            String fallbackHex,
                            String fallbackImage) {
        List<BikeRequestDTO.ColorRequest> effective = colorReqs;

        if (effective == null || effective.isEmpty()) {
            BikeRequestDTO.ColorRequest single = new BikeRequestDTO.ColorRequest(
                    fallbackHex != null ? fallbackHex : "#cccccc",
                    fallbackImage
            );
            effective = List.of(single);
        }

        for (int i = 0; i < effective.size(); i++) {
            BikeRequestDTO.ColorRequest cr = effective.get(i);
            BikeColor bc = new BikeColor();
            bc.setBike(bike);
            bc.setDisplayOrder(i);
            bc.setHex(cr.getHex() != null ? cr.getHex() : "#cccccc");
            // Only store the image if one was provided
            bc.setImage(cr.getImage() != null && !cr.getImage().isBlank()
                    ? cr.getImage() : null);
            colorRepo.save(bc);
        }
    }

    private void saveGroups(Bike bike,
                            List<BikeRequestDTO.GroupRequest> groupReqs) {
        if (groupReqs == null) return;
        for (int gi = 0; gi < groupReqs.size(); gi++) {
            BikeRequestDTO.GroupRequest gr = groupReqs.get(gi);
            BikeSpecGroup group = new BikeSpecGroup();
            group.setBike(bike);
            group.setTitle(gr.getTitle().toUpperCase());
            group.setDisplayOrder(gr.getDisplayOrder() != 0 ? gr.getDisplayOrder() : gi);
            group.setRows(new ArrayList<>());

            if (gr.getRows() != null) {
                for (int ri = 0; ri < gr.getRows().size(); ri++) {
                    BikeRequestDTO.RowRequest rr = gr.getRows().get(ri);
                    BikeSpecRow row = new BikeSpecRow();
                    row.setGroup(group);
                    row.setLabel(rr.getLabel());
                    row.setValue(rr.getValue());
                    row.setDisplayOrder(
                            rr.getDisplayOrder() != 0 ? rr.getDisplayOrder() : ri);
                    group.getRows().add(row);
                }
            }
            groupRepo.save(group);
        }
    }
}