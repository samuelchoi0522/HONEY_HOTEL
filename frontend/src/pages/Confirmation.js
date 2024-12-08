import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    Divider,
    Grid,
    CheckCircleOutline,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const Confirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate("/");
    };

    const handleViewReservations = () => {
        navigate("/account");
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "background.default",
                padding: "20px",
            }}
        >
            <Box
                sx={{
                    textAlign: "center",
                    mb: 4,
                }}
            >
                <CheckCircleIcon
                    sx={{ color: "success.main", fontSize: 80, mb: 2 }}
                />
                <Typography variant="h4" gutterBottom>
                    Reservation Confirmed!
                </Typography>
                <Typography variant="header1" color="text.secondary">
                    Your reservation has been successfully completed. We look forward to
                    hosting you!
                </Typography>
            </Box>

            <Box
                sx={{
                    display: "flex",
                    gap: 2,
                    mt: 4,
                }}
            >
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleViewReservations}
                >
                    View Reservations
                </Button>
                <Button variant="outlined" color="secondary" onClick={handleGoHome}>
                    Go to Home
                </Button>
            </Box>
        </Box>
    );
};

export default Confirmation;
