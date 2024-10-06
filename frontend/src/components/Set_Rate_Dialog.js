import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { styled } from '@mui/system';
import RadioGroup, { useRadioGroup } from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import TextField from '@mui/material/TextField';

// Define custom styles for the FormControlLabel
const StyledFormControlLabel = styled((props) => <FormControlLabel {...props} />)(
    ({ theme, checked }) => ({
        '.MuiFormControlLabel-label': {
            color: checked ? '#ffb84d' : theme.palette.text.primary, // Set to gold when checked
        },
    })
);

// Define custom styles for the Radio
const StyledRadio = styled(Radio)(({ theme }) => ({
    color: '#b0b8c4', // Default color (grey)
    '&.Mui-checked': {
        color: '#ffb84d', // Gold color when checked
    },
}));

export default function SetOccupancyDialog() {
    const [open, setOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState('LowestRegularRate'); // Track selected option
    const [promoCode, setPromoCode] = useState(''); // Track promo code input

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    // Custom FormControlLabel component
    function MyFormControlLabel(props) {
        const radioGroup = useRadioGroup();
        let checked = false;

        if (radioGroup) {
            checked = radioGroup.value === props.value;
        }

        return <StyledFormControlLabel checked={checked} {...props} />;
    }

    return (
        <React.Fragment>
            <Button
                onClick={handleClickOpen}
                sx={{
                    background: 'none',
                    color: 'black',
                    boxShadow: 'none',
                    textTransform: 'none',
                    marginLeft: '20px',
                    fontFamily: 'IBM Plex Sans, sans-serif',
                    fontWeight: 800,
                    fontSize: '0.755rem',
                    textDecoration: 'none',
                    textDecorationColor: 'transparent',
                    letterSpacing: '0.1em',
                    left: '-8px',
                    '&:hover': {
                        background: 'none',
                        boxShadow: 'none',
                        color: 'black',
                        textDecoration: 'underline',
                        textDecorationColor: 'black',
                        transition: 'text-decoration-color 0.2s ease-in-out',
                    },
                }}
            >
                LOWEST REGULAR RATE
            </Button>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Select One Rate</DialogTitle>
                <DialogContent>
                    <div className="counter-section">
                        <RadioGroup
                            name="use-radio-group"
                            value={selectedOption}
                            onChange={(e) => setSelectedOption(e.target.value)} // Track the selected option
                        >
                            <MyFormControlLabel
                                value="LowestRegularRate"
                                label="Lowest Regular Rate"
                                control={<StyledRadio />}
                            />
                            <MyFormControlLabel
                                value="AAA/CAA"
                                label="AAA/CAA"
                                control={<StyledRadio />}
                            />
                            <MyFormControlLabel
                                value="SeniorDiscount"
                                label="Senior Discount"
                                control={<StyledRadio />}
                            />
                            <MyFormControlLabel
                                value="Government/Military"
                                label="Government & Military"
                                control={<StyledRadio />}
                            />
                            <MyFormControlLabel
                                value="PromoCode"
                                label="Promo Code"
                                control={<StyledRadio />}
                            />
                        </RadioGroup>

                        {selectedOption === 'PromoCode' && (
                            <TextField
                                id="outlined-password-input"
                                label="Promo Code"
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value)}
                            />
                        )}
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button
                        onClick={() => {
                            console.log(`Selected Option: ${selectedOption}, Promo Code: ${promoCode}`);
                            handleClose();
                        }}
                    >
                        Apply
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
