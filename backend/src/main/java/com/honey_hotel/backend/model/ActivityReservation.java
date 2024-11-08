package com.honey_hotel.backend.model;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "activityreservations")
public class ActivityReservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "activity_id", nullable = false)
    private Activities activity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hotel_reservation_id", nullable = false)
    private Reservation reservation;

    @Column(name = "reservation_date", nullable = false)
    private LocalDate reservationDate;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public AppUser getUser() {
        return user;
    }

    public void setUser(AppUser user) {
        this.user = user;
    }

    public Activities getActivity() {
        return activity;
    }

    public void setActivity(Activities activity) {
        this.activity = activity;
    }

    public Reservation getReservation() {
        return reservation;
    }

    public void setReservation(Reservation reservation) {
        this.reservation = reservation;
    }

    public LocalDate getReservationDate() {
        return reservationDate;
    }

    public void setReservationDate(LocalDate reservationDate) {
        this.reservationDate = reservationDate;
    }
}
