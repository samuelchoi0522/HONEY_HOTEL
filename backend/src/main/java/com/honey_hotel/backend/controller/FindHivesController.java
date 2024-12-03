package com.honey_hotel.backend.controller;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.logging.FileHandler;
import java.util.logging.Logger;
import java.util.logging.SimpleFormatter;
import java.util.logging.Level;

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

    private static final Logger logger = Logger.getLogger(FindHivesController.class.getName());

    static {
        if (logger.getHandlers().length == 0) {
            try {
                FileHandler fileHandler = new FileHandler(
                        "/Users/sam/Desktop/SWE 1/FULLSTACK_HOTEL_APP/backend/src/main/java/com/honey_hotel/backend/logs/find_hives_logs.txt",
                        true);
                fileHandler.setFormatter(new SimpleFormatter());
                logger.addHandler(fileHandler);
                logger.setLevel(Level.INFO);
            } catch (IOException e) {
                logger.severe("Failed to initialize logger file handler: " + e.getMessage());
            }
        }
    }

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

            // Log room details
            availableRooms.forEach(room -> {
                String categoryName = (room.getCategory() != null) ? room.getCategory().getCategoryName()
                        : "Unknown Category";
                logger.info("Room ID: " + room.getId() +
                        ", Category: " + categoryName +
                        ", Bed Type: " + room.getBedType() +
                        ", Smoking Allowed: " + room.isSmokingAllowed() +
                        ", Price: " + room.getPrice() +
                        ", Room Type: " + room.getRoomType() +
                        ", Price Category: " + room.getPriceCategory());
            });

            return ResponseEntity.ok(availableRooms);
        } catch (DateTimeParseException e) {
            logger.warning("Error: Invalid date format provided.");
            return ResponseEntity.badRequest().body("Error: Invalid date format. Please use MM/DD/YYYY.");
        }
    }
}
