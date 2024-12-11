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

    @Transactional
    public boolean deleteUserById(Long id) {
        Optional<AppUser> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent()) {
            AppUser user = optionalUser.get();
            String email = user.getEmail();

            adminAccessRepository.deleteByEmail(email);

            clerkAccessRepository.deleteByEmail(email);

            reservationRepository.deleteByUserId(id);

            userRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public boolean promoteToClerk(Long userId) {
        Optional<AppUser> optionalUser = userRepository.findById(userId);
        if (optionalUser.isPresent()) {
            AppUser user = optionalUser.get();

            if (adminAccessRepository.existsByEmail(user.getEmail())) {
                adminAccessRepository.deleteByEmail(user.getEmail());
            }

            if (!clerkAccessRepository.existsByEmail(user.getEmail())) {
                ClerkAccess clerkAccess = new ClerkAccess();
                clerkAccess.setEmail(user.getEmail());
                clerkAccessRepository.save(clerkAccess);
            }

            return true;
        }
        return false;
    }

    public boolean promoteToAdmin(Long userId) {
        Optional<AppUser> optionalUser = userRepository.findById(userId);
        if (optionalUser.isPresent()) {
            AppUser user = optionalUser.get();

            if (clerkAccessRepository.existsByEmail(user.getEmail())) {
                clerkAccessRepository.deleteByEmail(user.getEmail());
            }

            if (!adminAccessRepository.existsByEmail(user.getEmail())) {
                AdminAccess adminAccess = new AdminAccess();
                adminAccess.setEmail(user.getEmail());
                adminAccessRepository.save(adminAccess);
            }

            return true;
        }
        return false;
    }

    public boolean demoteToGuest(Long userId) {
        Optional<AppUser> optionalUser = userRepository.findById(userId);
        if (optionalUser.isPresent()) {
            AppUser user = optionalUser.get();

            try {
                if (clerkAccessRepository.existsByEmail(user.getEmail())) {
                    clerkAccessRepository.deleteByEmail(user.getEmail());
                }

                if (adminAccessRepository.existsByEmail(user.getEmail())) {
                    adminAccessRepository.deleteByEmail(user.getEmail());
                }

                return true;
            } catch (Exception e) {
                throw new RuntimeException("Failed to demote user to guest: " + e.getMessage(), e);
            }
        }
        return false;
    }

}
