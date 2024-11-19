import { React, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();
    
    useEffect(() => {
        const checkAdminAccess = async () => {
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
                console.log("Admin Dashboard Data:", data);
            } catch (error) {
                console.error("Error fetching admin dashboard:", error);
            }
        };

        checkAdminAccess();
    }, [navigate]);
}

export default AdminDashboard;