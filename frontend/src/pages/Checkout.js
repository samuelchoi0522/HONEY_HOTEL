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
        roomId,
        reservedActivity,
        activityDate,
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
                roomId,
                reservedActivity,
                activityDate,
                cardnumber: '',
                expiry: '',
                cvv: '',
                accountHolderName: '',
            },
        },
    });

    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/check-session", {
                    method: "POST",
                    credentials: "include",
                    headers: { 'Content-Type': 'application/json' },
                });

                const data = await response.json();
                setIsLoggedIn(response.ok && data.isLoggedIn);
            } catch (error) {
                console.error("Error checking session:", error);
            }
        };

        checkSession();
    }, []);

    // Calculate total price and number of nights
    useEffect(() => {
        if (checkInDate && checkOutDate) {
            const nights = Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24));
            setNumNights(nights);

            let basePrice = totalPrice * nights;
            if (reservedActivity) {
                basePrice += reservedActivity.price;
            }

            const tax = basePrice * 0.06; // Assuming 6% tax
            setFinalTotal((basePrice + tax).toFixed(2));
        }
    }, [checkInDate, checkOutDate, totalPrice, reservedActivity]);


    
    const handleReserveRoom = async (data) => {
        if (!isLoggedIn) {
            sessionStorage.setItem('reservationData', JSON.stringify(location.state));
            navigate('/login');
            return;
        }

        if (!roomId || !checkInDate || !checkOutDate) {
            alert("Please fill in all required fields.");
            return;
        }

        try {
            const reservationPayload = {
                roomId,
                startDate: checkInDate,
                endDate: checkOutDate,
            };

            console.log("Room reservation payload:", reservationPayload);

            const reservationResponse = await fetch("http://localhost:8080/api/reservations", {
                method: "POST",
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reservationPayload),
            });

            if (!reservationResponse.ok) {
                const errorText = await reservationResponse.text();
                console.error("Error response:", errorText);
                throw new Error(errorText || "Failed to create reservation");
            }

            const reservationData = await reservationResponse.json();
            console.log("Room reservation response:", reservationData);

            const hotelReservationId = reservationData?.id;
            if (!hotelReservationId) {
                throw new Error("Failed to retrieve hotel reservation ID.");
            }

            if (reservedActivity) {
                const activityReservationPayload = {
                    hotelReservationId,
                    activityId: reservedActivity.id,
                    reservationDate: activityDate,
                    checkInDate,
                    checkOutDate,
                };

                console.log("Activity reservation payload:", activityReservationPayload);

                const activityResponse = await fetch("http://localhost:8080/api/reservations/activities", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(activityReservationPayload),
                });

                if (!activityResponse.ok) {
                    const errorText = await activityResponse.text();
                    console.error("Error response:", errorText);
                    throw new Error(errorText || "Failed to create activity reservation");
                }
            }

            alert("Reservation successful!");
            navigate('/confirmation');
        } catch (error) {
            console.error("Error during reservation:", error);
            alert(`An error occurred while processing your reservation: ${error.message}`);
        }
    };




    return (
        <div className="checkout-page">
            <h2 style={{ color: 'black' }}>Complete Booking</h2>
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
                <p><strong>Room Id:</strong>{roomId}</p>

                {reservedActivity && (
                    <>
                        <h3>Activity Details</h3>
                        <p><strong>Activity:</strong> {reservedActivity.name}</p>
                        <p><strong>Category:</strong> {reservedActivity.category}</p>
                        <p><strong>Price:</strong> ${reservedActivity.price}</p>
                        <p><strong>Activity Date:</strong> {activityDate}</p>
                        <p><strong>Activity Id:</strong> {reservedActivity.id}</p>
                    </>
                )}

                <p><strong>Total (including 6% tax):</strong> ${finalTotal}</p>
            </div>

            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(handleReserveRoom)}>
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
