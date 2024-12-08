package com.honey_hotel.backend.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

@Service
public class ReservationEmailService {

    private final EmailService emailService;

    public ReservationEmailService(EmailService emailService) {
        this.emailService = emailService;
    }

    public boolean sendReservationEmail(String email, String bookingId, String hotelLocation,
                                        String checkInDate, String checkOutDate,
                                        List<Map<String, Object>> selectedRooms, double finalTotal) {
        String subject = "Reservation Confirmation - " + bookingId;
        StringBuilder body = new StringBuilder();

        body.append("Dear Valued Guest,\n\n")
                .append("Thank you for choosing our hotel! Your reservation details are as follows:\n\n")
                .append("Hotel Location: ").append(hotelLocation).append("\n")
                .append("Booking ID: ").append(bookingId).append("\n")
                .append("Check-In Date: ").append(checkInDate).append("\n")
                .append("Check-Out Date: ").append(checkOutDate).append("\n\n")
                .append("Room Details:\n");

        for (Map<String, Object> room : selectedRooms) {
            body.append(" - Room ID: ").append(room.get("roomId"))
                    .append(", Price: $").append(room.get("totalPrice")).append("\n");
        }

        body.append("\nTotal Amount: $").append(String.format("%.2f", finalTotal)).append("\n\n")
                .append("If you have any questions or need assistance, please don't hesitate to contact us.\n\n")
                .append("Best Regards,\n")
                .append("Hotel Honey Team");

        return emailService.sendEmail(email, subject, body.toString());
    }
}
