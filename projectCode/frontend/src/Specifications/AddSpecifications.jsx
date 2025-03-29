import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AddSpecification.css';

const AddSpecifications = () => {
  const [inputs, setInputs] = useState(['']);

  const MAXSPEC = 7

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

/*   const handleSubmit = async (e) => {
    e.preventDefault();
    const apiUrl = process.env.REACT_APP_API_URL;  // Connect to backend
    try {
      const response = await fetch(`${apiUrl}/api/addspecification`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(), 
          condition: formData.condition,
          supplierName: formData.supplierName.toLowerCase(), // Convert all supplier names to lower case for ease of user experience.
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        alert('Specifications added succesfully. Please add equipment details.');
        // TODO: Finish add specification page
      } else {
        alert(data.detail);
      }
    } catch (error) {
      console.error('Unable to add item:', error);
      alert('Something went wrong. Please try again.');
    }
  }; */

  return (
      <div  className="wrapper-addSpec">
        <div className="title-addSpec">Add Specifications</div>
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
          <div >
            <input type="submit" value="Submit" className="add-btn" />
          </div>
        </div>
      </div>
  );

}; 

export default AddSpecifications;
