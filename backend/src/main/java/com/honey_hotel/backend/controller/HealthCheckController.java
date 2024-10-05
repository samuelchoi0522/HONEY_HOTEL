package com.honey_hotel.backend.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/healthCheck")
public class HealthCheckController {

    @GetMapping
    public String isHealthOK(){
        return "Health is OK";
    }
}
