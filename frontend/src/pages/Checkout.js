import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import {
    Box,
    TextField,
    Button,
    Typography,
    Grid,
    Divider,
    FormControlLabel,
    Checkbox,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
} from '@mui/material';
import '../styles/Checkout.css';
import '../styles/AddVacationPackage.css';
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
        mode: 'onChange', // Tracks real-time form validation state
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            country: '',
            cancellationPolicy: false,
            consent: false,
        },
    });

    const { formState } = methods;
    const { isValid } = formState;

    useEffect(() => {
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

        const bookingId = uuidv4();

        try {
            const reservationIds = [];

            for (let i = 0; i < selectedRooms.length; i++) {
                const room = selectedRooms[i];
                const roomPrice = roomPrices[i];

                const reservationPayload = {
                    hotelLocation,
                    roomId: room.roomId,
                    startDate: checkInDate,
                    endDate: checkOutDate,
                    adults,
                    children,
                    rateOption,
                    promoCode,
                    totalPrice: roomPrice * numNights,
                    roomPrice,
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

            // Send email confirmation
            const emailPayload = {
                email: data.email,
                bookingId,
                hotelLocation,
                checkInDate,
                checkOutDate,
                selectedRooms,
                finalTotal,
            };

            const emailResponse = await fetch("http://localhost:8080/api/reservations/send-reservation-email", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(emailPayload),
            });

            if (!emailResponse.ok) {
                console.error("Failed to send confirmation email.");
            }

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
                    maxWidth: '600px',
                    margin: '50px auto',
                    marginTop: '150px',
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
                            rules={{ required: 'First Name is required' }}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    label="First Name"
                                    fullWidth
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Controller
                            name="lastName"
                            control={methods.control}
                            rules={{ required: 'Last Name is required' }}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    label="Last Name"
                                    fullWidth
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Controller
                            name="email"
                            control={methods.control}
                            rules={{
                                required: 'Email is required',
                                pattern: {
                                    value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                                    message: 'Invalid email address',
                                },
                            }}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    label="Email Address"
                                    fullWidth
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Controller
                            name="country"
                            control={methods.control}
                            rules={{ required: 'Country is required' }}
                            render={({ field, fieldState }) => (
                                <FormControl fullWidth error={!!fieldState.error}>
                                    <InputLabel>Country/Region</InputLabel>
                                    <Select {...field}
                                        label="Country/Region"
                                        sx={{ height: '40px', fontSize: '14px' }}
                                    >
                                        <MenuItem value="USA">United States</MenuItem>
                                        <MenuItem value="CAN">Canada</MenuItem>
                                        <MenuItem value="MEX">Mexico</MenuItem>
                                        <MenuItem value="UK">United Kingdom</MenuItem>
                                        <MenuItem value="AUS">Australia</MenuItem>
                                    </Select>
                                    {fieldState.error && (
                                        <Typography variant="caption" color="error">
                                            {fieldState.error.message}
                                        </Typography>
                                    )}
                                </FormControl>
                            )}
                        />
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
                        <FormControlLabel
                            control={
                                <Controller
                                    name="cancellationPolicy"
                                    control={methods.control}
                                    rules={{ required: true }}
                                    render={({ field, fieldState }) => (
                                        <Checkbox
                                            {...field}
                                            color="primary"
                                            error={!!fieldState.error}
                                        />
                                    )}
                                />
                            }
                            label={<Typography style={{ color: 'black' }}>I have read and accepted the Cancellation Policy.</Typography>}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={
                                <Controller
                                    name="consent"
                                    control={methods.control}
                                    rules={{ required: true }}
                                    render={({ field, fieldState }) => (
                                        <Checkbox
                                            {...field}
                                            color="primary"
                                            error={!!fieldState.error}
                                        />
                                    )}
                                />
                            }
                            label={
                                <Typography style={{ color: 'black' }}>
                                    I consent to receiving communications from Hotel Honey.
                                </Typography>
                            }
                        />
                    </Grid>

                    {/* Submit Button */}
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            size="large"
                            disabled={!isValid || isSubmitting}
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
};

export default Checkout;
