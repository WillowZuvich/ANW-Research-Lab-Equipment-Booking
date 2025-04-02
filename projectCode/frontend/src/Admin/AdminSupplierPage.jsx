import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminSupplierPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', phoneNumber: '' });
  const [showModal, setShowModal] = useState(false);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 7000);
  };

  const fetchSuppliers = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const res = await axios.get(`${apiUrl}/api/suppliers`);
      setSuppliers(res.data);
    } catch (err) {
      console.error('Error fetching suppliers:', err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      await axios.post(`${apiUrl}/api/addsupplier`, {
        name: form.name.toLowerCase().trim(),
        email: form.email.trim(),
        phoneNumber: form.phoneNumber.trim(),
      });
      showNotification('Supplier added!');
      setForm({ name: '', email: '', phoneNumber: '' });
      setShowModal(false);
      fetchSuppliers();
    } catch (err) {
      alert(err.response?.data?.detail || 'Error adding supplier');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex' }}>
        <div style={{ padding: '2rem', width: '100%', paddingLeft: '100px', paddingTop: '50px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>Suppliers</h2>
            {notification && <p style={{ color: 'green', marginTop: '1rem', marginBottom: '1rem' }}>{notification}</p>}
            <button
              style={{ backgroundColor: 'pink', color: 'black', border: 'none', padding: '0.5rem 1rem', borderRadius: '5px', cursor: 'pointer' }}
              onClick={() => setShowModal(true)}
            >
              Add New Supplier
            </button>
          </div>

          {/* Supplier Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', marginTop: '1rem' }}>
            <thead style={{ backgroundColor: '#f5f5f5', textAlign: 'left' }}>
              <tr>
                <th style={{ padding: '10px' }}>Name</th>
                <th style={{ padding: '10px' }}>Email</th>
                <th style={{ padding: '10px' }}>Phone Number</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((s, i) => (
                <tr key={i}>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{s.name}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{s.email}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{s.phoneNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Modal */}
          {showModal && (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
              <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', width: '400px', height: 'auto', position: 'relative' }}>

             
                <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '1.2rem', border: 'none', background: 'none', cursor: 'pointer' }}>×</button>
                <h3>Add New Supplier</h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} style={{ backgroundColor: 'pink', color: 'black' }} required />
                  <input type="text" name="email" placeholder="Email" value={form.email} onChange={handleChange} style={{ backgroundColor: 'pink', color: 'black' }} required />

                  {/*The line below doe snot work */}
                  {/* <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} style={{ backgroundColor: 'pink', color: 'black' }} required /> */}
                  <input type="text" name="phoneNumber" placeholder="Phone Number" value={form.phoneNumber} onChange={handleChange} style={{ backgroundColor: 'pink', color: 'black' }} required />

                  <button type="submit" style={{ backgroundColor: '#3498db', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '5px' }}>Submit</button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSupplierPage;