package com.honey_hotel.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.honey_hotel.backend.model.AppUser;

@Repository
public interface UserRepository extends JpaRepository<AppUser, Long> {
}
