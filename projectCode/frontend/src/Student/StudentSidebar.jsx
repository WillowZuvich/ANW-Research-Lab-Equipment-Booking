// AdminSidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import './StudentSidebar.css';

const StudentSidebar = () => {
  return (
    <div className="admin-sidebar">
      <ul className="sidebar-links">
        <li><NavLink to="/student/bookings">Bookings</NavLink></li>
        <li><NavLink to="/student/equipments">Equipments</NavLink></li>
        <li><NavLink to="/logout">Logout</NavLink></li>
      </ul>
    </div>
  );
};

export default StudentSidebar;