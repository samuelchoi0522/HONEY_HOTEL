package com.honey_hotel.backend.controller;

import com.honey_hotel.backend.model.AppUser;
import com.honey_hotel.backend.service.ReservationService;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private static final Logger logger = Logger.getLogger(ReservationController.class.getName());

    @Autowired
    private ReservationService reservationService;

    @PostMapping
    public ResponseEntity<String> createReservation(@RequestBody Map<String, Object> reservationDetails) {
        Long userId = reservationDetails.get("userId") != null ? ((Number) reservationDetails.get("userId")).longValue() : null;
        Long roomId = reservationDetails.get("roomId") != null ? ((Number) reservationDetails.get("roomId")).longValue() : null;

        if (userId == null) {
            logger.severe("Missing userId");
            return ResponseEntity.status(400).body("Error: Missing userId");
        }
        if (roomId == null) {
            logger.severe("Missing roomId");
            return ResponseEntity.status(400).body("Error: Missing roomId");
        }

        String startDateString = (String) reservationDetails.get("startDate");
        String endDateString = (String) reservationDetails.get("endDate");

        logger.info("Received startDate: " + startDateString);
        logger.info("Received endDate: " + endDateString);

        if (startDateString == null || endDateString == null) {
            logger.severe("Missing startDate or endDate");
            return ResponseEntity.status(400).body("Error: Missing startDate or endDate");
        }

        try {
            LocalDate checkInDate = LocalDate.parse(startDateString);
            LocalDate checkOutDate = LocalDate.parse(endDateString);

            logger.info("Parsed checkInDate: " + checkInDate);
            logger.info("Parsed checkOutDate: " + checkOutDate);

            boolean reservationCreated = reservationService.createReservation(userId, roomId, checkInDate, checkOutDate);

            if (reservationCreated) {
                logger.info("Reservation successful");
                return ResponseEntity.ok("Reservation successful!");
            } else {
                logger.severe("Failed to create reservation");
                return ResponseEntity.status(400).body("Error: Failed to create reservation");
            }

        } catch (Exception e) {
            logger.severe("Error parsing dates: " + e.getMessage());
            return ResponseEntity.status(400).body("Error: Invalid date format");
        }
    }

    @PostMapping("/check-session")
    public ResponseEntity<?> checkSession(HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        if (reservationService.isUserLoggedIn(request)) {
            AppUser user = (AppUser) request.getSession().getAttribute("user");
            response.put("isLoggedIn", true);
            response.put("firstname", user.getFirstname());
            response.put("id", user.getId());
        } else {
            response.put("isLoggedIn", false);
        }
        return ResponseEntity.ok(response);
    }
}
