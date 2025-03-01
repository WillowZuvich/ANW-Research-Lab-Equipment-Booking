import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const StudentPage = () => {
  useEffect(() => {
    console.log("StudentPage Loaded");  // ✅ Debugging Log
  }, []);

  return (
    <div>
      <h1>Welcome, [Student]!</h1>
      <p>Click below to access Equipment:</p>
      <Link to="/equipment">Go to Equipment Page</Link>
    </div>
  );
};

export default StudentPage;
