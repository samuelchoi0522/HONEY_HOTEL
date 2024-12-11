package com.honey_hotel.backend.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.honey_hotel.backend.model.Room;
import com.honey_hotel.backend.repository.RoomRepository;

/**
 Service class for find hives web directory
 @author Samuel Choi
 @version 2.0 (Oct 17 2024)
 */
@Service
public class FindHivesService {

    /**
     * Repository of all rooms
     */
    @Autowired
    private RoomRepository roomRepository;

    /**
     * Finds available rooms in a specified hotel location within a given date range.
     *
     * @param hotelLocation location of the hotel chosen by user to sort for available rooms for
     * @param startDate start date of the desired booking chosen by user
     * @param endDate end date of the desired booking chosen by user
     * @return filtered list of available rooms
     */
    public List<Room> findAvailableRooms(String hotelLocation, LocalDate startDate, LocalDate endDate) {
        System.out.println("Query Parameters - Location: " + hotelLocation + ", Start Date: " + startDate
                + ", End Date: " + endDate);

        List<Room> availableRooms = roomRepository.findAvailableRooms(hotelLocation, startDate, endDate);

        System.out.println("SIZE: " + availableRooms.size());
        if (!availableRooms.isEmpty()) {
            String dbLocation = availableRooms.get(0).getCategory().getHotel().getName();
            System.out.println("Database location being queried: " + dbLocation);
        } else {
            System.out.println("No rooms found for location: " + hotelLocation);
        }

        return availableRooms;
    }
}
