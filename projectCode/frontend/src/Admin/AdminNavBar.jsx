// AdminNavBar.jsx

import React from 'react';
import './AdminNavBar.css';

const AdminNavBar = ({ firstName, lastInitial }) => {
  return (
    <div className="admin-navbar">
      <div className="admin-brand">
        <span className="brand-name">FastEquip</span>
        <span className="role-label">ADMIN</span>
      </div>
      <div className="admin-user">
        {firstName} {lastInitial && `${lastInitial}.`}
      </div>
    </div>
  );
};

export default AdminNavBar;