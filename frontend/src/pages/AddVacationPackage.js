import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    Typography,
    Button,
    Card,
    CardContent,
    Grid,
    Box,
    CircularProgress,
    TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const AddVacationPackage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {
        hotelLocation,
        checkInDate,
        checkOutDate,
        selectedRooms,
        roomPrices,
        totalPrice,
        rooms,
        adults,
        children,
        rateOption,
        promoCode,
        chosenPhoto,
    } = location.state || {};

    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [activityDate, setActivityDate] = useState(null);

    const numNights = useMemo(() => {
        if (checkInDate && checkOutDate) {
            return dayjs(checkOutDate).diff(dayjs(checkInDate), "day");
        }
        return 0;
    }, [checkInDate, checkOutDate]);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/api/vacations/available?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`
                );
                if (response.ok) {
                    const data = await response.json();
                    setActivities(data);
                } else {
                    console.error("Failed to fetch activities.");
                }
            } catch (error) {
                console.error("Error fetching activities:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, [checkInDate, checkOutDate]);

    const handleReserveActivity = () => {
        if (selectedActivity && !activityDate) {
            alert("Please select an activity date.");
            return;
        }

        const bookingDetails = {
            hotelLocation,
            checkInDate,
            checkOutDate,
            selectedRooms,
            roomPrices,
            totalPrice,
            rooms,
            adults,
            children,
            rateOption,
            promoCode,
            reservedActivity: selectedActivity
                ? {
                    id: selectedActivity.id,
                    name: selectedActivity.name,
                    price: selectedActivity.price * (adults + children),
                    category: selectedActivity.category,
                }
                : null,
            activityDate: selectedActivity
                ? dayjs(activityDate).format("YYYY-MM-DD")
                : null,
            chosenPhoto,
        };

        navigate("/checkout", { state: bookingDetails });
    };

    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                padding: "20px",
                maxWidth: "1200px",
                margin: "0 auto",
                marginTop: "50px",
            }}
        >
            <Typography variant="h4" gutterBottom>
                Vacation Package Details
            </Typography>

            <Box mb={3}>
                <Typography variant="body1">
                    <strong>Check-in Date:</strong> {checkInDate}
                </Typography>
                <Typography variant="body1">
                    <strong>Check-out Date:</strong> {checkOutDate}
                </Typography>
                <Typography variant="body1">
                    <strong>Hotel Location:</strong> {hotelLocation || "N/A"}
                </Typography>
            </Box>

            {selectedRooms?.map((room, index) => (
                <Card
                    key={index}
                    sx={{
                        mb: 3,
                        boxShadow: 3,
                        p: 2,
                        borderRadius: 2,
                    }}
                >
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Room {index + 1} Details
                        </Typography>
                        <Typography variant="body1">Category: {room.categoryName}</Typography>
                        <Typography variant="body1">Room Type: {room.roomType}</Typography>
                        <Typography variant="body1">
                            Bed Type: {room.selectedBedType}
                        </Typography>
                        <Typography variant="body1">
                            Smoking: {room.selectedSmoking ? "Yes" : "No"}
                        </Typography>
                        <Typography variant="body1">
                            Room Price: ${room.totalPrice * numNights}
                        </Typography>
                    </CardContent>
                </Card>
            ))}

            <Typography variant="h5" gutterBottom>
                Select an Activity (Optional)
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                    <Card
                        onClick={() => setSelectedActivity(null)}
                        sx={{
                            p: 2,
                            cursor: "pointer",
                            boxShadow: selectedActivity === null ? 6 : 3,
                            backgroundColor: selectedActivity === null ? "#f0f8ff" : "#fff",
                        }}
                    >
                        <Typography>No Thanks</Typography>
                    </Card>
                </Grid>
                {activities.map((activity) => (
                    <Grid item xs={12} sm={6} md={4} key={activity.id}>
                        <Card
                            onClick={() => setSelectedActivity(activity)}
                            sx={{
                                p: 2,
                                cursor: "pointer",
                                boxShadow:
                                    selectedActivity?.id === activity.id ? 6 : 3,
                                backgroundColor:
                                    selectedActivity?.id === activity.id
                                        ? "#f0f8ff"
                                        : "#fff",
                            }}
                        >
                            <Typography variant="h6">{activity.name}</Typography>
                            <Typography>Category: {activity.category}</Typography>
                            <Typography>
                                Price: ${activity.price * (adults + children)}
                            </Typography>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {selectedActivity && (
                <Box mt={3}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Select Activity Date"
                            value={activityDate}
                            onChange={(newValue) => setActivityDate(newValue)}
                            minDate={dayjs(checkInDate)}
                            maxDate={dayjs(checkOutDate)}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                </Box>
            )}

            <Box mt={4}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleReserveActivity}
                    fullWidth
                >
                    {selectedActivity ? "Reserve Activity" : "Proceed Without Activity"}
                </Button>
            </Box>
        </Box>
    );
};

export default AddVacationPackage;
