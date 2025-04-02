import React, { useEffect, useState } from "react";
import {  Link, useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';

const EditEquipment = () => {
  const [formData, setFormData] = useState({
    name: '',
    condition: '',
  });

  const navigate = useNavigate(); // For navigation after equipment is added or supplier must be entered
  const location = useLocation();
    const equip = location.state;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.name) { formData.name = equip.Name}
    if(!formData.condition) { formData.condition = equip.Condition}
    console.log(JSON.stringify({
        equipId: equip.EquipID,
        name: formData.name.trim(), 
        condition: formData.condition,
      }))
    const apiUrl = process.env.REACT_APP_API_URL;  // Connect to backend
    try {
      const response = await fetch(`${apiUrl}/api/editequipment`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          equipId: equip.EquipID,
          name: formData.name.trim(), 
          condition: formData.condition,
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        alert('Equipment item edited succesfully.');
        navigate('/admin/equipments')
      } else {
        alert(data.detail);
        navigate('/admin/equipments',  { state: data})
      }
    } catch (error) {
      console.error('Unable to edit item:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
      <div className="wrapper-addEquip">
        <form onSubmit={handleSubmit} className="form-addEquip">
          <div className="title-addEquip">Edit Lab Equipment</div>
          <div className="p-addEquip">Item ID: {equip.EquipID}</div>
          <div className="field">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <label>Current Name: {equip.Name}</label>
          </div>
          <div className="field">
            <input
              type="text"
              name="condition"
              value={formData.condition}
              onChange={handleChange}
            />
            <label>Current Value: {equip.Condition}</label>
          </div>
          <div className="field">
            <input type="submit" value="Submit Changes" className="add-btn" />
          </div>
          <p className="p-addEquip">
            <Link to="/admin/equipments"> Cancel here</Link>
          </p>
        </form>
      </div>
    );
};


export default EditEquipment;