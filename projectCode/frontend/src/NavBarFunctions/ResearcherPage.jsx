import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./ResearcherPage.css"; // Import Researcher CSS file

const ResearcherPage = () => {
  const [bookings, setBookings] = useState([]);
  const researcherId = localStorage.getItem("researcher_id"); // Change from student_id to researcher_id

  useEffect(() => {
    if (!researcherId) {
      console.error("No researcher ID found");
      return;
    }

    const fetchBookings = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        const response = await axios.get(`${apiUrl}/api/researcher/bookings`, {
          params: { researcher_id: researcherId }, // Change from student_id to researcher_id
        });
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching researcher bookings:", error);
      }
    };

    fetchBookings();
  }, [researcherId]);

  return (
    <div className="researcher-container">
      <h2>Welcome, Researcher!</h2>

      {/* Explore Equipment Button */}
      <Link to="/equipment">
        <button className="explore-button">Explore Equipment</button>
      </Link>

      <div className="booking-section">
        <h3>Booking History</h3>

        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <div key={booking.BookingID} className="booking-entry">
              <p><strong>Booking ID:</strong> {booking.BookingID || "N/A"}</p>
              <p><strong>Status:</strong> {booking.Status || "N/A"}</p>
              <p><strong>Start Time:</strong> {booking.StartTime || "N/A"}</p>
              <p><strong>End Time:</strong> {booking.EndTime || "N/A"}</p>
            </div>
          ))
        ) : (
          <p>No bookings found.</p>
        )}
      </div>
    </div>
  );
};

export default ResearcherPage;
