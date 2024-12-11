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

    public List<Reservation> getReservationsByUser(AppUser user) {
        return reservationRepository.findByUserId(user.getId());
    }

    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    public List<Long> getReservedRoomIds() {
        return reservationRepository.findAll().stream()
                .map(reservation -> reservation.getRoom().getId())
                .collect(Collectors.toList());
    }

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

    public List<Reservation> getReservationsInRange(LocalDate checkInDate, LocalDate checkOutDate) {
        return reservationRepository.findReservationsInRange(checkInDate, checkOutDate);
    }

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


    public boolean isUserLoggedIn(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            Object user = session.getAttribute("user");
            return user != null && user instanceof AppUser;
        }
        return false;
    }

    public Reservation checkInReservation(Long id) {
        Reservation reservation = reservationRepository.findById(id).orElse(null);
        if (reservation != null) {
            reservation.setCheckedIn(true);
            return reservationRepository.save(reservation);
        }
        return null;
    }

    public Reservation checkOutReservation(Long id) {
        Reservation reservation = reservationRepository.findById(id).orElse(null);
        if (reservation != null) {
            reservation.setCheckedIn(false);
            return reservationRepository.save(reservation);
        }
        return null;
    }

    public boolean deleteReservation(Long id) {
        if (reservationRepository.existsById(id)) {
            reservationRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public Reservation findReservationById(Long id) {
        return reservationRepository.findById(id).orElse(null);
    }
}