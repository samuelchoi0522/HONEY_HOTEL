package com.honey_hotel.backend.component;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/healthCheck")
public class HealthCheckController {

    @GetMapping
    public String isHealthOK(){
        return "Health is OK";
    }
}
