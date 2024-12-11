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

/**
 * Controller for room management in the repository
 *
 * @author Eugene Pak
 * @Version 2.0 (12/10/24)
 */
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

    /**
     *
     *
     * @return
     */
    @GetMapping
    public ResponseEntity<List<Room>> getAllRooms() {
        List<Room> rooms = roomService.getAllRooms();
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(rooms);
    }

    /**
     * Gets a specific room by its id
     *
     * @param id, room id to search with
     * @return room corresponding to the id
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getRoomById(@PathVariable Long id) {
        Room room = roomService.getRoomById(id);
        if (room == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Room not found");
        }
        return ResponseEntity.ok(room);
    }

    /**
     * Creates a room and adds it to the repository
     *
     * @param roomDetails, key information that make up a room
     * @return Response Entity stating room was successfully created, error if not
     */
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

    /**
     * Updates a room found by its id
     *
     * @param id, id used to find room
     * @param roomDetails, new details about the room to add/edit
     * @return Response Entity stating room was updated or if room was not found
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateRoom(@PathVariable Long id, @RequestBody Room roomDetails) {
        Room updatedRoom = roomService.updateRoom(id, roomDetails);
        if (updatedRoom == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Room not found");
        }
        return ResponseEntity.ok(updatedRoom);
    }

    /**
     * Deletes a room from the repository found by its associated id
     *
     * @param id, id used to find the room to delete
     * @return Response Entity stating if room was deleted successfully, or if room was not found
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRoom(@PathVariable Long id) {
        if (roomService.deleteRoom(id)) {
            return ResponseEntity.ok("Room deleted successfully");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Room not found");
    }
}