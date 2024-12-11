package com.honey_hotel.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.honey_hotel.backend.model.ActivityReservation;
import com.honey_hotel.backend.model.Reservation;

@Repository
public interface ActivityReservationRepository extends JpaRepository<ActivityReservation, Long> {
    List<ActivityReservation> findByUserId(Long userId);

    ActivityReservation findByReservationId(Long reservationId);

    List<ActivityReservation> findByReservation(Reservation reservation);

}