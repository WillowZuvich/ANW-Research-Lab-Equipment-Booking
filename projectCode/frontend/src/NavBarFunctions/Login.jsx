// Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); 

  localStorage.clear(); 
  //  Use a default API URL if process.env.REACT_APP_API_URL is undefined
  const apiUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${apiUrl}/api/login`, {  
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        localStorage.setItem('userId', data.userId)

        // Redirect users based on their role
        if (data.role === 'admin') {
          navigate('/admin');
        } else if (data.role === 'researcher') {
          navigate('/researcher'); // Fixed from 'volunteer-dashboard'
        } else if (data.role === 'student') {
          navigate('/student');
        }
         else{
          alert("Path not found...") }
         }
        else {
        // Show error message properly
        alert(data.detail || 'Invalid login credentials.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="wrapper-login">
      <form className="form-login" onSubmit={handleSubmit}>
        <div className="field-login">
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            required/>
          <label>Email Address</label>
        </div>
        <div className="field-login">
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
            required/>
          <label>Password</label>
        </div>
        <div className="field-login">
          <input type="submit" value="Login" className="auth-btn-login" />
        </div>
        <p className="p-login">
          Not a member? <Link to="/register">Signup now</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;

