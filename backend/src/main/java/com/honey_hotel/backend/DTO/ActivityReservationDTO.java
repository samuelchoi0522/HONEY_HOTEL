package com.honey_hotel.backend.DTO;

import java.time.LocalDate;

public class ActivityReservationDTO {
    private Long id;
    private String activityName;
    private LocalDate reservationDate;

    public ActivityReservationDTO(Long id, String activityName, LocalDate reservationDate) {
        this.id = id;
        this.activityName = activityName;
        this.reservationDate = reservationDate;
    }

    public Long getId() {
        return id;
    }

    public String getActivityName() {
        return activityName;
    }

    public LocalDate getReservationDate() {
        return reservationDate;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setActivityName(String activityName) {
        this.activityName = activityName;
    }

    public void setReservationDate(LocalDate reservationDate) {
        this.reservationDate = reservationDate;
    }
}
