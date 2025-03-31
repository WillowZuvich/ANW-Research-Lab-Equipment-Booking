import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminSidebar from './AdminSidebar';
import AdminNavBar from './AdminNavBar';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
  const [user, setUser] = useState({ firstName: '', lastName: '' });

  useEffect(() => {
    const fetchUserData = async () => {
      const apiUrl = process.env.REACT_APP_API_URL;
      const role = localStorage.getItem('role');
      const userId = localStorage.getItem('userId');

      if (!role || !userId) {
        console.error('Missing role or userId in localStorage');
        return;
      }

      try {
        const res = await axios.get(`${apiUrl}/api/user`, {
          params: { role, userId },
        });

        const data = res.data;
        setUser({ firstName: data.firstName, lastName: data.lastName });
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="admin-layout">
      <AdminNavBar
        firstName={user.firstName}
        lastInitial={user.lastName.charAt(0)}
      />
      <AdminSidebar />
      <main className="admin-content">{children}</main>
    </div>
  );
};

export default AdminLayout;

