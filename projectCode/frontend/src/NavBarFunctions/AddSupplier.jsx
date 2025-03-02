import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AddEquipment.css';

const AddSupplier = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
  });

  const navigate = useNavigate(); // For navigation after equipment is added or supplier must be entered

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiUrl = process.env.REACT_APP_API_URL;  // Connect to backend
    try {
      const response = await fetch(`${apiUrl}/api/addsupplier`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.toLowerCase(), 
          email: formData.email.trim(),
          phoneNumber: formData.phoneNumber.trim(), // Convert all supplier names to lower case for ease of user experience.
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        alert('Supplier created succesfully. Please add equipment details.');
        // TODO: add add specification page
        //navigate('/addSpecifications');
      } else {
        alert(data.detail);
      }
    } catch (error) {
      console.error('Unable to add supplier:', error);
      alert('Something went wrong. Please try again.');
    }
  };

 return (
      <div className="wrapper-addEquip">
        <form onSubmit={handleSubmit} className="form-addEquip">
          <div className="title-addEquip">Add Lab Equipment</div>
          <div className="field">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <label>Supplier Name</label>
          </div>
          <div className="field">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <label>Supplier Email</label>
          </div>
          <div className="field">
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
            <label>Supplier Name</label>
          </div>
          <div className="field">
            <input type="submit" value="Submit" className="add-btn" />
          </div>
          <p className="p-addEquip">
            <Link to="/admin"> Cancel here</Link>
          </p>
        </form>
      </div>
    );
};


export default AddSupplier;