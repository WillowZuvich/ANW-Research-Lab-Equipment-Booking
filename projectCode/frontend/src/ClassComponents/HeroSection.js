import React from 'react';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero">
      {/* Left Side: Text and Get Started Box */}
      <div className="hero-text">
        <h1>Research Lab Equipment Booking</h1>
        <h3>
          Organize and manage all your equipment in one system 
          to optimize time management and increase result accuracy.
        </h3>
        <div className="getstartedsquare">
          <h3>Get Started</h3>
          <a href="/register">
            <button className="signup-button">Sign Up</button>
          </a>
          <a href="/login">
            <button className="login-button">Log In</button>
          </a>
        </div>
      </div>

      {/* Right Side: Image */}
      <div className="hero-image">
        <img src="/frontpage.png" alt="Researcher at Work" />
      </div>
    </section>
  );
};

export default HeroSection;
