import React, { useEffect } from 'react';

const AddEquipment = () => {
  useEffect(() => {
    console.log("AddEquip page Loaded");  // ✅ Debugging Log
  }, []);

  return (
    <div>
      <h1>Welcome!</h1>
      <p>This page is for adding equipment.</p>

    </div>
  );
};

export default AddEquipment;