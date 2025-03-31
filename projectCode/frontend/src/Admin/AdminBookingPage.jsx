import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminNavBar from "./AdminNavBar";
import AdminSidebar from "./AdminSidebar";
import './AdminBookingPage.css';

const AdminBookingPage = () => {
  const [user, setUser] = useState({ firstName: '', lastName: '' });
  const [bookings, setBookings] = useState([]);
  const [statusUpdates, setStatusUpdates] = useState({});
  const [loading, setLoading] = useState(true);

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending Request": return "orange";
      case "Approved": return "green";
      case "Denied": return "red";
      case "Returned": return "blue";
      case "Booking Canceled": return "gray";
      default: return "black";
    }
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await axios.get(`${apiUrl}/api/admin/bookings`);
      setBookings(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const role = localStorage.getItem('role');
    const userId = localStorage.getItem('userId');

    if (!role || !userId) return;

    try {
      const res = await axios.get(`${apiUrl}/api/user`, {
        params: { role, userId }
      });
      const data = res.data;
      setUser({ firstName: data.firstName, lastName: data.lastName });
    } catch (err) {
      console.error("Error fetching user", err);
    }
  };

  const handleStatusChange = (id, value) => {
    setStatusUpdates(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmitStatus = async (id) => {
    const newStatus = statusUpdates[id];
    if (!newStatus) return alert("Please select a status");

    const apiUrl = process.env.REACT_APP_API_URL;
    await axios.put(`${apiUrl}/api/bookings/${id}/status`, {
      status: newStatus,
      admin_action: `${newStatus} by admin`,
    });
    fetchBookings();
  };

  const handleReturnEquipment = async (id) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    await axios.put(`${apiUrl}/api/bookings/${id}/return`);
    fetchBookings();
  };

  useEffect(() => {
    fetchBookings();
    fetchUser();
  }, []);

  return (
    <div>
      <AdminNavBar
        firstName={user.firstName}
        lastInitial={user.lastName.charAt(0)}
      />
      <div className="admin-layout">
        <AdminSidebar />
        <div className="admin-container">
          <h2>Booking Requests</h2>
          {loading ? <p>Loading...</p> : (

          <div className="bookings-table-container">
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>ID</th><th>Requester</th><th>Equipment</th><th>Date</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.BookingID}>
                    <td>{b.BookingID}</td>
                    <td>{b.requester_info?.name || "N/A"} ({b.requester_info?.role})</td>
                    <td>{b.EquipmentName}</td>
                    <td>{b.RequestDate}</td>
                    <td style={{ color: getStatusColor(b.Status) }}>{b.Status}</td>

                    <td className="actions-cell"> 
                      {b.Status === "Pending Request" && (
                        <>
                          <select value={statusUpdates[b.BookingID] || ""} onChange={(e) => handleStatusChange(b.BookingID, e.target.value)}>
                            <option value="">Select Action</option>
                            <option value="Approved">Approve</option>
                            <option value="Denied">Deny</option>
                          </select>
                          <button onClick={() => handleSubmitStatus(b.BookingID)}>Submit</button>
                        </>
                      )}
                      {b.Status === "Approved" && (
                        <button onClick={() => handleReturnEquipment(b.BookingID)}>Mark Returned</button>
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
    </div>
  );
};

export default AdminBookingPage;