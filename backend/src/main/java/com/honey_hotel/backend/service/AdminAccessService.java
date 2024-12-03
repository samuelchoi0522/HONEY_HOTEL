package com.honey_hotel.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.honey_hotel.backend.repository.AdminAccessRepository;

@Service
public class AdminAccessService {

    @Autowired
    private AdminAccessRepository adminAccessRepository;

    public boolean isAdmin(String email) {
        return adminAccessRepository.existsByEmail(email);
    }

    public boolean checkIfExists(Long id) {
        return adminAccessRepository.existsById(id);
    }

    public boolean checkEmail(String email) {
        return adminAccessRepository.existsByEmail(email);
    }

    public void removeAdmin(Long id) {
        adminAccessRepository.deleteById(id);
    }
}

    public boolean checkIfExists(Long id) {
        return adminAccessRepository.existsById(id);
    }

    public boolean checkEmail(String email) {
        return adminAccessRepository.existsByEmail(email);
    }

    public void removeAdmin(Long id) {
        adminAccessRepository.deleteById(id);
    }
}
