import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminSpecificationPage = () => {
  const [equipmentList, setEquipmentList] = useState([]);
  const [selectedEquipId, setSelectedEquipId] = useState('');
  const [newSpec, setNewSpec] = useState('');
  const [notification, setNotification] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const res = await axios.get(`${apiUrl}/api/equipment`);
      setEquipmentList(res.data);
    } catch (err) {
      console.error('Error fetching equipment:', err);
    }
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 7000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEquipId || !newSpec.trim()) {
      alert('Please fill in both fields.');
      return;
    }

    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      await axios.post(`${apiUrl}/api/addspecifications`, {
        equipId: selectedEquipId,
        input: newSpec.trim(),
      });
      showNotification('Specification added!');
      setNewSpec('');
      setSelectedEquipId('');
      setShowModal(false);
      fetchEquipment(); // Refresh
    } catch (err) {
      alert('Error adding specification.');
      console.error(err);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex' }}>
        <div style={{ padding: '2rem', width: '100%', paddingLeft: '100px', paddingTop: '50px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>Specifications</h2>
            <button
              style={{ backgroundColor: 'pink', color: 'black', border: 'none', padding: '0.5rem 1rem', borderRadius: '5px', cursor: 'pointer' }}
              onClick={() => setShowModal(true)}
            >
              Add Specification
            </button>
          </div>

          {notification && (
            <p style={{ color: 'green', marginTop: '1rem', marginBottom: '1rem' }}>{notification}</p>
          )}

          {/* Equipment Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', marginTop: '1rem' }}>
            <thead style={{ backgroundColor: '#f5f5f5', textAlign: 'left' }}>
              <tr>
                <th style={{ padding: '10px' }}>Name</th>
                <th style={{ padding: '10px' }}>Condition</th>
                <th style={{ padding: '10px' }}>Specifications</th>
              </tr>
            </thead>
            <tbody>
              {equipmentList.map((eq) => (
                <tr key={eq.EquipID}>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{eq.Name}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{eq.Condition}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{eq.Specifications?.join(', ') || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Modal */}
          {showModal && (
            <div style={{
              position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
              backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', zIndex: 1000
            }}>
              <div style={{
                background: 'white', padding: '2rem', borderRadius: '8px',
                width: '400px', height: 'auto', position: 'relative'
              }}>
                <button
                  onClick={() => setShowModal(false)}
                  style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '1.2rem', border: 'none', background: 'none', cursor: 'pointer' }}
                >×</button>
                <h3>Add New Specification</h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <select
                    value={selectedEquipId}
                    onChange={(e) => setSelectedEquipId(e.target.value)}
                    style={{ padding: '0.5rem', backgroundColor: 'pink', color: 'black', border: '1px solid #ccc', borderRadius: '5px' }}
                    required
                  >
                    <option value="">Select Equipment</option>
                    {equipmentList.map((eq) => (
                      <option key={eq.EquipID} value={eq.EquipID}>{eq.Name}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Enter new specification"
                    value={newSpec}
                    onChange={(e) => setNewSpec(e.target.value)}
                    style={{ padding: '0.5rem', backgroundColor: 'pink', color: 'black', border: '1px solid #ccc', borderRadius: '5px' }}
                    required
                  />
                  <button
                    type="submit"
                    style={{ backgroundColor: '#3498db', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '5px', cursor: 'pointer' }}
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSpecificationPage;