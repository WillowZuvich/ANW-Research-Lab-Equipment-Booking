import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [user, setUser] = useState({ firstName: '', lastName: '' });

  useEffect(() => {
    const fetchUserData = async () => {
      const apiUrl = process.env.REACT_APP_API_URL;
      const role = localStorage.getItem('role');
      const userId = localStorage.getItem('userId');

      if (!role || !userId) return;

      try {
        const res = await axios.get(`${apiUrl}/api/user`, {
          params: { role, userId },
        });

        const data = res.data;
        setUser({ firstName: data.firstName, lastName: data.lastName });
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      {/* <h1>Welcome, {user.firstName} {user.lastName.charAt(0)}.</h1> */}
      <h1>Welcome</h1>

    </div>
  );
};

export default AdminDashboard;