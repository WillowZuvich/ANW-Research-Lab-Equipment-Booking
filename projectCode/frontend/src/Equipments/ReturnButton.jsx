import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ReturnButton.css';

const ReturnButton = () => {
  const navigate = useNavigate();
  return (
    <button className="return-button" onClick={() => navigate(-1)}>
      Return
    </button>
  );
};

export default ReturnButton;
