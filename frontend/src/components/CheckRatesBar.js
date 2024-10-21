import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import dayjs from 'dayjs';
import { useNavigate, useLocation } from 'react-router-dom';
import SetOccupancyDialog from './Set_Occupancy_Dialog.js';
import '../styles/CheckRatesBar.css';

const hotelLocations = [
    { title: 'Brazos Bliss Hotel, Waco, Texas, USA' },
    { title: 'The Grand Palace, Paris, France' },
    { title: 'Seaside Serenity Resort, Phuket, Thailand' },
    { title: 'Urban Oasis, Tokyo, Japan' },
    { title: 'Misty Mountain Lodge, Queenstown, New Zealand' },
    { title: 'Desert Mirage Hotel, Dubai, UAE' },
    { title: 'Maple Leaf Lodge, Banff, Canada' },
    { title: 'Savannah Retreat, Nairobi, Kenya' },
    { title: 'Alpine Meadows Hotel, Interlaken, Switzerland' },
    { title: 'Casa Del Sol, Barcelona, Spain' },
    { title: 'Emerald Bay Resort, Bora Bora, French Polynesia' },
    { title: 'Crescent Cove Hotel, Sydney, Australia' },
    { title: 'Royal Garden Inn, London, UK' },
    { title: 'Blue Lagoon Resort, Reykjavik, Iceland' },
    { title: 'Rainforest Hideaway, Tulum, Mexico' },
    { title: 'Golden Sands Hotel, Cape Town, South Africa' },
    { title: 'Redwood Retreat, San Francisco, California, USA' },
    { title: 'Lakefront Lodge, Queenstown, New Zealand' },
    { title: 'Coconut Grove Resort, Bali, Indonesia' },
    { title: 'Northern Lights Inn, Tromsø, Norway' }
];

const CheckRatesBar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // States for hotel, dates, and occupancy
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [dateRange, setDateRange] = useState([null, null]);
    const [rooms, setRooms] = useState(1);
    const [adults, setAdults] = useState(2);
    const [children, setChildren] = useState(0);
    const [dateRangeError, setDateRangeError] = useState(false);

    // Load the booking details from the location state, if available
    useEffect(() => {
        if (location.state?.bookingDetails) {
            const { hotelLocation, startDate, endDate, rooms, adults, children } = location.state.bookingDetails;

            // Find the matching hotel based on location
            const matchingHotel = hotelLocations.find(hotel => hotel.title === hotelLocation);
            setSelectedHotel(matchingHotel || null);

            // Set the date range and occupancy values
            setDateRange([startDate ? dayjs(startDate) : null, endDate ? dayjs(endDate) : null]);
            setRooms(rooms || 1);
            setAdults(adults || 2);
            setChildren(children || 0);
        }
    }, [location.state]);

    const handleFindHivesClick = () => {
        const startDate = dateRange[0] ? dayjs(dateRange[0]).format('YYYY-MM-DD') : "No start date selected";
        const endDate = dateRange[1] ? dayjs(dateRange[1]).format('YYYY-MM-DD') : "No end date selected";

        const bookingDetails = {
            hotelLocation: selectedHotel?.title || "",
            startDate,
            endDate,
            rooms,
            adults,
            children,
        };

        fetch("http://localhost:8080/api/hives/find", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bookingDetails),
        })
            .then(response => response.json())
            .then(data => {
                const rooms = Array.isArray(data) ? data : []; // Ensure rooms is always an array
                navigate('/find-hive', { state: { bookingDetails, rooms: data } });
            })
            .catch(error => console.error("Error fetching available rooms:", error));

    };

    const handleSetOccupancy = (newRooms, newAdults, newChildren) => {
        setRooms(newRooms);
        setAdults(newAdults);
        setChildren(newChildren);
    };

    const today = dayjs();

    return (
        <div className="check-rates-bar">
            <div className="input-container">
                <Autocomplete
                    options={hotelLocations}
                    getOptionLabel={(option) => option.title}
                    value={selectedHotel}
                    onChange={(e, newValue) => setSelectedHotel(newValue)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Find A Hotel Or Resort"
                            variant="outlined"
                            sx={{
                                '& .MuiInputLabel-root': {
                                    fontFamily: 'Kaisei Tokumin, serif',
                                    fontStyle: 'italic',
                                    fontSize: '0.85rem',
                                    lineHeight: '0px',
                                    overflow: 'visible',
                                    color: '#FFFFFF'
                                },
                                '& .MuiOutlinedInput-root': {
                                    fontFamily: 'Kaisei Tokumin, serif',
                                    fontSize: '0.9rem',
                                    textAlign: 'center',
                                    lineHeight: '1.5rem',
                                },
                                '& .MuiInputBase-input': {
                                    fontFamily: 'Kaisei Tokumin, serif',
                                    textAlign: 'center',
                                }
                            }}
                        />
                    )}
                    className="destination-input"
                />
            </div>

            <div className="input-container">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateRangePicker
                        value={dateRange}
                        onChange={(newValue) => {
                            setDateRange(newValue);
                            setDateRangeError(false);
                        }}
                        minDate={today}
                        error={dateRangeError}
                        slots={{ field: SingleInputDateRangeField }}
                        sx={{
                            width: 250,
                            '& .MuiOutlinedInput-root': {
                                fontFamily: 'Kaisei Tokumin, serif',
                                fontSize: '0.9rem',
                                textAlign: 'center',
                                lineHeight: '1.5rem',
                                color: '#FFFFFF',
                                backgroundColor: '#363535',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.336)',
                                borderRadius: 0,
                                height: '33px',
                                '& fieldset': {
                                    borderColor: dateRangeError ? 'red' : 'white',
                                },
                                '&:hover fieldset': {
                                    borderColor: dateRangeError ? 'red' : '#F0D10B',
                                },
                            },
                            '& .MuiInputBase-input': {
                                textAlign: 'center',
                                fontFamily: 'Kaisei Tokumin, serif',
                                fontSize: '0.85rem',
                                padding: '8px 0',
                            },
                            '& .MuiInputBase-input::placeholder': {
                                color: dateRangeError ? 'red' : '#FFFFFF',
                                fontFamily: 'Kaisei Tokumin, serif',
                                fontSize: '0.85rem'
                            },
                        }}
                        slotProps={{
                            textField: {
                                error: dateRangeError,
                            },
                        }}
                    />
                </LocalizationProvider>
            </div>

            <div className="input-container">
                <SetOccupancyDialog
                    rooms={rooms}
                    adults={adults}
                    children={children}
                    onSetOccupancy={handleSetOccupancy}
                    className="guests-input"
                />
            </div>

            <button className="check-rates-button" onClick={handleFindHivesClick}>
                CHECK RATES
            </button>
        </div >
    );
};

export default CheckRatesBar;
