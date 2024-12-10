package com.honey_hotel.backend.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.honey_hotel.backend.DTO.ActivityReservationDTO;
import com.honey_hotel.backend.model.Activities;
import com.honey_hotel.backend.service.ActivitiesService;
import com.honey_hotel.backend.service.ActivityReservationService;

/**
 Activity controller class to break down complicated tasks with an array of simpler function calls
 @author Samuel Choi
 @version 1.0 (Oct 18 2024)
 */
@RestController
@RequestMapping("/api/vacations")
@CrossOrigin(origins = "http://localhost:3000")
public class ActivitiesController {

    @Autowired
    private ActivitiesService activitiesService;

    @Autowired
    private ActivityReservationService activitiesReservationService;

    // Add a new activity
    /**
     * Adds a new vacation activity to the system
     *
     * @param vacation vacation activity to be added
     * @return ResponseEntity containing the saved activity
     */
    @PostMapping
    public ResponseEntity<Activities> addVacation(@RequestBody Activities vacation) {
        Activities savedVacation = activitiesService.addVacation(vacation);
        return ResponseEntity.ok(savedVacation);
    }

    // Get available activities (filtered by reservation dates)
    /**
     * Retrieves a list of available vacation activities, filtered by the given reservation dates
     *
     * @param checkInDate check-in date of the reservation
     * @param checkOutDate check-out date of the reservation
     * @return ResponseEntity containing the list of available activities, or a BAD_REQUEST status if invalid dates are provided
     */
    @GetMapping("/available")
    public ResponseEntity<List<Activities>> getAvailableVacations(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkInDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOutDate) {
        if (checkInDate == null || checkOutDate == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
        List<Activities> availableVacations = activitiesService.getAvailableVacations(checkInDate, checkOutDate);
        return ResponseEntity.ok(availableVacations);
    }

    @GetMapping("/{hotelReservationId}")
    public ResponseEntity<ActivityReservationDTO> getActivityReservationByHotelReservationId(
            @PathVariable Long hotelReservationId) {
        ActivityReservationDTO activityReservationDTO = activitiesReservationService
                .getActivityReservationByHotelReservationId(hotelReservationId);
        if (activityReservationDTO != null) {
            return ResponseEntity.ok(activityReservationDTO);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

}