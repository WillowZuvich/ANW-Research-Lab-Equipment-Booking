import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./EquipmentDetails.css";

const EquipmentDetails = () => {
  const { equipId } = useParams();
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRequesting, setIsRequesting] = useState(false);
  const studentId = localStorage.getItem("userId");
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
    if (!studentId || userRole !== "student") {
      alert("Please log in as a student to book equipment.");
      navigate("/login");
      return;
    }

    setIsRequesting(true);
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      await axios.post(`${apiUrl}/api/bookings`, {
        student_id: parseInt(studentId),
        equipment_id: parseInt(equipId),
      });
      alert("Booking request submitted successfully!");
      navigate("/student");
    } catch (error) {
      console.error("Error sending booking request:", error);
      alert(error.response?.data?.detail || "Error sending booking request");
    } finally {
      setIsRequesting(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!equipment) return <div className="not-found">Equipment not found.</div>;

  return (
    <div className="equipment-details-container">
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

      {userRole === "student" && equipment.Availability === "Available" && (
        <button 
          onClick={handleRequestBooking}
          disabled={isRequesting}
          className="book-button"
        >
          {isRequesting ? "Processing..." : "Request to Book This Equipment"}
        </button>
      )}
    </div>
  );
};

export default EquipmentDetails;