package com.honey_hotel.backend.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.honey_hotel.backend.model.AppUser;
import com.honey_hotel.backend.model.Reservation;
import com.honey_hotel.backend.service.AdminAccessService;
import com.honey_hotel.backend.service.ClerkAccessService;
import com.honey_hotel.backend.service.ReservationService;
import com.honey_hotel.backend.service.UserService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AdminController {

    @Autowired
    private AdminAccessService adminAccessService;

    @Autowired
    private ClerkAccessService clerkAccessService;

    @Autowired
    private ReservationService reservationService;

    @Autowired
    private UserService userService;

    // bookings tab

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

    // users tab

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(HttpServletRequest request) {
        AppUser user = getLoggedInUser(request);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Error: User not logged in");
        }

        boolean hasAdminAccess = adminAccessService.isAdmin(user.getEmail());

        if (!hasAdminAccess) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Error: Access denied");
        }

        List<AppUser> users = userService.getAllUsers();
        List<Map<String, Object>> response = users.stream().map(appUser -> {
            Map<String, Object> userDetails = new HashMap<>();
            userDetails.put("id", appUser.getId());
            userDetails.put("email", appUser.getEmail());
            userDetails.put("firstname", appUser.getFirstname());
            userDetails.put("lastname", appUser.getLastname());
            userDetails.put("isAdmin", adminAccessService.isAdmin(appUser.getEmail()));
            userDetails.put("isClerk", clerkAccessService.isClerk(appUser.getEmail())); // Add a clerk access check
            return userDetails;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id, HttpServletRequest request) {
        AppUser user = getLoggedInUser(request);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Error: User not logged in");
        }

        boolean hasAdminAccess = adminAccessService.isAdmin(user.getEmail());

        if (!hasAdminAccess) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Error: Access denied");
        }

        try {
            boolean isDeleted = userService.deleteUserById(id);
            if (!isDeleted) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: User not found");
            }
        } catch (Exception e) {
            // Log the stack trace for debugging
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }

        return ResponseEntity.ok("User deleted successfully");
    }

    @PutMapping("/users/{id}/makeClerk")
    public ResponseEntity<?> promoteToClerk(@PathVariable Long id, HttpServletRequest request) {
        AppUser user = getLoggedInUser(request);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Error: User not logged in");
        }

        boolean hasAdminAccess = adminAccessService.isAdmin(user.getEmail());

        if (!hasAdminAccess) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Error: Access denied");
        }

        boolean isPromoted = userService.promoteToClerk(id);
        if (!isPromoted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: User not found");
        }

        return ResponseEntity.ok("User promoted to Clerk successfully");
    }

    @PutMapping("/users/{id}/makeAdmin")
    public ResponseEntity<?> promoteToAdmin(@PathVariable Long id, HttpServletRequest request) {
        AppUser user = getLoggedInUser(request);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Error: User not logged in");
        }

        boolean hasAdminAccess = adminAccessService.isAdmin(user.getEmail());

        if (!hasAdminAccess) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Error: Access denied");
        }

        boolean isPromoted = userService.promoteToAdmin(id);
        if (!isPromoted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: User not found");
        }

        return ResponseEntity.ok("User promoted to Administrator successfully");
    }
}
