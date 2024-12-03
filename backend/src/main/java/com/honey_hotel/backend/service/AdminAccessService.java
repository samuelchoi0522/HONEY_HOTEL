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
}
