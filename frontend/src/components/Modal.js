import React, { useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { LicenseInfo } from '@mui/x-license-pro';
import dayjs from 'dayjs';
import SetOccupancyDialog from './Set_Occupancy_Dialog.js';
import SetRateDialog from './Set_Rate_Dialog.js';
import '../styles/Modal.css';

LicenseInfo.setLicenseKey(process.env.REACT_APP_MUI_X_LICENSEKEY);

const theme = createTheme({
    components: {
        MuiAutocomplete: {
            styleOverrides: {
                root: {
                    marginTop: '-10px',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiInput-underline:before': {
                        borderBottom: 'none',
                    },
                    '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                        borderBottom: 'none',
                    },
                    '& .MuiInput-underline:after': {
                        borderBottom: 'none',
                    },
                },
            },
        },
        MuiInputBase: {
            styleOverrides: {
                root: {
                    position: 'relative',
                    '&:hover:not(.Mui-disabled):before': {
                        backgroundColor: '#F0D10B',
                    },
                    '&.Mui-focused:before': {
                        backgroundColor: '#F0D10B',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                    },
                    marginTop: '-10px',
                },
            },
        },
        MuiPickersDay: {
            styleOverrides: {
                root: {
                    '&.Mui-selected': {
                        backgroundColor: '#000000',
                        color: '#ffffff',
                    },
                    '&.Mui-selected:hover': {
                        color: '#000000',
                        backgroundColor: '#000000',
                    },
                    '&.Mui-selected.MuiPickersDay-dayOutsideMonth': {
                        color: '#000000',
                        backgroundColor: '#000000',
                    },
                },
                dayInsideMonth: {
                    '&.Mui-selected': {
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                    },
                },
            },
        },
    },
});

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


const Modal = ({ open, handleClose }) => {
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [dateRange, setDateRange] = useState([null, null]);
    const [rooms, setRooms] = useState(1);
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [rateOption, setRateOption] = useState('Lowest Regular Rate');
    const [ratePromoCode, setRatePromoCode] = useState('');

    const handleSetOccupancy = (rooms, adults, children) => {
        setRooms(rooms);
        setAdults(adults);
        setChildren(children);
    };

    const handleSetRate = (option, promoCode) => {
        setRateOption(option);
        setRatePromoCode(promoCode);
    };

    const handleFindHivesClick = () => {
        const hotelTitle = selectedHotel ? selectedHotel.title : "No hotel selected";
        const startDate = dateRange[0] ? dayjs(dateRange[0]).format('MM/DD/YYYY') : "No start date selected";
        const endDate = dateRange[1] ? dayjs(dateRange[1]).format('MM/DD/YYYY') : "No end date selected";
        const nights = calculateNights();

        console.log(`Hotel: ${hotelTitle}`);
        console.log(`Rooms: ${rooms}, Adults: ${adults}, Children: ${children}`);
        console.log(`Rate Option: ${rateOption}`);
        if (rateOption === 'Promo Code' && ratePromoCode) {
            console.log(`Promo Code: ${ratePromoCode.toUpperCase()}`);
        }
        console.log(`Start Date: ${startDate}`);
        console.log(`End Date: ${endDate}`);
        console.log(`Number of Nights: ${nights}`);
    };



    const calculateNights = () => {
        if (dateRange[0] && dateRange[1]) {
            const start = dayjs(dateRange[0]);
            const end = dayjs(dateRange[1]);
            return end.diff(start, 'day');
        }
        return 0;
    };

    const nights = calculateNights();
    const today = dayjs();

    if (!open) return null;

    return (
        <ThemeProvider theme={theme}>
            <div className="modal-overlay">
                <div className="modal-container">
                    <button className="close-button" onClick={handleClose}>×</button>
                    <div className="modal-content">
                        <div className="inputs-container">
                            <div className="field destination">
                                <label className="label">
                                    <img src="/icons/DESTINATION_ICON.png" alt="Destination Icon" className="icon" />
                                    &nbsp;DESTINATION
                                </label>

                                <Autocomplete
                                    id="hotel-select"
                                    options={hotelLocations}
                                    getOptionLabel={(option) => option.title}
                                    value={selectedHotel}
                                    onChange={(event, newValue) => {
                                        setSelectedHotel(newValue);
                                    }}
                                    sx={{
                                        width: 250,
                                        '& .MuiAutocomplete-popupIndicator': {
                                            color: '#000000',
                                        },
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Where can we take you?"
                                            variant="standard"
                                            InputProps={{
                                                ...params.InputProps,
                                                disableUnderline: true,
                                            }}
                                            sx={{
                                                position: 'relative',
                                                '&:before': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    left: 0,
                                                    right: 0,
                                                    bottom: '-2px',
                                                    height: '2px',
                                                    backgroundColor: '#000000',
                                                    transition: 'background-color 0.2s ease',
                                                },
                                                '&:hover:before': {
                                                    backgroundColor: '#F0D10B',
                                                },
                                                '& label.Mui-focused': {
                                                    color: '#000000',
                                                },
                                                '& .MuiInputBase-root': {
                                                    '&:before': {
                                                        borderBottom: 'none',
                                                    },
                                                    '&:hover:before': {
                                                        borderBottom: 'none',
                                                    },
                                                    '&:after': {
                                                        borderBottom: 'none',
                                                    },
                                                },
                                            }}
                                        />
                                    )}
                                />
                            </div>

                            {/* date range picker */}
                            <div className="field date-range-picker">
                                <label className="label">
                                    <img src="/icons/CALENDAR_ICON.png" alt="Calendar Icon" className="icon" />
                                    &nbsp;{nights > 0 ? `${nights} NIGHTS` : "DATE RANGE"}
                                </label>
                                <div className="date-range-container">

                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DateRangePicker
                                            value={dateRange}
                                            onChange={(newValue) => setDateRange(newValue)}
                                            minDate={today}
                                            slots={{ field: SingleInputDateRangeField }}
                                            sx={{
                                                width: 250,
                                                position: 'relative',
                                                '&:before': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    left: 0,
                                                    right: 0,
                                                    bottom: '5px',
                                                    height: '2px',
                                                    backgroundColor: '#000000',
                                                    transition: 'background-color 0.2s ease',
                                                },
                                                '&:hover:before': {
                                                    backgroundColor: '#F0D10B',
                                                },
                                            }}
                                        />
                                    </LocalizationProvider>
                                </div>
                            </div>
                            {/* submit button */}
                            <button className="find-hives-button" onClick={handleFindHivesClick}>
                                FIND HIVES
                            </button>
                        </div>

                        {/* occupancy and rate dialog boxes */}
                        <SetOccupancyDialog onSetOccupancy={handleSetOccupancy} />
                        <SetRateDialog onSetRate={handleSetRate} />
                    </div>
                </div>
            </div>
        </ThemeProvider>
    );
};

export default Modal;
