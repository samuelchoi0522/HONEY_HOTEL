package com.honey_hotel.backend.controller;

import java.util.*;
import java.util.logging.Logger;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.honey_hotel.backend.model.AppUser;
import jakarta.servlet.http.HttpServletRequest;
import com.honey_hotel.backend.repository.*;

import static com.honey_hotel.backend.utility.PasswordUtils.hashPassword;

@RestController
@RequestMapping("/api/account")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AccountController {
    @Autowired
    private UserRepository userRepository;

    private static final Logger logger = Logger.getLogger(AccountController.class.getName());

    private AppUser getLoggedInUser(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null) {
            logger.severe("No session found.");
            return null;
        }
        AppUser user = (AppUser) session.getAttribute("user");
        if (user == null) {
            logger.severe("User attribute not found in session.");
        }
        return user;
    }


    @RequestMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, Object> request, HttpServletRequest servletRequest) {
        String oldPassword = (String) request.get("oldPassword");
        String newPassword = (String) request.get("newPassword");
        String confirmPassword = (String) request.get("confirmPassword");

        AppUser user = getLoggedInUser(servletRequest);

        if (user == null) {
            logger.severe("User is not logged in or session has expired.");
            return ResponseEntity.status(401).body("Error: User is not authenticated");
        }

        if (!(hashPassword(oldPassword).equals(user.getPassword()))) {
            logger.severe("Old password does not match.");
            return ResponseEntity.status(401).body("Error: Old password does not match");
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

        if (oldPassword.equals(newPassword)){
            return ResponseEntity.status(401).body("Error: New password cannot be the same as old password");
        }

        user.setPassword(hashPassword(newPassword));
        userRepository.save(user);
        return ResponseEntity.ok("Password Reset Successfully");
    }
}