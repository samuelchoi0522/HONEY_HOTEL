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

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class LoginController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/api/login")
    public ResponseEntity<?> loginUser(@RequestBody AppUser user, HttpServletRequest request) {
        // Check for missing fields
        if (user.getEmail() == null || user.getPassword() == null) {
            return ResponseEntity.badRequest().body("A required field is missing.");
        }

        // Hash the provided password
        String hashedPassword = hashPassword(user.getPassword());

        // Find the user by email
        Optional<AppUser> existingUserOpt = userRepository.findByEmail(user.getEmail());

        if (!existingUserOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid email or password.");
        }

        AppUser existingUser = existingUserOpt.get();

        // Compare hashed passwords
        if (!existingUser.getPassword().equals(hashedPassword)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid email or password.");
        }

        // Set user session
        HttpSession session = request.getSession(true);
        session.setAttribute("user", existingUser);

        // Log user login and session ID
        System.out.println(existingUser.getEmail() + " has logged in.");
        System.out.println("Session created with ID: " + session.getId());

        return ResponseEntity.ok("Login successful!");
    }

    @PostMapping("/api/check-session")
    public ResponseEntity<?> checkSession(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null && session.getAttribute("user") != null) {
            AppUser user = (AppUser) session.getAttribute("user");
            System.out.println(user.getEmail() + " is already logged in, redirecting to homepage.");
            return ResponseEntity.ok(user.getEmail() + " is already logged in, redirecting to homepage.");
        }
        return ResponseEntity.ok("No user logged in.");
    }

    @PostMapping("/api/logout")
    public ResponseEntity<?> logoutUser(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        AppUser user = (AppUser) session.getAttribute("user");
        if (session != null) {
            System.out.println(user.getEmail() + " logged out.");
            session.invalidate();
        }
        return ResponseEntity.ok("Logout successful.");
    }
}
