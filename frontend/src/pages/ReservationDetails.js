import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/ReservationDetails.css';

const ReservationDetails = () => {
    const { id } = useParams(); // Get reservation ID from URL
    const [reservation, setReservation] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

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

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!reservation) {
        return <div>Reservation not found.</div>;
    }

    return (
        <div className="reservation-details-temp">
            <h1>Reservation Details</h1>
            <p><strong>Reservation ID:</strong> {reservation.id}</p>
            <p><strong>Booking ID:</strong> {reservation.bookingId} </p>
            <p><strong>Customer Name:</strong> {reservation.user.firstname} {reservation.user.lastname}</p>
            <p><strong>Check-In Date:</strong> {reservation.checkInDate}</p>
            <p><strong>Check-Out Date:</strong> {reservation.checkOutDate}</p>
            <p><strong>Status:</strong> {reservation.checkedIn}</p>
            {/* Add more fields as needed */}
        </div>
    );
};

export default ReservationDetails;