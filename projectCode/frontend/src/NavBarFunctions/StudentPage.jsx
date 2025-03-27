import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
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
      await axios.put(`${apiUrl}/api/bookings/${bookingId}/cancel`);
      setBookings(bookings.map(b => 
        b.BookingID === bookingId ? {...b, Status: "Booking Canceled"} : b
      ));
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
      <h2>Student Dashboard</h2>
      
      <Link to="/equipment" className="explore-button">
        Browse Available Equipment
      </Link>

      <div className="booking-history">
        <h3>Your Booking History</h3>
        
        {loading ? (
          <p>Loading your bookings...</p>
        ) : bookings.length === 0 ? (
          <p>You haven't made any bookings yet.</p>
        ) : (
          <div className="booking-cards">
            {bookings.map((booking) => (
              <div 
                key={booking.BookingID} 
                className="booking-card"
                style={{ borderLeft: `5px solid ${getStatusColor(booking.Status)}`}}
              >
                <div className="booking-header">
                  <h4>{booking.EquipmentName}</h4>
                  <span 
                    className="booking-status"
                    style={{ color: getStatusColor(booking.Status) }}
                  >
                    {getStatusDisplay(booking.Status)}
                  </span>
                </div>
                
                <div className="booking-details">
                  <p><strong>Requested:</strong> {booking.RequestDate}</p>
                  {booking.StartTime && <p><strong>Start Time:</strong> {booking.StartTime}</p>}
                  {booking.EndTime && <p><strong>End Time:</strong> {booking.EndTime}</p>}
                  {booking.AdminAction && <p><strong>Admin Note:</strong> {booking.AdminAction}</p>}
                </div>

                {(booking.Status === "Pending Request" || 
                  booking.Status === "Approved") && (
                  <button
                    onClick={() => handleCancelBooking(booking.BookingID)}
                    className="cancel-button"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentPage;