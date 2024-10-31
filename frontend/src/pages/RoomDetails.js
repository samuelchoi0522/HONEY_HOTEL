import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/RoomDetails.css';

const RoomDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const {
        categoryName,
        roomType,
        roomOptions,
        startDate,
        endDate,
        roomId,
        rooms,
        adults,
        children,
        rateOption,
        promoCode,
        discountRate = 0,
        ...initialBookingDetails
    } = location.state || {};

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
        rooms: rooms || 1,
        adults: adults || 1,
        children: children || 0,
        rateOption: rateOption || 'Lowest Regular Rate',
        promoCode: promoCode || '',
        discountRate,
        ...initialBookingDetails,
    });

    const availableRoomOptions = roomOptions.filter(
        option => !reservedRoomIds.includes(option.id)
    );

    const [selectedRooms, setSelectedRooms] = useState(
        Array.from({ length: bookingDetails.rooms }, (_, i) => {
            const roomOption = availableRoomOptions[i] || {};
            const discountedPrice = roomOption.price ? roomOption.price * (1 - discountRate) : 0;
            return {
                roomId: roomOption.id || null,
                categoryName: bookingDetails.categoryName,
                roomType: bookingDetails.roomType,
                selectedBedType: roomOption.bedType || bookingDetails.selectedBedType,
                selectedSmoking: roomOption.smokingAllowed || bookingDetails.selectedSmoking,
                selectedPriceCategory: roomOption.priceCategory || bookingDetails.selectedPriceCategory,
                totalPrice: discountedPrice.toFixed(2), // Apply discount to totalPrice
                checkInDate: bookingDetails.checkInDate,
                checkOutDate: bookingDetails.checkOutDate,
                adults: bookingDetails.adults,
                children: bookingDetails.children,
            };
        })
    );

    useEffect(() => {
        console.log('FROM: /room-details: \n\nSelected Room Details:', {
            categoryName,
            roomType,
            roomOptions,
            startDate,
            endDate,
            roomId,
            rooms,
            adults,
            children,
            rateOption,
            promoCode,
            discountRate,
            ...initialBookingDetails
        });
        const fetchReservedRooms = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/api/reservations/reserved-rooms?checkInDate=${bookingDetails.checkInDate}&checkOutDate=${bookingDetails.checkOutDate}`
                );
                if (response.ok) {
                    const reservedIds = await response.json();
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

    const updateBookingDetails = (index, field, value) => {
        const updatedRooms = [...selectedRooms];

        const matchedOption = availableRoomOptions.find(option =>
            option.bedType === (field === 'selectedBedType' ? value : updatedRooms[index].selectedBedType) &&
            option.smokingAllowed === (field === 'selectedSmoking' ? value : updatedRooms[index].selectedSmoking) &&
            option.priceCategory === (field === 'selectedPriceCategory' ? value : updatedRooms[index].selectedPriceCategory)
        );

        if (matchedOption) {
            updatedRooms[index] = {
                ...updatedRooms[index],
                [field]: value,
                totalPrice: (matchedOption.price * (1 - discountRate)).toFixed(2), // Apply discount on price change
                roomId: matchedOption.id,
            };

            for (let i = 0; i < updatedRooms.length; i++) {
                if (i !== index && updatedRooms[i].roomId === matchedOption.id) {
                    const nextAvailableOption = availableRoomOptions.find(
                        option => !updatedRooms.some(room => room.roomId === option.id)
                    );

                    if (nextAvailableOption) {
                        updatedRooms[i] = {
                            ...updatedRooms[i],
                            roomId: nextAvailableOption.id,
                            selectedBedType: nextAvailableOption.bedType,
                            selectedSmoking: nextAvailableOption.smokingAllowed,
                            selectedPriceCategory: nextAvailableOption.priceCategory,
                            totalPrice: (nextAvailableOption.price * (1 - discountRate)).toFixed(2), // Apply discount
                        };
                    }
                }
            }

            setSelectedRooms(updatedRooms);
        }
    };

    const handleRoomChange = (index, field, value) => {
        updateBookingDetails(index, field, value);
    };

    const handleReserve = () => {
        for (const room of selectedRooms) {
            if (reservedRoomIds.includes(room.roomId)) {
                alert("One of the selected rooms is alreafdy reserved. Please select a different option.");
                return;
            }
        }

        navigate('/add-vacation-package', {
            state: {
                selectedRooms,
                checkInDate: bookingDetails.checkInDate,
                checkOutDate: bookingDetails.checkOutDate,
                rateOption: bookingDetails.rateOption,
                promoCode: bookingDetails.promoCode,
                adults: bookingDetails.adults,
                children: bookingDetails.children,
                totalPrice: bookingDetails.totalPrice,
            },
        });
    };

    const subtotal = selectedRooms.reduce((acc, room) => acc + parseFloat(room.totalPrice), 0).toFixed(2);


    return (
        <div className="room-details">
            <h2>{bookingDetails.categoryName} - {bookingDetails.roomType} Room</h2>
            <p style={{ color: 'black' }}>Check-in Date: {bookingDetails.checkInDate}</p>
            <p style={{ color: 'black' }}>Check-out Date: {bookingDetails.checkOutDate}</p>

            {selectedRooms.map((room, index) => (
                <div key={index} className="room-options">
                    <h3>Room {index + 1} Options:</h3>

                    <div className="room-option">
                        <label>Bed Type:</label>
                        <select
                            value={room.selectedBedType}
                            onChange={(e) => handleRoomChange(index, 'selectedBedType', e.target.value)}
                        >
                            {filteredBedTypes.map(bedType => (
                                <option key={bedType} value={bedType}>{bedType}</option>
                            ))}
                        </select>
                    </div>

                    <div className="room-option">
                        <label>Smoking Status:</label>
                        <select
                            value={room.selectedSmoking}
                            onChange={(e) => handleRoomChange(index, 'selectedSmoking', e.target.value === 'true')}
                        >
                            {filteredSmokingStatuses.map(smokingAllowed => (
                                <option key={smokingAllowed} value={smokingAllowed}>
                                    {smokingAllowed ? 'Smoking' : 'Non-Smoking'}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="room-option">
                        <label>Price Category:</label>
                        <select
                            value={room.selectedPriceCategory}
                            onChange={(e) => handleRoomChange(index, 'selectedPriceCategory', e.target.value)}
                        >
                            {filteredPriceCategories.map(priceCategory => (
                                <option key={priceCategory} value={priceCategory}>{priceCategory}</option>
                            ))}
                        </select>
                    </div>

                    <p style={{ color: 'black' }}>Total: ${room.totalPrice}</p>
                    <p style={{ color: 'black' }}>Room ID: {room.roomId}</p>
                </div>
            ))}


            <p style={{ color: 'black' }}>Subtotal: ${subtotal}</p>

            <button onClick={handleReserve}>Reserve</button>
        </div>
    );
};

export default RoomDetails;
