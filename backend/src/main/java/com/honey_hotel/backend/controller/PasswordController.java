package com.honey_hotel.backend.controller;

import com.honey_hotel.backend.model.AppUser;
import com.honey_hotel.backend.repository.UserRepository;
import com.honey_hotel.backend.service.ValidateTokenService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import static com.honey_hotel.backend.utility.PasswordUtils.hashPassword;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class PasswordController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ValidateTokenService tokenService;

    // Token-based password reset endpoint
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPasswordWithToken(@RequestBody Map<String, Object> request) {
        String token = (String) request.get("token");
        String newPassword = (String) request.get("newPassword");
        String confirmPassword = (String) request.get("confirmPassword");

        if (token == null || !tokenService.validateToken(token)) {
            return ResponseEntity.status(401).body("Error: Invalid or expired token");
        }

        if (newPassword == null || confirmPassword == null) {
            return ResponseEntity.status(400).body("Error: Missing newPassword or confirmPassword");
        }

        if (newPassword.length() < 8) {
            return ResponseEntity.status(400).body("Error: Password must be at least 8 characters");
        }

        if (!newPassword.equals(confirmPassword)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Passwords do not match"));
        }

        AppUser user = tokenService.getUserByToken(token);
        if (user == null) {
            return ResponseEntity.status(404).body("Error: User not found");
        }

        user.setPassword(hashPassword(newPassword));
        userRepository.save(user);

        // Invalidate token after successful password reset
        tokenService.invalidateToken(token);

        return ResponseEntity.ok("Password reset successfully");
    }

}
