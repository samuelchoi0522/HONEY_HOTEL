package com.honey_hotel.backend.repository;

import com.honey_hotel.backend.model.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 Repository class for AppUsers
 @author Samuel Choi
 @version 1.0 (Oct 17 2024)
 */
@Repository
public interface AppUserRepository extends JpaRepository<AppUser, Long> {
}
