package com.honey_hotel.backend.controller;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.logging.Logger;

import com.honey_hotel.backend.service.AccountService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.honey_hotel.backend.model.AppUser;
import com.honey_hotel.backend.service.LoginService;
import jakarta.servlet.http.HttpServletRequest;
import com.honey_hotel.backend.repository.*;

import static com.honey_hotel.backend.utility.PasswordUtils.hashPassword;

@RestController
@RequestMapping("/api/account")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AccountController {
    //If logged in, go to account page, if logged out, redirect to login page
    @Autowired
    private UserRepository userRepository;

    private static final Logger logger = Logger.getLogger(AccountController.class.getName());

    private AppUser getLoggedInUser(HttpServletRequest request) {
        HttpSession session = request.getSession(false); // Get existing session, if any
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
        String newPassword = (String) request.get("newPassword");
        String confirmPassword = (String) request.get("confirmPassword");

        AppUser user = getLoggedInUser(servletRequest);

        if (user == null) {
            logger.severe("User is not logged in or session has expired.");
            return ResponseEntity.status(401).body("Error: User is not authenticated");
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

        user.setPassword(hashPassword(newPassword));
        userRepository.save(user);
        return ResponseEntity.ok("Password Reset Successfully");
    }
}