import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./StudentPage.css"; // Import CSS

const StudentPage = () => {
  const [bookings, setBookings] = useState([]);
  const studentId = localStorage.getItem("student_id");

  useEffect(() => {
    if (!studentId) {
      console.error("No student ID found");
      return;
    }

    const fetchBookings = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        const response = await axios.get(`${apiUrl}/api/student/bookings`, {
          params: { student_id: studentId },
        });
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, [studentId]);

  return (
    <div className="student-container">
      <h2>Welcome, Student!</h2>

      {/* Explore Equipment Button */}
      <Link to="/equipment">
        <button className="explore-button">Explore Equipment</button>
      </Link>

      <div className="booking-section">
        <h3>Booking History</h3>
        {bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          bookings.map((booking) => (
            <div key={booking.BookingID} className="booking-entry">
              <p><strong>Booking ID:</strong> {booking.BookingID || "N/A"}</p>
              <p><strong>Status:</strong> {booking.Status || "N/A"}</p>
              <p><strong>Start Time:</strong> {booking.StartTime || "N/A"}</p>
              <p><strong>End Time:</strong> {booking.EndTime || "N/A"}</p>
            </div>
          ))
        )}
      </div>


    </div>
  );
};

export default StudentPage;
