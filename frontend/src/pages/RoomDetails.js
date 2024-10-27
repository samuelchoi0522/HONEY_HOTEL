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
        startDate,
        endDate,
        roomId,
        ...initialBookingDetails
    } = location.state || {};

    // State to manage booking details
    const [reservedRoomIds, setReservedRoomIds] = useState([]);
    const [bookingDetails, setBookingDetails] = useState({
        categoryName,
        roomType,
        selectedBedType: roomOptions[0]?.bedType,
        selectedSmoking: roomOptions[0]?.smokingAllowed,
        selectedPriceCategory: roomOptions[0]?.priceCategory,
        totalPrice: roomOptions[0]?.price,
        roomId: roomId || roomOptions[0]?.id,
        checkInDate: startDate,
        checkOutDate: endDate,
        ...initialBookingDetails,
    });

    // Fetch reserved room IDs on component mount
    useEffect(() => {
        const fetchReservedRooms = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/reservations/reserved-rooms?checkInDate=${bookingDetails.checkInDate}&checkOutDate=${bookingDetails.checkOutDate}`);
                if (response.ok) {
                    const reservedIds = await response.json();
                    console.log("Reserved room IDs:", reservedIds); // Debug log
                    setReservedRoomIds(reservedIds);
                } else {
                    console.error("Failed to fetch reserved room IDs");
                }
            } catch (error) {
                console.error("Error fetching reserved rooms:", error);
            }
        };

        fetchReservedRooms();
    }, [bookingDetails.checkInDate, bookingDetails.checkOutDate]);


    // Filter available room options by excluding reserved ones
    const availableRoomOptions = roomOptions.filter(
        option => !reservedRoomIds.includes(option.id)
    );

    // Get the filtered options based on current selection
    const filteredBedTypes = [...new Set(
        availableRoomOptions
            .filter(option =>
                option.smokingAllowed === bookingDetails.selectedSmoking &&
                option.priceCategory === bookingDetails.selectedPriceCategory
            )
            .map(option => option.bedType)
    )];

    const filteredSmokingStatuses = [...new Set(
        availableRoomOptions
            .filter(option =>
                option.bedType === bookingDetails.selectedBedType &&
                option.priceCategory === bookingDetails.selectedPriceCategory
            )
            .map(option => option.smokingAllowed)
    )];

    const filteredPriceCategories = [...new Set(
        availableRoomOptions
            .filter(option =>
                option.bedType === bookingDetails.selectedBedType &&
                option.smokingAllowed === bookingDetails.selectedSmoking
            )
            .map(option => option.priceCategory)
    )];

    // Update booking details when the user selects an option
    const updateBookingDetails = (newBedType, newSmoking, newPriceCategory) => {
        const matchedOption = availableRoomOptions.find(option =>
            option.bedType === newBedType &&
            option.smokingAllowed === newSmoking &&
            option.priceCategory === newPriceCategory
        );

        if (matchedOption) {
            setBookingDetails(prevDetails => ({
                ...prevDetails,
                selectedBedType: newBedType,
                selectedSmoking: newSmoking,
                selectedPriceCategory: newPriceCategory,
                totalPrice: matchedOption.price,
                roomId: matchedOption.id,
            }));
        }
    };

    // Handle changes for room option selections
    const handleBedTypeChange = (e) => {
        const newBedType = e.target.value;
        updateBookingDetails(newBedType, bookingDetails.selectedSmoking, bookingDetails.selectedPriceCategory);
    };

    const handleSmokingChange = (e) => {
        const newSmoking = e.target.value === 'true';
        updateBookingDetails(bookingDetails.selectedBedType, newSmoking, bookingDetails.selectedPriceCategory);
    };

    const handlePriceCategoryChange = (e) => {
        const newPriceCategory = e.target.value;
        updateBookingDetails(bookingDetails.selectedBedType, bookingDetails.selectedSmoking, newPriceCategory);
    };

    // Handle reserve button click
    const handleReserve = () => {
        if (reservedRoomIds.includes(bookingDetails.roomId)) {
            alert("Selected room is already reserved. Please select a different option.");
            return;
        }

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
                        {filteredBedTypes.map(bedType => (
                            <option key={bedType} value={bedType}>{bedType}</option>
                        ))}
                    </select>
                </div>

                <div className="room-option">
                    <label>Smoking Status:</label>
                    <select value={bookingDetails.selectedSmoking} onChange={handleSmokingChange}>
                        {filteredSmokingStatuses.map(smokingAllowed => (
                            <option key={smokingAllowed} value={smokingAllowed}>
                                {smokingAllowed ? 'Smoking' : 'Non-Smoking'}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="room-option">
                    <label>Price Category:</label>
                    <select value={bookingDetails.selectedPriceCategory} onChange={handlePriceCategoryChange}>
                        {filteredPriceCategories.map(priceCategory => (
                            <option key={priceCategory} value={priceCategory}>{priceCategory}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="total">
                <h3>Total: ${bookingDetails.totalPrice}</h3>
                <p style={{ color: 'black' }}>Room ID: {bookingDetails.roomId}</p> {/* Display updated Room ID */}
                <button onClick={handleReserve}>Reserve</button>
            </div>
        </div>
    );
};

export default RoomDetails;
