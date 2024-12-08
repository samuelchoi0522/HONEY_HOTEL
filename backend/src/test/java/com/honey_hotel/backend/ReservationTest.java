package com.honey_hotel.backend;

import com.honey_hotel.backend.model.Reservation;
import com.honey_hotel.backend.service.ReservationService;
import com.honey_hotel.backend.controller.ReservationController;
import com.honey_hotel.backend.model.AppUser;
import jakarta.servlet.http.*;
import org.junit.jupiter.api.*;
import org.mockito.*;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ReservationTest {

    @Mock
    private ReservationService reservationService;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpSession session;

    @InjectMocks
    private ReservationController reservationController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        when(request.getSession()).thenReturn(session);
    }

    @Test
    void testCreateReservation_Success() {
        AppUser mockUser = new AppUser();
        when(session.getAttribute("user")).thenReturn(mockUser);

        when(reservationService.createReservation(any(), anyLong(), any(), any(), anyInt(), anyInt(),
                anyString(), anyString(), any(), any(), anyString(), anyString(), anyString()))
                .thenReturn(1L);

        Map<String, Object> requestBody = Map.of(
                "roomId", 101L,
                "startDate", "2024-12-10",
                "endDate", "2024-12-15",
                "hotelLocation", "Waco",
                "roomPrice", "200",
                "totalPrice", "1000"
        );

        ResponseEntity<Map<String, Object>> response =
                reservationController.createReservation(requestBody, request);

        assertEquals(200, response.getStatusCodeValue());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().containsKey("id"));
    }

    @Test
    void testCreateReservation_UserNotLoggedIn() {
        when(session.getAttribute("user")).thenReturn(null);

        Map<String, Object> requestBody = Map.of("roomId", 101L);

        ResponseEntity<Map<String, Object>> response =
                reservationController.createReservation(requestBody, request);

        assertEquals(401, response.getStatusCodeValue());
        assertEquals("User not logged in", response.getBody().get("error"));
    }

    @Test
    void testReservationDefaultValues() {
        Reservation reservation = new Reservation();
        assertNull(reservation.getId());
        assertNull(reservation.getCheckInDate());
        assertNull(reservation.getCheckOutDate());
        assertNull(reservation.getRoom());
        assertNull(reservation.getUser());
        assertEquals(0, reservation.getAdults());
        assertEquals(0, reservation.getChildren());
        assertNull(reservation.getPromoCode());
        assertNull(reservation.getRateOption());
        assertNull(reservation.getTotalPrice());
        assertNull(reservation.getRoomPrice());
        assertNull(reservation.getBookingId());
        assertNull(reservation.getPhoto_path());
        assertNull(reservation.getHotelLocation());
        assertFalse(reservation.isCheckedIn());
    }

    @Test
    void testSetAndGetReservationFields() {
        Reservation reservation = new Reservation();

        reservation.setId(1L);
        reservation.setCheckInDate(LocalDate.of(2024, 12, 10));
        reservation.setCheckOutDate(LocalDate.of(2024, 12, 15));
        reservation.setAdults(2);
        reservation.setChildren(1);
        reservation.setPromoCode("ERNESTO50");
        reservation.setRateOption("Flexible");
        reservation.setTotalPrice(BigDecimal.valueOf(500.00));
        reservation.setRoomPrice(BigDecimal.valueOf(200.00));
        reservation.setBookingId("BKG12345");
        reservation.setPhoto_path("/images/room.jpg");
        reservation.setHotelLocation("Waco");
        reservation.setCheckedIn(true);

        assertEquals(1L, reservation.getId());
        assertEquals(LocalDate.of(2024, 12, 10), reservation.getCheckInDate());
        assertEquals(LocalDate.of(2024, 12, 15), reservation.getCheckOutDate());
        assertEquals(2, reservation.getAdults());
        assertEquals(1, reservation.getChildren());
        assertEquals("ERNESTO50", reservation.getPromoCode());
        assertEquals("Flexible", reservation.getRateOption());
        assertEquals(BigDecimal.valueOf(500.00), reservation.getTotalPrice());
        assertEquals(BigDecimal.valueOf(200.00), reservation.getRoomPrice());
        assertEquals("BKG12345", reservation.getBookingId());
        assertEquals("/images/room.jpg", reservation.getPhoto_path());
        assertEquals("Waco", reservation.getHotelLocation());
        assertTrue(reservation.isCheckedIn());
    }

    @Test
    void testCreateCompleteReservation() {
        Reservation reservation = new Reservation();
        reservation.setId(1L);
        reservation.setCheckInDate(LocalDate.of(2024, 12, 10));
        reservation.setCheckOutDate(LocalDate.of(2024, 12, 15));
        reservation.setAdults(2);
        reservation.setChildren(1);
        reservation.setTotalPrice(BigDecimal.valueOf(800.00));

        assertNotNull(reservation.getId());
        assertEquals(LocalDate.of(2024, 12, 10), reservation.getCheckInDate());
        assertEquals(LocalDate.of(2024, 12, 15), reservation.getCheckOutDate());
        assertEquals(2, reservation.getAdults());
        assertEquals(1, reservation.getChildren());
        assertEquals(BigDecimal.valueOf(800.00), reservation.getTotalPrice());
    }

    @Test
    void testPromoCode() {
        Reservation reservation = new Reservation();
        reservation.setPromoCode("ERNESTO50");
        assertEquals("ERNESTO50", reservation.getPromoCode());
    }
}
