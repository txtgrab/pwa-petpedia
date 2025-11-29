import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../App.css'; 

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active-link' : '';

  return (
    <nav className="desktop-nav">
      <div className="nav-brand">
        <h1>🐶 PetPedia</h1>
      </div>
      <div className="nav-links">
        <Link to="/" className={isActive('/')}>Home</Link>
        <Link to="/tips" className={isActive('/tips')}>Tips</Link>
        <Link to="/about" className={isActive('/about')}>Profile</Link>
      </div>
    </nav>
  );
};

export default Navbar;