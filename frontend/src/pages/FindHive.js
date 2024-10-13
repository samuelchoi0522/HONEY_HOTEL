import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import TableSortLabel from '@mui/material/TableSortLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import '../styles/FindHives.css';  // Import the CSS file for styling

const FindHive = () => {
    const location = useLocation();
    const rooms = location.state?.rooms || [];

    const [sortConfig, setSortConfig] = useState({ key: 'category', direction: 'asc' });

    const handleSort = (key) => {
        setSortConfig(prevConfig => ({
            key,
            direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc',
        }));
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
            <FormControl variant="outlined" style={{ minWidth: 200, marginBottom: '20px' }}>
                <InputLabel id="sort-by-label">Sort by</InputLabel>
                <Select
                    labelId="sort-by-label"
                    value={sortConfig.key}
                    onChange={(e) => handleSort(e.target.value)}
                    label="Sort by"
                >
                    <MenuItem value="category">Category</MenuItem>
                    <MenuItem value="price">Lowest Price</MenuItem>
                    <MenuItem value="roomSize">Room Size</MenuItem>
                </Select>
            </FormControl>

            <div className="room-list">
                {sortedRooms.map(room => (
                    <div key={room.id} className="room-card">
                        <TableSortLabel
                            active={sortConfig.key === 'category'}
                            direction={sortConfig.key === 'category' ? sortConfig.direction : 'asc'}
                            onClick={() => handleSort('category')}
                        >
                            <h3>{room.category ? room.category.categoryName : "Category not available"} - {room.roomSize} Room</h3>
                        </TableSortLabel>
                        <p>Bed Type: {room.bedType}</p>
                        <p>Smoking Allowed: {room.smokingAllowed ? 'Yes' : 'No'}</p>
                        <TableSortLabel
                            active={sortConfig.key === 'price'}
                            direction={sortConfig.key === 'price' ? sortConfig.direction : 'asc'}
                            onClick={() => handleSort('price')}
                        >
                            <p>Price: ${room.price} / night</p>
                        </TableSortLabel>
                        <button>Select Room</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FindHive;
