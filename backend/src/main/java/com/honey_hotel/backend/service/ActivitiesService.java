package com.honey_hotel.backend.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.honey_hotel.backend.model.Activities;
import com.honey_hotel.backend.repository.ActivitiesRepository;

/**
 Service class for activity reservation web directory
 @author Samuel Choi
 @version 1.0 (Oct 18 2024)
 */
@Service
public class ActivitiesService {

    /**
     * Repository of all activities
     */
    @Autowired
    private ActivitiesRepository activitiesRepository;

    /**
     * Add new vacation activity to the repository
     *
     * @param vacation activity to be added
     * @return the updated repository with the new vacation activity added into it
     */
    public Activities addVacation(Activities vacation) {
        return activitiesRepository.save(vacation);
    }

    /**
     * Get available vacation activites not reserved during the given dates
     *
     * @param checkInDate check in date of the user's reservation
     * @param checkOutDate check out date of user's reservation
     * @return list of activities user has yet to reserve during the given check dates
     */
    public List<Activities> getAvailableVacations(LocalDate checkInDate, LocalDate checkOutDate) {
        return activitiesRepository.findAvailableActivities(checkInDate, checkOutDate);
    }
}
