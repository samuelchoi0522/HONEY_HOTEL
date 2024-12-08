package com.honey_hotel.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.honey_hotel.backend.model.AdminAccess;

import jakarta.transaction.Transactional;

@Repository
public interface AdminAccessRepository extends JpaRepository<AdminAccess, Long> {
    @Modifying
    @Transactional
    @Query("DELETE FROM AdminAccess a WHERE a.email = :email")
    void deleteByEmail(@Param("email") String email);

    boolean existsByEmail(String email);
}
