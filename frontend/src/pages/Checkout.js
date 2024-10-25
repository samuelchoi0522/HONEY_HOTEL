import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import Button from '@mui/material/Button';
import '../styles/Checkout.css';
import PaymentComponent from '../components/PaymentComponent';

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {
        checkInDate,
        checkOutDate,
        categoryName,
        roomType,
        selectedBedType,
        selectedSmoking,
        totalPrice,
        reservedActivity,
        activityDate,
        roomPrice
    } = location.state || {};

    const [finalTotal, setFinalTotal] = useState(0);
    const [numNights, setNumNights] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const methods = useForm({
        defaultValues: {
            payment: {
                checkInDate,
                checkOutDate,
                categoryName,
                roomType,
                selectedBedType,
                selectedSmoking,
                totalPrice,
                reservedActivity,
                activityDate,
                roomPrice,
                cardnumber: '',
                expiry: '',
                cvv: '',
                accountHolderName: ''
            }
        }
    });

    // Check if the user is logged in
    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/check-session", {
                    method: "POST",
                    credentials: "include",
                    headers: { 'Content-Type': 'application/json' }
                });

                const data = await response.json();
                if (response.ok && data.isLoggedIn) {
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error("Error checking session:", error);
            }
        };

        checkSession();
    }, []);

    // Calculate total price and number of nights
    useEffect(() => {
        if (checkInDate && checkOutDate) {
            const checkIn = new Date(checkInDate);
            const checkOut = new Date(checkOutDate);
            const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
            setNumNights(nights);

            let basePrice = totalPrice * nights;
            if (reservedActivity) {
                basePrice += reservedActivity.price;
            }

            const tax = basePrice * 0.06;
            const total = basePrice + tax;
            setFinalTotal(total.toFixed(2));
        }
    }, [checkInDate, checkOutDate, totalPrice, reservedActivity]);

    // Handle reservation submission
    const handleReserve = (data) => {
        if (!isLoggedIn) {
            // Save reservation data in session storage
            sessionStorage.setItem('reservationData', JSON.stringify({
                checkInDate,
                checkOutDate,
                categoryName,
                roomType,
                selectedBedType,
                selectedSmoking,
                totalPrice,
                reservedActivity,
                activityDate,
                roomPrice
            }));

            // Redirect to login page
            navigate('/login');
        } else {
            // Handle reservation logic with form data
            console.log("Form Data: ", data);
            alert('Reserving room...');
        }
    };

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
                <p><strong>Number of Nights:</strong> {numNights}</p>
                <p><strong>Base Price:</strong> ${totalPrice * numNights}</p>
                {reservedActivity && (
                    <>
                        <h3>Activity Details</h3>
                        <p><strong>Activity:</strong> {reservedActivity.name}</p>
                        <p><strong>Category:</strong> {reservedActivity.category}</p>
                        <p><strong>Activity Price:</strong> ${reservedActivity.price}</p>
                        <p><strong>Activity Date:</strong> {activityDate}</p>
                    </>
                )}
                <p><strong>Total (including 6% tax):</strong> ${finalTotal}</p>
            </div>

            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(handleReserve)}>
                    <PaymentComponent />

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        style={{ marginTop: '20px' }}
                    >
                        Reserve Now
                    </Button>
                </form>
            </FormProvider>
        </div>
    );
};

export default Checkout;
