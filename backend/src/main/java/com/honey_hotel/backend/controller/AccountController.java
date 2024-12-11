package com.honey_hotel.backend.controller;

import java.util.Map;
import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.honey_hotel.backend.model.AppUser;
import com.honey_hotel.backend.repository.UserRepository;
import static com.honey_hotel.backend.utility.PasswordUtils.hashPassword;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

/**
 * Account controller class to break down complicated tasks with an array of
 * simpler function calls
 * 
 * @author Eugene Pak
 * @version 3.2 (Oct 30 2024)
 */
@RestController
@RequestMapping("/api/account")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AccountController {
    // If logged in, go to account page, if logged out, redirect to login page
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

    /**
     * Resets the user's password
     * Validates the old password, checks if the new password matches confirmation,
     * and updates the password
     * if all conditions are met
     *
     * @param request        map containing the old password, new password, and
     *                       confirm password
     * @param servletRequest HttpServletRequest to manage the session
     * @return a ResponseEntity indicating the result of the password reset attempt
     */
    @RequestMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, Object> request,
            HttpServletRequest servletRequest) {
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

        if (oldPassword.equals(newPassword)) {
            return ResponseEntity.status(401).body("Error: New password cannot be the same as old password");
        }

        user.setPassword(hashPassword(newPassword));
        userRepository.save(user);

        HttpSession session = servletRequest.getSession();
        session.setAttribute("user", user);

        return ResponseEntity.ok("Password Reset Successfully");
    }

    @PostMapping("/update-name")
    public ResponseEntity<?> updateName(@RequestBody Map<String, String> request, HttpServletRequest servletRequest) {
        AppUser user = getLoggedInUser(servletRequest);
        if (user == null) {
            return ResponseEntity.status(401).body("Error: User is not authenticated");
        }

        logger.info("Updating name for user: " + user.getEmail());

        String firstName = request.get("firstName");
        String lastName = request.get("lastName");

        logger.info("New name: " + firstName + " " + lastName);

        user.setFirstname(firstName);
        user.setLastname(lastName);

        userRepository.save(user);

        HttpSession session = servletRequest.getSession();
        session.setAttribute("user", user);

        logger.info("Name updated successfully");
        return ResponseEntity.ok("Name updated successfully");
    }

    @PostMapping("/update-email")
    public ResponseEntity<?> updateEmail(@RequestBody Map<String, String> request, HttpServletRequest servletRequest) {
        AppUser user = getLoggedInUser(servletRequest);
        if (user == null) {
            return ResponseEntity.status(401).body("Error: User is not authenticated");
        }

        String email = request.get("email");

        user.setEmail(email);
        userRepository.save(user);

        HttpSession session = servletRequest.getSession();
        session.setAttribute("user", user);

        return ResponseEntity.ok("Email updated successfully");
    }
}