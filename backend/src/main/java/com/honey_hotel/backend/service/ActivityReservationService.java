package com.honey_hotel.backend.service;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.honey_hotel.backend.DTO.ActivityReservationDTO;
import com.honey_hotel.backend.model.Activities;
import com.honey_hotel.backend.model.ActivityReservation;
import com.honey_hotel.backend.model.AppUser;
import com.honey_hotel.backend.model.Reservation;
import com.honey_hotel.backend.repository.ActivitiesRepository;
import com.honey_hotel.backend.repository.ActivityReservationRepository;
import com.honey_hotel.backend.repository.ReservationRepository;

@Service
public class ActivityReservationService {

    @Autowired
    private ActivityReservationRepository activityReservationRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private ActivitiesRepository activitiesRepository;

    public boolean createActivityReservation(AppUser user, Long hotelReservationId, Integer activityId,
            LocalDate activityDate) {
        try {
            // Fetch the Reservation and Activities entities from the database
            Reservation reservation = reservationRepository.findById(hotelReservationId).orElse(null);
            Activities activity = activitiesRepository.findById(Long.valueOf(activityId)).orElse(null);

            // Check if both reservation and activity exist
            if (reservation == null || activity == null) {
                return false;
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

    public ActivityReservationDTO getActivityReservationByHotelReservationId(Long hotelReservationId) {
        ActivityReservation activityReservation = activityReservationRepository.findByReservationId(hotelReservationId);
        if (activityReservation != null) {
            return new ActivityReservationDTO(
                    activityReservation.getId(),
                    activityReservation.getActivity().getName(),
                    activityReservation.getReservationDate());
        }
        return null;
    }

}
