import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginModal from './LoginModal';
import './Navbar.css';

const Navbar = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleAuthClick = () => {
    if (isAuthenticated) {
      logout();
      navigate('/');
    } else {
      setIsLoginModalOpen(true);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          React App
        </Link>
        <div className="navbar-right">
          <ul className="navbar-menu">
            <li className="navbar-item">
              <Link to="/" className="navbar-link">
                Home
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/carousel" className="navbar-link">
                Carousel
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/list" className="navbar-link">
                List
              </Link>
            </li>
            {isAuthenticated && (
              <li className="navbar-item">
                <Link to="/my-uploads" className="navbar-link">
                  My Uploads
                </Link>
              </li>
            )}
          </ul>
          <div className="auth-section">
            {isAuthenticated && (
              <span className="user-greeting">
                {user.photo && (
                  <img 
                    src={user.photo} 
                    alt={user.displayName || user.firstName} 
                    className="user-avatar"
                  />
                )}
                Welcome, {user.displayName || user.firstName}!
              </span>
            )}
            <button className="auth-button" onClick={handleAuthClick}>
              {isAuthenticated ? 'Sign Out' : 'Sign In / Sign Up'}
            </button>
          </div>
        </div>
      </div>
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </nav>
  );
};

export default Navbar;
