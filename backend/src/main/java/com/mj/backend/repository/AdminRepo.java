package com.mj.backend.repository;

import com.mj.backend.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdminRepo extends JpaRepository<Admin, Long> {

    Optional<Admin> findByEmail(String email);

    boolean existsByEmail(String email);

    long countByRole(String role);

    List<Admin> findByRole(String role);

    List<Admin> findByActiveTrue();

    // Check role is already taken (for OWNER and ACCOUNTANT)
    boolean existsByRole(String role);
}