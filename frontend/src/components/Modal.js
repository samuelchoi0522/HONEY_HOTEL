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

// Define the custom theme
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
    { title: 'Brazos Bliss Hotel, Waco, Texas'},
];

const Modal = ({ open, handleClose }) => {
    const [selectedCountry, setSelectedCountry] = useState(null); // State to manage selected country
    const [dateRange, setDateRange] = useState([null, null]); // State for date range

    const calculateNights = () => {
        if (dateRange[0] && dateRange[1]) {
            const start = dayjs(dateRange[0]);
            const end = dayjs(dateRange[1]);
            return end.diff(start, 'day');
        }
        return 0;
    };

    const nights = calculateNights();
    const today = dayjs(); // Get today's date

    if (!open) return null; // Do not render if the modal is not open

    return (
        <ThemeProvider theme={theme}>
            <div className="modal-overlay">
                <div className="modal-container">
                    <button className="close-button" onClick={handleClose}>×</button>
                    <div className="modal-content">
                        <div className="inputs-container">
                            {/* Destination Field */}
                            <div className="field destination">
                                <label className="label">
                                    <img src="/icons/DESTINATION_ICON.png" alt="Destination Icon" className="icon" />
                                    &nbsp;DESTINATION
                                </label>

                                {/* Use Material-UI Autocomplete component */}
                                <Autocomplete
                                    id="country-select"
                                    options={hotelLocations}
                                    getOptionLabel={(option) => option.title}
                                    value={selectedCountry}
                                    onChange={(event, newValue) => {
                                        setSelectedCountry(newValue);
                                    }}
                                    sx={{
                                        width: 250,
                                        '& .MuiAutocomplete-popupIndicator': {
                                            color: '#000000', // Change dropdown arrow color
                                        },
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Where can we take you?"
                                            variant="standard"
                                            InputProps={{
                                                ...params.InputProps,
                                                disableUnderline: true, // Explicitly disable the underline
                                            }}
                                            sx={{
                                                position: 'relative', // Required for the underline styling
                                                '&:before': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    left: 0,
                                                    right: 0,
                                                    bottom: '-2px',
                                                    height: '2px', // Height of the custom underline
                                                    backgroundColor: '#000000', // Default underline color
                                                    transition: 'background-color 0.2s ease', // Add transition effect
                                                },
                                                '&:hover:before': {
                                                    backgroundColor: '#F0D10B', // Hover effect to change underline color
                                                },
                                                '& label.Mui-focused': {
                                                    color: '#000000', // Change label color to #F0D10B when focused
                                                },
                                                '& .MuiInputBase-root': {
                                                    '&:before': {
                                                        borderBottom: 'none', // Remove underline
                                                    },
                                                    '&:hover:before': {
                                                        borderBottom: 'none', // Remove underline on hover
                                                    },
                                                    '&:after': {
                                                        borderBottom: 'none', // Remove underline on focus
                                                    },
                                                },
                                            }}
                                        />
                                    )}
                                />
                            </div>

                            {/* Single Date Range Picker with button */}
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
                                            minDate={today} // Set minimum date to today's date
                                            slots={{ field: SingleInputDateRangeField }}
                                            sx={{
                                                width: 250,
                                                position: 'relative', // Required for the underline styling
                                                '&:before': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    left: 0,
                                                    right: 0,
                                                    bottom: '5px',
                                                    height: '2px', // Height of the custom underline
                                                    backgroundColor: '#000000', // Default underline color
                                                    transition: 'background-color 0.2s ease', // Add transition effect
                                                },
                                                '&:hover:before': {
                                                    backgroundColor: '#F0D10B', // Hover effect to change underline color
                                                },
                                            }}
                                        />
                                    </LocalizationProvider>
                                </div>
                            </div>
                            {/* "Find Hives" Button */}
                            <button className="find-hives-button" onClick={() => alert('Find Hives clicked!')}>
                                FIND HIVES
                            </button>
                        </div>
                        <SetOccupancyDialog />
                        <SetRateDialog />
                        {/* put the number of guests nd promo code stuff here */}
                    </div>
                </div>
            </div>
        </ThemeProvider>
    );
};

export default Modal;
