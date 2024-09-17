package com.honey_hotel.backend.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.honey_hotel.backend.model.AppUser;
import com.honey_hotel.backend.repository.UserRepository;
import static com.honey_hotel.backend.utility.PasswordUtils.hashPassword;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class LoginController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/api/login")
    public ResponseEntity<?> loginUser(@RequestBody AppUser user) {
        // Check for missing fields
        if (user.getEmail() == null || user.getPassword() == null) {
            return ResponseEntity.badRequest().body("A required field is missing.");
        }

        // Hash the provided password
        String hashedP