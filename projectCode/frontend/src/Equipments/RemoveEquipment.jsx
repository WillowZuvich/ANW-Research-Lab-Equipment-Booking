import React, { useEffect, useState } from "react";
import {  Link, useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';

const RemoveEquipment = () => {
  
  const navigate = useNavigate(); // For navigation after equipment is added or supplier must be entered


    const location = useLocation();
    const equip = location.state;
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiUrl = process.env.REACT_APP_API_URL;  // Connect to backend
    try {
      const response = await fetch(`${apiUrl}/api/removeequipment`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            equipId: equip.EquipID
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        alert('Equipment item removed succesfully.');
       
        navigate('/equipment',  { state: data});
      } else {
        alert(data.detail);
      }
    } catch (error) {
      console.error('Unable to remove item:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
      <div className="wrapper-addEquip">
        <form onSubmit={handleSubmit} className="form-addEquip">
          <div className="title-addEquip">Remove Lab Equipment</div>
          <div className="p-removeEquip">
          Item ID: {equip.EquipID}
           
          </div>
          <div className="p-removeEquip">
           Name:  {equip.Name}
          </div>
          <div className="p-removeEquip">
          Condition: {equip.Condition}
            
          </div>
          <div className="field">
            <input type="submit" value="Permanently Remove  Item" className="add-btn" />
          </div>
          <p className="p-addEquip">
            <Link to="/equipment"> Cancel here</Link>
          </p>
        </form>
      </div>
    );
};


export default RemoveEquipment;