import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import ReturnButton from "./ReturnButton";
import "./ResearcherPage.css";

const ResearcherPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const researcherId = localStorage.getItem("userId");
  const userRole = localStorage.getItem("role");
  const navigate = useNavigate();

  useEffect(() => {
    if (!researcherId || userRole !== "researcher") {
      navigate("/login");
      return;
    }

    const fetchBookings = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.REACT_APP_API_URL;
        const response = await axios.get(`${apiUrl}/api/researcher/bookings`, {
          params: { researcher_id: researcherId },
        });
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [researcherId, userRole, navigate]);
  
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      // IMPORTANT: Pass the user_type query parameter
      const response = await axios.put(
        `${apiUrl}/api/bookings/${bookingId}/cancel?user_type=researcher`
      );
      // Update bookings state
      setBookings(
        bookings.map((b) =>
          b.BookingID === bookingId ? { ...b, Status: "Booking Canceled" } : b
        )
      );
      // Display the message field rather than the whole object
      alert(response.data.message);
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert(error.response?.data?.detail || "Error cancelling booking");
    }
  };
  

  const getStatusDisplay = (status) => {
    switch(status) {
      case "Pending Request": return "Requested";
      case "Approved": return "Equipment is Booked!";
      case "Denied": return "Request has denied!";
      case "Returned": return "Returned";
      case "Booking Canceled": return "Booking Canceled";
      default: return status;
    }
  };

  if (loading) return <div className="loading">Loading bookings...</div>;

  return (
    <div className="researcher-container">
      <ReturnButton />
      <h2>Welcome, Researcher!</h2>

      <Link to="/equipment">
        <button className="explore-button">Explore Equipment</button>
      </Link>

      <div className="booking-section">
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

export default ResearcherPage;