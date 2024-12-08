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

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState("Bookings");
    const [statusFilter, setStatusFilter] = useState("");
    const [dateRange, setDateRange] = useState([null, null]);
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [confirmationDialog, setConfirmationDialog] = useState({
        open: false,
        type: "", // "checkout" or "delete"
    });
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [menuContext, setMenuContext] = useState({ type: "", data: null });
    const [userRole, setUserRole] = useState(""); // Tracks the role (e.g., "admin" or "clerk")

    dayjs.extend(isSameOrAfter);
    dayjs.extend(isSameOrBefore);

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

    const handleMenuClick = (event, type, data) => {
        if (!type || !data) {
            console.error("Invalid type or data for menu context");
            return;
        }
        setMenuAnchor(event.currentTarget);
        setMenuContext({ type, data });
    };



    const handleMenuClose = () => {
        setMenuAnchor(null);
    };

    const handleBookingsDialogOpen = (type) => {
        setSelectedBooking(menuContext.data); // Set the booking from the menu context
        setConfirmationDialog({ open: true, type });
        handleMenuClose();
    };


    const handleBookingsDialogClose = async (confirm) => {
        if (!selectedBooking) {
            console.error("No booking selected.");
            return;
        }

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
        setSelectedBooking(null); // Clear the selected booking
    };


    const fetchUsersData = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/admin/users", {
                method: "GET",
                credentials: "include",
            });
            if (response.status === 403) {
                navigate("/invalid-page");
                return;
            }
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            } else {
                console.error("Error fetching users:", await response.text());
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const getUserStatus = (user) => {
        if (user.isAdmin) return "Administrator";
        if (user.isClerk) return "Clerk";
        return "Guest";
    };

    const handleUsersDialogOpen = (type) => {
        console.log("Opening user dialog with type:", type); // Debugging log
        if (type === "view") {
            return;
        }
        setSelectedUser(menuContext.data); // Set the user from the menu context
        setConfirmationDialog({ open: true, type });
        handleMenuClose();
    };



    const handleUsersDialogClose = async (confirm) => {
        console.log("Closing user dialog with type:", confirm); // Debugging log
        if (!selectedUser) {
            console.error("No user selected.");
            return;
        }

        if (confirm) {
            try {
                if (confirmationDialog.type === "delete") {
                    await fetch(`http://localhost:8080/api/admin/users/${selectedUser.id}`, {
                        method: "DELETE",
                        credentials: "include",
                    });
                    fetchUsersData();
                } else if (confirmationDialog.type === "makeClerk") {
                    await fetch(`http://localhost:8080/api/admin/users/${selectedUser.id}/makeClerk`, {
                        method: "PUT",
                        credentials: "include",
                    });
                    fetchUsersData();
                } else if (confirmationDialog.type === "makeAdmin") {
                    await fetch(`http://localhost:8080/api/admin/users/${selectedUser.id}/makeAdmin`, {
                        method: "PUT",
                        credentials: "include",
                    });
                    fetchUsersData();
                } else if (confirmationDialog.type === "makeGuest") {
                    await fetch(`http://localhost:8080/api/admin/users/${selectedUser.id}/makeGuest`, {
                        method: "PUT",
                        credentials: "include",
                    });
                    fetchUsersData();
                }
            } catch (error) {
                console.error("Error performing user action:", error);
            }
        }
        setConfirmationDialog({ open: false, type: "" });
        setSelectedUser(null); // Clear the selected user
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
                    navigate("/invalid-page");
                    return;
                }
                throw new Error("Failed to fetch admin dashboard");
            }

            const data = await response.json();
            console.log("API Response Data:", data);

            // Set user role
            const userRole = data.role;
            setUserRole(userRole);

            // Redirect if role is not admin or clerk
            if (userRole !== "admin" && userRole !== "clerk") {
                navigate("/invalid-page");
                return;
            }

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

    const handleViewReservation = async (reservationId, bookingId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/admin/reservations/${reservationId}/view`, {
                method: 'GET',
                credentials: 'include', // Include cookies if required
            });

            if (response.ok) {
                const reservationData = await response.json();
                console.log('Reservation Details:', reservationData);
                // Display the details in a modal or new page
            } else {
                console.error('Failed to fetch reservation details');
            }
        } catch (error) {
            console.error('Error:', error);
        }
        navigate(`/admin-dashboard/view/${reservationId}/${bookingId}`);
    };

    useEffect(() => {
        fetchAdminDashboardData();
        fetchUsersData();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [statusFilter, dateRange]);

    return (
        <div className="admin-dashboard">
            <h1 className="dashboard-title"></h1>
            <div style={{ display: "flex" }}>
                <AdminNavbar onSelect={handleNavbarSelect} />
                <div style={{ marginLeft: "20px", flex: 1 }}>
                    <h2 className="dashboard-admin-title">
                        {selectedTab === "Bookings" && "Bookings"}
                        {selectedTab === "Administrator" && userRole === "admin" && "Administrator"}
                        {selectedTab === "Users" && "Users"}
                    </h2>
                    {(userRole === "admin" || userRole === "clerk") && selectedTab === "Bookings" && (
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
                                                {`${booking.user?.firstname || "Unknown"} ${booking.user?.lastname || ""}`}
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
                                                    onClick={(e) => handleMenuClick(e, "booking", booking)}
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
                    {userRole === "clerk" && selectedTab === "Administrator" && (
                        <div classname="dashboard-insufficient-permissions">
                            <h2>Insufficient Permissions</h2>
                            <p>You do not have sufficient permissions to view this content.</p>
                        </div>
                    )}

                    {userRole === "admin" && selectedTab === "Administrator" && (
                        <>
                            <div className="dashboard-bookings-table">
                                <div className="dashboard-table-header">
                                    <div className="dashboard-table-column">Name</div>
                                    <div className="dashboard-table-column">Email</div>
                                    <div className="dashboard-table-column">Status</div>
                                    <div className="dashboard-table-column">Actions</div>
                                </div>
                                {isLoading ? (
                                    <div className="dashboard-loading">Loading...</div>
                                ) : users.length > 0 ? (
                                    users.map((user, index) => (
                                        <div className="dashboard-table-row" key={user.id || index}>
                                            <div className="dashboard-user-name">{`${user.firstname} ${user.lastname}`}</div>
                                            <div className="dashboard-user-email">{user.email}</div>
                                            <div className="dashboard-user-status">{getUserStatus(user)}</div>
                                            <div className="dashboard-actions">
                                                <IconButton onClick={(e) => handleMenuClick(e, "user", user)}>
                                                    <MoreVertIcon />
                                                </IconButton>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="dashboard-no-bookings">No users available.</div>
                                )}
                            </div>
                        </>
                    )}
                    {selectedTab === "Users" && (
                        <>
                            <div className="dashboard-bookings-table">
                                <div className="dashboard-table-header">
                                    <div className="dashboard-table-column">Name</div>
                                    <div className="dashboard-table-column">Email</div>
                                    <div className="dashboard-table-column">Status</div>
                                    <div className="dashboard-table-column">Actions</div>
                                </div>
                                {isLoading ? (
                                    <div className="dashboard-loading">Loading...</div>
                                ) : users.length > 0 ? (
                                    users.map((user, index) => (
                                        <div className="dashboard-table-row" key={user.id || index}>
                                            <div className="dashboard-user-name">{`${user.firstname} ${user.lastname}`}</div>
                                            <div className="dashboard-user-email">{user.email}</div>
                                            <div className="dashboard-user-status">{getUserStatus(user)}</div>
                                            <div className="dashboard-actions">
                                                <IconButton onClick={(e) => handleMenuClick(e, "user", user)}>
                                                    <MoreVertIcon />
                                                </IconButton>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="dashboard-no-bookings">No users available.</div>
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
                {menuContext.type === "booking" && menuContext.data && [
                    <MenuItem
                        key="view"
                        onClick={() => handleViewReservation(menuContext.data.id, menuContext.data.bookingId)}
                    >
                        <VisibilityIcon style={{ marginRight: "10px" }} /> View
                    </MenuItem>,
                    (() => {
                        const checkInDate = new Date(menuContext.data.checkInDate);
                        const today = new Date();
                        today.setHours(0, 0, 0, 0); // Normalize today's date to ignore time
                        if (checkInDate >= today && getStatus(menuContext.data) === "UPCOMING") {
                            return (
                                <MenuItem key="checkin" onClick={() => handleBookingsDialogOpen("checkin")}>
                                    <ExitToAppIcon style={{ marginRight: "10px" }} /> Check In
                                </MenuItem>
                            );
                        } else if (getStatus(menuContext.data) === "CHECKED IN") {
                            return (
                                <MenuItem key="checkout" onClick={() => handleBookingsDialogOpen("checkout")}>
                                    <ExitToAppIcon style={{ marginRight: "10px" }} /> Check Out
                                </MenuItem>
                            );
                        }
                        return null;
                    })(),
                    <MenuItem key="delete" onClick={() => handleBookingsDialogOpen("delete")}>
                        <DeleteIcon style={{ marginRight: "10px", color: "red" }} /> Delete Reservation
                    </MenuItem>,
                ]}
                {
                    menuContext.type === "user" && menuContext.data && [
                        <MenuItem
                            key="view"
                            onClick={() => handleUsersDialogOpen("view")}
                        >
                            <VisibilityIcon style={{ marginRight: "10px" }} /> View
                        </MenuItem>,

                        userRole === "admin" && selectedTab === "Administrator" && [
                            // Option to make the user a Clerk if they are a Guest
                            (getUserStatus(menuContext.data) === "Guest" && (
                                <MenuItem
                                    key="makeClerk"
                                    onClick={() => handleUsersDialogOpen("makeClerk")}
                                >
                                    <ExitToAppIcon style={{ marginRight: "10px" }} /> Make Clerk
                                </MenuItem>
                            )),
                            (getUserStatus(menuContext.data) === "Guest" && (
                                <MenuItem
                                    key="makeAdmin"
                                    onClick={() => handleUsersDialogOpen("makeAdmin")}
                                >
                                    <ExitToAppIcon style={{ marginRight: "10px" }} /> Make Admin
                                </MenuItem>
                            )),
                            (getUserStatus(menuContext.data) === "Administrator" && (
                                <MenuItem
                                    key="makeClerk"
                                    onClick={() => handleUsersDialogOpen("makeClerk")}
                                >
                                    <ExitToAppIcon style={{ marginRight: "10px" }} /> Make Clerk
                                </MenuItem>
                            )),
                            // Option to make the user an Admin if they are a Clerk
                            (menuContext.data.isClerk && !menuContext.data.isAdmin && (
                                <MenuItem
                                    key="makeAdmin"
                                    onClick={() => handleUsersDialogOpen("makeAdmin")}
                                >
                                    <ExitToAppIcon style={{ marginRight: "10px" }} /> Make Admin
                                </MenuItem>
                            )),
                            // Option to make the user a Guest if they are a Clerk or Admin
                            ((menuContext.data.isClerk || menuContext.data.isAdmin) && (
                                <MenuItem
                                    key="makeGuest"
                                    onClick={() => handleUsersDialogOpen("makeGuest")}
                                >
                                    <ExitToAppIcon style={{ marginRight: "10px" }} /> Make Guest
                                </MenuItem>
                            )),
                            // Option to delete the user
                            <MenuItem
                                key="delete"
                                onClick={() => handleUsersDialogOpen("delete")}
                            >
                                <DeleteIcon style={{ marginRight: "10px", color: "red" }} /> Delete User
                            </MenuItem>,
                        ]
                    ]
                }


            </Menu>

            <Dialog
                open={confirmationDialog.open}
                onClose={() => {
                    if (selectedTab === "Bookings") {
                        handleBookingsDialogClose(false);
                    } else if (selectedTab === "Users") {
                        handleUsersDialogClose(false);
                    }
                }}
            >
                <DialogTitle>Confirmation</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {selectedTab === "Bookings" && confirmationDialog.type === "checkin"
                            ? "Are you sure you want to check in this reservation?"
                            : selectedTab === "Bookings" && confirmationDialog.type === "checkout"
                                ? "Are you sure you want to check out this reservation?"
                                : selectedTab === "Bookings" && confirmationDialog.type === "delete"
                                    ? "Are you sure you want to delete this reservation?"
                                    : selectedTab === "Administrator" && confirmationDialog.type === "delete"
                                        ? "Are you sure you want to delete this user?"
                                        : selectedTab === "Administrator" && confirmationDialog.type === "makeClerk"
                                            ? "Are you sure you want to make this user a clerk?"
                                            : selectedTab === "Administrator" && confirmationDialog.type === "makeAdmin"
                                                ? "Are you sure you want to make this user an administrator?"
                                                : selectedTab === "Administrator" && confirmationDialog.type === "makeGuest"
                                                    ? "Are you sure you want to make this user a guest?"
                                                    : "Are you sure about this action?"}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            if (selectedTab === "Bookings") {
                                handleBookingsDialogClose(false);
                            } else if (selectedTab === "Administrator") {
                                handleUsersDialogClose(false);
                            }
                        }}
                        color="primary"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            if (selectedTab === "Bookings") {
                                handleBookingsDialogClose(true);
                            } else if (selectedTab === "Administrator") {
                                handleUsersDialogClose(true);
                            }
                        }}
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
