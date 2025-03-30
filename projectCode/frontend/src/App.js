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

import './App.css';

const AppContent = () => {
  return (
    <div className="App">
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
        <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminPage /></ProtectedRoute>} />
        <Route path="/addequipment" element={<ProtectedRoute allowedRoles={["admin"]}><AddEquipment /></ProtectedRoute>} />
        <Route path="/removeequipment" element={<ProtectedRoute allowedRoles={["admin"]}><RemoveEquipment /></ProtectedRoute>} />
        <Route path="/editequipment" element={<ProtectedRoute allowedRoles={["admin"]}><EditEquipment /></ProtectedRoute>} />
        <Route path="/addsupplier" element={<ProtectedRoute allowedRoles={["admin"]}><AddSupplier /></ProtectedRoute>} />
        <Route path="/addspecifications" element={<ProtectedRoute allowedRoles={["admin"]}><AddSpecifications /></ProtectedRoute>} />
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