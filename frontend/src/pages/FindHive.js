import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import '../styles/FindHives.css';

const FindHive = () => {
    const location = useLocation();
    const rooms = location.state?.rooms || [];

    const [sortConfig, setSortConfig] = useState({ key: 'price', direction: 'asc' });

    const handleSortChange = (event) => {
        const value = event.target.value;
        const [key, direction] = value.split('-');
        setSortConfig({ key, direction });
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
                        <button>Select Room</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FindHive;
