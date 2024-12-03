package com.honey_hotel.backend.controller;

import com.honey_hotel.backend.model.AppUser;
import com.honey_hotel.backend.model.Reservation;
import com.honey_hotel.backend.service.AdminAccessService;
import com.honey_hotel.backend.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @PutMapping("/reservations/{id}/checkin")
    public ResponseEntity<?> checkInReservation(@PathVariable Long id, HttpServletRequest request) {
        AppUser user = getLoggedInUser(request);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Error: User not logged in");
        }

        boolean hasAdminAccess = adminAccessService.isAdmin(user.getEmail());

        if (!hasAdminAccess) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Error: Access denied");
        }

        Reservation reservation = reservationService.checkInReservation(id);
        if (reservation == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: Reservation not found");
        }

        return ResponseEntity.ok("Reservation checked in successfully");
    }

    @PutMapping("/reservations/{id}/checkout")
    public ResponseEntity<?> checkOutReservation(@PathVariable Long id, HttpServletRequest request) {
        AppUser user = getLoggedInUser(request);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Error: User not logged in");
        }

        boolean hasAdminAccess = adminAccessService.isAdmin(user.getEmail());

        if (!hasAdminAccess) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Error: Access denied");
        }

        Reservation reservation = reservationService.checkOutReservation(id);
        if (reservation == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: Reservation not found");
        }

        return ResponseEntity.ok("Reservation checked out successfully");
    }

    @DeleteMapping("/reservations/{id}")
    public ResponseEntity<?> deleteReservation(@PathVariable Long id, HttpServletRequest request) {
        AppUser user = getLoggedInUser(request);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Error: User not logged in");
        }

        boolean hasAdminAccess = adminAccessService.isAdmin(user.getEmail());

        if (!hasAdminAccess) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Error: Access denied");
        }

        boolean isDeleted = reservationService.deleteReservation(id);
        if (!isDeleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: Reservation not found");
        }

        return ResponseEntity.ok("Reservation deleted successfully");
    }

    private AppUser getLoggedInUser(HttpServletRequest request) {
        return (AppUser) request.getSession().getAttribute("user");
    }
}
