package com.honey_hotel.backend;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.honey_hotel.backend.DTO.ActivityReservationDTO;
import com.honey_hotel.backend.controller.ActivitiesController;
import com.honey_hotel.backend.model.Activities;
import com.honey_hotel.backend.service.ActivitiesService;
import com.honey_hotel.backend.service.ActivityReservationService;

import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.*;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;


public class ActivityTest {
    @Mock
    private ActivitiesService activitiesService;

    @Mock
    private ActivityReservationService activitiesReservationService;

    @InjectMocks
    private ActivitiesController activitiesController;

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
    void testAddVacation() {
        Activities activity = new Activities();
        activity.setName("Spa");

        when(activitiesService.addVacation(activity)).thenReturn(activity);

        ResponseEntity<Activities> response = activitiesController.addVacation(activity);

        assertNotNull(response);
        assertEquals(activity, response.getBody());
        verify(activitiesService, times(1)).addVacation(activity);
    }

    @Test
    void testGetAvailableVacations() {
        LocalDate checkInDate = LocalDate.of(2024, 12, 1);
        LocalDate checkOutDate = LocalDate.of(2024, 12, 10);
        List<Activities> activities = List.of(new Activities(), new Activities());

        when(activitiesService.getAvailableVacations(checkInDate, checkOutDate)).thenReturn(activities);

        ResponseEntity<List<Activities>> response = activitiesController.getAvailableVacations(checkInDate, checkOutDate);

        assertNotNull(response);
        assertEquals(activities, response.getBody());
        verify(activitiesService, times(1)).getAvailableVacations(checkInDate, checkOutDate);
    }

    @Test
    void testGetActivityReservationByHotelReservationId() {
        Long reservationId = 1L;
        ActivityReservationDTO dto = new ActivityReservationDTO(1L, "Spa", LocalDate.now());

        when(activitiesReservationService.getActivityReservationByHotelReservationId(reservationId)).thenReturn(dto);

        ResponseEntity<ActivityReservationDTO> response = activitiesController.getActivityReservationByHotelReservationId(reservationId);

        assertNotNull(response);
        assertEquals(dto, response.getBody());
        verify(activitiesReservationService, times(1)).getActivityReservationByHotelReservationId(reservationId);
    }
}
