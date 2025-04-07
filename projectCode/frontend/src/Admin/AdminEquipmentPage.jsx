// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import {  useNavigate } from "react-router-dom";

// const AdminEquipmentPage = () => {
//   const [equipmentList, setEquipmentList] = useState([]);
//   const [filters, setFilters] = useState({ name: '', condition: '', availability: '' });
//   const [showModal, setShowModal] = useState(false);
//   const [formData, setFormData] = useState({ name: '', condition: '', supplierName: '', specification: '' });
//   const [specOptions, setSpecOptions] = useState([]);
//   const [supplierOptions, setSupplierOptions] = useState([]);
//   const [notification, setNotification] = useState('');
//   const [selectedRow, setSelectedRow] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchEquipment();
//     fetchSuppliers();
//   }, []);

//   const handleRowClick = (equipID) => {
//     setSelectedRow(equipID === selectedRow ? null : equipID); 
//   };

//   const showNotification = (message) => {
//     setNotification(message);
//     setTimeout(() => setNotification(''), 7000);
//   };

//   const fetchEquipment = async () => {
//     try {
//       const apiUrl = process.env.REACT_APP_API_URL;
//       const res = await axios.get(`${apiUrl}/api/equipment`);
//       setEquipmentList(res.data);

//       const specsSet = new Set();
//       res.data.forEach(eq => {
//         eq.Specifications?.forEach(spec => specsSet.add(spec));
//       });
//       setSpecOptions([...specsSet]);
//     } catch (err) {
//       console.error('Error fetching equipment:', err);
//     }
//   };

//   const fetchSuppliers = async () => {
//     try {
//       const apiUrl = process.env.REACT_APP_API_URL;
//       const res = await axios.get(`${apiUrl}/api/suppliers`);
//       setSupplierOptions(res.data.map(s => s.name));
//     } catch (err) {
//       console.error('Error fetching suppliers:', err);
//     }
//   };

//   // const fetchSpecifications = async () => {
//   //   try {
//   //     const apiUrl = process.env.REACT_APP_API_URL;
//   //     const res = await axios.get(`${apiUrl}/api/specifications`);
//   //     setSpecOptions(res.data.map((s) => s.Detail)); // Assuming you're storing just the detail
//   //   } catch (err) {
//   //     console.error('Error fetching specifications:', err);
//   //   }
//   // };
  
//   const handleFilterChange = (e) => {
//     setFilters({ ...filters, [e.target.name]: e.target.value });
//   };

//   const filteredEquipment = equipmentList.filter(eq =>
//     eq.Name.toLowerCase().includes(filters.name.toLowerCase()) &&
//     (filters.condition === '' || eq.Condition === filters.condition) &&
//     (filters.availability === '' || eq.Availability === filters.availability)
//   );

//   const handleFormChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleAddEquipment = async (e) => {
//     e.preventDefault();
//     try {
//       const apiUrl = process.env.REACT_APP_API_URL;
  
//       // Send specification as part of the creation body (assuming backend supports it)
//       const res = await axios.post(`${apiUrl}/api/addequipment`, {
//         name: formData.name.trim(),
//         condition: formData.condition.trim(),
//         supplierName: formData.supplierName.toLowerCase().trim(),
//         //specification: formData.specification || null, 
//       });

//       //     if (res.data.EquipID && formData.specification.trim()) {
//   //       await axios.post(`${apiUrl}/api/addspecifications`, {
//   //         equipId: res.data.EquipID,
//   //         input: formData.specification,
//   //       });
//   //     }
  
//       showNotification("Equipment added!");
//      // setFormData({ name: '', condition: '', supplierName: '', specification: '' });
//       setFormData({ name: '', condition: '', supplierName: '' });
//       setShowModal(false);
//       fetchEquipment();
//       //fetchSpecifications(); 
//     } catch (err) {
//       alert(err.response?.data?.detail || 'Error adding equipment');
//     }
//   };

//   // Handler for navigating to Remove equipment page
//   const handleRemoveEquipment = async (eq) => {
//     console.log(eq);
//     navigate('/removeequipment', { state: eq});
//   };

//   // Handler for navigating to Edit equipment page
//   const handleEditEquipment = async (eq) => {
//     console.log(eq);
//     navigate('/editequipment', { state: eq});
//   };

