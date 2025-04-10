import React, { useEffect, useState } from "react";
import axios from "axios";
import './AdminBookingPage.css';

const AdminBookingPage = () => {
  const [bookings, setBookings] = useState([]);
  const [statusUpdates, setStatusUpdates] = useState({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({status: ''});

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


  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredBookings = bookings.filter(b =>
    (filters.status === '' || b.Status === filters.status) 
  );



  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div>
      <div className="admin-layout">
        <div className="admin-container">
          <h2>Booking Requests</h2>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', marginBottom: '1rem' }}>
            <select name="status" onChange={handleFilterChange} value={filters.status}>
              <option value="">Any Status</option>
              <option value="Pending Request">Pending Request</option>
              <option value="Approved">Approved</option>
              <option value="Denied">Denied</option>
              <option value="Booking Canceled">Canceled</option>
              
            </select>
          </div>

          {loading ? <p>Loading...</p> : (

          <div className="bookings-table-container">
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>ID</th><th>Requester</th><th>Equipment</th><th>Date</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((b) => (
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