package com.honey_hotel.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "rooms")
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "room_category_id", nullable = false)
    @JsonIgnoreProperties("rooms")
    private RoomCategory category;

    private String bedType;
    private boolean smokingAllowed;
    private double price;

    @Column(name = "price_category")
    private String priceCategory;

    @Column(name = "room_type_id", nullable = false)
    private int roomTypeId;

    private static final String[] ROOM_TYPE_NAMES = {
            "Single",
            "Double",
            "Family",
            "Suite",
            "Deluxe",
            "Standard"
    };

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public RoomCategory getCategory() {
        return category;
    }

    public void setCategory(RoomCategory category) {
        this.category = category;
    }

    public String getBedType() {
        return bedType;
    }

    public void setBedType(String bedType) {
        this.bedType = bedType;
    }

    public boolean isSmokingAllowed() {
        return smokingAllowed;
    }

    public void setSmokingAllowed(boolean smokingAllowed) {
        this.smokingAllowed = smokingAllowed;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getRoomType() {
        if (roomTypeId >= 1 && roomTypeId <= ROOM_TYPE_NAMES.length) {
            return ROOM_TYPE_NAMES[roomTypeId - 1];
        } else {
            return "Unknown";
        }
    }

    public int getRoomTypeId() {
        return roomTypeId;
    }

    public void setRoomTypeId(int roomTypeId) {
        this.roomTypeId = roomTypeId;
    }
    
    public String getPriceCategory() {
        return priceCategory;
    }

    public void setPriceCategory(String priceCategory) {
        this.priceCategory = priceCategory;
    }

    public void setRoomType(String deluxe) {

    }
}
