import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/RoomDetails.css';

const RoomDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Extract initial values from location state
    const {
        categoryName,
        roomType,
        roomOptions,
        startDate, // Rename startDate to checkInDate
        endDate,   // Rename endDate to checkOutDate
        ...initialBookingDetails
    } = location.state || {};

    // State to manage booking details
    const [bookingDetails, setBookingDetails] = useState({
        categoryName,
        roomType,
        selectedBedType: roomOptions[0]?.bedType,
        selectedSmoking: roomOptions[0]?.smokingAllowed,
        selectedPriceCategory: roomOptions[0]?.priceCategory,
        totalPrice: roomOptions[0]?.price,
        checkInDate: startDate,  // Set checkInDate to startDate
        checkOutDate: endDate,   // Set checkOutDate to endDate
        ...initialBookingDetails,
    });

    // Debug log to ensure booking details are set correctly
    useEffect(() => {
        console.log('Initial booking details:', bookingDetails);
    }, [bookingDetails]);

    // Update total price based on user selection
    const updatePrice = (bedType, smoking, priceCategory) => {
        const matchedOption = roomOptions.find(option =>
            option.bedType === bedType &&
            option.smokingAllowed === smoking &&
            option.priceCategory === priceCategory
        );
        if (matchedOption) {
            setBookingDetails(prevDetails => ({
                ...prevDetails,
                totalPrice: matchedOption.price,
            }));
        }
    };

    // Handle changes for room option selections
    const handleBedTypeChange = (e) => {
        const newBedType = e.target.value;
        setBookingDetails(prevDetails => ({
            ...prevDetails,
            selectedBedType: newBedType,
        }));
        updatePrice(newBedType, bookingDetails.selectedSmoking, bookingDetails.selectedPriceCategory);
    };

    const handleSmokingChange = (e) => {
        const newSmoking = e.target.value === 'true';
        setBookingDetails(prevDetails => ({
            ...prevDetails,
            selectedSmoking: newSmoking,
        }));
        updatePrice(bookingDetails.selectedBedType, newSmoking, bookingDetails.selectedPriceCategory);
    };

    const handlePriceCategoryChange = (e) => {
        const newPriceCategory = e.target.value;
        setBookingDetails(prevDetails => ({
            ...prevDetails,
            selectedPriceCategory: newPriceCategory,
        }));
        updatePrice(bookingDetails.selectedBedType, bookingDetails.selectedSmoking, newPriceCategory);
    };

    // Handle reserve button click
    const handleReserve = () => {
        console.log('Final booking details:', bookingDetails); // Debug log

        // Navigate to AddVacationPackage and pass booking details
        navigate('/add-vacation-package', {
            state: {
                ...bookingDetails,
            },
        });
    };

    return (
        <div className="room-details">
            <h2>{bookingDetails.categoryName} - {bookingDetails.roomType} Room</h2>
            <p style={{ color: 'black' }}>Check-in Date: {bookingDetails.checkInDate}</p>
            <p style={{ color: 'black' }}>Check-out Date: {bookingDetails.checkOutDate}</p>

            <div className="room-options">
                <h3>Select Room Options:</h3>

                <div className="room-option">
                    <label>Bed Type:</label>
                    <select value={bookingDetails.selectedBedType} onChange={handleBedTypeChange}>
                        {[...new Set(roomOptions.map(option => option.bedType))].map(bedType => (
                            <option key={bedType} value={bedType}>{bedType}</option>
                        ))}
                    </select>
                </div>

                <div className="room-option">
                    <label>Smoking Status:</label>
                    <select value={bookingDetails.selectedSmoking} onChange={handleSmokingChange}>
                        <option value={true}>Smoking</option>
                        <option value={false}>Non-Smoking</option>
                    </select>
                </div>

                <div className="room-option">
                    <label>Price Category:</label>
                    <select value={bookingDetails.selectedPriceCategory} onChange={handlePriceCategoryChange}>
                        {[...new Set(roomOptions.map(option => option.priceCategory))].map(priceCategory => (
                            <option key={priceCategory} value={priceCategory}>{priceCategory}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="total">
                <h3>Total: ${bookingDetails.totalPrice}</h3>
                <button onClick={handleReserve}>Reserve</button>
            </div>
        </div>
    );
};

export default RoomDetails;
