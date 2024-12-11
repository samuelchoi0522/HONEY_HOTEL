package com.honey_hotel.backend.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Health Check controller class to break down complicated tasks with an array
 * of simpler function calls
 * 
 * @author Samuel Choi
 * @version 2.0 (Oct 5 2024)
 */
@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/healthCheck")
public class HealthCheckController {
    
    /**
     * Used to verify if server health is OK (checking if server is up and running)
     *
     * @return simple string message indicating the health status
     */
    @GetMapping
    public String isHealthOK(){
        return "Health is OK";
    }
}
