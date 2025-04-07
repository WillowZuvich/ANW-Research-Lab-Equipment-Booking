// This file handles navigation (Navbar, Footer) and Public Pages
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './ClassComponents/Navbar';
import Footer from './ClassComponents/Footer';
import Contact from './NavBarFunctions/Contact';
import About from './NavBarFunctions/About';
import Login from './NavBarFunctions/Login';
import Register from './NavBarFunctions/Register';
import HeroSection from './ClassComponents/HeroSection';
import ProtectedRoute from './ProtectedRoute';  
import Logout from './NavBarFunctions/Logout';
import AdminLayout from './Admin/AdminLayout';
import AdminDashboard from './Admin/AdminDashboard';
import AdminBookingPage from './Admin/AdminBookingPage';
import AdminEquipmentPage from './Admin/AdminEquipmentPage';
import AdminSpecificationPage from './Admin/AdminSpecificationPage';
import AdminSupplierPage from './Admin/AdminSupplierPage';
import StudentBookingPage from './Student/StudentBookingPage';
import StudentEquipmentPage from './Student/StudentEquipmentPage';
import StudentLayout from './Student/StudentLayout';
import ResearcherBookingPage from './Researcher/ResearcherBookingPage';
import ResearcherLayout from './Researcher/ResearcherLayout';
import ResearcherEquipmentPage from './Researcher/ResearcherEquipmentPage';
import './App.css';

const AppContent = () => {

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

        {/* === Admin Routes (each one inside AdminLayout) === */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><AdminDashboard  /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/bookings" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><AdminBookingPage /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/equipments" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><AdminEquipmentPage /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/specifications" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><AdminSpecificationPage /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/suppliers" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><AdminSupplierPage /></AdminLayout></ProtectedRoute>} />
        {/* === Student Routes (each one inside StudentLayout) === */}
        <Route path="/student" element={<ProtectedRoute allowedRoles={['student']}><StudentLayout><AdminDashboard  /></StudentLayout></ProtectedRoute>} />
        <Route path="/student/bookings" element={<ProtectedRoute allowedRoles={['student']}><StudentLayout><StudentBookingPage /></StudentLayout></ProtectedRoute>} />
        <Route path="/student/equipments" element={<ProtectedRoute allowedRoles={['student']}><StudentLayout><StudentEquipmentPage /></StudentLayout></ProtectedRoute>} />
         {/* === Researcher Routes (each one inside ResearcherLayout) === */}
        <Route path="/researcher" element={<ProtectedRoute allowedRoles={['researcher']}><ResearcherLayout><AdminDashboard  /></ResearcherLayout></ProtectedRoute>} />
        <Route path="/researcher/bookings" element={<ProtectedRoute allowedRoles={['researcher']}><ResearcherLayout><ResearcherBookingPage /></ResearcherLayout></ProtectedRoute>} />
        <Route path="/researcher/equipments" element={<ProtectedRoute allowedRoles={['researcher']}><ResearcherLayout><ResearcherEquipmentPage /></ResearcherLayout></ProtectedRoute>} />
         {/* Every user uses that logout */}
        <Route path="/logout" element={<Logout />} />
        
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