import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ReturnButton from "./ReturnButton";
import "./EquipmentDetails.css";

const EquipmentDetails = () => {
  const { equipId } = useParams();
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRequesting, setIsRequesting] = useState(false);
  const userId = localStorage.getItem("userId");
  const userRole = localStorage.getItem("role");

  useEffect(() => {
    const fetchEquipmentDetails = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        const response = await axios.get(`${apiUrl}/api/equipment/${equipId}`);
        setEquipment(response.data);
      } catch (error) {
        console.error("Error fetching equipment details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipmentDetails();
  }, [equipId]);

  const handleRequestBooking = async () => {
    if (!userId || (userRole !== "student" && userRole !== "researcher")) {
      alert("Please log in to book equipment.");
      navigate("/login");
      return;
    }
  
    setIsRequesting(true);
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await axios.post(`${apiUrl}/api/bookings`, {
        user_id: parseInt(userId),
        equipment_id: parseInt(equipId),
        user_type: userRole
      });
      alert("Booking request submitted successfully!");
      navigate(`/${userRole}`);
    } catch (error) {
      console.error("Error:", error.response?.data);
      alert(error.response?.data?.detail || "Error sending booking request");
    } finally {
      setIsRequesting(false);
    }
  };

  const handleRemoveEquipment = async () => {
    navigate('/removeequipment', { state: equipment});
  };
  if (loading) return <div className="loading">Loading...</div>;
  if (!equipment) return <div className="not-found">Equipment not found.</div>;

  return (
    <div className="equipment-details-container">
        <ReturnButton />
      <div className="equipment-header">
        <h2>{equipment.Name}</h2>
        <span className={`availability-badge ${equipment.Availability.toLowerCase()}`}>
          {equipment.Availability}
        </span>
      </div>

      <div className="equipment-info">
        <p><strong>Condition:</strong> {equipment.Condition}</p>
        
        {equipment.Specifications && equipment.Specifications.length > 0 && (
          <div className="specifications">
            <h3>Specifications:</h3>
            <ul>
              {equipment.Specifications.map((spec, index) => (
                <li key={index}>{spec}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {(userRole === "student" || userRole === "researcher") && equipment.Availability === "Available" && (
        <button 
          onClick={handleRequestBooking}
          disabled={isRequesting}
          className="book-button"
        >
          {isRequesting ? "Processing..." : "Request to Book This Equipment"}
        </button>
      )}

      {(userRole === "admin") && equipment.Availability === "Available" && (
        <button 
          onClick={handleRemoveEquipment}
          className="book-button"
        >
          Remove Item
        </button>
      )}
    </div>
  );
};

export default EquipmentDetails;