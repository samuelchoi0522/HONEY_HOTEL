package com.honey_hotel.backend.controller;

import com.honey_hotel.backend.model.AppUser;
import com.honey_hotel.backend.model.Reservation;
import com.honey_hotel.backend.service.AdminAccessService;
import com.honey_hotel.backend.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AdminController {

    @Autowired
    private AdminAccessService adminAccessService;

    @Autowired
    private ReservationService reservationService;

    @GetMapping("/dashboard")
    public ResponseEntity<?> getAdminDashboard(HttpServletRequest request) {
        AppUser user = getLoggedInUser(request);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Error: User not logged in");
        }

        boolean hasAdminAccess = adminAccessService.isAdmin(user.getEmail());

        if (!hasAdminAccess) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Error: Access denied");
        }

        List<Reservation> reservations = reservationService.getAllReservations();
        Map<String, Object> dashboardData = new HashMap<>();
        dashboardData.put("reservations", reservations);
        return ResponseEntity.ok(dashboardData);
    }

    private AppUser getLoggedInUser(HttpServletRequest request) {
        return (AppUser) request.getSession().getAttribute("user");
    }
}
