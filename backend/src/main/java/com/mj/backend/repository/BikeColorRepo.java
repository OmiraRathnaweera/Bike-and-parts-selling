package com.mj.backend.repository;

import com.mj.backend.model.BikeColor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface BikeColorRepo extends JpaRepository<BikeColor, Long> {
    @Modifying
    @Query("DELETE FROM BikeColor bc WHERE bc.bike.id = :bikeId")
    void deleteByBikeId(@Param("bikeId") Long bikeId);
}