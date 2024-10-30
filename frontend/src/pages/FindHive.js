import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/FindHives.css';

const FindHive = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const rooms = Array.isArray(location.state?.rooms) ? location.state.rooms : [];

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
    }, [navigate]);

    const handleRoomCardClick = (categoryName, roomType, roomOptions) => {
        const bookingDetails = location.state?.bookingDetails || {};

        const updatedBookingDetails = {
            ...bookingDetails,
            checkInDate: bookingDetails.startDate,
            checkOutDate: bookingDetails.endDate,
            roomId: roomOptions[0].id
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
                            return (
                                <div key={roomType} className="room-card">
                                    <h3 style={{ color: 'black' }}>{roomType} Room</h3>
                                    <p>Starting from: ${representativeRoom.price} / night</p>
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
