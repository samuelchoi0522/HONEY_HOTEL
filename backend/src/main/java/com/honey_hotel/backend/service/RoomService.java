package com.honey_hotel.backend.service;

import com.honey_hotel.backend.model.Room;
import com.honey_hotel.backend.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    public Room getRoomById(Long id) {
        return roomRepository.findById(id).orElse(null);
    }

    public Room createRoom(Room room) {
        return roomRepository.save(room);
    }

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

    public boolean deleteRoom(Long id) {
        if (roomRepository.existsById(id)) {
            roomRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
