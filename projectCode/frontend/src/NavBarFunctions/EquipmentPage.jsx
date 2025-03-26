import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./EquipmentPage.css";


const EquipmentPage = () => {
  const [equipment, setEquipment] = useState([]);
  const [filters, setFilters] = useState({ name: "", condition: "", availability: "" });

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

  return (
    <div className="equipment-container">
      <h2>Equipment List</h2>
  
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
        </select>
        <select name="availability" value={filters.availability} onChange={handleFilterChange}>
          <option value="">All Availability</option>
          <option value="Available">Available</option>
          <option value="Booked">Booked</option>
        </select>
      </div>
  
      <ul className="equipment-list">
        {filteredEquipment.map((eq) => (
          <li key={eq.EquipID} className="equipment-item">
            <a href={`/equipment/${eq.EquipID}`} style={{ color: "white" }}>
              {eq.Name}
            </a> - {eq.Condition} - {eq.Availability}
          </li>
        ))}
      </ul>
    </div>
  );
  
};

export default EquipmentPage;
