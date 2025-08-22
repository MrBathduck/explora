import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { User } from 'firebase/auth';
import './UserAuth.css';

interface UserAuthProps {
  user: User | null;
  onSignIn: () => void;
  onSignOut: () => void;
}

const UserAuth: React.FC<UserAuthProps> = ({ user, onSignIn, onSignOut }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (user) {
    return (
      <div className="user-profile" ref={dropdownRef}>
        <button 
          className="user-profile-button"
          onClick={() => setShowDropdown(!showDropdown)}
          aria-expanded={showDropdown}
          aria-haspopup="true"
        >
          <img 
            src={user.photoURL || '/default-avatar.png'} 
            alt={user.displayName || 'User'} 
            className="user-avatar"
          />
          <div className="user-info">
            <span className="user-name">{user.displayName || 'User'}</span>
          </div>
          <span className={`dropdown-arrow ${showDropdown ? 'open' : ''}`}>▼</span>
        </button>

        {showDropdown && (
          <div className="user-dropdown">
            <div className="dropdown-header">
              <div className="dropdown-user-info">
                <img 
                  src={user.photoURL || '/default-avatar.png'} 
                  alt={user.displayName || 'User'} 
                  className="dropdown-avatar"
                />
                <div>
                  <div className="dropdown-name">{user.displayName}</div>
                  <div className="dropdown-email">{user.email}</div>
                </div>
              </div>
            </div>
            
            <div className="dropdown-divider"></div>
            
            <div className="dropdown-menu">
              <Link 
                to="/settings" 
                className="dropdown-item"
                onClick={() => setShowDropdown(false)}
              >
                <span className="dropdown-icon">⚙️</span>
                <span>Settings</span>
              </Link>
              
              <Link 
                to="/dashboard" 
                className="dropdown-item"
                onClick={() => setShowDropdown(false)}
              >
                <span className="dropdown-icon">📊</span>
                <span>Dashboard</span>
              </Link>
              
              <div className="dropdown-divider"></div>
              
              <button 
                className="dropdown-item sign-out-item"
                onClick={() => {
                  onSignOut();
                  setShowDropdown(false);
                }}
              >
                <span className="dropdown-icon">👋</span>
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="auth-container">
      <button className="sign-in-btn" onClick={onSignIn}>
        <span className="google-icon">🔑</span>
        Sign in with Google
      </button>
    </div>
  );
};

export default UserAuth;