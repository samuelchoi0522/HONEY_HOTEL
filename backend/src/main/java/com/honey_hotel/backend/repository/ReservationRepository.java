package com.honey_hotel.backend.repository;

import com.honey_hotel.backend.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

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

    @Query("SELECT r FROM Reservation r WHERE r.room.id = :roomId AND r.bookingId = :bookingId AND r.user.id = :userId")
    Optional<Reservation> findByRoomIdAndBookingIdAndUser(@Param("roomId") Long roomId,
            @Param("bookingId") String bookingId, @Param("userId") Long userId);

    @Modifying
    @Query("DELETE FROM Reservation r WHERE r.room.id = :roomId AND r.bookingId = :bookingId")
    void deleteByRoomIdAndBookingId(@Param("roomId") Long roomId, @Param("bookingId") String bookingId);

    @Query("SELECT r FROM Reservation r WHERE r.bookingId = :bookingId")
    List<Reservation> findByBookingId(@Param("bookingId") String bookingId);

    @Query("SELECT r.room.id FROM Reservation r")
    List<Long> findReservedRoomIds();

    @Modifying
    @Query("UPDATE Reservation r SET r.checkInDate = :checkInDate, r.checkOutDate = :checkOutDate WHERE r.id = :reservationId AND r.user.id = :userId")
    void updateReservationDates(@Param("reservationId") Long reservationId, @Param("userId") Long userId,
            @Param("checkInDate") LocalDate checkInDate, @Param("checkOutDate") LocalDate checkOutDate);
}