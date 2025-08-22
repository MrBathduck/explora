import { Link } from 'react-router-dom'
import './Footer.css'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <span className="footer-logo-icon">🧭</span>
              <span className="footer-logo-text">Explora</span>
            </div>
            <p className="footer-description">
              Your smart city guide that learns your style while respecting your privacy.
            </p>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-title">Explore</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/about">About</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-title">Features</h4>
            <ul className="footer-links">
              <li><span>Interactive Maps</span></li>
              <li><span>Personal Favorites</span></li>
              <li><span>Smart Categories</span></li>
              <li><span>Offline Support</span></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-title">Technology</h4>
            <ul className="footer-links">
              <li><span>React & TypeScript</span></li>
              <li><span>OpenStreetMap</span></li>
              <li><span>Firebase</span></li>
              <li><span>Progressive Web App</span></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="footer-copyright">
              © {currentYear} Explora. Built with ❤️ for travelers.
            </p>
            <div className="footer-meta">
              <span className="footer-version">v1.0.0</span>
              <span className="footer-location">🗺️ Vienna, Austria</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer