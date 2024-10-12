package com.honey_hotel.backend.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.honey_hotel.backend.model.Room;
import com.honey_hotel.backend.repository.RoomRepository;

@Service
public class FindHivesService {

    @Autowired
    private RoomRepository roomRepository;

    public List<Room> findAvailableRooms(String hotelLocation, LocalDate startDate, LocalDate endDate) {
        // Log the received location
        System.out.println("Received location: " + hotelLocation);
        System.out.println("Query Parameters - Location: " + hotelLocation + ", Start Date: " + startDate
                + ", End Date: " + endDate);
        System.out.println("Executing query with startDate: " + startDate + ", endDate: " + endDate);

        // Fetch available rooms based on the location, start date, and end date
        List<Room> availableRooms = roomRepository.findAvailableRooms(hotelLocation, startDate, endDate);

        System.out.println("SIZE: " + availableRooms.size());
        // If rooms are found, print the location for each room
        if (!availableRooms.isEmpty()) {
            String dbLocation = availableRooms.get(0).getCategory().getHotel().getName();
            System.out.println("Database location being queried: " + dbLocation);
        } else {
            System.out.println("No rooms found for location: " + hotelLocation);
        }

        return availableRooms;
    }
}
