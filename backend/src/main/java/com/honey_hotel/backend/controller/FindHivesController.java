package com.honey_hotel.backend.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.honey_hotel.backend.model.BookingDetails;

@RestController
@RequestMapping("/api/hives")
public class FindHivesController {

    @PostMapping("/find")
    public void receiveBookingDetails(@RequestBody BookingDetails details) {
        System.out.println("Hotel: " + details.getHotel());
        System.out.println("Start Date: " + details.getStartDate());
        System.out.println("End Date: " + details.getEndDate());
        System.out.println("Nights: " + details.getNights());
        System.out.println("Rooms: " + details.getRooms());
        System.out.println("Adults: " + details.getAdults());
        System.out.println("Children: " + details.getChildren());
        System.out.println("Rate Option: " + details.getRateOption());
        if (details.getRateOption().equals("Promo Code")) {
            System.out.println("Promo Code: " + details.getPromoCode());
        }
    }
}
