package com.honey_hotel.backend.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.honey_hotel.backend.model.Room;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {

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

    // Custom query to find a Room by its ID (optional)
    @Query("SELECT r FROM Room r WHERE r.id = :roomId")
    Optional<Room> findRoomById(@Param("roomId") Long roomId);
}
