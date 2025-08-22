import { Link, useLocation } from 'react-router-dom'
import type { User } from 'firebase/auth'
import UserAuth from '../auth/UserAuth'
import './Navigation.css'

interface NavigationProps {
  user: User | null
  onSignIn: () => void
  onSignOut: () => void
}

const Navigation: React.FC<NavigationProps> = ({ user, onSignIn, onSignOut }) => {
  const location = useLocation()
  
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true
    if (path !== '/' && location.pathname.startsWith(path)) return true
    return false
  }

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <span className="logo-icon">🧭</span>
          <span className="logo-text">Explora</span>
        </Link>
        
        <div className="nav-links">
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            <span className="nav-icon">🏠</span>
            <span className="nav-text">Home</span>
          </Link>
          
          <Link 
            to="/trips" 
            className={`nav-link ${isActive('/trips') ? 'active' : ''}`}
          >
            <span className="nav-icon">🗺️</span>
            <span className="nav-text">Trips</span>
          </Link>
          
          
          <Link 
            to="/dashboard" 
            className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-text">Dashboard</span>
          </Link>
          
          <Link 
            to="/about" 
            className={`nav-link ${isActive('/about') ? 'active' : ''}`}
          >
            <span className="nav-icon">ℹ️</span>
            <span className="nav-text">About</span>
          </Link>
          
          {user && (
            <Link 
              to="/admin" 
              className={`nav-link ${isActive('/admin') ? 'active' : ''}`}
            >
              <span className="nav-icon">🛠️</span>
              <span className="nav-text">Admin</span>
            </Link>
          )}
        </div>
        
        <div className="nav-auth">
          <UserAuth 
            user={user} 
            onSignIn={onSignIn} 
            onSignOut={onSignOut} 
          />
        </div>
      </div>
    </nav>
  )
}

export default Navigation