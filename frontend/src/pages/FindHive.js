import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/FindHives.css';


const FindHive = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const rooms = Array.isArray(location.state?.rooms) ? location.state.rooms : [];
    const bookingDetails = location.state?.bookingDetails || {};

    const [promoDiscount, setPromoDiscount] = useState(0);

    const discountMap = {
        "Lowest Regular Rate": 0,
        "AAA/CAA": 0.10,
        "Senior Discount": 0.15,
        "Government & Military": 0.20,
    };

    const imageMap = {
        "Nature Retreat": {
            "Single": "../uploads/NATURE_RETREAT_SINGLE_PHOTO.png",
            "Double": "../uploads/NATURE_RETREAT_DOUBLE_PHOTO.jpg",
            "Family": "../uploads/NATURE_RETREAT_FAMILY_PHOTO.jpg"
        },
        "Urban Elegance": {
            "Suite": "../uploads/URBAN_ELEGANCE_SUITE_PHOTO.jpg",
            "Deluxe": "../uploads/URBAN_ELEGANCE_DELUXE_PHOTO.jpg"
        },
        "Vintage Charm": {
            "Standard": "../uploads/VINTAGE_CHARM_STANDARD_PHOTO.jpg",
            "Deluxe": "../uploads/VINTAGE_CHARM_DELUXE_PHOTO.jpg"
        }
    };

    const descriptionMap = {
        "Nature Retreat": {
            "Single": [
                { icon: "/icons/bed_icon.png", text: "Twin, Full, Queen, King Beds" },
                { icon: "/icons/smoking_icon.png", text: "Smoking And Non-Smoking" },
                { icon: "/icons/occupancy_icon.png", text: "Up to 8 People" }
            ],
            "Double": [
                { icon: "/icons/bed_icon.png", text: "Twin, Full, Queen, King Beds" },
                { icon: "/icons/smoking_icon.png", text: "Smoking And Non-Smoking" },
                { icon: "/icons/occupancy_icon.png", text: "Up to 8 People" }
            ],
            "Family": [
                { icon: "/icons/bed_icon.png", text: "Twin, Full, Queen, King Beds" },
                { icon: "/icons/smoking_icon.png", text: "Smoking And Non-Smoking" },
                { icon: "/icons/occupancy_icon.png", text: "Up to 8 People" }
            ]
        },
        "Urban Elegance": {
            "Suite": [
                { icon: "/icons/bed_icon.png", text: "Twin, Full, Queen, King Beds" },
                { icon: "/icons/smoking_icon.png", text: "Smoking And Non-Smoking" },
                { icon: "/icons/occupancy_icon.png", text: "Up to 8 People" }
            ],
            "Deluxe": [
                { icon: "/icons/bed_icon.png", text: "Twin, Full, Queen, King Beds" },
                { icon: "/icons/smoking_icon.png", text: "Smoking And Non-Smoking" },
                { icon: "/icons/occupancy_icon.png", text: "Up to 8 People" }
            ]
        },
        "Vintage Charm": {
            "Standard": [
                { icon: "/icons/bed_icon.png", text: "Twin, Full, Queen, King Beds" },
                { icon: "/icons/smoking_icon.png", text: "Smoking And Non-Smoking" },
                { icon: "/icons/occupancy_icon.png", text: "Up to 8 People" }
            ],
            "Deluxe": [
                { icon: "/icons/bed_icon.png", text: "Twin, Full, Queen, King Beds" },
                { icon: "/icons/smoking_icon.png", text: "Smoking And Non-Smoking" },
                { icon: "/icons/occupancy_icon.png", text: "Up to 8 People" }
            ]
        }
    };



    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/reservations/check-session", {
                    method: "POST",
                    credentials: "include",
                    headers: { 'Content-Type': 'application/json' }
                });

                if (response.ok) {
                    const data = await response.json();
                    setUser(data.isLoggedIn ? data : null);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Error checking session:", error);
            }
        };

        checkSession();

        if (bookingDetails.rateOption === "Promo Code" && bookingDetails.promoCode) {
            fetchPromoDiscount(bookingDetails.promoCode);
        }
    }, [navigate, bookingDetails.rateOption, bookingDetails.promoCode]);

    const fetchPromoDiscount = async (promoCode) => {
        try {
            const response = await fetch("http://localhost:8080/api/promo/validate", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: promoCode }),
            });

            const data = await response.json();
            if (data.isValid) {
                setPromoDiscount(data.discountPercentage / 100);
            } else {
                console.error("Invalid or expired promo code");
                setPromoDiscount(0);
            }
        } catch (error) {
            console.error("Error fetching promo code discount:", error);
        }
    };

    const handleRoomCardClick = (categoryName, roomType, roomOptions) => {
        const discountRate = bookingDetails.rateOption === "Promo Code" ? promoDiscount : discountMap[bookingDetails.rateOption] || 0;
        const updatedBookingDetails = {
            ...bookingDetails,
            checkInDate: bookingDetails.startDate,
            checkOutDate: bookingDetails.endDate,
            roomId: roomOptions[0].id,
            discountRate,
            chosenPhoto: imageMap[categoryName]?.[roomType] || "../../public/uploads/default-photo.jpg"
        };

        navigate('/room-details', {
            state: {
                categoryName,
                roomType,
                roomOptions,
                ...updatedBookingDetails,
            },
        });
    };

    const groupedRooms = rooms.reduce((acc, room) => {
        const categoryName = room.category ? room.category.categoryName : "Unknown Category";
        const roomType = room.roomType || "Unknown Room Type";

        if (!acc[categoryName]) {
            acc[categoryName] = {};
        }

        if (!acc[categoryName][roomType]) {
            acc[categoryName][roomType] = [];
        }

        acc[categoryName][roomType].push(room);
        return acc;
    }, {});

    return (
        <div className="room-list" style={{ marginTop: '200px' }}>
            {Object.keys(groupedRooms).map(categoryName => (
                <div key={categoryName} className="room-category">
                    <h2 className="category-name">{categoryName.toUpperCase()}</h2>
                    {Object.keys(groupedRooms[categoryName]).map(roomType => {
                        const representativeRoom = groupedRooms[categoryName][roomType][0];

                        const imageUrl = imageMap[categoryName]?.[roomType] || "../../public/uploads/default-photo.jpg";

                        const discountRate = bookingDetails.rateOption === "Promo Code" ? promoDiscount : discountMap[bookingDetails.rateOption] || 0;
                        const discountedPrice = Math.round(representativeRoom.price * (1 - discountRate));

                        return (
                            <div key={roomType} className="room-card">
                                <div className="room-content">
                                    <img
                                        src={imageUrl}
                                        alt={`${roomType} room in ${categoryName}`}
                                        className="room-image"
                                    />
                                    <div className="room-info-1">
                                        <h3 className="room-name">
                                            {roomType.toUpperCase()} ROOM
                                        </h3>
                                        <div className="room-description">
                                            {descriptionMap[categoryName]?.[roomType]?.map((item, index) => (
                                                <div key={index} className="description-line">
                                                    <img src={item.icon} alt="icon" className="description-icon" />
                                                    <span>{item.text}</span>
                                                </div>
                                            )) || <p>Description not available</p>}
                                        </div>
                                    </div>
                                </div>
                                <hr className="room-divider" />
                                <div className="room-price-details">
                                    <div className="room-info">
                                        <p>Room Rate</p>
                                        <a href="/cancellation-policy" className="cancellation-policy">Cancellation Policy</a>
                                    </div>
                                    <div className="room-bottom">
                                        <span className="room-price">{discountedPrice} <span className='currency-label'>USD / NIGHT</span></span>
                                        <button
                                            onClick={() => handleRoomCardClick(categoryName, roomType, groupedRooms[categoryName][roomType])}
                                            className="select-button"
                                        >
                                            Select Bed Options
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export default FindHive;
