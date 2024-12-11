package com.honey_hotel.backend.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.honey_hotel.backend.service.ForgotPasswordService;

@RestController
@RequestMapping("/api")
public class ForgotPasswordController {

    private final ForgotPasswordService forgotPasswordService;

    /**
     * Copy constructor for the forgot password service
     * 
     * @param forgotPasswordService, service that holds all the functions for forgot
     *                               password
     */
    public ForgotPasswordController(ForgotPasswordService forgotPasswordService) {
        this.forgotPasswordService = forgotPasswordService;
    }

    /**
     * Sends a password reset link to the email inputted by the user to reset the
     * password
     *
     * @param request, map that holds data received from the frontend
     * @return Response entity stating the password reset link was sent, system
     *         error if not
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<String> sendResetLink(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        boolean success = forgotPasswordService.sendResetToken(email);

        if (success) {
            return ResponseEntity.ok("Password reset link sent successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("System error. Please try again later.");
        }
    }
}