//   return (
//     <div>
//       <div style={{ display: 'flex' }}>
//         <div style={{ padding: '2rem', width: '100%', paddingLeft: '180px', paddingTop: '100px' }}>
//           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//             <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>Equipments</h2>
//             {notification && <p style={{ color: 'green', marginTop: '1rem', marginBottom: '1rem' }}>{notification}</p>}
//             <button
//               style={{
//                 backgroundColor: 'pink',
//                 color: 'black',
//                 border: 'none',
//                 padding: '0.5rem 1rem',
//                 borderRadius: '5px',
//                 cursor: 'pointer'
//               }}
//               onClick={() => setShowModal(true)}
//             >
//               Add New Equipment
//             </button>
//           </div>

//           <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', marginBottom: '1rem' }}>
//             <input
//               name="name"
//               placeholder="Search Name"
//               value={filters.name}
//               onChange={handleFilterChange}
//               style={{
//                 backgroundColor: 'pink',
//                 color: 'black',
//                 border: 'none',
//                 padding: '0.5rem',
//                 borderRadius: '4px',
//                 '::placeholder': { color: 'white' }
//               }}
//             />
//             <select name="condition" onChange={handleFilterChange} value={filters.condition}>
//               <option value="">All Conditions</option>
//               <option value="New">New</option>
//               <option value="Used">Used</option>
//               <option value="Damaged">Damaged</option>
//             </select>
//             <select name="availability" onChange={handleFilterChange} value={filters.availability}>
//               <option value="">All Availability</option>
//               <option value="Available">Available</option>
//               <option value="Booked">Booked</option>
//             </select>
//           </div>

//           <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
//             <thead style={{ backgroundColor: '#f5f5f5', textAlign: 'left' }}>
//               <tr>
//                 <th style={{ padding: '10px' }}>Name</th>
//                 <th style={{ padding: '10px' }}>Condition</th>
//                 <th style={{ padding: '10px' }}>Availability</th>
//                 <th style={{ padding: '10px' }}>Specifications</th>
//                 <th style={{ padding: '10px' }}>Actions</th>

//               </tr>
//             </thead>
//             <tbody>
//               {filteredEquipment.map(eq => (
//                 <tr
//                  key={eq.EquipID}
//                  onClick={() => handleRowClick(eq.EquipID)} 
//                  style={{ cursor: 'pointer' }} 
//                  >

//                   <td style={{ padding: '10px', border: '1px solid #ddd' }}>{eq.Name}</td>
//                   <td style={{ padding: '10px', border: '1px solid #ddd' }}>{eq.Condition}</td>
//                   <td style={{ padding: '10px', border: '1px solid #ddd' }}>{eq.Availability}</td>
//                   <td style={{ padding: '10px', border: '1px solid #ddd' }}>{eq.Specifications?.join(', ') || '-'}</td>

//                   <td style={{ padding: '10px', border: '1px solid #ddd' }}>
//                     {/* Buttons for removing and adding Equipment */}
//                   <div style={{ display: 'flex', gap: '10px' }}>
//                       {selectedRow === eq.EquipID && (
//                         <button 
//                           style={{ padding: '5px 10px', backgroundColor: 'pink', color: 'black', borderRadius: '5px', border: 'none' }}
//                           onClick={() => handleRemoveEquipment(eq)} 
//                           >
//                           Remove Item
//                         </button>
                        
//                     )}
//                     {selectedRow === eq.EquipID && (
//                         <button 
//                           style={{ padding: '5px 10px', backgroundColor: '#add8e6', color: 'black', borderRadius: '5px', border: 'none' }}
//                           onClick={() => handleEditEquipment(eq)}
//                           >
//                           Edit Item
//                         </button>
                        
//                     )}
//                   </div>
//                  </td>

//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {/* Modal */}
//           {showModal && (
//             <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
//               <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', width: '400px', position: 'relative' }}>
//                 <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '1.2rem', border: 'none', background: 'none', cursor: 'pointer' }}>×</button>
//                 <h3>Add New Equipment</h3>
//                 <form onSubmit={handleAddEquipment} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
//                   <input type="text" name="name" placeholder="Equipment Name" value={formData.name} onChange={handleFormChange} style= {{ backgroundColor: 'pink', color: 'black'}} required />
//                   <input type="text" name="condition" placeholder="Condition (New, Used, Damaged)" value={formData.condition} onChange={handleFormChange} style= {{ backgroundColor: 'pink', color: 'black'}} required />

