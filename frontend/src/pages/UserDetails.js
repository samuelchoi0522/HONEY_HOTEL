import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Typography,
    Card,
    CardContent,
    Grid,
    Box,
    CircularProgress,
    Paper,
    Avatar,
} from "@mui/material";
import dayjs from "dayjs";

const UserDetails = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [reservations, setReservations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch user details and reservations
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                console.log("Fetching user data...");
                const userResponse = await fetch(`http://localhost:8080/api/admin/users/${id}`, {
                    method: "GET",
                    credentials: "include",
                });

                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    console.log("User data fetched successfully:", userData);
                    setUser(userData);

                    const reservationsResponse = await fetch(
                        `http://localhost:8080/api/admin/users/${id}/reservations`,
                        {
                            method: "GET",
                            credentials: "include",
                        }
                    );

                    if (reservationsResponse.ok) {
                        const reservationsData = await reservationsResponse.json();
                        console.log("Reservations data fetched successfully:", reservationsData);
                        setReservations(reservationsData);
                    } else {
                        console.error("Failed to fetch reservations.");
                    }
                } else {
                    console.error("Failed to fetch user data.");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [id]);

    useEffect(() => {
        console.log("Updated user:", user);
    }, [user]);


    const getStatus = (reservation) => {
        const today = dayjs().startOf("day");
        const checkInDate = dayjs(reservation.checkInDate);
        const checkOutDate = dayjs(reservation.checkOutDate);

        if (!reservation.checkedIn) {
            if (checkInDate.isAfter(today)) return "Upcoming";
            if (checkInDate.isBefore(today)) return "Cancelled";
        }

        if (reservation.checkedIn) {
            if (checkInDate.isSameOrBefore(today) && checkOutDate.isSameOrAfter(today)) {
                return "Checked In";
            }
            if (checkOutDate.isBefore(today)) {
                return "Checked Out";
            }
        }

        return "Unknown";
    };

    if (isLoading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                    bgcolor: "background.default",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (!user) {
        return (
            <Typography variant="h5" align="center" sx={{ mt: 3 }}>
                User not found.
            </Typography>
        );
    }

    return (
        <Box sx={{ padding: "20px", maxWidth: "900px", margin: "0 auto", marginTop: "100px"}}>
            <Paper
                elevation={3}
                sx={{
                    p: 3,
                    borderRadius: 2,
                    mb: 4,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                }}
            >
                <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56 }}>
                    {user?.firstname?.charAt(0).toUpperCase() || "U"}
                </Avatar>
                <Box>
                    <Typography variant="h4" fontWeight="bold">
                        {user?.firstname || "Unknown"} {user?.lastname || "User"}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Email: {user?.email || "Not Provided"}
                    </Typography>
                </Box>
            </Paper>




            {reservations.length === 0 ? (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: "200px", // Adjust as needed
                        textAlign: "center",
                        color: "text.secondary",
                    }}
                >
                    <Typography variant="h6">No reservations found for this user.</Typography>
                </Box>
            ) : (
                    <>
                        <Typography variant="h5" gutterBottom sx={{ mb: 2, color: "black" }}>
                            Reservations
                        </Typography>
                        <Grid container spacing={3}>
                            {reservations.map((reservation) => (
                                <Grid item xs={12} md={6} key={reservation.bookingId}>
                                    <Card
                                        sx={{
                                            boxShadow: 3,
                                            borderRadius: 2,
                                            "&:hover": {
                                                boxShadow: 6,
                                                transform: "scale(1.02)",
                                                transition: "transform 0.2s",
                                            },
                                        }}
                                    >
                                        <CardContent>
                                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                                {reservation.hotelLocation || "Unknown Hotel"}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Check-in:{" "}
                                                {dayjs(reservation.checkInDate).format("MM-DD-YYYY")}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Check-out:{" "}
                                                {dayjs(reservation.checkOutDate).format("MM-DD-YYYY")}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Room: {reservation.roomType || "N/A"} - $
                                                {reservation.roomPrice?.toFixed(2) || "0.00"}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Adults: {reservation.adults} | Children: {reservation.children}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Promo Code: {reservation.promoCode || "N/A"}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Rate Option: {reservation.rateOption || "Standard"}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="primary"
                                                fontWeight="bold"
                                                sx={{ mt: 1 }}
                                            >
                                                Status: {getStatus(reservation)}
                                            </Typography>
                                            {reservation.activities?.length > 0 && (
                                                <Box sx={{ mt: 2 }}>
                                                    <Typography variant="subtitle2" color="text.secondary">
                                                        Activities:
                                                    </Typography>
                                                    <ul style={{ paddingLeft: "20px", margin: 0 }}>
                                                        {reservation.activities.map((activity) => (
                                                            <li key={activity.id}>{activity.name}</li>
                                                        ))}
                                                    </ul>
                                                </Box>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </>
            )}
        </Box>
    );
};

export default UserDetails;
