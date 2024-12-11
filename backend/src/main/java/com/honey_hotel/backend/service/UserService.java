package com.honey_hotel.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.honey_hotel.backend.model.AdminAccess;
import com.honey_hotel.backend.model.AppUser;
import com.honey_hotel.backend.model.ClerkAccess;
import com.honey_hotel.backend.repository.AdminAccessRepository;
import com.honey_hotel.backend.repository.ClerkAccessRepository;
import com.honey_hotel.backend.repository.ReservationRepository;
import com.honey_hotel.backend.repository.UserRepository;

import jakarta.transaction.Transactional;

/**
 * Service class for users
 *
 * @author Samuel Choi
 * @Version 1.0 (12/3/24)
 */
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AdminAccessRepository adminAccessRepository;

    @Autowired
    private ClerkAccessRepository clerkAccessRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    public List<AppUser> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * Deletes a user found by its id
     *
     * @param id, id used to find user
     * @return true if user is found/exists and is deleted, false otherwise
     */
    @Transactional
    public boolean deleteUserById(Long id) {
        Optional<AppUser> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent()) {
            AppUser user = optionalUser.get();
            String email = user.getEmail();

            // Delete admin access if it exists
            adminAccessRepository.deleteByEmail(email);

            // Delete clerk access if it exists
            clerkAccessRepository.deleteByEmail(email);

            // Delete reservations if they exist
            reservationRepository.deleteByUserId(id);

            // Finally, delete the user
            userRepository.deleteById(id);
            return true;
        }
        return false; // User not found
    }

    /**
     * Promotes a user to clerk found by their id
     *
     * @param userId, id of user to be promoted
     * @return true if user exists and is successfully promoted, false otherwise
     */
    public boolean promoteToClerk(Long userId) {
        Optional<AppUser> optionalUser = userRepository.findById(userId);
        if (optionalUser.isPresent()) {
            AppUser user = optionalUser.get();

            // If the user is an admin, remove their admin access
            if (adminAccessRepository.existsByEmail(user.getEmail())) {
                adminAccessRepository.deleteByEmail(user.getEmail()); // Correct deletion by email
            }

            // Add the user to clerk access if not already a clerk
            if (!clerkAccessRepository.existsByEmail(user.getEmail())) {
                ClerkAccess clerkAccess = new ClerkAccess();
                clerkAccess.setEmail(user.getEmail()); // Set email
                clerkAccessRepository.save(clerkAccess);
            }

            return true;
        }
        return false; // User not found
    }

    /**
     * Promotes a user to admin found by their id
     *
     * @param userId, id of user to be promoted
     * @return true if user exists and is successfully promoted, false otherwise
     */
    public boolean promoteToAdmin(Long userId) {
        Optional<AppUser> optionalUser = userRepository.findById(userId);
        if (optionalUser.isPresent()) {
            AppUser user = optionalUser.get();

            // If the user is a clerk, remove their clerk access
            if (clerkAccessRepository.existsByEmail(user.getEmail())) {
                clerkAccessRepository.deleteByEmail(user.getEmail()); // Correct deletion by email
            }

            // Add the user to admin access if not already an admin
            if (!adminAccessRepository.existsByEmail(user.getEmail())) {
                AdminAccess adminAccess = new AdminAccess();
                adminAccess.setEmail(user.getEmail()); // Set email
                adminAccessRepository.save(adminAccess);
            }

            return true;
        }
        return false; // User not found
    }

    /**
     * Demotes a clerk or admin to a guest
     *
     * @param userId, id of user to be demoted
     * @return true if user exists and is successfully demoted, false otherwise
     */
    public boolean demoteToGuest(Long userId) {
        Optional<AppUser> optionalUser = userRepository.findById(userId);
        if (optionalUser.isPresent()) {
            AppUser user = optionalUser.get();

            try {
                // Remove clerk access if it exists
                if (clerkAccessRepository.existsByEmail(user.getEmail())) {
                    clerkAccessRepository.deleteByEmail(user.getEmail());
                }

                // Remove admin access if it exists
                if (adminAccessRepository.existsByEmail(user.getEmail())) {
                    adminAccessRepository.deleteByEmail(user.getEmail());
                }

                return true; // Successfully demoted to guest
            } catch (Exception e) {
                throw new RuntimeException("Failed to demote user to guest: " + e.getMessage(), e);
            }
        }
        return false; // User not found
    }

}
