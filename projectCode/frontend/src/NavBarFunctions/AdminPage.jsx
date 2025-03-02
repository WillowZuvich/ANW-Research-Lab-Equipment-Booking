import React from 'react';
import { Link } from 'react-router-dom';

const AdminPage = () => {
  return (
    <div>
      <h1>Welcome, [Role Name]!</h1>
      <p>Click below to access Equipment:</p>
      <Link to="/equipment">Go to Equipment Page</Link>
      <p>Click below to add new Equipment:</p>
      <Link to="/addequipment">Go to Add Equipment Page</Link>
    </div>
  );
};

export default AdminPage;
