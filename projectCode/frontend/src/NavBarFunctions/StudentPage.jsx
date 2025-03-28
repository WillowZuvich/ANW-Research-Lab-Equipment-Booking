import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import ReturnButton from "./ReturnButton";
import "./StudentPage.css";

const StudentPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const studentId = localStorage.getItem("userId");
  const userRole = localStorage.getItem("role");
  const navigate = useNavigate();

  useEffect(() => {
    if (!studentId || userRole !== "student") {
      navigate("/login");
      return;
    }

    const fetchBookings = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.REACT_APP_API_URL;
        const response = await axios.get(`${apiUrl}/api/student/bookings`, {
          params: { student_id: studentId },
        });
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [studentId, userRole, navigate]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await axios.put(
        `${apiUrl}/api/bookings/${bookingId}/cancel?user_type=student`
      );
      setBookings(
        bookings.map((b) =>
          b.BookingID === bookingId ? { ...b, Status: "Booking Canceled" } : b
        )
      );
      alert(response.data.message);
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert(error.response?.data?.detail || "Error cancelling booking");
    }
  };
  

  const getStatusDisplay = (status) => {
    switch(status) {
      case "Pending Request": return "⏳ Pending Approval";
      case "Approved": return " Equipment Booked!";
      case "Denied": return " Request Denied";
      case "Returned": return " Returned";
      case "Booking Canceled": return " Booking Canceled";
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "Pending Request": return "#FFA500";
      case "Approved": return "#2ECC71";
      case "Denied": return "#E74C3C";
      case "Returned": return "#3498DB";
      case "Booking Canceled": return "#95A5A6";
      default: return "#000000";
    }
  };

  return (
    <div className="student-container">
      <ReturnButton />
      <h2>Welcome, Student!</h2>
      
      <Link to="/equipment">
        <button className="explore-button">Explore Equipment</button>
      </Link>

      <div className="booking-history">
        <h3>Booking History</h3>
        
        {bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          <div className="bookings-table">
            <table>
              <thead>
                <tr>
                  <th>Equipment</th>
                  <th>Status</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.BookingID}>
                    <td>{booking.EquipmentName}</td>
                    <td>{getStatusDisplay(booking.Status)}</td>
                    <td>
                      {["Approved", "Returned"].includes(booking.Status) 
                        ? new Date(booking.StartTime).toLocaleString() 
                        : "N/A"}
                    </td>
                    <td>
                      {booking.Status === "Returned" 
                        ? new Date(booking.EndTime).toLocaleString() 
                        : "N/A"}
                    </td>
                    <td>
                      {["Pending Request", "Approved", "Denied"].includes(booking.Status) && (
                        <button
                          onClick={() => handleCancelBooking(booking.BookingID)}
                          className="cancel-button"
                        >
                          Cancel Booking
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentPage;