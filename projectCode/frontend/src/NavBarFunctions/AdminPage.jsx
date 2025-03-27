import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./AdminPage.css";

const AdminPage = () => {
  const [bookings, setBookings] = useState([]);
  const [statusUpdates, setStatusUpdates] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await axios.get(`${apiUrl}/api/admin/bookings`);
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching booking requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (bookingId, newStatus) => {
    setStatusUpdates((prev) => ({ ...prev, [bookingId]: newStatus }));
  };

  const handleSubmitStatus = async (bookingId) => {
    const newStatus = statusUpdates[bookingId];
    if (!newStatus) {
      alert("Please select a status");
      return;
    }
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      await axios.put(`${apiUrl}/api/bookings/${bookingId}/status`, {
        status: newStatus,
        admin_action: newStatus === "Approved" ? "Approved by admin" : "Denied by admin"
      });
      fetchBookings();
    } catch (error) {
      console.error("Error updating booking status:", error);
      alert(error.response?.data?.detail || "Error updating booking status");
    }
  };

  const handleReturnEquipment = async (bookingId) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      await axios.put(`${apiUrl}/api/bookings/${bookingId}/return`);
      fetchBookings();
    } catch (error) {
      console.error("Error returning equipment:", error);
      alert(error.response?.data?.detail || "Error returning equipment");
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "Pending Request": return "orange";
      case "Approved": return "green";
      case "Denied": return "red";
      case "Returned": return "blue";
      case "Booking Canceled": return "gray";
      default: return "black";
    }
  };

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>
      
      <div className="admin-actions">
        <Link to="/equipment" className="admin-link">
          Manage Equipment
        </Link>
        <Link to="/addequipment" className="admin-link">
          Add New Equipment
        </Link>
      </div>

      <h2>Booking Requests</h2>
      {loading ? (
        <p>Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p>No booking requests found.</p>
      ) : (
        <div className="bookings-table-container">
          <table className="bookings-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Equipment</th>
                <th>Request Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.BookingID}>
                  <td>{booking.BookingID}</td>
                  <td>{booking.EquipmentName}</td>
                  <td>{booking.RequestDate}</td>
                  <td style={{ color: getStatusColor(booking.Status) }}>
                    {booking.Status}
                  </td>
                  <td className="actions-cell">
                    {booking.Status === "Pending Request" && (
                      <>
                        <select
                          value={statusUpdates[booking.BookingID] || ""}
                          onChange={(e) => handleStatusChange(booking.BookingID, e.target.value)}
                          className="status-select"
                        >
                          <option value="">Select Action</option>
                          <option value="Approved">Approve</option>
                          <option value="Denied">Deny</option>
                        </select>
                        <button 
                          onClick={() => handleSubmitStatus(booking.BookingID)}
                          className="status-button"
                        >
                          Submit
                        </button>
                      </>
                    )}
                    {booking.Status === "Approved" && (
                      <button 
                        onClick={() => handleReturnEquipment(booking.BookingID)}
                        className="return-button"
                      >
                        Mark Returned
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
  );
};

export default AdminPage;