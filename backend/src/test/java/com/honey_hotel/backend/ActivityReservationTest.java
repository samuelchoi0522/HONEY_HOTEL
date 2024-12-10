package com.honey_hotel.backend;

import com.honey_hotel.backend.DTO.ActivityReservationDTO;
import com.honey_hotel.backend.model.*;
import com.honey_hotel.backend.repository.*;

import java.time.LocalDate;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.honey_hotel.backend.service.ActivityReservationService;
import org.junit.jupiter.api.*;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

public class ActivityReservationTest {
    @Mock
    private ActivityReservationRepository activityReservationRepository;

    @Mock
    private ReservationRepository reservationRepository;

    @Mock
    private ActivitiesRepository activitiesRepository;

    @InjectMocks
    private ActivityReservationService activityReservationService;

    private AutoCloseable closeable;

    @BeforeEach
    void setUp() {
        closeable = MockitoAnnotations.openMocks(this);
    }

    @AfterEach
    void tearDown() throws Exception {
        closeable.close();
    }

    @Test
    void testCreateActivityReservation() {
        AppUser user = new AppUser();
        Long reservationId = 1L;
        Integer activityId = 2;
        LocalDate activityDate = LocalDate.of(2024, 12, 15);
        Reservation reservation = new Reservation();
        Activities activity = new Activities();

        when(reservationRepository.findById(reservationId)).thenReturn(java.util.Optional.of(reservation));
        when(activitiesRepository.findById(Long.valueOf(activityId))).thenReturn(java.util.Optional.of(activity));
        when(activityReservationRepository.save(any(ActivityReservation.class))).thenReturn(new ActivityReservation());

        boolean result = activityReservationService.createActivityReservation(user, reservationId, activityId, activityDate);

        assertTrue(result);
        verify(reservationRepository, times(1)).findById(reservationId);
        verify(activitiesRepository, times(1)).findById(Long.valueOf(activityId));
        verify(activityReservationRepository, times(1)).save(any(ActivityReservation.class));
    }

    @Test
    void testGetActivityReservationByHotelReservationId() {
        Long reservationId = 1L;
        ActivityReservation activityReservation = new ActivityReservation();
        activityReservation.setId(1L);
        activityReservation.setReservationDate(LocalDate.of(2024, 12, 20));
        Activities activity = new Activities();
        activity.setName("Coding");
        activityReservation.setActivity(activity);

        when(activityReservationRepository.findByReservationId(reservationId)).thenReturn(activityReservation);

        ActivityReservationDTO dto = activityReservationService.getActivityReservationByHotelReservationId(reservationId);

        assertNotNull(dto);
        assertEquals(activity.getName(), dto.getActivityName());
        assertEquals(activityReservation.getReservationDate(), dto.getReservationDate());
        verify(activityReservationRepository, times(1)).findByReservationId(reservationId);
    }
}
