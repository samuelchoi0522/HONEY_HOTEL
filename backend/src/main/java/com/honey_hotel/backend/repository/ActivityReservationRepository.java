package com.honey_hotel.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.honey_hotel.backend.model.ActivityReservation;
import com.honey_hotel.backend.model.Reservation;

/**
 Repository class for activity reservations
 @author Samuel Choi, Aiden Grajo
 @version 1.0 (Oct 26 2024)
 */
@Repository
public interface ActivityReservationRepository extends JpaRepository<ActivityReservation, Long> {

    /**
     * Finds all activity reservations associated with a specific user
     *
     * @param userId ID of the user
     * @return A filtered list of activity reservations
     */
    List<ActivityReservation> findByUserId(Long userId);

    ActivityReservation findByReservationId(Long reservationId);

    List<ActivityReservation> findByReservation(Reservation reservation);

}