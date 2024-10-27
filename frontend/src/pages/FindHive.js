import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import '../styles/FindHives.css';

const FindHive = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const rooms = Array.isArray(location.state?.rooms) ? location.state.rooms : [];
    const [sortConfig, setSortConfig] = useState({ key: 'price', direction: 'asc' });

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

    const handleSortChange = (event) => {
        const value = event.target.value;
        const [key, direction] = value.split('-');
        setSortConfig({ key, direction });
    };

    const handleRoomCardClick = (categoryName, roomType, roomOptions) => {
        const bookingDetails = location.state?.bookingDetails || {}; // Retrieve booking details from the state

        // Include roomId in the booking details
        const updatedBookingDetails = {
            ...bookingDetails,
            checkInDate: bookingDetails.startDate,
            checkOutDate: bookingDetails.endDate,
            roomId: roomOptions[0].id // Set the roomId to the first room in the selected group
        };

        navigate('/room-details', {
            state: {
                categoryName,
                roomType,
                roomOptions,
                ...updatedBookingDetails, // Pass booking details with roomId
            },
        });
    };

    // Group rooms by category and then by roomType
    const groupedRooms = rooms.reduce((acc, room) => {
        console.log('testing:', location.state?.bookingDetails, 'Room ID:', room.id);
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
            <FormControl
                variant="outlined"
                sx={{
                    minWidth: 200,
                    marginBottom: 4,
                    marginTop: 20,
                    backgroundColor: '#fff',
                    padding: '8px',
                }}
            >
                <InputLabel id="sort-by-label">Sort by</InputLabel>
                <Select
                    labelId="sort-by-label"
                    value={`${sortConfig.key}-${sortConfig.direction}`}
                    onChange={handleSortChange}
                    label="Sort by"
                >
                    <MenuItem value="price-asc">Price (Low to High)</MenuItem>
                    <MenuItem value="price-desc">Price (High to Low)</MenuItem>
                    <MenuItem value="roomSize-asc">Room Size (A-Z)</MenuItem>
                    <MenuItem value="roomSize-desc">Room Size (Z-A)</MenuItem>
                </Select>
            </FormControl>

            <div className="room-list" style={{ marginTop: '20px' }}>
                {Object.keys(groupedRooms).map(categoryName => (
                    <div key={categoryName} className="room-category">
                        <h2 style={{ color: 'black' }}>{categoryName}</h2>
                        {Object.keys(groupedRooms[categoryName]).map(roomType => {
                            // Get the first room as a representative of the room type
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
