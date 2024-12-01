package com.honey_hotel.backend.service;

import com.honey_hotel.backend.model.AppUser;
import com.honey_hotel.backend.model.Reservation;
import com.honey_hotel.backend.model.Room;
import com.honey_hotel.backend.repository.ReservationRepository;
import com.honey_hotel.backend.repository.RoomRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 Service class for reservations
 @author Samuel Choi
 @version 2.0 (Oct 26 2024)
 */

@Service
public class ReservationService {

    /**
     * Repository of all reservations
     */
    @Autowired
    private ReservationRepository reservationRepository;

    /**
     * Respository of all rooms
     */
    @Autowired
    private RoomRepository roomRepository;

    /**
     * Create a new reservation
     *
     * @param user         The user making the reservation
     * @param roomId       The ID of the room to be reserved
     * @param checkInDate  The check-in date
     * @param checkOutDate The check-out date
     * @return True if the reservation is created successfully, false otherwise
     */
    public Long createReservation(AppUser user, Long roomId, LocalDate checkInDate, LocalDate checkOutDate) {
        try {
            // Fetch the room by roomId
            Optional<Room> roomOpt = roomRepository.findById(roomId);
            if (roomOpt.isEmpty()) {
                return null; // Room not found
            }

            Reservation reservation = new Reservation();
            reservation.setUser(user); // Set the user directly
            reservation.setRoom(roomOpt.get()); // Set the fetched Room
            reservation.setCheckInDate(checkInDate);
            reservation.setCheckOutDate(checkOutDate);

            // Save the reservation and return its ID
            Reservation savedReservation = reservationRepository.save(reservation);
            return savedReservation.getId();
        } catch (Exception e) {
            e.printStackTrace();
            return null; // Return null on failure
        }
    }

    /**
     * Retrieve reservations for a specific user
     *
     * @param user The user for whom reservations are retrieved
     * @return List of reservations
     */
    public List<Reservation> getReservationsByUser(AppUser user) {
        return reservationRepository.findByUserId(user.getId());
    }

    /**
     * Retrieve all reservations
     *
     * @return List of all reservations
     */
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    /**
     * Retrieve all reserved room IDs
     *
     * @return List of reserved room IDs
     */
    public List<Long> getReservedRoomIds() {
        return reservationRepository.findAll().stream()
                .map(reservation -> reservation.getRoom().getId())
                .collect(Collectors.toList());
    }

    /**
     * Update an existing reservation
     *
     * @param reservationId The ID of the reservation to update
     * @param user          The user making the update
     * @param checkInDate   The new check-in date
     * @param checkOutDate  The new check-out date
     * @return True if the update is successful, false otherwise
     */
    public boolean updateReservation(Long reservationId, AppUser user, LocalDate checkInDate, LocalDate checkOutDate) {
        Optional<Reservation> reservationOpt = reservationRepository.findById(reservationId);
        if (reservationOpt.isPresent()) {
            Reservation reservation = reservationOpt.get();
            // Ensure the reservation belongs to the user
            if (!reservation.getUser().getId().equals(user.getId())) {
                return false;
            }
            reservation.setCheckInDate(checkInDate);
            reservation.setCheckOutDate(checkOutDate);
            reservationRepository.save(reservation);
            return true;
        }
        return false;
    }

    public List<Reservation> getReservationsInRange(LocalDate checkInDate, LocalDate checkOutDate) {
        return reservationRepository.findReservationsInRange(checkInDate, checkOutDate);
    }

    /**
     * Delete an existing reservation
     *
     * @param reservationId The ID of the reservation to delete
     * @param user          The user making the deletion
     * @return True if the deletion is successful, false otherwise
     */
    public boolean deleteReservation(Long reservationId, AppUser user) {
        Optional<Reservation> reservationOpt = reservationRepository.findById(reservationId);
        if (reservationOpt.isPresent()) {
            Reservation reservation = reservationOpt.get();
            // Ensure the reservation belongs to the user
            if (!reservation.getUser().getId().equals(user.getId())) {
                return false;
            }
            reservationRepository.delete(reservation);
            return true;
        }
        return false;
    }

    /**
     * Check if a user is logged in by inspecting the session
     *
     * @param request The HTTP request
     * @return True if the user is logged in, false otherwise
     */
    public boolean isUserLoggedIn(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            Object user = session.getAttribute("user");
            return user != null && user instanceof AppUser;
        }
        return false;
    }
}
