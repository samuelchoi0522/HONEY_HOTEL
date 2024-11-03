import React, { useState, useEffect } from 'react';
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

export default function SetRateDialog({ onSetRate, customStyle, rateOption = 'Lowest Regular Rate', promoCode: initialPromoCode = '' }) {
    const [open, setOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(rateOption);
    const [promoCode, setPromoCode] = useState(initialPromoCode);
    const [tempSelectedOption, setTempSelectedOption] = useState(rateOption);
    const [tempPromoCode, setTempPromoCode] = useState(initialPromoCode);
    const [promoCodeError, setPromoCodeError] = useState('');

    useEffect(() => {
        setTempSelectedOption(rateOption);
        setTempPromoCode(initialPromoCode);
    }, [rateOption, initialPromoCode]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setTempSelectedOption(selectedOption);
        setTempPromoCode(promoCode);
        setPromoCodeError('');
        setOpen(false);
    };

    const handleApply = () => {
        if (tempSelectedOption === 'Promo Code' && tempPromoCode) {
            validatePromoCode(tempPromoCode);
        } else {
            applySelectedRate();
        }
    };

    const validatePromoCode = async (code) => {
        try {
            const response = await fetch(`http://localhost:8080/api/promo/validate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code }),
            });

            const data = await response.json();

            if (response.ok && data.isValid) {
                applySelectedRate(); // Apply the rate if the promo code is valid
                setPromoCodeError(''); // Clear any previous error message
            } else {
                setPromoCodeError('Invalid promo code. Please try again.');
            }
        } catch (error) {
            setPromoCodeError('Error validating promo code. Please try again later.');
            console.error('Promo code validation error:', error);
        }
    };

    const applySelectedRate = () => {
        setSelectedOption(tempSelectedOption);
        setPromoCode(tempPromoCode);
        onSetRate(tempSelectedOption, tempPromoCode);
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
                sx={customStyle}
            >
                {tempSelectedOption === 'Promo Code' ? tempPromoCode.toUpperCase() : tempSelectedOption.toUpperCase()}
            </Button>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Select One Rate</DialogTitle>
                <DialogContent>
                    <div className="counter-section">
                        <RadioGroup
                            name="use-radio-group"
                            value={tempSelectedOption}
                            onChange={(e) => {
                                const newOption = e.target.value;
                                setTempSelectedOption(newOption);
                                if (newOption !== 'Promo Code') {
                                    setTempPromoCode('');
                                    setPromoCodeError('');
                                }
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

                        {tempSelectedOption === 'Promo Code' && (
                            <TextField
                                id="outlined-promo-code-input-1"
                                label="Add Promo Code"
                                value={tempPromoCode}
                                onChange={(e) => {
                                    setTempPromoCode(e.target.value);
                                    setPromoCodeError(''); // Clear error on input change
                                }}
                                fullWidth
                                margin="dense"
                                error={!!promoCodeError}
                                helperText={promoCodeError}
                            />
                        )}
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleApply}>Apply</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
