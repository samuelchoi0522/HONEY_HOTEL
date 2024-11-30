import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState("Bookings");

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

    const getStatus = (booking) => {
        const today = new Date();
        const checkInDate = new Date(booking.checkInDate);
        const checkOutDate = new Date(booking.checkOutDate);
        const daysAfterCheckout = Math.floor(
            (today - checkOutDate) / (1000 * 60 * 60 * 24)
        );

        if (!booking.checkedIn) {
            if (checkInDate >= today) {
                return "UPCOMING";
            } else if (checkInDate < today) {
                return "CANCELLED";
            }
        } else if (booking.checkedIn) {
            if (checkInDate <= today && checkOutDate >= today) {
                return "CHECKED IN";
            } else if (daysAfterCheckout > 3) {
                updateBookingStatus(booking.id); // Automatically check out the customer
                return "PAST CHECKOUT";
            }
        }
        return "UNKNOWN";
    };

    useEffect(() => {
        if (selectedTab === "Bookings") {
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
                    setBookings(bookingsData); // Set state correctly
                } catch (error) {
                    console.error("Error fetching admin dashboard:", error);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchAdminDashboardData();
        }
    }, [selectedTab, navigate]);

    useEffect(() => {
        console.log("Updated Bookings State:", bookings);
    }, [bookings]);

    return (
        <div className="admin-dashboard">
            <h1 className="dashboard-title">Admin Dashboard</h1>
            <div style={{ display: "flex" }}>
                <AdminNavbar onSelect={handleNavbarSelect} />
                <div style={{ marginLeft: "20px", flex: 1 }}>
                    {selectedTab === "Bookings" && (
                        <>
                            <div className="dashboard-controls">
                                <select className="dashboard-status-filter">
                                    <option value="">STATUS</option>
                                    <option value="checked-in">Checked In</option>
                                    <option value="checked-out">Checked Out</option>
                                </select>
                                <input
                                    type="text"
                                    className="dashboard-date-filter"
                                    placeholder="Check In - Check Out"
                                />
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
                                ) : bookings.length > 0 ? (
                                    bookings.map((booking, index) => (
                                        <div className="dashboard-table-row" key={booking.id || index}>
                                            {/* Status */}
                                            <div
                                                className={`dashboard-status ${getStatus(booking).toLowerCase().replace(" ", "-")
                                                    }`}
                                            >
                                                {getStatus(booking)}
                                            </div>

                                            {/* Customer Name */}
                                            <div className="dashboard-customer-name">
                                                {`${booking.user?.firstname || "Unknown"} ${booking.user?.lastname || ""}`}
                                            </div>

                                            {/* Check-In and Check-Out */}
                                            <div className="dashboard-checkin-checkout">
                                                {`${new Date(booking.checkInDate).toLocaleDateString()} - ${new Date(
                                                    booking.checkOutDate
                                                ).toLocaleDateString()}`}
                                            </div>

                                            {/* Hotel Location */}
                                            <div className="dashboard-hotel-location">
                                                {booking.hotelLocation || "Unknown"}
                                            </div>

                                            {/* Total Price */}
                                            <div className="dashboard-total">
                                                ${booking.totalPrice?.toFixed(2) || "0.00"}
                                            </div>

                                            {/* Actions */}
                                            <div className="dashboard-actions">
                                                <button className="dashboard-action-view">👁</button>
                                                <button className="dashboard-action-menu">⋮</button>
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
        </div>
    );
};

export default AdminDashboard;