//                   {/* Supplier dropdown */}
//                   <select name="supplierName" value={formData.supplierName} onChange={handleFormChange} required>
//                     <option value="">Select Supplier</option>
//                     {supplierOptions.map((s, idx) => (
//                       <option key={idx} value={s}>{s}</option>
//                     ))}
//                   </select>

//                   {/* Specification dropdown */}
//                   {/* <select name="specification" value={formData.specification} onChange={handleFormChange}>
//                     <option value="">Select Specification (Optional)</option>
//                     {specOptions.map((spec, idx) => (
//                       <option key={idx} value={spec}>{spec}</option>
//                     ))}
//                   </select> */}

//                   <button type="submit" style={{ backgroundColor: '#3498db', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '5px' }}>Submit</button>
//                 </form>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminEquipmentPage;





import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNavBar from './AdminNavBar';
import {  useNavigate } from "react-router-dom";
import AdminSidebar from './AdminSidebar';

const AdminEquipmentPage = () => {
  const [equipmentList, setEquipmentList] = useState([]);
  const [filters, setFilters] = useState({ name: '', condition: '', availability: '' });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState(null); // 'edit' or 'remove'
  const [formData, setFormData] = useState({ name: '', condition: '', supplierName: '' });
  const [specOptions, setSpecOptions] = useState([]);
  const [supplierOptions, setSupplierOptions] = useState([]);
  const [notification, setNotification] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);
  const [actionEquipment, setActionEquipment] = useState(null);

  useEffect(() => {
    fetchEquipment();
    fetchSuppliers();
  }, []);

  const handleRowClick = (equipID) => {
    setSelectedRow(equipID === selectedRow ? null : equipID); 
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 7000);
  };

  const fetchEquipment = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const res = await axios.get(`${apiUrl}/api/equipment`);
      setEquipmentList(res.data);

      const specsSet = new Set();
      res.data.forEach(eq => {
        eq.Specifications?.forEach(spec => specsSet.add(spec));
      });
      setSpecOptions([...specsSet]);
    } catch (err) {
      console.error('Error fetching equipment:', err);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const res = await axios.get(`${apiUrl}/api/suppliers`);
      setSupplierOptions(res.data.map(s => s.name));
    } catch (err) {
      console.error('Error fetching suppliers:', err);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredEquipment = equipmentList.filter(eq =>
    eq.Name.toLowerCase().includes(filters.name.toLowerCase()) &&
    (filters.condition === '' || eq.Condition === filters.condition) &&
    (filters.availability === '' || eq.Availability === filters.availability)
  );

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddEquipment = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      await axios.post(`${apiUrl}/api/addequipment`, {
        name: formData.name.trim(),
        condition: formData.condition.trim(),
        supplierName: formData.supplierName.toLowerCase().trim(),
      });

      showNotification("Equipment added!");
      setFormData({ name: '', condition: '', supplierName: '' });
      setShowAddModal(false);
      fetchEquipment();
    } catch (err) {
      alert(err.response?.data?.detail || 'Error adding equipment');
    }
  };

  const handleEditClick = (eq) => {
    setActionType('edit');
    setActionEquipment(eq);
    setFormData({ name: '', condition: '', supplierName: '' });
    setShowActionModal(true);
  };

  const handleRemoveClick = (eq) => {
    setActionType('remove');
    setActionEquipment(eq);
    setShowActionModal(true);
  };

  const handleEditSubmit = async () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    try {
      await axios.post(`${apiUrl}/api/editequipment`, {
        equipId: actionEquipment.EquipID,
        name: formData.name || actionEquipment.Name,
        condition: formData.condition || actionEquipment.Condition,
      });
      showNotification("Equipment updated successfully!");
      setShowActionModal(false);
      fetchEquipment();
    } catch (err) {
      alert('Error editing equipment');
    }
  };

  const handleRemoveSubmit = async () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    try {
      await axios.post(`${apiUrl}/api/removeequipment`, {
        equipId: actionEquipment.EquipID
      });
      showNotification("Equipment removed successfully!");
      setShowActionModal(false);
      fetchEquipment();
    } catch (err) {
      alert('Error removing equipment');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex' }}>
        <div style={{ padding: '2rem', width: '100%', paddingLeft: '180px', paddingTop: '100px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>Equipments</h2>
            {notification && <p style={{ color: 'green' }}>{notification}</p>}
            <button
              style={{ backgroundColor: 'pink', color: 'black', border: 'none', padding: '0.5rem 1rem', borderRadius: '5px' }}
              onClick={() => setShowAddModal(true)}
            >
              Add New Equipment
            </button>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', marginBottom: '1rem' }}>
            <input
              name="name"
              placeholder="Search Name"
              value={filters.name}
              onChange={handleFilterChange}
              style={{ backgroundColor: 'pink', color: 'black', border: 'none', padding: '0.5rem', borderRadius: '4px' }}
            />
            <select name="condition" onChange={handleFilterChange} value={filters.condition}>
              <option value="">All Conditions</option>
              <option value="New">New</option>
              <option value="Used">Used</option>
              <option value="Damaged">Damaged</option>
            </select>
            <select name="availability" onChange={handleFilterChange} value={filters.availability}>
              <option value="">All Availability</option>
              <option value="Available">Available</option>
              <option value="Booked">Booked</option>
            </select>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
            <thead style={{ backgroundColor: '#f5f5f5', textAlign: 'left' }}>
              <tr>
                <th style={{ padding: '10px' }}>Name</th>
                <th style={{ padding: '10px' }}>Condition</th>
                <th style={{ padding: '10px' }}>Availability</th>
                <th style={{ padding: '10px' }}>Specifications</th>
                <th style={{ padding: '10px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEquipment.map(eq => (
                <tr key={eq.EquipID} onClick={() => handleRowClick(eq.EquipID)} style={{ cursor: 'pointer' }}>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{eq.Name}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{eq.Condition}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{eq.Availability}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{eq.Specifications?.join(', ') || '-'}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {selectedRow === eq.EquipID && (
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button style={{ padding: '5px 10px', backgroundColor: 'pink', color: 'black', borderRadius: '5px', border: 'none' }} onClick={() => handleRemoveClick(eq)}>Remove</button>
                        <button style={{ padding: '5px 10px', backgroundColor: '#add8e6', color: 'black', borderRadius: '5px', border: 'none' }} onClick={() => handleEditClick(eq)}>Edit</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {(showAddModal || showActionModal) && (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
              <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', width: '400px', position: 'relative' }}>
                <button onClick={() => { setShowAddModal(false); setShowActionModal(false); }} style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '1.2rem', border: 'none', background: 'none', cursor: 'pointer' }}>×</button>
                <h3>{showAddModal ? "Add New Equipment" : actionType === 'edit' ? 'Edit Equipment' : 'Remove Equipment'}</h3>

                {showAddModal || actionType === 'edit' ? (
                  <form onSubmit={showAddModal ? handleAddEquipment : (e) => { e.preventDefault(); handleEditSubmit(); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input type="text" name="name" placeholder="Equipment Name" value={formData.name} onChange={handleFormChange} style={{ backgroundColor: 'pink', color: 'black' }} />
                    <input type="text" name="condition" placeholder="Condition" value={formData.condition} onChange={handleFormChange} style={{ backgroundColor: 'pink', color: 'black' }} />
                    <select name="supplierName" value={formData.supplierName} onChange={handleFormChange} required={showAddModal}>
                      <option value="">Select Supplier</option>
                      {supplierOptions.map((s, idx) => (
                        <option key={idx} value={s}>{s}</option>
                      ))}
                    </select>
                    <button type="submit" style={{ backgroundColor: '#3498db', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '5px' }}>Submit</button>
                  </form>
                ) : (
                  <>
                    <p>Are you sure you want to permanently delete the following item?</p>
                    <p><strong>ID:</strong> {actionEquipment?.EquipID}</p>
                    <p><strong>Name:</strong> {actionEquipment?.Name}</p>
                    <p><strong>Condition:</strong> {actionEquipment?.Condition}</p>
                    <button onClick={handleRemoveSubmit} style={{ backgroundColor: 'red', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '5px' }}>Confirm Remove</button>
                  </>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminEquipmentPage;