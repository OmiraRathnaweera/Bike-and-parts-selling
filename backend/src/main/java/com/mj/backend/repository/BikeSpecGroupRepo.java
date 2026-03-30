package com.mj.backend.repository;

import com.mj.backend.model.BikeSpecGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BikeSpecGroupRepo extends JpaRepository<BikeSpecGroup, Long> {
    List<BikeSpecGroup> findByBikeIdOrderByDisplayOrderAsc(Long bikeId);
    void                deleteByBikeId(Long bikeId);
}