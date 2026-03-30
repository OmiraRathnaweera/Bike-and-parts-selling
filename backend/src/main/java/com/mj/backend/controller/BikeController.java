package com.mj.backend.controller;

import com.mj.backend.dto.BikeRequestDTO;
import com.mj.backend.dto.ResponseDTO;
import com.mj.backend.service.BikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bikes")
@CrossOrigin(origins = "http://localhost:3000")
public class BikeController {

    @Autowired
    private BikeService bikeService;

    // ---PUBLIC---

    // GET all bikes, card data only (BikeInventory.js)
    @GetMapping
    public ResponseEntity<ResponseDTO> getAllBikes() {
        return ResponseEntity.ok(
                ResponseDTO.success("Bikes fetched", bikeService.getAllBikes()));
    }

    // GET Filtered list
    @GetMapping("/category/{category}")
    public ResponseEntity<ResponseDTO> getByCategory(@PathVariable String category) {
        return ResponseEntity.ok(
                ResponseDTO.success("Bikes fetched", bikeService.getBikesByCategory(category)));
    }

    // GET full specs by slug
    @GetMapping("/slug/{slug}")
    public ResponseEntity<ResponseDTO> getSpecsBySlug(@PathVariable String slug) {
        return bikeService.getSpecsBySlug(slug)
                .map(dto -> ResponseEntity.ok(ResponseDTO.success("Specs fetched", dto)))
                .orElse(ResponseEntity.ok(ResponseDTO.error("Bike not found")));
    }

    // ---ADMIN---

    // GET full specs by id for admin edit form
    @GetMapping("/{id}/specs")
    public ResponseEntity<ResponseDTO> getSpecsById(@PathVariable Long id) {
        return bikeService.getSpecsById(id)
                .map(dto -> ResponseEntity.ok(ResponseDTO.success("Specs fetched", dto)))
                .orElse(ResponseEntity.ok(ResponseDTO.error("Bike not found")));
    }

    // POST create bike and specs
    @PostMapping
    public ResponseEntity<ResponseDTO> createBike(@RequestBody BikeRequestDTO req) {
        try {
            return ResponseEntity.ok(
                    ResponseDTO.success("Bike created", bikeService.createBike(req)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.ok(ResponseDTO.error(e.getMessage()));
        }
    }

    // PUT update bike + replace all specs
    @PutMapping("/{id}")
    public ResponseEntity<ResponseDTO> updateBike(
            @PathVariable Long id, @RequestBody BikeRequestDTO req) {
        try {
            return bikeService.updateBike(id, req)
                    .map(dto -> ResponseEntity.ok(ResponseDTO.success("Bike updated", dto)))
                    .orElse(ResponseEntity.ok(ResponseDTO.error("Bike not found")));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.ok(ResponseDTO.error(e.getMessage()));
        }
    }

    // PATCH toggle stock status
    @PatchMapping("/{id}/stock")
    public ResponseEntity<ResponseDTO> toggleStock(@PathVariable Long id) {
        return bikeService.toggleStock(id)
                .map(dto -> ResponseEntity.ok(ResponseDTO.success("Stock updated", dto)))
                .orElse(ResponseEntity.ok(ResponseDTO.error("Bike not found")));
    }

    // DELETE bike and all spec rows
    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseDTO> deleteBike(@PathVariable Long id) {
        boolean deleted = bikeService.deleteBike(id);
        return ResponseEntity.ok(deleted
                ? ResponseDTO.success("Bike deleted", null)
                : ResponseDTO.error("Bike not found"));
    }

}