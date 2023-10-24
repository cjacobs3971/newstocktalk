// src/pages/LandingPage/index.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';
import landingImage from '../../assets/landing-bg2.png';

function LandingPage() {
    const navigate = useNavigate();

  const handleStartClick = () => {
    navigate('/login-register');
  };

  return (
    <div className="landingPage" style={{ backgroundImage: `url(${landingImage})` }}>
      <div className="title">
        <h1>Stock Talk</h1>
      </div>
      <button className="startButton" onClick={handleStartClick}>
        START
      </button>
    </div>
  );
}

export default LandingPage;

