package com.mj.backend.repository;

import com.mj.backend.model.Bike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BikeRepo extends JpaRepository<Bike, Long> {
    List<Bike>     findAllByOrderByIdAsc();
    List<Bike>     findByCategoryIgnoreCaseOrderByIdAsc(String category);
    Optional<Bike> findBySlug(String slug);
    boolean        existsBySlug(String slug);
    boolean        existsBySlugAndIdNot(String slug, Long id);
}