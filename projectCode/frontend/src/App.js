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
import StudentPage from './NavBarFunctions/StudentPage';
import AdminPage from './NavBarFunctions/AdminPage';
import ResearcherPage from './NavBarFunctions/ResearcherPage';
import ProtectedRoute from './ProtectedRoute';  
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
        <Route path="/researcher" element={<ProtectedRoute allowedRoles={["researcher"]}><ResearcherPage /></ProtectedRoute>} />

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