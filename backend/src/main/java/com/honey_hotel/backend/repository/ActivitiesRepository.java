package com.honey_hotel.backend.repository;

import com.honey_hotel.backend.model.Activities;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ActivitiesRepository extends JpaRepository<Activities, Long> {

    @Query(value = "SELECT * FROM activities a WHERE a.id NOT IN (" +
            "SELECT ar.activity_id FROM activityreservations ar " +
            "WHERE ar.check_in_date < :checkOutDate AND ar.check_out_date > :checkInDate)", nativeQuery = true)
    List<Activities> findAvailableActivities(
            @Param("checkInDate") LocalDate checkInDate,
            @Param("checkOutDate") LocalDate checkOutDate);
}
