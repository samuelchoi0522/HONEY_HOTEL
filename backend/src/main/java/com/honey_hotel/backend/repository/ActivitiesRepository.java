package com.honey_hotel.backend.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.honey_hotel.backend.model.Activities;

/**
 Repository class for activities
 @author Samuel Choi
 @version 2.0 (Oct 26 2024)
 */
@Repository
public interface ActivitiesRepository extends JpaRepository<Activities, Long> {

    /**
     * Finds all available activities that are not reserved within the given date range
     *
     * @param checkInDate start date of the date range to check for activity availability
     * @param checkOutDate end date of the date range to check for activity availability
     * @return A filtered list of available activities during the given date range
     */
    @Query(value = "SELECT * FROM activities a WHERE a.id NOT IN (" +
            "SELECT ar.activity_id FROM activityreservations ar " +
            "WHERE ar.reservation_date BETWEEN :checkInDate AND :checkOutDate)", nativeQuery = true)
    List<Activities> findAvailableActivities(
            @Param("checkInDate") LocalDate checkInDate,
            @Param("checkOutDate") LocalDate checkOutDate);


}
