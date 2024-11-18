package com.honey_hotel.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.honey_hotel.backend.model.AdminAccess;

@Repository
public interface AdminAccessRepository extends JpaRepository<AdminAccess, Long> {

    boolean existsByEmail(String email);
}
