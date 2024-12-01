package com.honey_hotel.backend.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.honey_hotel.backend.model.Room;

/**
 Repository class for rooms
 @author Samuel Choi
 @version 3.0 (Oct 26 2024)
 */
@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {

    /**
     * Finds a list of available rooms in a specified hotel location
     * within the given date range.
     *
     * @param location hotel location to search
     * @param startDate start date of the desired reservation period
     * @param endDate end date of the desired reservation period
     * @return A filtered list of available rooms
     */
    @Query("SELECT r FROM Room r "
            + "JOIN r.category rc "
            + "JOIN rc.hotel h "
            + "WHERE LOWER(h.name) LIKE LOWER(CONCAT('%', :location, '%')) "
            + "AND NOT EXISTS ("
            + "    SELECT res FROM Reservation res "
            + "    WHERE res.room = r "
            + "    AND (res.checkInDate <= :endDate AND res.checkOutDate >= :startDate)"
            + ")")
    List<Room> findAvailableRooms(@Param("location") String location,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    /**
     * Custom query to find a Room by its ID (optional)
     *
     * @param roomId ID of the room to retrieve
     * @return a room if found by matching ID, empty if none matches
     */
    @Query("SELECT r FROM Room r WHERE r.id = :roomId")
    Optional<Room> findRoomById(@Param("roomId") Long roomId);
}
