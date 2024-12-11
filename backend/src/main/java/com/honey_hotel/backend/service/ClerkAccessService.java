package com.honey_hotel.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.honey_hotel.backend.repository.ClerkAccessRepository;

/**
 * Services for checking if person has clerk permissions or is clerk and to remove clerk permissions
 *
 * @author Samuel Choi
 * @Version 1.0 (12/3/24)
 */
@Service
public class ClerkAccessService {

    @Autowired
    private ClerkAccessRepository clerkAccessRepository;

    public boolean isClerk(String email) {
        return clerkAccessRepository.existsByEmail(email);
    }

    public boolean checkIfExists(Long id) {
        return clerkAccessRepository.existsById(id);
    }

    public boolean checkEmail(String email) {
        return clerkAccessRepository.existsByEmail(email);
    }

    public void removeClerk(Long id) {
        clerkAccessRepository.deleteById(id);
    }
}