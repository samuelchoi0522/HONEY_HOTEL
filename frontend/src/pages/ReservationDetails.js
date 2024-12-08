import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/ReservationDetails.css';

const ReservationDetails = () => {
    const { id } = useParams();
    const [reservation, setReservation] = useState(null);
    const [activity, setActivity] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const process = require('process');

    useEffect(() => {
        const fetchReservationDetails = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/admin/reservations/${id}/view`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    setReservation(data);
                } else {
                    console.error('Failed to fetch reservation details');
                }
            } catch (error) {
                console.error('Error fetching reservation details:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchReservationDetails();
    }, [id]);

    useEffect(() => {
        const fetchActivityDetails = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/vacations/${id}`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (response.ok) {
                    const contentType = response.headers.get("content-type");
                    if (contentType && contentType.includes("application/json")) {
                        const data = await response.json();
                        console.log(data);
                        setActivity(data);
                    } else {
                        console.log("No JSON response body; activity might not exist.");
                        setActivity(null);
                    }
                } else if (response.status === 404) {
                    console.error('No activity found for this reservation.');
                    setActivity(null);
                } else {
                    console.error('Failed to fetch activity details');
                }
            } catch (error) {
                console.error('Error fetching activity details:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchActivityDetails();
    }, [id]);



    if (isLoading) {
        return <div className="reservation-details-loading">Loading...</div>;
    }

    if (!reservation) {
        return <div className="reservation-details-error">Reservation not found.</div>;
    }

    return (
        <div className="reservation-details">
            <h1 className="reservation-details-title">Reservation Details</h1>
            <div className="reservation-details-content">
                <div className="reservation-details-right-side">
                    <p><strong>Booking ID:</strong> {reservation.bookingId}</p>
                    <p><strong>Customer Name:</strong> {reservation.user.firstname} {reservation.user.lastname}</p>
                    <p><strong>Email:</strong> {reservation.user.email}</p>
                    <p><strong>Check-In Date:</strong> {reservation.checkInDate}</p>
                    <p><strong>Check-Out Date:</strong> {reservation.checkOutDate}</p>
                    <p className="reservation-details-status">
                        <strong>Status:</strong> {reservation.checkedIn ? "Checked In" : "Not Checked In"}
                    </p>
                </div>
                <div className="reservation-details-details reservation-details-section">
                    <p><strong>Adults:</strong> {reservation.adults}</p>
                    <p><strong>Children:</strong> {reservation.children}</p>
                    <p><strong>Promo Code:</strong> {reservation.promoCode || "N/A"}</p>
                    <p><strong>Rate Option:</strong> {reservation.rateOption}</p>
                    <p className="reservation-details-total-price">
                        <p><strong>Total Price:</strong> ${reservation.roomPrice.toFixed(2)}</p>
                    </p>
                </div>
            </div>
            <div className="reservation-details-room reservation-details-section">
                <h3 className="reservation-details-h3">Room Details</h3>
                <p><strong>Hotel Location:</strong> {reservation.hotelLocation}</p>
                <p><strong>Category:</strong> {reservation.room.category.categoryName}</p>
                <p><strong>Bed Type:</strong> {reservation.room.bedType}</p>
                <p><strong>Smoking Allowed:</strong> {reservation.room.smokingAllowed ? "Yes" : "No"}</p>
                <p><strong>Room Type:</strong> {reservation.room.roomType}</p>
                <p><strong>Price Category:</strong> {reservation.room.priceCategory}</p>
            </div>

            <div className="reservation-details-room reservation-details-section">
                <h3 className="reservation-details-h3">Activity Details</h3>
                {activity ? (
                    <>
                        <p><strong>Activity:</strong> {activity.activityName}</p>
                        <p><strong>Activity Date:</strong> {activity.reservationDate}</p>
                    </>
                ) : (
                    <p>No activities found.</p>
                )}
            </div>
        </div>
    );
};

export default ReservationDetails;