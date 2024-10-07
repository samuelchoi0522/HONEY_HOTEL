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

const StyledFormControlLabel = styled((props) => <FormControlLabel {...props} />)(
    ({ theme, checked }) => ({
        '.MuiFormControlLabel-label': {
            color: checked ? '#ffb84d' : theme.palette.text.primary,
        },
    })
);

const StyledRadio = styled(Radio)(({ theme }) => ({
    color: '#b0b8c4',
    '&.Mui-checked': {
        color: '#ffb84d',
    },
}));

export default function SetOccupancyDialog() {
    const [open, setOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState('Lowest Regular Rate');
    const [promoCode, setPromoCode] = useState('');

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

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
                {selectedOption === 'Promo Code' ? promoCode.toUpperCase() : selectedOption.toUpperCase()}
            </Button>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Select One Rate</DialogTitle>
                <DialogContent>
                    <div className="counter-section">
                        <RadioGroup
                            name="use-radio-group"
                            value={selectedOption}
                            onChange={(e) => {
                                setSelectedOption(e.target.value);
                                console.log(`Selected Option: ${e.target.value}`);
                            }}
                        >
                            <MyFormControlLabel
                                value="Lowest Regular Rate"
                                label="Lowest Regular Rate"
                                control={<StyledRadio />}
                            />
                            <MyFormControlLabel
                                value="AAA/CAA"
                                label="AAA/CAA"
                                control={<StyledRadio />}
                            />
                            <MyFormControlLabel
                                value="Senior Discount"
                                label="Senior Discount"
                                control={<StyledRadio />}
                            />
                            <MyFormControlLabel
                                value="Government & Military"
                                label="Government & Military"
                                control={<StyledRadio />}
                            />
                            <MyFormControlLabel
                                value="Promo Code"
                                label="Promo Code"
                                control={<StyledRadio />}
                            />
                        </RadioGroup>

                        {selectedOption === 'Promo Code' && (
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
