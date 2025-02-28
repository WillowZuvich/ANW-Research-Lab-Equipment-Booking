import React, { useEffect } from 'react';

const StudentPage = () => {
  useEffect(() => {
    console.log("StudentPage Loaded");  // ✅ Debugging Log
  }, []);

  return (
    <div>
      <h1>Welcome, Student!</h1>
      <p>This is the student dashboard.</p>
    </div>
  );
};

export default StudentPage;
