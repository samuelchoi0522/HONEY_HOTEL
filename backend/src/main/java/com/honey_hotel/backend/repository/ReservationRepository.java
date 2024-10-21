package com.honey_hotel.backend.repository;

import com.honey_hotel.backend.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    @Query("SELECT r FROM Reservation r WHERE r.room.id = :roomId AND " +
            "((:checkInDate BETWEEN r.checkInDate AND r.checkOutDate) OR " +
            "(:checkOutDate BETWEEN r.checkInDate AND r.checkOutDate) OR " +
            "(r.checkInDate BETWEEN :checkInDate AND :checkOutDate))")
    List<Reservation> findConflictingReservations(
            @Param("roomId") Long roomId,
            @Param("checkInDate") LocalDate checkInDate,
            @Param("checkOutDate") LocalDate checkOutDate);
}
