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
        selectedRooms,
        rooms,
        adults,
        children,
        rateOption,
        promoCode,
        reservedActivity,
        activityDate,
    } = location.state || {};

    const [finalTotal, setFinalTotal] = useState(0);
    const [numNights, setNumNights] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);


    const methods = useForm({
        defaultValues: {
            payment: {
                checkInDate,
                checkOutDate,
                selectedRooms,
                rooms,
                adults,
                children,
                rateOption,
                promoCode,
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

    useEffect(() => {
        if (checkInDate && checkOutDate) {
            const nights = Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24));
            setNumNights(nights);

            let basePrice = selectedRooms.reduce((acc, room) => acc + room.totalPrice * nights, 0);
            if (reservedActivity) {
                basePrice += reservedActivity.price;
            }

            const tax = basePrice * 0.06;
            setFinalTotal((basePrice + tax).toFixed(2));
        }
    }, [checkInDate, checkOutDate, selectedRooms, reservedActivity]);

    const handleReserveRoom = async (data) => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        if (!isLoggedIn) {
            sessionStorage.setItem('reservationData', JSON.stringify(location.state));
            navigate('/login');
            setIsSubmitting(false);
            return;
        }

        if (selectedRooms.some(room => !room.roomId || !checkInDate || !checkOutDate)) {
            alert("Please fill in all required fields.");
            setIsSubmitting(false);
            return;
        }

        try {
            const reservationIds = [];

            for (const room of selectedRooms) {
                const reservationPayload = {
                    roomId: room.roomId,
                    startDate: checkInDate,
                    endDate: checkOutDate,
                    adults,
                    children,
                    rateOption,
                    promoCode,
                    finalTotal
                };

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
                reservationIds.push(reservationData.id);
            }

            if (reservedActivity) {
                const activityReservationPayload = {
                    hotelReservationId: reservationIds[0],
                    activityId: reservedActivity.id,
                    reservationDate: activityDate,
                    checkInDate,
                    checkOutDate,
                };

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
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="checkout-page">
            <h2 style={{ color: 'black' }}>Complete Booking</h2>
            <div className="booking-details">
                <h3>Room Details</h3>
                {selectedRooms?.map((room, index) => (
                    <div key={index} className="room-details">
                        <h4>Room {index + 1}</h4>
                        <p><strong>Category:</strong> {room.categoryName}</p>
                        <p><strong>Room Type:</strong> {room.roomType}</p>
                        <p><strong>Bed Type:</strong> {room.selectedBedType}</p>
                        <p><strong>Smoking:</strong> {room.selectedSmoking ? 'Yes' : 'No'}</p>
                        <p><strong>Base Price:</strong> ${room.totalPrice * numNights}</p>
                        <p><strong>Room Id:</strong> {room.roomId}</p>
                    </div>
                ))}

                <p><strong>Check-in Date:</strong> {checkInDate}</p>
                <p><strong>Check-out Date:</strong> {checkOutDate}</p>
                <p><strong>Number of Nights:</strong> {numNights}</p>

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
