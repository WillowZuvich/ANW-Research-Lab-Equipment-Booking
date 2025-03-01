import React from 'react';
import { Link } from 'react-router-dom';

const ResearcherPage = () => {
  return (
    <div>
      <h1>Welcome, [Researher]!</h1>
      <p>Click below to access Equipment:</p>
      <Link to="/equipment">Go to Equipment Page</Link>
    </div>
  );
};

export default ResearcherPage;
