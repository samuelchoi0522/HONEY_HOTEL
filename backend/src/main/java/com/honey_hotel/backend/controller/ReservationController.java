package com.honey_hotel.backend.controller;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.honey_hotel.backend.model.AppUser;
import com.honey_hotel.backend.model.Reservation;
import com.honey_hotel.backend.service.ActivityReservationService;
import com.honey_hotel.backend.service.ReservationEmailService;
import com.honey_hotel.backend.service.ReservationService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ReservationController {

    private static final Logger logger = Logger.getLogger(ReservationController.class.getName());

    @Autowired
    public ReservationService reservationService;

    @Autowired
    public ActivityReservationService activityReservationService;

    @Autowired
    public ReservationEmailService reservationEmailService;

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
        String hotelLocation = (String) reservationDetails.get("hotelLocation");
        Long roomId = extractLongValue(reservationDetails, "roomId");
        String startDateString = (String) reservationDetails.get("startDate");
        String endDateString = (String) reservationDetails.get("endDate");
        Integer adults = (Integer) reservationDetails.getOrDefault("adults", 1);
        Integer children = (Integer) reservationDetails.getOrDefault("children", 0);
        String promoCode = (String) reservationDetails.get("promoCode");
        String rateOption = (String) reservationDetails.get("rateOption");

        // Parse roomPrice and totalPrice
        BigDecimal roomPrice = reservationDetails.get("roomPrice") != null
                ? new BigDecimal(reservationDetails.get("roomPrice").toString())
                : BigDecimal.ZERO;
        BigDecimal totalPrice = reservationDetails.get("totalPrice") != null
                ? new BigDecimal(reservationDetails.get("totalPrice").toString())
                : BigDecimal.ZERO;

        String bookingId = (String) reservationDetails.get("bookingId");
        String photoPath = (String) reservationDetails.get("chosenPhoto");

        if (bookingId == null) {
            bookingId = UUID.randomUUID().toString();
        }

        if (roomId == null || startDateString == null || endDateString == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Missing required fields"));
        }

        try {
            LocalDate checkInDate = LocalDate.parse(startDateString);
            LocalDate checkOutDate = LocalDate.parse(endDateString);

            // Pass roomPrice and totalPrice to the service layer
            Long reservationId = reservationService.createReservation(
                    user, roomId, checkInDate, checkOutDate, adults, children, promoCode, rateOption,
                    totalPrice, roomPrice, bookingId, photoPath, hotelLocation);

            return reservationId != null
                    ? ResponseEntity.ok(Map.of("id", reservationId, "bookingId", bookingId))
                    : ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body(Map.of("error", "Failed to create reservation"));
        } catch (Exception e) {
            logger.severe("Error creating reservation: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Invalid data format"));
        }
    }

    // Fetch all reservations for the logged-in user
    @GetMapping
    public ResponseEntity<?> getUserReservations(HttpServletRequest request) {
        AppUser user = getLoggedInUser(request);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Error: User not logged in");
        }

        List<Map<String, Object>> reservations = reservationService.getReservationsByUser(user).stream()
                .map(reservation -> {
                    Map<String, Object> reservationMap = new HashMap<>();
                    reservationMap.put("hotelLocation", reservation.getHotelLocation());
                    reservationMap.put("roomId", reservation.getRoom().getId());
                    reservationMap.put("roomType", reservation.getRoom().getRoomType());
                    reservationMap.put("bedType", reservation.getRoom().getBedType());
                    reservationMap.put("smokingAllowed", reservation.getRoom().isSmokingAllowed());
                    reservationMap.put("checkInDate", reservation.getCheckInDate());
                    reservationMap.put("checkOutDate", reservation.getCheckOutDate());
                    reservationMap.put("adults", reservation.getAdults());
                    reservationMap.put("children", reservation.getChildren());
                    reservationMap.put("promoCode", reservation.getPromoCode());
                    reservationMap.put("rateOption", reservation.getRateOption());
                    reservationMap.put("roomPrice", reservation.getRoomPrice());
                    reservationMap.put("totalPrice", reservation.getTotalPrice());
                    reservationMap.put("bookingId", reservation.getBookingId());
                    reservationMap.put("photo_path", reservation.getPhoto_path());
                    return reservationMap;
                })
                .collect(Collectors.toList());

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
                    .map(reservation -> reservation.getRoom().getId())
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

    @PostMapping("/cancel")
    public ResponseEntity<String> cancelRoom(@RequestBody Map<String, Object> cancelDetails,
            HttpServletRequest request) {
        AppUser user = getLoggedInUser(request);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Error: User not logged in");
        }

        Long roomId = extractLongValue(cancelDetails, "roomId");
        String bookingId = (String) cancelDetails.get("bookingId");

        if (roomId == null || bookingId == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error: Missing roomId or bookingId in the request body");
        }

        try {
            boolean roomCanceled = reservationService.cancelRoom(user, roomId, bookingId);

            return roomCanceled
                    ? ResponseEntity.ok("Room canceled successfully!")
                    : ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: Failed to cancel the room");
        } catch (Exception e) {
            logger.severe("Error canceling room: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: Internal server error");
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

    @PostMapping("/send-reservation-email")
    public ResponseEntity<String> sendReservationEmail(@RequestBody Map<String, Object> request) {
        String email = (String) request.get("email");

        // Validate email
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body("Email address is required and cannot be empty.");
        }
        if (!email.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            return ResponseEntity.badRequest().body("Invalid email address format.");
        }

        String bookingId = (String) request.get("bookingId");
        String hotelLocation = (String) request.get("hotelLocation");
        String checkInDate = (String) request.get("checkInDate");
        String checkOutDate = (String) request.get("checkOutDate");
        List<Map<String, Object>> selectedRooms = (List<Map<String, Object>>) request.get("selectedRooms");
        double finalTotal = Double.parseDouble(request.get("finalTotal").toString());

        boolean success = reservationEmailService.sendReservationEmail(
                email, bookingId, hotelLocation, checkInDate, checkOutDate, selectedRooms, finalTotal);

        if (success) {
            return ResponseEntity.ok("Reservation email sent successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to send reservation email.");
        }
    }

}
