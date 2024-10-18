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
    const rooms = location.state?.rooms || [];
    const bookingDetails = location.state?.bookingDetails || {};
    const [sortConfig, setSortConfig] = useState({ key: 'price', direction: 'asc' });

    useEffect(() => {
        const checkSession = async () => {
            console.log("Checking session...");
            try {
                const response = await fetch("http://localhost:8080/api/reservations/check-session", {
                    method: "POST",
                    credentials: "include",
                    headers: { 'Content-Type': 'application/json' }
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log("Session response:", data);

                    if (data.isLoggedIn) {
                        console.log("User is logged in:", data.firstname);
                        setUser(data);
                    } else {
                        console.log("No active session found.");
                        setUser(null);
                    }
                } else {
                    console.error("Session check failed with status:", response.status);
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

            console.log("Reservation Details:", reservationDetails);

            const response = await fetch('http://localhost:8080/api/reservations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reservationDetails),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Server Error: ${errorText}`);
            }

            alert('Reservation successful!');
        } catch (error) {
            console.error('Error:', error);
            alert(`Failed to make reservation: ${error.message}`);
        }
    };

    const sortedRooms = [...rooms].sort((a, b) => {
        const direction = sortConfig.direction === 'asc' ? 1 : -1;
        if (sortConfig.key === 'price') {
            return direction * (a.price - b.price);
        } else if (sortConfig.key === 'category') {
            return direction * a.category.categoryName.localeCompare(b.category.categoryName);
        } else {
            return direction * a.roomSize.localeCompare(b.roomSize);
        }
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
                </Select>
            </FormControl>

            <div className="room-list" style={{ marginTop: '20px' }}>
                {sortedRooms.map(room => (
                    <div key={room.id} className="room-card">
                        <h3>{room.category ? room.category.categoryName : "Category not available"} - {room.roomSize} Room</h3>
                        <p>Bed Type: {room.bedType}</p>
                        <p>Smoking Allowed: {room.smokingAllowed ? 'Yes' : 'No'}</p>
                        <p>Price: ${room.price} / night</p>
                        <button onClick={() => handleSelectRoom(room)}>Select Room</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FindHive;
