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
@RequestMapping("/api/account")
@CrossOrigin(origins = "http://localhost:3000")
public class AccountController {
    //If logged in, go to account page, if logged out, redirect to login page
    @Autowired
    private AccountService accountService;

    public ResponseEntity<?> resetPassword(@RequestBody Map<String, Object> resetDetails, HttpServletRequest request, AppUser user){
        String newPassword = (String) resetDetails.get("newPassword");
        String confirmPassword = (String) resetDetails.get("confirmPassword");
        if (newPassword == null || confirmPassword == null){
            return ResponseEntity.badRequest().body("A required field is missing.");
        }
        if (!newPassword.equals(confirmPassword)){
            return ResponseEntity.badRequest().body("New passwords do not match.");
        }
        user.setPassword(hashPassword(newPassword));
        userRepository.save(user);
        return ResponseEntity.ok("Password changed successfully");
    }
}
