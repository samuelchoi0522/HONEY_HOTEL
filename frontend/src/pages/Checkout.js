import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { Box, TextField, Button, Typography, Grid, Divider, FormControlLabel, Checkbox, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import '../styles/Checkout.css';
import PaymentComponent from '../components/PaymentComponent';
import { v4 as uuidv4 } from 'uuid';

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const {
        hotelLocation,
        checkInDate,
        checkOutDate,
        selectedRooms,
        rooms,
        roomPrices,
        adults,
        children,
        rateOption,
        promoCode,
        reservedActivity,
        activityDate,
        chosenPhoto,
    } = location.state || {};

    const [finalTotal, setFinalTotal] = useState(0);
    const [numNights, setNumNights] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const methods = useForm({
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            country: '', // This will hold the selected country
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
                accountHolderName: '',
                cardnumber: '',
                expiry: '',
                cvv: '',
            },
        },
    });

    useEffect(() => {
        console.log(location.state);
        const checkSession = async () => {
            try {
                const response = await fetch("http://localhost:8080/auth/check-session", {
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

        const bookingId = uuidv4(); // Generate a unique booking ID

        try {
            const reservationIds = [];

            // Iterate over selectedRooms to create a reservation for each room
            for (let i = 0; i < selectedRooms.length; i++) {
                const room = selectedRooms[i];
                const roomPrice = roomPrices[i]; // Get the corresponding room price

                const reservationPayload = {
                    hotelLocation,
                    roomId: room.roomId,
                    startDate: checkInDate,
                    endDate: checkOutDate,
                    adults,
                    children,
                    rateOption,
                    promoCode,
                    totalPrice: roomPrice * numNights, // Total price for this room
                    roomPrice, // Individual room price per night
                    bookingId,
                    chosenPhoto,
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
        <FormProvider {...methods}>
            <Box
                sx={{
                    padding: '60px',
                    maxWidth: '1000px',
                    margin: '50px auto',
                    marginLeft: '0',
                    backgroundColor: 'white',
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                    borderRadius: '12px',
                    fontFamily: 'Roboto, sans-serif',
                }}
            >
                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{
                        fontWeight: 'bold',
                        textAlign: 'center',
                        marginBottom: '30px',
                        fontSize: '24px',
                        color: '#333',
                    }}
                >
                    Complete Booking
                </Typography>
                <Grid container spacing={3}>
                    {/* Contact Information */}
                    <Grid item xs={12}>
                        <Typography
                            variant="h6"
                            sx={{
                                color: '#333',
                                fontWeight: 'bold',
                                marginBottom: '10px',
                                fontSize: '18px',
                            }}
                        >
                            CONTACT INFORMATION
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Controller
                            name="firstName"
                            control={methods.control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="First Name"
                                    fullWidth
                                    required
                                    sx={{
                                        backgroundColor: '#f9f9f9',
                                        '& .MuiInputBase-root': {
                                            color: 'black',
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: 'black',
                                        },
                                        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'black',
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: 'black',
                                        },
                                    }}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Controller
                            name="lastName"
                            control={methods.control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Last Name"
                                    fullWidth
                                    required
                                    sx={{
                                        backgroundColor: '#f9f9f9',
                                        '& .MuiInputBase-root': {
                                            color: 'black',
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: 'black',
                                        },
                                        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'black',
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: 'black',
                                        },
                                    }}
                                />
                            )}
                        />
                    </Grid>

                    {/* Email and Country/Region fields on the same line */}
                    <Grid item xs={12} sm={6}>
                        <Controller
                            name="email"
                            control={methods.control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Email Address"
                                    fullWidth
                                    required
                                    type="email"
                                    sx={{
                                        backgroundColor: '#f9f9f9',
                                        '& .MuiInputBase-root': {
                                            color: 'black',
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: 'black',
                                        },
                                        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'black',
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: 'black',
                                        },
                                    }}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel
                                id="country-label"
                                sx={{
                                    color: 'black',
                                    '&.Mui-focused': {
                                        color: 'black',
                                    },
                                }}
                            >
                                Country/Region *
                            </InputLabel>
                            <Controller
                                name="country"
                                control={methods.control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        labelId="country-label"
                                        id="country-select"
                                        label="Country/Region"
                                        sx={{
                                            backgroundColor: '#f9f9f9',
                                            height: '40px',
                                            '& .MuiInputBase-root': {
                                                color: 'black',
                                                height: '40px',
                                            },
                                            '& .MuiOutlinedInput-root': {
                                                borderColor: 'black',
                                                height: '40px',
                                            },
                                            '& .MuiSelect-icon': {
                                                color: 'black',
                                                height: '20px',
                                            },
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                height: '42px',
                                            },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'black',
                                                height: '40px',
                                            },
                                        }}
                                    >
                                        <MenuItem value="USA">United States</MenuItem>
                                        <MenuItem value="CAN">Canada</MenuItem>
                                        <MenuItem value="MEX">Mexico</MenuItem>
                                        <MenuItem value="UK">United Kingdom</MenuItem>
                                        <MenuItem value="AUS">Australia</MenuItem>
                                    </Select>
                                )}
                            />
                        </FormControl>
                    </Grid>

                    {/* Divider */}
                    <Grid item xs={12}>
                        <Divider sx={{ margin: '20px 0', backgroundColor: '#ddd' }} />
                    </Grid>

                    {/* Payment Information */}
                    <Grid item xs={12}>
                        <PaymentComponent />
                    </Grid>

                    {/* Divider */}
                    <Grid item xs={12}>
                        <Divider sx={{ margin: '20px 0', backgroundColor: '#ddd' }} />
                    </Grid>

                    {/* Terms & Conditions */}
                    <Grid item xs={12}>
                        <Typography
                            variant="h6"
                            sx={{
                                color: '#333',
                                fontWeight: 'bold',
                                marginBottom: '10px',
                                fontSize: '18px',
                            }}
                        >
                            TERMS & CONDITIONS
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={
                                <Controller
                                    name="cancellationPolicy"
                                    control={methods.control}
                                    render={({ field }) => (
                                        <Checkbox
                                            {...field}
                                            sx={{
                                                color: 'black',
                                                '&.Mui-checked': {
                                                    color: 'black',
                                                },
                                            }}
                                            required
                                        />
                                    )}
                                />
                            }
                            label={<Typography sx={{ color: 'black' }}>I have read and accepted the Cancellation Policy.</Typography>}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={
                                <Controller
                                    name="consent"
                                    control={methods.control}
                                    render={({ field }) => (
                                        <Checkbox
                                            {...field}
                                            sx={{
                                                color: 'black',
                                                '&.Mui-checked': {
                                                    color: 'black',
                                                },
                                            }}
                                            required
                                        />
                                    )}
                                />
                            }
                            label={<Typography sx={{ color: 'black' }}>I consent to Hotel Honey sending me electronic communications so that Honey Hotel can keep me informed of upcoming reservations and exclusive offers.</Typography>}
                        />
                    </Grid>

                    {/* Submit Button */}
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            size="large"
                            onClick={methods.handleSubmit(handleReserveRoom)}
                            sx={{
                                marginTop: '20px',
                                padding: '15px',
                                fontWeight: 'bold',
                                fontSize: '16px',
                                backgroundColor: '#000',
                                '&:hover': {
                                    backgroundColor: '#333',
                                },
                            }}
                        >
                            Book
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </FormProvider>
    );

    //     <div className="checkout-page">
    //        <h2 style={{ color: 'black' }}>Complete Booking</h2>
    //        <div className="booking-details">
    //           <h3>Room Details</h3>
    //           {selectedRooms?.map((room, index) => (
    //               <div key={index} className="room-details">
    //                   <h4>Room {index + 1}</h4>
    //                   <p><strong>Category:</strong> {room.categoryName}</p>
    //                     <p><strong>Room Type:</strong> {room.roomType}</p>
    //                  <p><strong>Bed Type:</strong> {room.selectedBedType}</p>
    //                   <p><strong>Smoking:</strong> {room.selectedSmoking ? 'Yes' : 'No'}</p>
    //                   <p><strong>Base Price:</strong> ${room.totalPrice * numNights}</p>
    //                  <p><strong>Room Id:</strong> {room.roomId}</p>
    //              </div>
    //          ))}
    //
    //          <p><strong>Check-in Date:</strong> {checkInDate}</p>
    //          <p><strong>Check-out Date:</strong> {checkOutDate}</p>
    //          <p><strong>Number of Nights:</strong> {numNights}</p>
    //
    //          {reservedActivity && (
    //                 <>
    //                    <h3>Activity Details</h3>
    //                    <p><strong>Activity:</strong> {reservedActivity.name}</p>
    //                     <p><strong>Category:</strong> {reservedActivity.category}</p>
    //                    <p><strong>Price:</strong> ${reservedActivity.price}</p>
    //                     <p><strong>Activity Date:</strong> {activityDate}</p>
    //                  <p><strong>Activity Id:</strong> {reservedActivity.id}</p>
    //               </>
    //           )}
    //
    //           <p><strong>Total (including 6% tax):</strong> ${finalTotal}</p>
    //       </div>
    //
    //       <FormProvider {...methods}>
    //          <form onSubmit={methods.handleSubmit(handleReserveRoom)}>
    //                 <PaymentComponent />
    //
    //                 <Button
    //                    type="submit"
    //                    variant="contained"
    //                   color="primary"
    //                   style={{ marginTop: '20px' }}
    //               >
    //                   Reserve Now
    //               </Button>
    //          </form>
    //      </FormProvider>
    //     </div>
    // );
};

export default Checkout;
