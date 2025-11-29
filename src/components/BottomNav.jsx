import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaBook, FaUser } from 'react-icons/fa';
import '../App.css';

const BottomNav = () => {
  const location = useLocation();

  const getStyle = (path) => {
    return location.pathname === path ? { color: '#4CAF50' } : { color: '#888' };
  };

  return (
    <nav className="bottom-nav">
      <Link to="/" className="nav-item" style={getStyle('/')}>
        <FaHome size={20} />
        <span>Home</span>
      </Link>
      
      <Link to="/tips" className="nav-item" style={getStyle('/tips')}>
        <FaBook size={20} />
        <span>Tips</span>
      </Link>
      
      <Link to="/about" className="nav-item" style={getStyle('/about')}>
        <FaUser size={20} />
        <span>Profile</span>
      </Link>
    </nav>
  );
};

export default BottomNav;