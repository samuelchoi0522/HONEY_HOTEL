import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DateRangePicker, LocalizationProvider } from "@mui/x-date-pickers-pro";
import AdminNavbar from "../components/AdminNavbar";
import "../styles/AdminDashboard.css";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TextField, Menu, MenuItem, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { jaJP } from "@mui/x-date-pickers/locales";



const AdminDashboard = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState("Bookings");
    const [statusFilter, setStatusFilter] = useState("");
    const [dateRange, setDateRange] = useState([null, null]);

    dayjs.extend(isSameOrAfter);
    dayjs.extend(isSameOrBefore);

    const [menuAnchor, setMenuAnchor] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [confirmationDialog, setConfirmationDialog] = useState({
        open: false,
        type: "", // "checkout" or "delete"
    });

    const handleNavbarSelect = (item) => {
        setSelectedTab(item);
    };

    const updateBookingStatus = async (bookingId) => {
        try {
            await fetch(`http://localhost:8080/api/admin/bookings/${bookingId}/checkout`, {
                method: "PUT",
                credentials: "include",
            });
            console.log(`Booking ${bookingId} checked out successfully.`);
        } catch (error) {
            console.error(`Error checking out booking ${bookingId}:`, error);
        }
    };

    const handleMenuClick = (event, booking) => {
        setMenuAnchor(event.currentTarget);
        setSelectedBooking(booking);
    };

    const handleMenuClose = () => {
        setMenuAnchor(null);
    };

    const handleDialogOpen = (type) => {
        setConfirmationDialog({ open: true, type });
        handleMenuClose();
    };

    const handleDialogClose = async (confirm) => {
        if (confirm) {
            try {
                if (confirmationDialog.type === "checkout") {
                    const response = await fetch(
                        `http://localhost:8080/api/admin/reservations/${selectedBooking.id}/checkout`,
                        {
                            method: "PUT",
                            credentials: "include",
                        }
                    );
                    if (response.ok) {
                        console.log("Reservation checked out successfully.");
                        // Update the bookings list after a successful checkout
                        fetchAdminDashboardData();
                    } else {
                        console.error("Error checking out reservation:", await response.text());
                    }
                } else if (confirmationDialog.type === "delete") {
                    const response = await fetch(
                        `http://localhost:8080/api/admin/reservations/${selectedBooking.id}`,
                        {
                            method: "DELETE",
                            credentials: "include",
                        }
                    );
                    if (response.ok) {
                        console.log("Reservation deleted successfully.");
                        fetchAdminDashboardData();
                    } else {
                        console.error("Error deleting reservation:", await response.text());
                    }
                } else if (confirmationDialog.type === "checkin") {
                    const response = await fetch(
                        `http://localhost:8080/api/admin/reservations/${selectedBooking.id}/checkin`,
                        {
                            method: "PUT",
                            credentials: "include",
                        }
                    );
                    if (response.ok) {
                        console.log("Reservation checked in successfully.");
                        fetchAdminDashboardData();
                    } else {
                        console.error("Error checking in reservation:", await response.text());
                    }
                }
            } catch (error) {
                console.error("Error performing action:", error);
            }
        }

        setConfirmationDialog({ open: false, type: "" });
    };



    const getStatus = (booking) => {
        if (!booking || !booking.checkInDate || !booking.checkOutDate) {
            return "UNKNOWN";
        }

        const today = dayjs().startOf("day");
        const checkInDate = dayjs(booking.checkInDate);
        const checkOutDate = dayjs(booking.checkOutDate);

        if (!booking.checkedIn) {
            // Not checked in yet
            if (checkInDate.isSameOrAfter(today)) {
                return "UPCOMING";
            } else if (checkInDate.isBefore(today)) {
                return "CANCELLED";
            }
        } else if (booking.checkedIn) {
            // Checked in
            if (checkInDate.isSameOrBefore(today) && checkOutDate.isSameOrAfter(today)) {
                return "CHECKED IN";
            } else if (checkInDate.isAfter(today)) {
                // Future check-in date but already marked as checked-in
                return "CHECKED IN";
            } else if (today.diff(checkOutDate, "days") > 3) {
                updateBookingStatus(booking.id); // Automatically check out the customer
                return "PAST CHECKOUT";
            }
        }

        return "UNKNOWN";
    };




    const applyFilters = () => {
        let filtered = bookings;

        // Filter by status
        if (statusFilter) {
            filtered = filtered.filter((booking) => getStatus(booking) === statusFilter.toUpperCase());
        }

        // Filter by date range
        if (dateRange[0] && dateRange[1]) {
            const startDate = dayjs(dateRange[0]);
            const endDate = dayjs(dateRange[1]);

            filtered = filtered.filter((booking) => {
                const checkInDate = dayjs(booking.checkInDate);
                const checkOutDate = dayjs(booking.checkOutDate);
                return (
                    (checkInDate.isSameOrAfter(startDate) && checkInDate.isSameOrBefore(endDate)) ||
                    (checkOutDate.isSameOrAfter(startDate) && checkOutDate.isSameOrBefore(endDate))
                );
            });

        }

        setFilteredBookings(filtered);
    };

    const fetchAdminDashboardData = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/admin/dashboard", {
                method: "GET",
                credentials: "include",
            });

            if (!response.ok) {
                if (response.status === 403) {
                    alert("Access denied: You do not have admin access.");
                }
                navigate("/");
                return;
            }

            const data = await response.json();
            console.log("API Response Data:", data);

            // Access reservations array
            const bookingsData = data.reservations || [];
            setBookings(bookingsData);
            setFilteredBookings(bookingsData);
        } catch (error) {
            console.error("Error fetching admin dashboard:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (selectedTab === "Bookings") {
            fetchAdminDashboardData();
        }
    }, [selectedTab, navigate]);

    useEffect(() => {
        applyFilters();
    }, [statusFilter, dateRange]);

    return (
        <div className="admin-dashboard">
            <h1 className="dashboard-title">Admin Dashboard</h1>
            <div style={{ display: "flex" }}>
                <AdminNavbar onSelect={handleNavbarSelect} />
                <div style={{ marginLeft: "20px", flex: 1 }}>
                    {selectedTab === "Bookings" && (
                        <>
                            <div className="dashboard-controls">
                                <select
                                    className="dashboard-status-filter"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="">Show All</option>
                                    <option value="upcoming">Upcoming</option>
                                    <option value="checked-in">Checked In</option>
                                    <option value="checked-out">Checked Out</option>
                                    <option value="cancelled">Cancelled</option>
                                    <option value="past-checkout">Past Checkout</option>
                                </select>

                                <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                    localeText={{
                                        start: "Check-In",
                                        end: "Check-Out",
                                    }}
                                >
                                    <DateRangePicker
                                        value={dateRange}
                                        onChange={(newValue) => setDateRange(newValue)}
                                        renderInput={(startProps, endProps) => (
                                            <div style={{ display: "flex", gap: "10px" }}>
                                                <TextField {...startProps} placeholder="Check-In" />
                                                <TextField {...endProps} placeholder="Check-Out" />
                                            </div>
                                        )}
                                    />
                                </LocalizationProvider>
                            </div>
                            <div className="dashboard-bookings-table">
                                <div className="dashboard-table-header">
                                    <div className="dashboard-table-column">STATUS</div>
                                    <div className="dashboard-table-column">CUSTOMER NAME</div>
                                    <div className="dashboard-table-column">CHECK IN - CHECK OUT</div>
                                    <div className="dashboard-table-column">HOTEL LOCATION</div>
                                    <div className="dashboard-table-column">TOTAL</div>
                                    <div className="dashboard-table-column">ACTIONS</div>
                                </div>
                                {isLoading ? (
                                    <div className="dashboard-loading">Loading...</div>
                                ) : filteredBookings.length > 0 ? (
                                    filteredBookings.map((booking, index) => (
                                        <div className="dashboard-table-row" key={booking.id || index}>
                                            <div
                                                className={`dashboard-status ${getStatus(booking)
                                                    .toLowerCase()
                                                    .replace(" ", "-")}`}
                                            >
                                                {getStatus(booking)}
                                            </div>
                                            <div className="dashboard-customer-name">
                                                {`${booking.user?.firstname || "Unknown"} ${booking.user?.lastname || ""
                                                    }`}
                                            </div>
                                            <div className="dashboard-checkin-checkout">
                                                {`${dayjs(booking.checkInDate).format("MM-DD-YYYY")} - ${dayjs(
                                                    booking.checkOutDate
                                                ).format("MM-DD-YYYY")}`}

                                            </div>
                                            <div className="dashboard-hotel-location">
                                                {booking.hotelLocation || "Unknown"}
                                            </div>
                                            <div className="dashboard-total">
                                                ${booking.roomPrice?.toFixed(2) || "0.00"}
                                            </div>
                                            <div className="dashboard-actions">
                                                <IconButton
                                                    onClick={(e) => handleMenuClick(e, booking)}
                                                >
                                                    <MoreVertIcon />
                                                </IconButton>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="dashboard-no-bookings">No bookings available.</div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>

            <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={handleMenuClose}
            >
                <MenuItem>
                    <VisibilityIcon style={{ marginRight: "10px" }} /> View
                </MenuItem>
                {selectedBooking && (() => {
                    const checkInDate = new Date(selectedBooking.checkInDate);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0); // Normalize today's date to ignore time
                    if (checkInDate >= today && getStatus(selectedBooking) === "UPCOMING") {
                        return (
                            <MenuItem onClick={() => handleDialogOpen("checkin")}>
                                <ExitToAppIcon style={{ marginRight: "10px" }} /> Check In
                            </MenuItem>
                        );
                    } else if (getStatus(selectedBooking) === "CHECKED IN") {
                        return (
                            <MenuItem onClick={() => handleDialogOpen("checkout")}>
                                <ExitToAppIcon style={{ marginRight: "10px" }} /> Check Out
                            </MenuItem>
                        );
                    }
                    return null;
                })()}
                <MenuItem onClick={() => handleDialogOpen("delete")}>
                    <DeleteIcon style={{ marginRight: "10px", color: "red" }} /> Delete Reservation
                </MenuItem>
            </Menu>


            <Dialog
                open={confirmationDialog.open}
                onClose={() => handleDialogClose(false)}
            >
                <DialogTitle>Confirmation</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {confirmationDialog.type === "checkin"
                            ? "Are you sure you want to check in this reservation?"
                            : confirmationDialog.type === "checkout"
                                ? "Are you sure you want to check out this reservation?"
                                : "Are you sure you want to delete this reservation?"}
                    </DialogContentText>

                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleDialogClose(false)} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={() => handleDialogClose(true)}
                        color="primary"
                        autoFocus
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default AdminDashboard;
