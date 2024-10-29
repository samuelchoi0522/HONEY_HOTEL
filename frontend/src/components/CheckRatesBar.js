import React, { useState, useEffect, useRef } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import dayjs from 'dayjs';
import { useNavigate, useLocation } from 'react-router-dom';
import SetOccupancyDialog from './Set_Occupancy_Dialog.js';
import styles from '../styles/CheckRatesBar.module.css'; // Import CSS module

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


const dateRangePickerTheme = createTheme({
    components: {
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    fontFamily: 'Kaisei Tokumin, serif',
                    fontSize: '0.9rem',
                    textAlign: 'center',
                    lineHeight: '1.5rem',
                    color: '#FFFFFF',
                    backgroundColor: '#363535',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.336)',
                    borderRadius: 0,
                    height: '33px',
                },
            },
        },
    },
});

const CheckRatesBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [dateRange, setDateRange] = useState([null, null]);
    const [rooms, setRooms] = useState(1);
    const [adults, setAdults] = useState(2);
    const [children, setChildren] = useState(0);
    const [dateRangeError, setDateRangeError] = useState(false);
    const [autocompleteWidth, setAutocompleteWidth] = useState(300); // State to control width

    const textRef = useRef(null);

    useEffect(() => {
        if (location.state?.bookingDetails) {
            const { hotelLocation, startDate, endDate, rooms, adults, children } = location.state.bookingDetails;
            const matchingHotel = hotelLocations.find(hotel => hotel.title === hotelLocation);
            setSelectedHotel(matchingHotel || null);
            setDateRange([startDate ? dayjs(startDate) : null, endDate ? dayjs(endDate) : null]);
            setRooms(rooms || 1);
            setAdults(adults || 2);
            setChildren(children || 0);
        }
    }, [location.state]);

    useEffect(() => {
        // Adjust width based on the selected title's length
        if (selectedHotel && textRef.current) {
            const newWidth = textRef.current.scrollWidth + 40; // Add padding
            setAutocompleteWidth(Math.min(Math.max(newWidth, 200), 500)); // Min 200px, Max 500px
        }
    }, [selectedHotel]);

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
                const rooms = Array.isArray(data) ? data : [];
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
        <div className={styles.checkRatesBar}>
            <div className={styles.inputContainer}>
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
                            inputRef={textRef}
                            sx={{
                                
                                '& .MuiInputLabel-root': {
                                    color: 'white', // Set label color
                                    fontFamily: 'Kaisei Tokumin, serif', // Set label font
                                    fontSize: '1rem', // Set label font size
                                    fontWeight: 'bold', // Optional: make it bold
                                    fontStyle: 'italic', // Optional: make it italic
                                    zIndex: 1,
                                },
                                '& .MuiOutlinedInput-root': {
                                    height: 33,
                                    color: '#FFFFFF', // Set input text color
                                    '& .MuiInputBase-input': {
                                        color: '#FFFFFFF', // Set text color inside the input
                                    },
                                },
                                '& .MuiSvgIcon-root': {
                                    color: '#FFFFFF', // Set icon color
                                },
                                width: autocompleteWidth,

                                backgroundColor: '#363535',
                                outline: 'none',
                                color: '#FFFFFF',
                                borderRadius: 0,
                            }}
                            className={styles.destinationInput}
                        />
                    )}
                />
            </div>

            <div className={styles.inputContainer}>
                <ThemeProvider theme={dateRangePickerTheme}>
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
                        />
                    </LocalizationProvider>
                </ThemeProvider>
            </div>

            <div className={styles.inputContainer}>
                <SetOccupancyDialog
                    rooms={rooms}
                    adults={adults}
                    children={children}
                    onSetOccupancy={handleSetOccupancy}
                />
            </div>

            <button className={styles.checkRatesButton} onClick={handleFindHivesClick}>
                CHECK RATES
            </button>
        </div>
    );
};

export default CheckRatesBar;
