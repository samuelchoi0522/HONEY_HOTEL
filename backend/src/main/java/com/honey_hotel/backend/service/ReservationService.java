package com.honey_hotel.backend.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.honey_hotel.backend.model.ActivityReservation;
import com.honey_hotel.backend.model.AppUser;
import com.honey_hotel.backend.model.Reservation;
import com.honey_hotel.backend.model.Room;
import com.honey_hotel.backend.repository.ActivityReservationRepository;
import com.honey_hotel.backend.repository.ReservationRepository;
import com.honey_hotel.backend.repository.RoomRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;

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
    private ActivityReservationRepository activityReservationRepository;

    @Autowired
    private RoomRepository roomRepository;

    /**
     * Creates reservation given another reservation information
     * @param other, second reservation to be copied
     * @return Long, reservation id, or null if errors
     */
    public Long createReservation(Reservation other) {
        try {
            Reservation reservation = new Reservation();
            reservation.setUser(other.getUser());
            reservation.setRoom(other.getRoom());
            reservation.setCheckInDate(other.getCheckInDate());
            reservation.setCheckOutDate(other.getCheckOutDate());
            reservation.setAdults(other.getAdults());
            reservation.setChildren(other.getChildren());
            reservation.setPromoCode(other.getPromoCode());
            reservation.setRateOption(other.getRateOption());
            reservation.setTotalPrice(other.getTotalPrice());
            reservation.setRoomPrice(other.getRoomPrice());
            reservation.setBookingId(other.getBookingId());
            reservation.setPhoto_path(other.getPhoto_path());
            reservation.setHotelLocation(other.getHotelLocation());

            Reservation savedReservation = reservationRepository.save(reservation);
            return savedReservation.getId();
        }
        catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * Conventional reservation creation through parameters inputted by the user on the front end
     * @param user, user who is logged in
     * @param roomId, id of the room the user wishes to book
     * @param checkInDate, date of checkin user desires
     * @param checkOutDate, date of checkout user desires
     * @param adults, amount of people within certain age group
     * @param children, amount of people within certain age group
     * @param promoCode, promo code inputted by user
     * @param rateOption, rate option
     * @param totalPrice, total price of booking
     * @param roomPrice, price of room that has been selected per night
     * @param bookingId, id generated from the booking
     * @param photo_path, photo path
     * @param hotelLocation, location of the hotel user has chosen
     * @return Long, reservation id, or null if errors
     */
    public Long createReservation(AppUser user, Long roomId, LocalDate checkInDate, LocalDate checkOutDate,
                                  int adults, int children, String promoCode, String rateOption, BigDecimal totalPrice, BigDecimal roomPrice,
                                  String bookingId, String photo_path, String hotelLocation) {
        try {
            Optional<Room> roomOpt = roomRepository.findById(roomId);
            if (roomOpt.isEmpty()) {
                return null;
            }

            Reservation reservation = new Reservation();
            reservation.setUser(user);
            reservation.setRoom(roomOpt.get());
            reservation.setCheckInDate(checkInDate);
            reservation.setCheckOutDate(checkOutDate);
            reservation.setAdults(adults);
            reservation.setChildren(children);
            reservation.setPromoCode(promoCode);
            reservation.setRateOption(rateOption);
            reservation.setTotalPrice(totalPrice);
            reservation.setRoomPrice(roomPrice);
            reservation.setBookingId(bookingId);
            reservation.setPhoto_path(photo_path);
            reservation.setHotelLocation(hotelLocation);

            Reservation savedReservation = reservationRepository.save(reservation);
            return savedReservation.getId();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * Gets all reservations of a single user
     *
     * @param user, user that is logged into the page unless otherwise specified
     * @return List, list of reservations booked by user
     */
    public List<Reservation> getReservationsByUser(AppUser user) {
        return reservationRepository.findByUserId(user.getId());
    }

    /**
     * Gets all reservations in the repository
     *
     * @return List, list of every reservation made
     */
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    /**
     * Gets ids of all reserved rooms
     *
     * @return List, list of ids of every reservation
     */
    public List<Long> getReservedRoomIds() {
        return reservationRepository.findAll().stream()
                .map(reservation -> reservation.getRoom().getId())
                .collect(Collectors.toList());
    }

    /**
     * Updates reservation detail with edits made by user
     *
     * @param reservationId, id of reservation
     * @param user, user who has made or is making the edits
     * @param checkInDate, date of checkin
     * @param checkOutDate, date of checkout
     * @return true if reservation has been successfully updated, false otherwise
     */
    public boolean updateReservation(Long reservationId, AppUser user, LocalDate checkInDate, LocalDate checkOutDate) {
        Optional<Reservation> reservationOpt = reservationRepository.findById(reservationId);
        if (reservationOpt.isPresent()) {
            Reservation reservation = reservationOpt.get();
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

    /**
     * Gets all reservations within a certain date range
     *
     * @param checkInDate, date of checkin
     * @param checkOutDate, date of checkout
     * @return List, ist of all reservations made within certain date range
     */
    public List<Reservation> getReservationsInRange(LocalDate checkInDate, LocalDate checkOutDate) {
        return reservationRepository.findReservationsInRange(checkInDate, checkOutDate);
    }

    /**
     * Deletes a reservation from the repository
     *
     * @param reservationId, id of reservation
     * @param user, user who is wanting to cancel or delete reservation
     * @return true if reservation has been deleted, false otherwise
     */
    public boolean deleteReservation(Long reservationId, AppUser user) {
        Optional<Reservation> reservationOpt = reservationRepository.findById(reservationId);
        if (reservationOpt.isPresent()) {
            Reservation reservation = reservationOpt.get();
            if (!reservation.getUser().getId().equals(user.getId())) {
                return false;
            }
            reservationRepository.delete(reservation);
            return true;
        }
        return false;
    }

    /**
     * Cancels a user's booking
     *
     * @param user, user who wishes to cancel
     * @param roomId, id of room being canceled
     * @param bookingId
     * @return
     */
    @Transactional
    public boolean cancelRoom(AppUser user, Long roomId, String bookingId) {
        try {
            // Fetch the reservation based on the provided criteria
            Optional<Reservation> reservationOpt = reservationRepository.findByRoomIdAndBookingIdAndUser(
                    roomId, bookingId, user.getId());

            if (reservationOpt.isPresent()) {
                Reservation reservation = reservationOpt.get();

                // Fetch all associated activity reservations
                List<ActivityReservation> activityReservations = activityReservationRepository
                        .findByReservation(reservation);

                // Delete all associated activity reservations
                if (!activityReservations.isEmpty()) {
                    activityReservationRepository.deleteAll(activityReservations);
                }

                // Delete the main reservation
                reservationRepository.delete(reservation);

                return true;
            } else {
                return false; // No reservation found
            }
        } catch (Exception e) {
            e.printStackTrace();
            return false; // Handle any unexpected exceptions
        }
    }

    /**
     * Checks if the user is logged in through session management
     *
     * @param request, session management request
     * @return true if user is logged in, false otherwise
     */
    public boolean isUserLoggedIn(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            Object user = session.getAttribute("user");
            return user != null && user instanceof AppUser;
        }
        return false;
    }

    /**
     * Check in service for a reservation
     *
     * @param id, id of reservation being checked in
     * @return reservation, updated with it being checked in if successful, null otherwise
     */
    public Reservation checkInReservation(Long id) {
        Reservation reservation = reservationRepository.findById(id).orElse(null);
        if (reservation != null) {
            reservation.setCheckedIn(true);
            return reservationRepository.save(reservation);
        }
        return null;
    }

    /**
     * Check out service for a reservation
     *
     * @param id, id of reservation that requires checking out
     * @return reservation, updated with it being checked out if successful, null otherwise
     */
    public Reservation checkOutReservation(Long id) {
        Reservation reservation = reservationRepository.findById(id).orElse(null);
        if (reservation != null) {
            reservation.setCheckedIn(false);
            return reservationRepository.save(reservation);
        }
        return null;
    }

    /**
     * Deletes a reservation found by its id
     *
     * @param id, id of a reservation
     * @return true of reservation has been found and deleted, false otherwise
     */
    public boolean deleteReservation(Long id) {
        if (reservationRepository.existsById(id)) {
            reservationRepository.deleteById(id);
            return true;
        }
        return false;
    }

    /**
     * Finds reservation by its respective id
     *
     * @param id, if of reservation to be found
     * @return reservation, reservation corresponding to the id, null otherwise
     */
    public Reservation findReservationById(Long id) {
        return reservationRepository.findById(id).orElse(null);
    }
}