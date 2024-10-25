import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Box, TextField, Typography } from '@mui/material';

const PaymentComponent = () => {
    const { control } = useFormContext();

    return (
        <Box sx={{ maxWidth: 400, margin: '0 auto' }}>
            <Typography variant="h5" gutterBottom color="black">
                Payment Information
            </Typography>
            <Controller
                name="payment.accountHolderName"
                control={control}
                render={({ field }) => (
                    <TextField
                        fullWidth
                        label="Account Holder Name"
                        margin="normal"
                        required
                        {...field}
                    />
                )}
            />
            <Controller
                name="payment.cardnumber"
                control={control}
                render={({ field }) => (
                    <TextField
                        fullWidth
                        label="Card Number"
                        margin="normal"
                        required
                        {...field}
                    />
                )}
            />
            <Controller
                name="payment.expiry"
                control={control}
                render={({ field }) => (
                    <TextField
                        fullWidth
                        label="Expiration Date (MM/YY)"
                        margin="normal"
                        required
                        {...field}
                    />
                )}
            />
            <Controller
                name="payment.cvv"
                control={control}
                render={({ field }) => (
                    <TextField
                        fullWidth
                        label="CVV"
                        margin="normal"
                        required
                        type="password"
                        {...field}
                    />
                )}
            />
        </Box>
    );
};

export default PaymentComponent;
