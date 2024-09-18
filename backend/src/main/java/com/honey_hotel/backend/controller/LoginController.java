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
        String hashedPassword = hashPassword(user.getPassword());

        // Find the user by email
        Optional<AppUser> existingUserOpt = userRepository.findByEmail(user.getEmail());

        if (!existingUserOpt.isPresent()) {
            // User not found
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid email or password.");
        }

        AppUser existingUser = existingUserOpt.get();

        // Compare hashed passwords
        if (!existingUser.getPassword().equals(hashedPassword)) {
            // Password does not match
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid email or password.");
        }

        // Authentication successful
        // You can include additional user details or tokens here if needed
        return ResponseEntity.ok("Login successful!");
    }
}
