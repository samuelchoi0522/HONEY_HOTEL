package com.honey_hotel.backend.service;

import com.honey_hotel.backend.model.Room;
import com.honey_hotel.backend.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Service for Room Class
 *
 * @author Eugene Pak
 * @Version 1.0
 */
@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    /**
     * Gets all rooms of a hotel
     *
     * @return List, list of all rooms
     */
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    /**
     * Finds a room by its corresponding id
     *
     * @param id, id of room to be found
     * @return Room, room returned that corresponds to the id given, null otherwise
     */
    public Room getRoomById(Long id) {
        return roomRepository.findById(id).orElse(null);
    }

    /**
     * Adds a room to the repository
     *
     * @param room, room to be created
     * @return Room, room successfully saved
     */
    public Room createRoom(Room room) {
        return roomRepository.save(room);
    }

    /**
     * Updates room details of an already existing room
     *
     * @param id, id of room to be updated
     * @param roomDetails, room details to be updated
     * @return Room, updated room details
     */
    public Room updateRoom(Long id, Room roomDetails) {
        Optional<Room> existingRoom = roomRepository.findById(id);

        if (existingRoom.isPresent()) {
            Room room = existingRoom.get();
            room.setCategory(roomDetails.getCategory());
            room.setBedType(roomDetails.getBedType());
            room.setSmokingAllowed(roomDetails.isSmokingAllowed());
            room.setPrice(roomDetails.getPrice());
            room.setPriceCategory(roomDetails.getPriceCategory());
            room.setRoomTypeId(roomDetails.getRoomTypeId());
            return roomRepository.save(room);
        }

        return null;
    }

    /**
     * Deletes room from repository
     *
     * @param id, id used to find room
     * @return true if room has been found and deleted, false otherwise
     */
    public boolean deleteRoom(Long id) {
        if (roomRepository.existsById(id)) {
            roomRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
