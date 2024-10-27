package com.honey_hotel.backend.controller;

import com.honey_hotel.backend.model.AppUser;
import com.honey_hotel.backend.model.Reservation;
import com.honey_hotel.backend.service.ReservationService;
import com.honey_hotel.backend.service.ActivityReservationService;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ReservationController {

    private static final Logger logger = Logger.getLogger(ReservationController.class.getName());

    @Autowired
    private ReservationService reservationService;

    @Autowired
    private ActivityReservationService activityReservationService;

    // Helper method to get the logged-in user from the session
    private AppUser getLoggedInUser(HttpServletRequest request) {
        return (AppUser) request.getSession().getAttribute("user");
    }

    // Create a new reservation
    @PostMapping
    public ResponseEntity<Map<String, Object>> createReservation(@RequestBody Map<String, Object> reservationDetails,
            HttpServletRequest request) {
        AppUser user = getLoggedInUser(request);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "User not logged in"));
        }

        Long roomId = extractLongValue(reservationDetails, "roomId");
        String startDateString = (String) reservationDetails.get("startDate");
        String endDateString = (String) reservationDetails.get("endDate");

        if (roomId == null || startDateString == null || endDateString == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Missing required fields"));
        }

        try {
            LocalDate checkInDate = LocalDate.parse(startDateString);
            LocalDate checkOutDate = LocalDate.parse(endDateString);

            // Call the service to create the reservation and return the ID
            Long reservationId = reservationService.createReservation(user, roomId, checkInDate, checkOutDate);

            if (reservationId != null) {
                // Return a JSON response with the reservation ID
                return ResponseEntity.ok(Map.of("id", reservationId));
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Failed to create reservation"));
            }
        } catch (Exception e) {
            logger.severe("Error creating reservation: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Invalid date format"));
        }
    }

    // Fetch all reservations for the logged-in user
    @GetMapping
    public ResponseEntity<?> getUserReservations(HttpServletRequest request) {
        AppUser user = getLoggedInUser(request);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Error: User not logged in");
        }

        List<Reservation> reservations = reservationService.getReservationsByUser(user);
        return ResponseEntity.ok(reservations);
    }

    @GetMapping("/reserved-rooms")
    public ResponseEntity<List<Long>> getReservedRoomIds(
            @RequestParam("checkInDate") String checkInDateString,
            @RequestParam("checkOutDate") String checkOutDateString) {
        try {
            // Parse the date strings
            LocalDate checkInDate = LocalDate.parse(checkInDateString);
            LocalDate checkOutDate = LocalDate.parse(checkOutDateString);

            // Retrieve reservations that overlap with the given date range
            List<Reservation> reservations = reservationService.getReservationsInRange(checkInDate, checkOutDate);

            // Extract room IDs from reservations
            List<Long> reservedRoomIds = reservations.stream()
                    .map(reservation -> reservation.getRoom().getId()) // Access the Room's ID
                    .collect(Collectors.toList());

            return ResponseEntity.ok(reservedRoomIds);
        } catch (Exception e) {
            logger.severe("Error fetching reserved room IDs: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // Update an existing reservation
    @PutMapping("/{reservationId}")
    public ResponseEntity<String> updateReservation(@PathVariable Long reservationId,
            @RequestBody Map<String, Object> reservationDetails,
            HttpServletRequest request) {
        AppUser user = getLoggedInUser(request);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Error: User not logged in");
        }

        String startDateString = (String) reservationDetails.get("startDate");
        String endDateString = (String) reservationDetails.get("endDate");

        if (startDateString == null || endDateString == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: Missing startDate or endDate");
        }

        try {
            LocalDate checkInDate = LocalDate.parse(startDateString);
            LocalDate checkOutDate = LocalDate.parse(endDateString);
            boolean reservationUpdated = reservationService.updateReservation(reservationId, user, checkInDate,
                    checkOutDate);

            return reservationUpdated
                    ? ResponseEntity.ok("Reservation updated successfully!")
                    : ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: Failed to update reservation");

        } catch (Exception e) {
            logger.severe("Error updating reservation: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: Invalid date format");
        }
    }

    // Delete an existing reservation
    @DeleteMapping("/{reservationId}")
    public ResponseEntity<String> deleteReservation(@PathVariable Long reservationId, HttpServletRequest request) {
        AppUser user = getLoggedInUser(request);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Error: User not logged in");
        }

        boolean reservationDeleted = reservationService.deleteReservation(reservationId, user);

        return reservationDeleted
                ? ResponseEntity.ok("Reservation deleted successfully!")
                : ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: Failed to delete reservation");
    }

    // Create an activity reservation associated with a hotel reservation
    @PostMapping("/activities")
    public ResponseEntity<String> createActivityReservation(@RequestBody Map<String, Object> activityDetails,
            HttpServletRequest request) {
        AppUser user = getLoggedInUser(request);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Error: User not logged in");
        }

        Long hotelReservationId = extractLongValue(activityDetails, "hotelReservationId");
        Integer activityId = extractIntegerValue(activityDetails, "activityId");
        String activityDateString = (String) activityDetails.get("reservationDate");

        System.out.println("Hotel Reservation ID: " + hotelReservationId);
        System.out.println("Activity ID: " + activityId);
        System.out.println("Activity Date: " + activityDateString);

        // Validate all required fields
        if (hotelReservationId == null || activityId == null || activityDateString == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error: Missing hotelReservationId, activityId, or activityDate");
        }

        try {
            // Parse the activity date
            LocalDate activityDate = LocalDate.parse(activityDateString);

            // Call the service to create the activity reservation
            boolean activityReservationCreated = activityReservationService.createActivityReservation(
                    user, hotelReservationId, activityId, activityDate);

            return activityReservationCreated
                    ? ResponseEntity.ok("Activity reservation successful!")
                    : ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body("Error: Failed to create activity reservation");

        } catch (Exception e) {
            logger.severe("Error creating activity reservation: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: Internal server error");
        }
    }

    // Check user session
    @PostMapping("/check-session")
    public ResponseEntity<?> checkSession(HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        AppUser user = getLoggedInUser(request);
        if (user != null) {
            response.put("isLoggedIn", true);
            response.put("firstname", user.getFirstname());
            response.put("id", user.getId());
        } else {
            response.put("isLoggedIn", false);
        }
        return ResponseEntity.ok(response);
    }

    // Helper methods to extract values from request body
    private Long extractLongValue(Map<String, Object> map, String key) {
        return map.get(key) != null ? ((Number) map.get(key)).longValue() : null;
    }

    private Integer extractIntegerValue(Map<String, Object> map, String key) {
        return map.get(key) != null ? ((Number) map.get(key)).intValue() : null;
    }
}
