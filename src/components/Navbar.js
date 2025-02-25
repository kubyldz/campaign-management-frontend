import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <button className="menu-toggle" onClick={toggleMenu}>
        <i className="fas fa-bars"></i>
      </button>
      <div className={`nav-left ${isMenuOpen ? 'active' : ''}`}>
        <Link to="/campaigns" className="nav-link" onClick={() => setIsMenuOpen(false)}>
          <i className="fas fa-bullhorn"></i>
          Kampanyalar
        </Link>
        <Link to="/scheduled-tasks" className="nav-link" onClick={() => setIsMenuOpen(false)}>
          <i className="fas fa-clock"></i>
          Zamanlı İşlemler
        </Link>
      </div>
      <div className="nav-right">
        <button onClick={handleLogout} className="logout-button">
          <i className="fas fa-sign-out-alt"></i>
          Çıkış
        </button>
      </div>
    </nav>
  );
};

export default Navbar; 