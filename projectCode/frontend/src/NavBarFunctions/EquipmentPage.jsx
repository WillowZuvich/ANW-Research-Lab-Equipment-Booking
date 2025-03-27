import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./EquipmentPage.css";

const EquipmentPage = () => {
  const [equipment, setEquipment] = useState([]);
  const [filters, setFilters] = useState({ 
    name: "", 
    condition: "", 
    availability: "" 
  });
  const userRole = localStorage.getItem("role");

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        const response = await axios.get(`${apiUrl}/api/equipment`);
        setEquipment(response.data);
      } catch (error) {
        console.error("Error fetching equipment:", error);
      }
    };

    fetchEquipment();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredEquipment = equipment.filter((eq) => 
    eq.Name.toLowerCase().includes(filters.name.toLowerCase()) &&
    (filters.condition === "" || eq.Condition === filters.condition) &&
    (filters.availability === "" || eq.Availability === filters.availability)
  );

  const getAvailabilityColor = (availability) => {
    return availability === "Available" ? "green" : "red";
  };

  return (
    <div className="equipment-container">
      <h2>Equipment List</h2>
      {userRole === "admin" && (
        <Link to="/add-equipment" className="add-equipment-btn">
          Add New Equipment
        </Link>
      )}
  
      <div className="equipment-filters">
        <input
          type="text"
          name="name"
          placeholder="Search by Name"
          value={filters.name}
          onChange={handleFilterChange}
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
  
      <div className="equipment-list">
        {filteredEquipment.map((eq) => (
          <div key={eq.EquipID} className="equipment-card">
            <Link to={`/equipment/${eq.EquipID}`} className="equipment-link">
              <h3>{eq.Name}</h3>
              <p>Condition: {eq.Condition}</p>
              <p style={{ color: getAvailabilityColor(eq.Availability) }}>
                Status: {eq.Availability}
              </p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EquipmentPage;