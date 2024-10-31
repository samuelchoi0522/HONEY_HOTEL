import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/FindHives.css';

const FindHive = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const rooms = Array.isArray(location.state?.rooms) ? location.state.rooms : [];
    const bookingDetails = location.state?.bookingDetails || {};

    const [promoDiscount, setPromoDiscount] = useState(0); // State to hold the promo code discount percentage

    // Define the discount map
    const discountMap = {
        "Lowest Regular Rate": 0,
        "AAA/CAA": 0.10,
        "Senior Discount": 0.15,
        "Government & Military": 0.20,
    };

    useEffect(() => {
        console.log("FROM: /find-hive: ", bookingDetails);
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

        // Fetch promo code discount if rateOption is Promo Code
        if (bookingDetails.rateOption === "Promo Code" && bookingDetails.promoCode) {
            fetchPromoDiscount(bookingDetails.promoCode);
        }
    }, [navigate, bookingDetails.rateOption, bookingDetails.promoCode]);

    // Function to fetch the promo code discount percentage
    const fetchPromoDiscount = async (promoCode) => {
        try {
            const response = await fetch("http://localhost:8080/api/promo/validate", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: promoCode }),
            });

            const data = await response.json();
            if (data.isValid) {
                setPromoDiscount(data.discountPercentage / 100); // Set the promo discount (e.g., 50% => 0.50)
            } else {
                console.error("Invalid or expired promo code");
                setPromoDiscount(0); // Set discount to 0 if invalid
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
            discountRate
            
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
        <div>
            <div className="room-list" style={{ marginTop: '200px' }}>
                {Object.keys(groupedRooms).map(categoryName => (
                    <div key={categoryName} className="room-category">
                        <h2 style={{ color: 'black' }}>{categoryName}</h2>
                        {Object.keys(groupedRooms[categoryName]).map(roomType => {
                            const representativeRoom = groupedRooms[categoryName][roomType][0];

                            // Determine discount based on rateOption or promo code
                            const discountRate = bookingDetails.rateOption === "Promo Code" ? promoDiscount : discountMap[bookingDetails.rateOption] || 0;
                            const discountedPrice = (representativeRoom.price * (1 - discountRate)).toFixed(2);

                            return (
                                <div key={roomType} className="room-card">
                                    <h3 style={{ color: 'black' }}>{roomType} Room</h3>
                                    <p>Starting from: ${discountedPrice} / night</p>
                                    <button
                                        onClick={() => handleRoomCardClick(categoryName, roomType, groupedRooms[categoryName][roomType])}
                                    >
                                        Select Room
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FindHive;
