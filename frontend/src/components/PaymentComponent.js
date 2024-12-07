import React from 'react';
import { TextField, Grid, Typography, Box } from '@mui/material';

const PaymentComponent = () => {
    return (
        <Grid container spacing={3}>
            {/* Payment Information Title */}
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
                    PAYMENT INFORMATION
                </Typography>
            </Grid>

            {/* Acceptable Cards Section */}
            <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography
                        variant="body2"
                        sx={{
                            color: '#333',
                            marginTop: '10px',
                            marginBottom: '10px',
                            marginRight: '10px', // Add space between text and icons
                        }}
                    >
                        ACCEPTED CARDS |
                    </Typography>
                    <Box sx={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        {/* Visa Icon */}
                        <img src="/icons/Visa.png" alt="Visa" style={{ width: '40px', height: 'auto' }} />
                        {/* MasterCard Icon */}
                        <img src="/icons/Mastercard.png" alt="MasterCard" style={{ width: '40px', height: 'auto' }} />
                        {/* Amex Icon */}
                        <img src="/icons/Amex.png" alt="American Express" style={{ width: '40px', height: 'auto' }} />
                    </Box>
                </Box>
            </Grid>

            {/* Account Holder Name and Card Number on the same line */}
            <Grid item xs={12} sm={6}>
                <TextField
                    label="Name On Card"
                    fullWidth
                    required
                    sx={{
                        backgroundColor: '#f9f9f9',
                        '& .MuiInputBase-root': {
                            color: 'black',  // Text color
                        },
                        '& .MuiInputLabel-root': {
                            color: 'black',  // Label color when not focused
                        },
                        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'black',  // Focused border color
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: 'black',  // Label color when focused (moves up)
                        },
                    }}
                />
            </Grid>

            <Grid item xs={12} sm={6}>
                <TextField
                    label="Card Number"
                    fullWidth
                    required
                    sx={{
                        backgroundColor: '#f9f9f9',
                        '& .MuiInputBase-root': {
                            color: 'black',  // Text color
                        },
                        '& .MuiInputLabel-root': {
                            color: 'black',  // Label color when not focused
                        },
                        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'black',  // Focused border color
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: 'black',  // Label color when focused (moves up)
                        },
                    }}
                />
            </Grid>

            {/* Expiry Date Field */}
            <Grid item xs={12} sm={6}>
                <TextField
                    label="MM/YY"
                    fullWidth
                    required
                    sx={{
                        backgroundColor: '#f9f9f9',
                        '& .MuiInputBase-root': {
                            color: 'black',  // Text color
                        },
                        '& .MuiInputLabel-root': {
                            color: 'black',  // Label color when not focused
                        },
                        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'black',  // Focused border color
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: 'black',  // Label color when focused (moves up)
                        },
                    }}
                />
            </Grid>

            {/* CVV Field */}
            <Grid item xs={12} sm={6}>
                <TextField
                    label="CVV"
                    fullWidth
                    required
                    sx={{
                        backgroundColor: '#f9f9f9',
                        '& .MuiInputBase-root': {
                            color: 'black',  // Text color
                        },
                        '& .MuiInputLabel-root': {
                            color: 'black',  // Label color when not focused
                        },
                        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'black',  // Focused border color
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: 'black',  // Label color when focused (moves up)
                        },
                    }}
                />
            </Grid>
        </Grid>
    );
};

export default PaymentComponent;
