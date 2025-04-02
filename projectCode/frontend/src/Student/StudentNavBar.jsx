import React from 'react';
import './StudentNavBar.css';

const StudentNavBar = ({ firstName, lastInitial }) => {
  return (
    <div className="admin-navbar">
      <div className="admin-brand">
        <span className="brand-name">FastEquip</span>
        <span className="role-label">STUDENT</span>
      </div>
      <div className="admin-user">
        {firstName} {lastInitial && `${lastInitial}.`}
      </div>
    </div>
  );
};

export default StudentNavBar;