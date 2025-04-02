import React from 'react';
import { NavLink } from 'react-router-dom';
import './ResearcherSidebar.css';

const ResearcherSidebar = () => {
  return (
    <div className="admin-sidebar">
      <ul className="sidebar-links">
        <li><NavLink to="/researcher/bookings">Bookings</NavLink></li>
        <li><NavLink to="/researcher/equipments">Equipments</NavLink></li>
        <li><NavLink to="/logout">Logout</NavLink></li>
      </ul>
    </div>
  );
};

export default ResearcherSidebar;