package com.honey_hotel.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.honey_hotel.backend.model.AppUser;
import com.honey_hotel.backend.repository.UserRepository;

//receive login info
//hash password
//check against hashed passwords in db
//if exists, login with login info @ id
//else return error "Seems like you don't have an account with us, register for one here"\
//redirect to homepage

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class LoginController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/api/login")
    public ResponseEntity<?> loginUser(@RequestBody AppUser user){
        if(user.getEmail == null || user.getPassword == null){
            return ResponseEntity.badRequest(),body(body: "A required field is missing.");
        }
    }
}
