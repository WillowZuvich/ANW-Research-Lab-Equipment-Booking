import React, { useEffect, useState } from "react";
import axios from "axios";

const ResearcherBookingPage = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [notification, setNotification] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmActionType, setConfirmActionType] = useState(null); // 'cancel' or 'return'
  const [actionBooking, setActionBooking] = useState(null);
  const researcherId = localStorage.getItem("userId");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const res = await axios.get(`${apiUrl}/api/researcher/bookings`, {
        params: { researcher_id: researcherId }
      });
      setBookings(res.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  const handleRowClick = (bookingId) => {
    setSelectedRow(selectedRow === bookingId ? null : bookingId);
  };

  const showNotificationMessage = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 7000);
  };

  const handleConfirmAction = (type, booking) => {
    setConfirmActionType(type);
    setActionBooking(booking);
    setShowConfirmModal(true);
  };

  const handleCancelBooking = async (booking) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      await axios.put(`${apiUrl}/api/bookings/${booking.BookingID}/cancel?user_type=researcher`);
      showNotificationMessage("Booking canceled.");
      fetchBookings();
    } catch (err) {
      console.error("Cancel error:", err.response?.data);
      showNotificationMessage("Cancel failed.");
    } finally {
      setShowConfirmModal(false);
    }
  };

  const handleReturnBooking = async (booking) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      await axios.put(`${apiUrl}/api/bookings/${booking.BookingID}/return`);
      showNotificationMessage("Equipment returned!");
      fetchBookings();
    } catch (err) {
      console.error("Return error:", err.response?.data);
      showNotificationMessage("Return failed.");
    } finally {
      setShowConfirmModal(false);
    }
  };

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

  return (
    <div style={{ display: "flex" }}>
      <div style={{ padding: "2rem", width: "100%", paddingLeft: "180px", paddingTop: "100px" }}>
        {notification && (
          <div style={{ color: "green", marginBottom: "1rem" }}>{notification}</div>
        )}

        <h2 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>My Bookings</h2>

        <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "white", marginTop: "1rem" }}>
          <thead style={{ backgroundColor: "#f5f5f5", textAlign: "left" }}>
            <tr>
              <th style={{ padding: "10px" }}>Booking ID</th>
              <th style={{ padding: "10px" }}>Equipment</th>
              <th style={{ padding: "10px" }}>Status</th>
              <th style={{ padding: "10px" }}>Start</th>
              <th style={{ padding: "10px" }}>End</th>
              <th style={{ padding: "10px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr
                key={b.BookingID}
                onClick={() => handleRowClick(b.BookingID)}
                style={{ cursor: "pointer" }}
              >
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{b.BookingID}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{b.EquipmentName}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd", color: getStatusColor(b.Status) }}>{b.Status}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{b.StartTime || "N/A"}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{b.EndTime || "N/A"}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {selectedRow === b.BookingID && (
                    <div style={{ display: "flex", gap: "10px" }}>
                      {["Pending Request", "Approved"].includes(b.Status) && (
                        <button
                          onClick={() => handleConfirmAction("cancel", b)}
                          style={{ padding: "5px 10px", backgroundColor: "pink", border: "none", borderRadius: "5px" }}
                        >
                          Cancel
                        </button>
                      )}
                      {b.Status === "Approved" && (
                        <button
                          onClick={() => handleConfirmAction("return", b)}
                          style={{ padding: "5px 10px", backgroundColor: "#ffa07a", border: "none", borderRadius: "5px" }}
                        >
                          Return
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showConfirmModal && (
          <div style={{
            position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
            backgroundColor: "rgba(0,0,0,0.6)", display: "flex",
            alignItems: "center", justifyContent: "center", zIndex: 1000
          }}>
            <div style={{
              background: "white", padding: "2rem", borderRadius: "8px",
              width: "400px", position: "relative"
            }}>
              <button
                onClick={() => setShowConfirmModal(false)}
                style={{
                  position: "absolute", top: "10px", right: "10px",
                  fontSize: "1.2rem", border: "none", background: "none", cursor: "pointer"
                }}
              >
                ×
              </button>
              <h3>Are you sure?</h3>
              <p>
                {confirmActionType === "cancel"
                  ? "Do you want to cancel this booking?"
                  : "Do you want to return this equipment?"}
              </p>
              <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", marginTop: "1rem" }}>
                <button
                  onClick={() => setShowConfirmModal(false)}
                  style={{
                    backgroundColor: "gray", color: "white", border: "none",
                    padding: "0.5rem 1rem", borderRadius: "5px"
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() =>
                    confirmActionType === "cancel"
                      ? handleCancelBooking(actionBooking)
                      : handleReturnBooking(actionBooking)
                  }
                  style={{
                    backgroundColor: "#3498db", color: "white", border: "none",
                    padding: "0.5rem 1rem", borderRadius: "5px"
                  }}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResearcherBookingPage;