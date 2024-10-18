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
    const bookingDetails = location.state?.bookingDetails || {};
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

    const handleSelectRoom = async (room) => {
        try {
            if (!user) {
                alert('Please log in to make a reservation.');
                return;
            }

            const reservationDetails = {
                userId: user.id,
                roomId: room.id,
                hotelLocation: bookingDetails.hotelLocation,
                startDate: bookingDetails.startDate,
                endDate: bookingDetails.endDate
            };

            const response = await fetch('http://localhost:8080/api/reservations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reservationDetails),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Server Error: ${errorText}`);
            }

            alert('Reservation successful!');
        } catch (error) {
            alert(`Failed to make reservation: ${error.message}`);
        }
    };

    // Group rooms by category and then by roomType within each category
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

    // Sort rooms within each roomType by price or roomSize
    Object.keys(groupedRooms).forEach(categoryName => {
        Object.keys(groupedRooms[categoryName]).forEach(roomType => {
            groupedRooms[categoryName][roomType].sort((a, b) => {
                const direction = sortConfig.direction === 'asc' ? 1 : -1;
                return sortConfig.key === 'price' ? direction * (a.price - b.price) : direction * a.roomSize.localeCompare(b.roomSize);
            });
        });
    });

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
                        {Object.keys(groupedRooms[categoryName]).map(roomType => (
                            <div key={roomType} className="room-type">
                                <h3 style={{ color: 'black' }}>{roomType} Room</h3>
                                {groupedRooms[categoryName][roomType].map(room => (
                                    <div key={room.id} className="room-card">
                                        <p>Bed Type: {room.bedType}</p>
                                        <p>Smoking Allowed: {room.smokingAllowed ? 'Yes' : 'No'}</p>
                                        <p>Price: ${room.price} / night</p>
                                        <button onClick={() => handleSelectRoom(room)}>Select Room</button>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FindHive;
