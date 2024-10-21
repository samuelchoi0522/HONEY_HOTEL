package com.honey_hotel.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
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
public class RegistrationController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/api/register")
    public ResponseEntity<?> registerUser(@RequestBody AppUser user) {
        if (user.getTitle() == null || user.getFirstname() == null || user.getLastname() == null || user.getEmail() == null || user.getPassword() == null) {
            return ResponseEntity.badRequest().body("A required field is missing.");
        }
        user.setPassword(hashPassword(user.getPassword()));

        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully");
    }
}