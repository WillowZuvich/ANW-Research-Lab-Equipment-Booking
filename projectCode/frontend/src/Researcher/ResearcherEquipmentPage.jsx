import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ResearcherEquipmentPage = () => {
  const [equipmentList, setEquipmentList] = useState([]);
  const [filters, setFilters] = useState({ name: '', condition: '', availability: '' });
  const [selectedRow, setSelectedRow] = useState(null);
  const [notification, setNotification] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [actionEquipment, setActionEquipment] = useState(null);
  const userId = localStorage.getItem("userId");
  const userRole = localStorage.getItem("role");

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const res = await axios.get(`${apiUrl}/api/equipment`);
      setEquipmentList(res.data);
    } catch (err) {
      console.error('Error fetching equipment:', err);
    }
  };

  const showNotificationMessage = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 7000);
  };

  const handleRowClick = (equipID) => {
    setSelectedRow(selectedRow === equipID ? null : equipID);
  };

  const handleConfirmAction = (equipment) => {
    setActionEquipment(equipment);
    setShowConfirmModal(true);
  };

  const handleRequestBooking = async (eq) => {
    if (!eq?.EquipID) {
      showNotificationMessage("No equipment selected.");
      setShowConfirmModal(false);
      return;
    }

    setIsRequesting(true);
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      await axios.post(`${apiUrl}/api/bookings`, {
        user_id: parseInt(userId),
        equipment_id: parseInt(eq.EquipID),
        user_type: userRole
      });

      showNotificationMessage("Booking request submitted!");
      fetchEquipment();
    } catch (error) {
      console.error("Booking request failed:", error);
      showNotificationMessage("Booking request failed.");
    } finally {
      setIsRequesting(false);
      setShowConfirmModal(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredEquipment = equipmentList.filter(eq =>
    eq.Name.toLowerCase().includes(filters.name.toLowerCase()) &&
    (filters.condition === '' || eq.Condition === filters.condition) &&
    (filters.availability === '' || eq.Availability === filters.availability)
  );

  return (
    <div>
      <div style={{ display: "flex" }}>
        <div style={{ padding: "2rem", width: "100%", paddingLeft: "180px", paddingTop: "100px" }}>
          {notification && (
            <div style={{ color: "green", marginBottom: "1rem" }}>{notification}</div>
          )}

          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Equipments</h2>

          <div style={{ display: "flex", gap: "1rem", margin: "1rem 0" }}>
            <input
              name="name"
              placeholder="Search Name"
              value={filters.name}
              onChange={handleFilterChange}
              style={{
                backgroundColor: "pink",
                color: "black",
                border: "none",
                padding: "0.5rem",
                borderRadius: "4px"
              }}
            />
            <select name="condition" value={filters.condition} onChange={handleFilterChange}>
              <option value="">All Conditions</option>
              <option value="New">New</option>
              <option value="Used">Used</option>
              <option value="Damaged">Damaged</option>
            </select>
            <select name="availability" value={filters.availability} onChange={handleFilterChange}>
              <option value="">All Availability</option>
              <option value="Available">Available</option>
              <option value="Booked">Booked</option>
            </select>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "white" }}>
            <thead style={{ backgroundColor: "#f5f5f5", textAlign: "left" }}>
              <tr>
                <th style={{ padding: "10px" }}>Name</th>
                <th style={{ padding: "10px" }}>Condition</th>
                <th style={{ padding: "10px" }}>Availability</th>
                <th style={{ padding: "10px" }}>Specifications</th>
                <th style={{ padding: "10px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEquipment.map((eq) => (
                <tr
                  key={eq.EquipID}
                  onClick={() => handleRowClick(eq.EquipID)}
                  style={{ cursor: "pointer" }}
                >
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{eq.Name}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{eq.Condition}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{eq.Availability}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{eq.Specifications?.join(", ") || "-"}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {selectedRow === eq.EquipID && eq.Availability === "Available" && (
                      <button
                        style={{
                          padding: "5px 10px",
                          backgroundColor: "lightgreen",
                          border: "none",
                          borderRadius: "5px"
                        }}
                        onClick={() => handleConfirmAction(eq)}
                      >
                        Request
                      </button>
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
                <p>Do you want to request this equipment?</p>
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
                    onClick={() => handleRequestBooking(actionEquipment)}
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
    </div>
  );
};

export default ResearcherEquipmentPage;