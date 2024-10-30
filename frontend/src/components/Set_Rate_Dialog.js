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
        setOpen(false);
    };

    const handleApply = () => {
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
                                id="outlined-promo-code-input"
                                label="Add Promo Code"
                                value={tempPromoCode}
                                onChange={(e) => setTempPromoCode(e.target.value)}
                                fullWidth
                                margin="dense"
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
