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

import java.util.Optional;

/**
 Registration controller class to break down complicated tasks with an array of simpler function calls
 @author Samuel Choi
 @version 3.0 (Oct 2 2024)
 */
@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class RegistrationController {

    @Autowired
    private UserRepository userRepository;

    /**
     * Web directory to register a new user by validating input fields and saving the user to the database
     *
     * @param user user containing registration details (title, first name, last name, email, and password)
     * @return ResponseEntity indicating whether registration was successful or if a required field is missing
     */
    @PostMapping("/api/register")
    public ResponseEntity<?> registerUser(@RequestBody AppUser user) {
        if (user.getTitle() == null || user.getFirstname() == null || user.getLastname() == null
                || user.getEmail() == null || user.getPassword() == null) {
            return ResponseEntity.badRequest().body("A required field is missing.");
        }
        Optional<AppUser> existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            return ResponseEntity.badRequest().body("User with this email already exists.");
        }

        user.setPassword(hashPassword(user.getPassword()));
        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully");
    }
}