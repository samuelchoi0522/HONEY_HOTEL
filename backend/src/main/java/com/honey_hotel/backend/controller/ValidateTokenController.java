package com.honey_hotel.backend.controller;

import com.honey_hotel.backend.service.ValidateTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ValidateTokenController {

    @Autowired
    private ValidateTokenService tokenService;

    @GetMapping("/validate-token")
    public ResponseEntity<Void> validateToken(@RequestParam("token") String token) {
        boolean isValid = tokenService.validateToken(token);

        if (isValid) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
}
