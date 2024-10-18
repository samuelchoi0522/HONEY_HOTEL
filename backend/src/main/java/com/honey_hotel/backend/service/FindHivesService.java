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
