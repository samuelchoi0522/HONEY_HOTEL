package com.honey_hotel.backend;

import com.honey_hotel.backend.model.Room;
import com.honey_hotel.backend.model.RoomCategory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.AfterEach;

import static org.junit.jupiter.api.Assertions.*;

public class RoomTest {

    private Room room;
    private RoomCategory category;

    @BeforeEach
    void setUp() {
        // Initialize RoomCategory and Room objects
        category = new RoomCategory();
        category.setId(1L);
        category.setCategoryName("Luxury");

        room = new Room();
        room.setId(100L);
        room.setCategory(category);
        room.setBedType("Double");
        room.setSmokingAllowed(false);
        room.setPrice(200.0);
        room.setPriceCategory("Comfort");
        room.setRoomTypeId(2);
    }

    @AfterEach
    void tearDown() {
        room = null;
        category = null;
    }

    @Test
    void testRoomId() {
        assertEquals(100L, room.getId());
        room.setId(101L);
        assertEquals(101L, room.getId());
    }

    @Test
    void testRoomCategory() {
        assertNotNull(room.getCategory());
        assertEquals("Luxury", room.getCategory().getCategoryName());
    }

    @Test
    void testBedType() {
        assertEquals("Double", room.getBedType());
        room.setBedType("Single");
        assertEquals("Single", room.getBedType());
    }

    @Test
    void testSmokingAllowed() {
        assertFalse(room.isSmokingAllowed());
        room.setSmokingAllowed(true);
        assertTrue(room.isSmokingAllowed());
    }

    @Test
    void testPrice() {
        assertEquals(200.0, room.getPrice(), 0.001);
        room.setPrice(250.0);
        assertEquals(250.0, room.getPrice(), 0.001);
    }

    @Test
    void testPriceCategory() {
        assertEquals("Comfort", room.getPriceCategory());
        room.setPriceCategory("Economy");
        assertEquals("Economy", room.getPriceCategory());
    }

    @Test
    void testRoomTypeName() {
        assertEquals("Double", room.getRoomType());
        room.setRoomTypeId(4);
        assertEquals("Suite", room.getRoomType());
    }

    @Test
    void testInvalidRoomTypeId() {
        room.setRoomTypeId(10);
        assertEquals("Unknown", room.getRoomType());
    }
}

