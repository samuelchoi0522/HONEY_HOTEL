package com.honey_hotel.backend.controller;

import com.honey_hotel.backend.model.AppUser;
import com.honey_hotel.backend.model.Reservation;
import com.honey_hotel.backend.repository.ClerkAccessRepository;
import com.honey_hotel.backend.repository.UserRepository;
import com.honey_hotel.backend.service.ReservationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.honey_hotel.backend.repository.AppUserRepository;
import com.honey_hotel.backend.repository.ClerkAccessRepository;
import com.honey_hotel.backend.repository.UserRepository;
import com.honey_hotel.backend.service.ClerkAccessService;
import org.apache.catalina.User;

import java.util.Map;

@RestController
@RequestMapping("/api/clerk")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ClerkAccessController {
    @Autowired
    public ClerkAccessService clerkAccessService;

    @Autowired
    public UserRepository userRepository;

    @Autowired
    public ReservationService reservationService;

    private boolean checkIfUserIsClerk(HttpServletRequest request) {
        AppUser user = (AppUser) request.getSession().getAttribute("user");
        return user != null && clerkAccessService.isClerk(user.getEmail());
    }

    @PostMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> initiateReservationForCustomer(
            @RequestBody Map<String, Object> requestDetails,
            HttpServletRequest request) {
        String customerEmail = (String) requestDetails.get("customerEmail");

        if (customerEmail == null || customerEmail.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Customer email is required"));
        }

        AppUser customer = userRepository.findByEmail(customerEmail).orElse(null);
        if (customer == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Customer not found"));
        }

        //request.getSession().setAttribute("user", customer);

        return ResponseEntity.ok(Map.of(
                "message", "Customer session set successfully. Redirecting to reservation page.",
                "redirectUrl", "/find-hive"
        ));
    }

    @PostMapping("/reservations")
    public String createReservation(@RequestBody Reservation reservationRequest, HttpServletRequest request) {
        if (!checkIfUserIsClerk(request)) {
            return "redirect:/error";
        }

        try {
            Long savedReservationID = reservationService.createReservation(reservationRequest);

            if (savedReservationID != null) {
                return "redirect:/clerk/dashboard";
            } else {
                return "redirect:/error";
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "redirect:/error";
        }
    }

}
