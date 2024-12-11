package com.honey_hotel.backend.model;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;

/**
 Main Booking Details class with functionalities
 @author Samuel Choi
 @version 3.0 (Oct 17 2024)
 */
public class BookingDetails {

    /**
     * Location of the hotel for the booking
     */
    private String hotelLocation;

    /**
     * Start date of the booking formatted as "yyyy-MM-dd"
     */
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate startDate;

    /**
     * End date of the booking formatted as "yyyy-MM-dd"
     */
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate endDate;

    // Getters and Setters
    /**
     * Gets the location of the hotel
     *
     * @return hotel location
     */
    public String getHotelLocation() {
        return hotelLocation;
    }

    /**
     * Sets the location of the hotel
     *
     * @param hotelLocation the location to set for the hotel
     */
    public void setHotelLocation(String hotelLocation) {
        this.hotelLocation = hotelLocation;
    }

    /**
     * Gets the start date of the booking
     *
     * @return start date of the booking
     */
    public LocalDate getStartDate() {
        return startDate;
    }

    /**
     * Sets the start date of the booking
     *
     * @param startDate start date to set for the booking
     */
    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    /**
     * Gets the end date of the booking
     *
     * @return end date of the booking
     */
    public LocalDate getEndDate() {
        return endDate;
    }

    /**
     * Sets the end date of the booking
     *
     * @param endDate end date to set for the booking
     */
    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }
}
