package com.honey_hotel.backend.controller;

import com.honey_hotel.backend.model.Room;
import com.honey_hotel.backend.model.RoomCategory;
import com.honey_hotel.backend.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    private static final String[] ROOM_TYPE_NAMES = {
            "Single",
            "Double",
            "Family",
            "Suite",
            "Deluxe",
            "Standard"
    };
    @Autowired
    private RoomService roomService;

    private Integer getRoomTypeId(String roomType) {
        for (int i = 0; i < ROOM_TYPE_NAMES.length; i++) {
            if (ROOM_TYPE_NAMES[i].equalsIgnoreCase(roomType)) {
                return i + 1;
            }
        }
        return null;
    }

    @GetMapping
    public ResponseEntity<List<Room>> getAllRooms() {
        List<Room> rooms = roomService.getAllRooms();
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(rooms);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRoomById(@PathVariable Long id) {
        Room room = roomService.getRoomById(id);
        if (room == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Room not found");
        }
        return ResponseEntity.ok(room);
    }

    @PostMapping
    public ResponseEntity<Room> createRoom(@RequestBody Map<String, Object> roomDetails) {
        try {
            String bedType = (String) roomDetails.get("bedType");
            Boolean smokingAllowed = (Boolean) roomDetails.get("smokingAllowed");
            Double price = (roomDetails.get("price") instanceof Number)
                    ? ((Number) roomDetails.get("price")).doubleValue()
                    : null;
            String priceCategory = (String) roomDetails.get("priceCategory");
            String roomType = (String) roomDetails.get("roomType");
            Integer roomTypeId = getRoomTypeId(roomType);
            String roomCat = (String) roomDetails.get("roomCategory");

            if (bedType == null || smokingAllowed == null || price == null ||
                    priceCategory == null || roomTypeId == null || roomCat == null) {
                return ResponseEntity.badRequest().body(null);
            }

            System.out.println("Checkpoint1");

            Room room = new Room();
            room.setBedType(bedType);
            room.setSmokingAllowed(smokingAllowed);
            room.setPrice(price);
            room.setPriceCategory(priceCategory);
            room.setRoomTypeId(roomTypeId);

            System.out.println("Checkpoint2");

            RoomCategory roomCategory = new RoomCategory();
            roomCategory.setCategoryName(roomCat);
            room.setCategory(roomCategory);

            System.out.println("Checkpoint3");

            Room savedRoom = roomService.createRoom(room);

            System.out.println("Checkpoint4");

            return ResponseEntity.status(HttpStatus.CREATED).body(savedRoom);
        } catch (ClassCastException e) {
            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRoom(@PathVariable Long id, @RequestBody Room roomDetails) {
        Room updatedRoom = roomService.updateRoom(id, roomDetails);
        if (updatedRoom == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Room not found");
        }
        return ResponseEntity.ok(updatedRoom);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRoom(@PathVariable Long id) {
        if (roomService.deleteRoom(id)) {
            return ResponseEntity.ok("Room deleted successfully");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Room not found");
    }
}