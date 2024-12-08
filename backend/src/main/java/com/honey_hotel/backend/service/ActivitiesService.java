package com.honey_hotel.backend.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.honey_hotel.backend.model.Activities;
import com.honey_hotel.backend.repository.ActivitiesRepository;

@Service
public class ActivitiesService {

    @Autowired
    private ActivitiesRepository activitiesRepository;

    // Add a new vacation activity
    public Activities addVacation(Activities vacation) {
        return activitiesRepository.save(vacation);
    }

    // Get available vacation activities not reserved during the given dates
    public List<Activities> getAvailableVacations(LocalDate checkInDate, LocalDate checkOutDate) {
        return activitiesRepository.findAvailableActivities(checkInDate, checkOutDate);
    }
}
