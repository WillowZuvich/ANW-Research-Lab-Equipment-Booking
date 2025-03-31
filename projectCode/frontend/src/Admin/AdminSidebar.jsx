// AdminSidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import './AdminSidebar.css';

const AdminSidebar = () => {
  return (
    <div className="admin-sidebar">
      <ul className="sidebar-links">
        <li><NavLink to="/admin/bookings">Bookings</NavLink></li>
        <li><NavLink to="/admin/equipments">Equipments</NavLink></li>
        <li><NavLink to="/admin/specifications">Specifications</NavLink></li>
        <li><NavLink to="/admin/suppliers">Suppliers</NavLink></li>
        <li><NavLink to="/logout">Logout</NavLink></li>
      </ul>
    </div>
  );
};

export default AdminSidebar;