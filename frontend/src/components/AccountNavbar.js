import React from 'react';
import { AppBar, Toolbar, Button } from '@mui/material';
import "../styles/AccountNavbar.css";

const AccountNavbar = ({ setSelectedView, selectedView }) => {
    return (
        <AppBar position="static" color="transparent" elevation={0} className="navbar-container">
            <Toolbar className="nav-toolbar">
                <Button
                    className={selectedView === 'upcoming' ? 'active-tab' : ''}
                    onClick={() => setSelectedView('upcoming')}
                >
                    Upcoming Reservations
                </Button>
                <Button
                    className={selectedView === 'past' ? 'active-tab' : ''}
                    onClick={() => setSelectedView('past')}
                >
                    Past Reservations
                </Button>
                <Button
                    className={selectedView === 'settings' ? 'active-tab' : ''}
                    onClick={() => setSelectedView('settings')}
                >
                    Account Settings
                </Button>
            </Toolbar>
            <div className="navbar-underline" />
        </AppBar>
    );
};

export default AccountNavbar;
