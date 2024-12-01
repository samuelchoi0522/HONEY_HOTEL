package com.honey_hotel.backend.controller;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.honey_hotel.backend.model.BookingDetails;
import com.honey_hotel.backend.model.Room;
import com.honey_hotel.backend.service.FindHivesService;

/**
 Find Hives controller class to break down complicated tasks with an array of simpler function calls
 @author Samuel Choi
 @version 4.0 (Oct 26 2024)
 */
@RestController
@RequestMapping("/api/hives")
public class FindHivesController {

    @Autowired
    private FindHivesService findHivesService;

    /**
     * Finds available rooms based on the given hotel location, start date, and end date
     *
     * @param bookingDetails booking details containing the hotel location, start date, and end date
     * @return ResponseEntity containing a list of available rooms or an error message if the date format is invalid
     */
    @PostMapping("/find")
    public ResponseEntity<?> findRooms(@RequestBody BookingDetails bookingDetails) {
        try {
            LocalDate startDate = bookingDetails.getStartDate();
            LocalDate endDate = bookingDetails.getEndDate();

            List<Room> availableRooms = findHivesService.findAvailableRooms(
                    bookingDetails.getHotelLocation(),
                    startDate,
                    endDate);

            // Debug: Print room details
            availableRooms.forEach(room -> {
                String categoryName = (room.getCategory() != null) ? room.getCategory().getCategoryName()
                        : "Unknown Category";
                System.out.println("Room ID: " + room.getId() +
                        ", Category: " + categoryName +
                        ", Bed Type: " + room.getBedType() +
                        ", Smoking Allowed: " + room.isSmokingAllowed() +
                        ", Price: " + room.getPrice() +
                        ", Room Type: " + room.getRoomType() +
                        ", Price Category: " + room.getPriceCategory());
            });

            return ResponseEntity.ok(availableRooms);
        } catch (DateTimeParseException e) {
            return ResponseEntity.badRequest().body("Error: Invalid date format. Please use MM/DD/YYYY.");
        }
    }
}
