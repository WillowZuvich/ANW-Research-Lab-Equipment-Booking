import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import './AddSpecification.css';

const AddSpecifications = () => {
  const [inputs, setInputs] = useState(['']);

  const MAXSPEC = 7

  const location = useLocation();
  const equip = location.state;

  const addInputField = () => {
    if (inputs.length < MAXSPEC) {
      setInputs([...inputs, '']); 
    } else {
      alert(`You can only add up to ${MAXSPEC} Specifications.`);
    }
  };

  const navigate = useNavigate(); 

  const handleChange = (index, value) => {
    const updatedInputs = [...inputs];
    updatedInputs[index] = value; 
    setInputs(updatedInputs); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiUrl = process.env.REACT_APP_API_URL;  // Connect to backend
    for(var i = 0; i < inputs.length; i++){
      
      if (!equip.EquipID ) {
        alert("equipId Missing.");
        return;
      }
      
      const item = inputs[i];

      if ( !item) {
        alert("Specification is Missing.");
        return;
      }
      else{ console.log(JSON.stringify({ 
        equipId: equip.EquipID, 
        input: item,
      }),)}
      try {
        const response = await fetch(`${apiUrl}/api/addspecifications`, { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            equipId: equip.EquipID[0], 
            input: item,
          }),
        });
    
        const data = await response.json();
        if (response.ok) {
        } else {
          alert(data.detail);
        }
      } catch (error) {
        console.error('Unable to add details:', error);
        alert('Something went wrong. Please try again.');
      
      }
    }
    alert('Specifications added succesfully.');
    navigate("/admin")
  };

  return (
      <div  className="wrapper-addSpec" >
        <div className="title-addSpec">Add Specifications</div>
        <div className="title-addSpec">For Item "{equip.Name}", {equip.EquipID}</div>
        <div className="field">
          <button className = "field" onClick={addInputField}>Add Additional Specification</button>
          <div className="field">
            {inputs.map((input, index) => (
              <div key={index} className="field">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => handleChange(index, e.target.value)}
                  placeholder="Enter Specification"
                  className="field"
                />
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="form-addEquip">
            <div >
              <input type="submit" value="Submit" className="add-btn" />
            </div>
          </form>
        </div>
      </div>
  );

}; 

export default AddSpecifications;
