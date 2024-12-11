package com.honey_hotel.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.honey_hotel.backend.model.ClerkAccess;

import jakarta.transaction.Transactional;

/**
 * Repository holding information on who has clerk access
 *
 * @author Samuel Choi
 * @Version 2.0 (12/8/24)
 */
@Repository
public interface ClerkAccessRepository extends JpaRepository<ClerkAccess, Long> {
    @Modifying
    @Transactional
    @Query("DELETE FROM ClerkAccess a WHERE a.email = :email")
    void deleteByEmail(@Param("email") String email);

    boolean existsByEmail(String email);
}