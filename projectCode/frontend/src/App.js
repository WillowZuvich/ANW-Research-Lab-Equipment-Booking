// This file handles navigation (Navbar, Footer) and Public Pages
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './ClassComponents/Navbar';
import Footer from './ClassComponents/Footer';
import Contact from './NavBarFunctions/Contact';
import About from './NavBarFunctions/About';
import Login from './NavBarFunctions/Login';
import Register from './NavBarFunctions/Register';
import HeroSection from './ClassComponents/HeroSection';
import StudentPage from './UserPages/StudentPage';
import AdminPage from './UserPages/AdminPage';
import ResearcherPage from './UserPages/ResearcherPage';
import ProtectedRoute from './ProtectedRoute';  
import EquipmentPage from './Equipments/EquipmentPage';
import AddEquipment from './Equipments/AddEquipment';
import RemoveEquipment from './Equipments/RemoveEquipment';
import EditEquipment from './Equipments/EditEquipment';
import AddSupplier from './Suppliers/AddSupplier';
import AddSpecifications from './Specifications/AddSpecifications';
import EquipmentDetails from './Equipments/EquipmentDetails'; 
import Logout from './NavBarFunctions/Logout';
import AdminLayout from './Admin/AdminLayout';
import AdminDashboard from './Admin/AdminDashboard';
import AdminBookingPage from './Admin/AdminBookingPage';
import AdminEquipmentPage from './Admin/AdminEquipmentPage';
import AdminSpecificationPage from './Admin/AdminSpecificationPage';
import AdminSupplierPage from './Admin/AdminSupplierPage';
import AdminNavBar from './Admin/AdminNavBar';
import AdminSidebar from './Admin/AdminSidebar';
import axios from 'axios';
import './App.css';

const AppContent = () => {
  const location = useLocation();
  const [user, setUser] = useState({ firstName: '', lastName: '' });

  useEffect(() => {
    const fetchUserData = async () => {
      const apiUrl = process.env.REACT_APP_API_URL;
      const role = localStorage.getItem('role');
      const userId = localStorage.getItem('userId');

      if (!role || !userId) return;

      try {
        const res = await axios.get(`${apiUrl}/api/user`, {
          params: { role, userId },
        });

        const data = res.data;
        setUser({ firstName: data.firstName, lastName: data.lastName });
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };

    fetchUserData();
  }, []);

  //const isAdminPage = location.pathname === '/admin' || location.pathname.startsWith('/admin');

  return (
    <div className="App">

      {/* {isAdminPage ? (
        <>
          <AdminNavBar role="ADMIN" firstName={user.firstName} lastInitial={user.lastName.charAt(0)} />
          <AdminSidebar />
        </>
      ) 
      : (
        <>
          <Navbar />
          <Footer />
        </>

      )}    */}

      <>
        <Navbar />
        <Footer />
      </>  


      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HeroSection />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Protected Routes (Only accessible after login) */}
        <Route path="/student" element={<ProtectedRoute allowedRoles={["student"]}><StudentPage /></ProtectedRoute>} />

        {/* <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminPage /></ProtectedRoute>} />
        <Route path="/addequipment" element={<ProtectedRoute allowedRoles={["admin"]}><AddEquipment /></ProtectedRoute>} />
        <Route path="/removeequipment" element={<ProtectedRoute allowedRoles={["admin"]}><RemoveEquipment /></ProtectedRoute>} />
        <Route path="/editequipment" element={<ProtectedRoute allowedRoles={["admin"]}><EditEquipment /></ProtectedRoute>} />
        <Route path="/addsupplier" element={<ProtectedRoute allowedRoles={["admin"]}><AddSupplier /></ProtectedRoute>} />
        <Route path="/addspecifications" element={<ProtectedRoute allowedRoles={["admin"]}><AddSpecifications /></ProtectedRoute>} /> */}


        <Route path="/removeequipment" element={<ProtectedRoute allowedRoles={["admin"]}><RemoveEquipment /></ProtectedRoute>} />
        <Route path="/editequipment" element={<ProtectedRoute allowedRoles={["admin"]}><EditEquipment /></ProtectedRoute>} />


        {/* === Admin Routes (each one inside AdminLayout) === */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><AdminDashboard  /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/bookings" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><AdminBookingPage /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/equipments" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><AdminEquipmentPage /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/specifications" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><AdminSpecificationPage /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/suppliers" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><AdminSupplierPage /></AdminLayout></ProtectedRoute>} />
        <Route path="/logout" element={<Logout />} />

        <Route path="/researcher" element={<ProtectedRoute allowedRoles={["researcher"]}><ResearcherPage /></ProtectedRoute>} />
        <Route path="/equipment" element={<ProtectedRoute><EquipmentPage /></ProtectedRoute>} />
        <Route path="/equipment/:equipId" element={<ProtectedRoute><EquipmentDetails /></ProtectedRoute>} />
        
      </Routes>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}