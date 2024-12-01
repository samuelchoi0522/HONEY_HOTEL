package com.honey_hotel.backend.service;

import com.honey_hotel.backend.model.ActivityReservation;
import com.honey_hotel.backend.model.AppUser;
import com.honey_hotel.backend.model.Reservation;
import com.honey_hotel.backend.model.Activities;
import com.honey_hotel.backend.repository.ActivityReservationRepository;
import com.honey_hotel.backend.repository.ReservationRepository;
import com.honey_hotel.backend.repository.ActivitiesRepository;

import java.time.LocalDate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 Service class for activity reservation web directory
 @author Samuel Choi
 @version 1.0 (Oct 26 2024)
 */
@Service
public class ActivityReservationService {

    /**
     * Repository of all activity reservations
     */
    @Autowired
    private ActivityReservationRepository activityReservationRepository;

    /**
     * Repository of all reservations
     */
    @Autowired
    private ReservationRepository reservationRepository;

    /**
     * Repository of all activities
     */
    @Autowired
    private ActivitiesRepository activitiesRepository;

    /**
     * Creates an activity reservation.
     *
     * @param user               The user making the reservation (AppUser object).
     * @param hotelReservationId The ID of the associated hotel reservation.
     * @param activityId         The ID of the activity to be reserved.
     * @param activityDate       The date of the activity reservation.
     * @return True if the reservation was created successfully, false otherwise.
     */
    public boolean createActivityReservation(AppUser user, Long hotelReservationId, Integer activityId,
            LocalDate activityDate) {
        try {
            // Fetch the Reservation and Activities entities from the database
            Reservation reservation = reservationRepository.findById(hotelReservationId).orElse(null);
            Activities activity = activitiesRepository.findById(Long.valueOf(activityId)).orElse(null);

            // Check if both reservation and activity exist
            if (reservation == null || activity == null) {
                return false; // Either reservation or activity not found
            }

            // Create a new ActivityReservation instance
            ActivityReservation activityReservation = new ActivityReservation();
            activityReservation.setUser(user);
            activityReservation.setReservation(reservation);
            activityReservation.setActivity(activity);

            // Set the reservation date to the provided activity date
            activityReservation.setReservationDate(activityDate);

            // Save the activity reservation to the repository
            activityReservationRepository.save(activityReservation);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
