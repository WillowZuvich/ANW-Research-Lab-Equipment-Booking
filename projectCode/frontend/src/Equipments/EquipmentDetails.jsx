import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const EquipmentDetails = () => {
  const { equipId } = useParams();
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <p>Loading...</p>;
  if (!equipment) return <p>Equipment not found.</p>;

  return (
    <div>
      <h2>{equipment.Name}</h2>
      <p><strong>Condition:</strong> {equipment.Condition}</p>
      <p><strong>Availability:</strong> {equipment.Availability}</p>

      {equipment.Specifications && (
        <div>
          <h3>Specifications:</h3>
          <ul>
            {equipment.Specifications.split(";").map((spec, index) => (
              <li key={index}>{spec}</li>
            ))}
          </ul>
        </div>
      )}

      {equipment.Availability === "Available" && (
        <button onClick={() => alert("Booking request sent!")}>
          Request to Book This Equipment
        </button>
      )}
    </div>
  );
};

export default EquipmentDetails;
