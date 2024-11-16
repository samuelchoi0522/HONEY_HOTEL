package com.honey_hotel.backend.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import com.honey_hotel.backend.model.AppUser;
import com.honey_hotel.backend.service.LoginService;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class LoginController {

    @Autowired
    private LoginService loginService;

    @PostMapping("/auth/login")
    public ResponseEntity<?> loginUser(@RequestBody AppUser user, HttpServletRequest request) {
        if (user.getEmail() == null || user.getPassword() == null) {
            return ResponseEntity.badRequest().body("A required field is missing.");
        }

        Optional<AppUser> existingUserOpt = loginService.validateUserCredentials(user.getEmail(), user.getPassword());

        if (!existingUserOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password.");
        }

        loginService.setSession(request, existingUserOpt.get());
        return ResponseEntity.ok("Login successful!");
    }

    @PostMapping("/auth/check-session")
    public ResponseEntity<?> checkSession(HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        if (loginService.isUserLoggedIn(request)) {
            AppUser user = (AppUser) request.getSession().getAttribute("user");
            response.put("isLoggedIn", true);
            response.put("firstname", user.getFirstname());
            response.put("lastname", user.getLastname());
            response.put("email", user.getEmail());
        } else {
            response.put("isLoggedIn", false);
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/auth/logout")
    public ResponseEntity<?> logoutUser(HttpServletRequest request) {
        loginService.invalidateSession(request);
        return ResponseEntity.ok("Logout successful.");
    }

    
}
