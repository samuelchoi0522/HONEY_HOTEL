import React from 'react';
import { TextField, Grid, Typography, Box } from '@mui/material';

const PaymentComponent = () => {
    return (
        <Grid container spacing={3}>
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

            <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography
                        variant="body2"
                        sx={{
                            color: '#333',
                            marginTop: '10px',
                            marginBottom: '10px',
                            marginRight: '10px',
                        }}
                    >
                        ACCEPTED CARDS |
                    </Typography>
                    <Box sx={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <img src="/icons/Visa.png" alt="Visa" style={{ width: '40px', height: 'auto' }} />
                        <img src="/icons/Mastercard.png" alt="MasterCard" style={{ width: '40px', height: 'auto' }} />
                        <img src="/icons/Amex.png" alt="American Express" style={{ width: '40px', height: 'auto' }} />
                    </Box>
                </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
                <TextField
                    label="Name On Card"
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
            </Grid>

            <Grid item xs={12} sm={6}>
                <TextField
                    label="Card Number"
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
            </Grid>

            <Grid item xs={12} sm={6}>
                <TextField
                    label="MM/YY"
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
            </Grid>

            <Grid item xs={12} sm={6}>
                <TextField
                    label="CVV"
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
            </Grid>
        </Grid>
    );
};

export default PaymentComponent;
