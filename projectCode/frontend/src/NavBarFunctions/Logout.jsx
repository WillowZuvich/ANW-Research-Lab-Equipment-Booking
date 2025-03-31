//Logout.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('token'); // Remove the token to log out
    navigate('/'); // Redirect to the home page
  }, [navigate]);

  return <div>Logging out...</div>;
};

export default Logout;