package com.honey_hotel.backend;

import com.honey_hotel.backend.controller.FindHivesController;
import com.honey_hotel.backend.model.BookingDetails;
import com.honey_hotel.backend.model.Room;
import com.honey_hotel.backend.service.FindHivesService;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import org.junit.jupiter.api.*;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import java.time.LocalDate;
import java.util.List;

public class FindHives {
    @Mock
    private FindHivesService findHivesService;

    @InjectMocks
    private FindHivesController findHivesController;

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
    void testFindRooms() {

        BookingDetails bookingDetails = new BookingDetails();
        bookingDetails.setHotelLocation("Waco");
        bookingDetails.setStartDate(LocalDate.of(2024, 12, 20));
        bookingDetails.setEndDate(LocalDate.of(2024, 12, 25));

        Room room1 = new Room();
        room1.setId(1L);
        room1.setBedType("King");
        room1.setSmokingAllowed(false);
        room1.setPrice(200.0);
        room1.setRoomType("Deluxe");
        room1.setPriceCategory("Standard");

        Room room2 = new Room();
        room2.setId(2L);
        room2.setBedType("Queen");
        room2.setSmokingAllowed(true);
        room2.setPrice(150.0);
        room2.setRoomType("Standard");
        room2.setPriceCategory("Economy");

        List<Room> availableRooms = List.of(room1, room2);

        when(findHivesService.findAvailableRooms("Waco", bookingDetails.getStartDate(),
                bookingDetails.getEndDate())).thenReturn(availableRooms);

        ResponseEntity<?> response = findHivesController.findRooms(bookingDetails);

        assertNotNull(response);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(availableRooms, response.getBody());
        verify(findHivesService, times(1)).findAvailableRooms("Waco", bookingDetails.getStartDate(),
                bookingDetails.getEndDate());
    }

    @Test
    void testFindRoomsInvalidDateFormat() {
        BookingDetails bookingDetails = new BookingDetails();
        bookingDetails.setHotelLocation("Waco");

        ResponseEntity<?> response = findHivesController.findRooms(bookingDetails);

        assertNotNull(response);
        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Error: Invalid date format. Please use MM/DD/YYYY.", response.getBody());
        verifyNoInteractions(findHivesService);
    }
}
