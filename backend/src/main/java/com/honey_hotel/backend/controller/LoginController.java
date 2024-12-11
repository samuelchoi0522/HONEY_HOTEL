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

/**
 Login controller class to break down complicated tasks with an array of simpler function calls
 @author Samuel Choi
 @version 3.0 (Oct 11 2024)
 */
@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class LoginController {

    @Autowired
    private LoginService loginService;

<<<<<<< HEAD
    @PostMapping("/auth/login")
=======
    /**
     * Login web directory that allows user to enter user credentials to log in
     *
     * @param user user with email and password for authentication
     * @param request HTTP request object used to manage the session
     * @return ResponseEntity indicating whether login was successful or not
     */
    @PostMapping("/api/login")
>>>>>>> fe227865f0619dbf68d39fee7e46956ba40479ff
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

<<<<<<< HEAD
    @PostMapping("/auth/check-session")
=======
    /**
     * Web directory used to check if a user is currently logged in
     *
     * @param request HTTP request object used to check the session state
     * @return ResponseEntity containing the login status and user's first name if logged in
     */
    @PostMapping("/api/check-session")
>>>>>>> fe227865f0619dbf68d39fee7e46956ba40479ff
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

<<<<<<< HEAD
    @PostMapping("/auth/logout")
=======
    /**
     * Web directory to log out a user by invalidating their credentials
     *
     * @param request HTTP request object used to invalidate the session
     * @return ResponseEntity indicating if logout was successful
     */
    @PostMapping("/api/logout")
>>>>>>> fe227865f0619dbf68d39fee7e46956ba40479ff
    public ResponseEntity<?> logoutUser(HttpServletRequest request) {
        loginService.invalidateSession(request);
        return ResponseEntity.ok("Logout successful.");
    }
}
