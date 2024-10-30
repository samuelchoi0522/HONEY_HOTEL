import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { styled } from '@mui/system';
import {
    Unstable_NumberInput as BaseNumberInput,
} from '@mui/base/Unstable_NumberInput';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

export default function SetOccupancyDialog({ onSetOccupancy, rooms: initialRooms, adults: initialAdults, children: initialChildren }) {
    const [open, setOpen] = useState(false);
    const [rooms, setRooms] = useState(initialRooms);
    const [adults, setAdults] = useState(initialAdults);
    const [children, setChildren] = useState(initialChildren);

    useEffect(() => {
        setRooms(initialRooms || 1);
        setAdults(initialAdults || 1);
        setChildren(initialChildren || 0);
    }, [initialRooms, initialAdults, initialChildren]);

    const totalGuests = adults + children;
    const guestLabel = totalGuests === 1 ? "GUEST" : "GUESTS";

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSet = () => {
        onSetOccupancy(rooms, adults, children);
        setOpen(false);
    };

    return (
        <React.Fragment>
            <Button
                onClick={handleClickOpen}
                sx={{
                    background: 'none',
                    color: 'black',
                    boxShadow: 'none',
                    textTransform: 'none',
                    fontFamily: 'IBM Plex Sans, sans-serif',
                    fontWeight: 800,
                    fontSize: '0.755rem',
                    textDecoration: 'none',
                    textDecorationColor: 'transparent',
                    left: '-8px',
                    letterSpacing: '0.1em',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                        background: 'none',
                        boxShadow: 'none',
                        color: 'black',
                        textDecoration: 'underline',
                        textDecorationColor: 'black',
                    },
                }}
            >
                {rooms} ROOM{rooms > 1 ? 'S' : ''}, {totalGuests} {guestLabel}
            </Button>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Set Room and Guests</DialogTitle>
                <DialogContent>
                    <div className="counter-section">
                        <p style={{ fontSize: '0.75rem' }}>Rooms</p>
                        <NumberInput
                            aria-label="Rooms"
                            value={rooms}
                            min={1}
                            max={10}
                            step={1}
                            onChange={(event, value) => {
                                setRooms(value);
                            }}
                        />
                    </div>

                    <div className="counter-section">
                        <p>Adults</p>
                        <p style={{ marginTop: '-15px', fontSize: '0.65rem' }}>(Max: 8 guests/room)</p>
                        <NumberInput
                            aria-label="Adults"
                            value={adults}
                            min={1}
                            max={rooms * 8}
                            step={1}
                            onChange={(event, value) => {
                                setAdults(value);
                            }}
                        />
                    </div>

                    <div className="counter-section">
                        <p>Children</p>
                        <p style={{ marginTop: '-15px', fontSize: '0.65rem' }}>(Max: 8 guests/room)</p>
                        <NumberInput
                            aria-label="Children"
                            value={children}
                            min={0}
                            max={rooms * 8 - adults}
                            step={1}
                            onChange={(event, value) => {
                                setChildren(value);
                            }}
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSet}>
                        Set
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

const NumberInput = React.forwardRef(function CustomNumberInput(props, ref) {
    return (
        <BaseNumberInput
            slots={{
                root: StyledInputRoot,
                input: StyledInput,
                incrementButton: StyledButton,
                decrementButton: StyledButton,
            }}
            slotProps={{
                incrementButton: {
                    children: <AddIcon fontSize="small" />,
                    className: 'increment',
                },
                decrementButton: {
                    children: <RemoveIcon fontSize="small" />,
                },
            }}
            {...props}
            ref={ref}
        />
    );
});

const honeyYellow = {
    100: '#fff9e6',
    200: '#fff2cc',
    300: '#ffe6a3',
    400: '#ffda80',
    500: '#ffc966',
    600: '#ffb84d',
    700: '#ffa31a',
    800: '#ff8c00',
};

const grey = {
    50: '#F3F6F9',
    100: '#E5EAF2',
    200: '#DAE2ED',
    300: '#C7D0DD',
    400: '#B0B8C4',
    500: '#9DA8B7',
    600: '#6B7A90',
    700: '#434D5B',
    800: '#303740',
    900: '#1C2025',
};

const StyledInputRoot = styled('div')`
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 400;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledInput = styled('input')`
  font-size: 0.875rem;
  font-family: inherit;
  font-weight: 400;
  line-height: 1.375;
  color: ${props => props.theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  background: ${props => props.theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 1px solid ${props => props.theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  box-shadow: 0px 2px 4px ${props => props.theme.palette.mode === 'dark' ? 'rgba(0,0,0, 0.5)' : 'rgba(0,0,0, 0.05)'};
  border-radius: 8px;
  margin: 0 8px;
  padding: 10px 12px;
  outline: 0;
  width: 4rem;
  text-align: center;

  &:hover {
    border-color: ${honeyYellow[400]};
  }

  &:focus {
    border-color: ${honeyYellow[400]};
    box-shadow: 0 0 0 3px ${props => props.theme.palette.mode === 'dark' ? honeyYellow[700] : honeyYellow[200]};
  }

  &:focus-visible {
    outline: 0;
  }
`;

const StyledButton = styled('button')`
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  line-height: 1.5;
  border: 1px solid;
  border-radius: 999px;
  border-color: ${props => props.theme.palette.mode === 'dark' ? grey[800] : grey[200]};
  background: ${props => props.theme.palette.mode === 'dark' ? grey[900] : grey[50]};
  color: ${props => props.theme.palette.mode === 'dark' ? grey[200] : grey[900]};
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 120ms cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    cursor: pointer;
    background: ${props => props.theme.palette.mode === 'dark' ? honeyYellow[700] : honeyYellow[500]};
    border-color: ${props => props.theme.palette.mode === 'dark' ? honeyYellow[500] : honeyYellow[400]};
    color: ${grey[50]};
  }

  &.increment {
    order: 1;
  }
`;
