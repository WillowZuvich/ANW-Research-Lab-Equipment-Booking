import React from 'react';
import './ResearcherNavBar.css';

const ResearcherNavBar = ({ firstName, lastInitial }) => {
  return (
    <div className="admin-navbar">
      <div className="admin-brand">
        <span className="brand-name">FastEquip</span>
        <span className="role-label">RESEARCHER</span>
      </div>
      <div className="admin-user">
        {firstName} {lastInitial && `${lastInitial}.`}
      </div>
    </div>
  );
};

export default ResearcherNavBar;