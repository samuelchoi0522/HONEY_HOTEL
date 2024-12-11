package com.honey_hotel.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.honey_hotel.backend.model.AppUser;

/**
 Repository class for users
 @author Samuel Choi
 @version 1.0 (Sep 17 2024)
 */
@Repository
public interface UserRepository extends JpaRepository<AppUser, Long> {

    /**
     * Retrieves an AppUser by their email inputted by the user
     *
     * @param email inputted by the user
     * @return an AppUser matching the email given by the user, empty if no match
     */
    Optional<AppUser> findByEmail(String email);

    void deleteById(Long id);

    boolean existsById(Long id);
    
}
