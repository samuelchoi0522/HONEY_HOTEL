import React from 'react';
import { useLocation } from 'react-router-dom';
import Button from '@mui/material/Button';
import '../styles/Checkout.css';

const Checkout = () => {
    const location = useLocation();
    const {
        checkInDate,
        checkOutDate,
        categoryName,
        roomType,
        selectedBedType,
        selectedSmoking,
        totalPrice,
        reservedActivity,
        activityDate
    } = location.state || {};

    return (
        <div className="checkout-page">
            <h2>Checkout Summary</h2>

            <div className="booking-details">
                <h3>Room Details</h3>
                <p><strong>Category:</strong> {categoryName}</p>
                <p><strong>Room Type:</strong> {roomType}</p>
                <p><strong>Bed Type:</strong> {selectedBedType}</p>
                <p><strong>Smoking:</strong> {selectedSmoking ? 'Yes' : 'No'}</p>
                <p><strong>Check-in Date:</strong> {checkInDate}</p>
                <p><strong>Check-out Date:</strong> {checkOutDate}</p>
                <p><strong>Total Price:</strong> ${totalPrice}</p>

                {reservedActivity && (
                    <>
                        <h3>Activity Details</h3>
                        <p><strong>Activity:</strong> {reservedActivity.name}</p>
                        <p><strong>Category:</strong> {reservedActivity.category}</p>
                        <p><strong>Activity Price:</strong> ${reservedActivity.price}</p>
                        <p><strong>Activity Date:</strong> {activityDate}</p>
                    </>
                )}
            </div>

            <Button
                variant="contained"
                color="primary"
                style={{ marginTop: '20px' }}
                onClick={() => alert('Proceeding to Payment...')}
            >
                Proceed to Payment
            </Button>
        </div>
    );
};

export default Checkout;
