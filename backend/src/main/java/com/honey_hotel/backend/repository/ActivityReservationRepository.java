package com.honey_hotel.backend.repository;

import com.honey_hotel.backend.model.ActivityReservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityReservationRepository extends JpaRepository<ActivityReservation, Long> {
    List<ActivityReservation> findByUserId(Long userId);

    List<ActivityReservation> findByReservationId(Long reservationId);
}
