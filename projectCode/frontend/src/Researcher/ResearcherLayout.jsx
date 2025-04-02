import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ResearcherSidebar from './ResearcherSidebar';
import ResearcherNavBar from './ResearcherNavBar';
import './ResearcherLayout.css';

const ResearcherLayout = ({ children }) => {
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
      <ResearcherNavBar
        firstName={user.firstName}
        lastInitial={user.lastName.charAt(0)}
      />
      <ResearcherSidebar />
      <main className="admin-content">{children}</main>
    </div>
  );
};

export default ResearcherLayout;