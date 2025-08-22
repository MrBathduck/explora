import React from 'react'
import { type UserProfile } from '../../types/UserProfile'

interface SupportInfoProps {
  profile: UserProfile | null
}

const SupportInfo: React.FC<SupportInfoProps> = ({ profile }) => {
  return (
    <div className="support-info">
      <div className="section-header">
        <h2>Support & Information</h2>
        <p>Get help, learn about the app, and contact support</p>
      </div>

      <div className="settings-section">
        <h3>App Information</h3>
        <div className="info-grid">
          <div className="info-item">
            <label>Version</label>
            <div className="info-value">{profile?.appVersion || '1.0.0'}</div>
          </div>
          <div className="info-item">
            <label>Account Created</label>
            <div className="info-value">
              {profile?.createdAt ? new Date(profile.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
            </div>
          </div>
          <div className="info-item">
            <label>Last Updated</label>
            <div className="info-value">
              {profile?.lastUpdated ? new Date(profile.lastUpdated.seconds * 1000).toLocaleDateString() : 'N/A'}
            </div>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3>Help & Support</h3>
        <div className="support-links">
          <a href="#" className="support-link">
            <span className="link-icon">📚</span>
            <div className="link-content">
              <div className="link-title">User Guide</div>
              <div className="link-description">Learn how to use Explora</div>
            </div>
          </a>
          
          <a href="#" className="support-link">
            <span className="link-icon">❓</span>
            <div className="link-content">
              <div className="link-title">FAQ</div>
              <div className="link-description">Frequently asked questions</div>
            </div>
          </a>
          
          <a href="#" className="support-link">
            <span className="link-icon">💬</span>
            <div className="link-content">
              <div className="link-title">Contact Support</div>
              <div className="link-description">Get help from our team</div>
            </div>
          </a>
          
          <a href="#" className="support-link">
            <span className="link-icon">🐛</span>
            <div className="link-content">
              <div className="link-title">Report a Bug</div>
              <div className="link-description">Help us improve the app</div>
            </div>
          </a>
        </div>
      </div>

      <div className="settings-section">
        <h3>Legal & Privacy</h3>
        <div className="legal-links">
          <a href="#" className="legal-link">Privacy Policy</a>
          <a href="#" className="legal-link">Terms of Service</a>
          <a href="#" className="legal-link">Licenses</a>
        </div>
      </div>

      <div className="settings-section">
        <h3>About Explora</h3>
        <div className="about-content">
          <p>
            Explora is your smart city guide that learns your style while respecting your privacy. 
            We help you discover amazing places that match your mood and preferences.
          </p>
          <div className="about-stats">
            <div className="stat-item">
              <div className="stat-number">8</div>
              <div className="stat-label">Vienna Locations</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">6</div>
              <div className="stat-label">Travel Moods</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">1</div>
              <div className="stat-label">City Available</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SupportInfo