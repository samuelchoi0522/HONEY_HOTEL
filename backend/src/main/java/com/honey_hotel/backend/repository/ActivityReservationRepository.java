package com.honey_hotel.backend.repository;

import com.honey_hotel.backend.model.ActivityReservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 Repository class for activity reservations
 @author Samuel Choi
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

    /**
     * Finds all activity reservations associated with a specific reservation
     *
     * @param reservationId ID of the reservation
     * @return A filtered list of activity reservations
     */
    List<ActivityReservation> findByReservationId(Long reservationId);
}
