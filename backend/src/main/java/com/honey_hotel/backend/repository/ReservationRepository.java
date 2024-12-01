package com.honey_hotel.backend.repository;

import com.honey_hotel.backend.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 Repository class for reservations
 @author Samuel Choi
 @version 2.0 (Oct 26 2024)
 */
@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    /**
     * Finds all reservations associated with a specific user
     *
     * @param userId ID of the user
     * @return A filtered list of reservations
     */
    List<Reservation> findByUserId(Long userId);

    /**
     * Finds all reservations associated with a specific room
     *
     * @param roomId ID of the room
     * @return A filtered list of reservations
     */
    List<Reservation> findByRoomId(Long roomId);

    /**
     * Finds all reservations that fall within the given date range
     *
     * @param startDate start date of the range to check
     * @param endDate end date of the range to check
     * @return A filtered list of reservations within the specified date range
     */
    @Query("SELECT r FROM Reservation r WHERE r.checkInDate <= :endDate AND r.checkOutDate >= :startDate")
    List<Reservation> findReservationsInRange(@Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);
}
