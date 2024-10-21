import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import Button from '@mui/material/Button';
import '../styles/AddVacationPackage.css';

const AddVacationPackage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { checkInDate, checkOutDate, categoryName, roomType, selectedBedType, selectedSmoking, totalPrice } = location.state || {};

    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [activityDate, setActivityDate] = useState(null);

    // Validate dates
    const isValidDate = (date) => date && !isNaN(new Date(date).getTime());

    useEffect(() => {
        const fetchActivities = async () => {
            console.log('Fetching check-in and check-out dates:', checkInDate, checkOutDate);
            // Only fetch if the dates are valid
            if (!isValidDate(checkInDate) || !isValidDate(checkOutDate)) {
                console.error('Invalid check-in or check-out date.');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(
                    `http://localhost:8080/api/vacations/available?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`
                );
                if (response.ok) {
                    const data = await response.json();
                    setActivities(data);
                } else {
                    console.error('Failed to fetch activities.');
                }
            } catch (error) {
                console.error('Error fetching activities:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, [checkInDate, checkOutDate]);

    // Handle activity reservation
    const handleReserveActivity = () => {
        if (selectedActivity && !activityDate) {
            alert("Please select an activity date.");
            return;
        }

        // Prepare booking details for checkout
        const bookingDetails = {
            checkInDate,
            checkOutDate,
            categoryName,
            roomType,
            selectedBedType,
            selectedSmoking,
            totalPrice,
            reservedActivity: selectedActivity || null,
            activityDate: selectedActivity ? dayjs(activityDate).format('YYYY-MM-DD') : null,
        };

        // Redirect to checkout page
        navigate('/checkout', { state: bookingDetails });
    };

    if (loading) {
        return <div>Loading available activities...</div>;
    }

    return (
        <div className="vacation-package">
            <h2>Vacation Package Details</h2>
            <p>Check-in Date: {checkInDate}</p>
            <p>Check-out Date: {checkOutDate}</p>
            <p>Category: {categoryName}</p>
            <p>Room Type: {roomType}</p>
            <p>Bed Type: {selectedBedType}</p>
            <p>Smoking: {selectedSmoking ? 'Yes' : 'No'}</p>
            <p>Total Price: ${totalPrice}</p>

            <div className="activity-list">
                <h3>Select an Activity (Optional)</h3>
                <div
                    className={`activity-card no-activity ${!selectedActivity ? 'selected' : ''}`}
                >
                    <h3>No Thanks</h3>
                    <Button
                        variant="outlined"
                        color={!selectedActivity ? 'secondary' : 'primary'}
                        onClick={() => setSelectedActivity(null)}
                        style={{ marginTop: '10px' }}
                    >
                        {selectedActivity ? 'Select No Activity' : 'No Thanks'}
                    </Button>
                </div>

                {activities.length > 0 ? (
                    activities.map(activity => (
                        <div
                            key={activity.id}
                            className={`activity-card ${selectedActivity?.id === activity.id ? 'selected' : ''}`}
                        >
                            <h3>{activity.name}</h3>
                            <p>Category: {activity.category}</p>
                            <p>Price: ${activity.price}</p>
                            <Button
                                variant="outlined"
                                color={selectedActivity?.id === activity.id ? 'secondary' : 'primary'}
                                onClick={() => setSelectedActivity(activity)}
                                style={{ marginTop: '10px' }}
                            >
                                {selectedActivity?.id === activity.id ? 'Selected' : 'Select Activity'}
                            </Button>
                        </div>
                    ))
                ) : (
                    <p>No activities available for the selected dates.</p>
                )}
            </div>

            {selectedActivity && (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Select Activity Date"
                        value={activityDate}
                        onChange={(newValue) => setActivityDate(newValue)}
                        minDate={dayjs(checkInDate)}
                        maxDate={dayjs(checkOutDate)}
                        disablePast
                        renderInput={(params) => <input {...params} />}
                    />
                </LocalizationProvider>
            )}

            <Button
                variant="contained"
                color="primary"
                onClick={handleReserveActivity}
                style={{ marginTop: '20px' }}
            >
                {selectedActivity ? 'Reserve Activity' : 'Proceed Without Activity'}
            </Button>
        </div>
    );
};

export default AddVacationPackage;
