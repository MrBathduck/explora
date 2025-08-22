import React, { useState } from 'react'
import { type User } from 'firebase/auth'
import { 
  type PrivacySettings, 
  type AppPreferences,
  DEFAULT_PRIVACY_SETTINGS,
  DEFAULT_APP_PREFERENCES
} from '../../types/UserProfile'
import './OnboardingPrivacy.css'

interface OnboardingPrivacyProps {
  onComplete: (privacy: PrivacySettings, preferences: AppPreferences, shouldSignIn: boolean) => void
  onBack: () => void
  user: User | null
  onSignIn: () => void
  initialPrivacy?: PrivacySettings
  initialPreferences?: AppPreferences
}

const OnboardingPrivacy: React.FC<OnboardingPrivacyProps> = ({ 
  onComplete, 
  onBack, 
  user,
  onSignIn,
  initialPrivacy = DEFAULT_PRIVACY_SETTINGS,
  initialPreferences = DEFAULT_APP_PREFERENCES
}) => {
  const [privacy, setPrivacy] = useState<PrivacySettings>(initialPrivacy)
  const [preferences, setPreferences] = useState<AppPreferences>(initialPreferences)
  const [wantsToSignIn, setWantsToSignIn] = useState(!!user)

  const handleComplete = () => {
    onComplete(privacy, preferences, wantsToSignIn && !user)
  }

  const updatePrivacy = (field: keyof PrivacySettings, value: any) => {
    setPrivacy(prev => ({ ...prev, [field]: value }))
  }

  const updatePreferences = (field: keyof AppPreferences, value: any) => {
    setPreferences(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="onboarding-privacy">
      <div className="privacy-content">
        <div className="privacy-header">
          <h2 className="privacy-title">Your data, your control</h2>
          <p className="privacy-subtitle">
            Choose how your data is handled and enable features that work for you.
          </p>
        </div>

        <div className="privacy-sections">
          {/* Sign In Section */}
          {!user && (
            <div className="privacy-section sync-section">
              <h3 className="section-title">
                <span className="section-icon">☁️</span>
                Sync across devices (recommended)
              </h3>
              <div className="sync-benefits">
                <div className="sync-option">
                  <div className="sync-card" data-selected={wantsToSignIn}>
                    <div className="sync-content">
                      <h4>Sign in with Google</h4>
                      <ul className="sync-benefits-list">
                        <li>✓ Save favorites across all devices</li>
                        <li>✓ Keep your trip plans synchronized</li>
                        <li>✓ Backup your preferences safely</li>
                        <li>✓ Pick up where you left off anywhere</li>
                      </ul>
                      <button 
                        className={`sync-button ${wantsToSignIn ? 'selected' : ''}`}
                        onClick={() => setWantsToSignIn(true)}
                      >
                        <span className="google-icon">🔑</span>
                        {wantsToSignIn ? 'Will sign in after setup' : 'Sign in with Google'}
                      </button>
                    </div>
                  </div>
                  
                  <div className="sync-skip">
                    <button 
                      className="skip-sync-button"
                      onClick={() => setWantsToSignIn(false)}
                    >
                      Skip for now - use locally only
                    </button>
                    <p className="skip-note">
                      You can sign in later from settings. Data will stay on this device only.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Already signed in */}
          {user && (
            <div className="privacy-section">
              <div className="signed-in-status">
                <div className="user-info">
                  <img 
                    src={user.photoURL || '/default-avatar.png'} 
                    alt={user.displayName || 'User'} 
                    className="user-avatar"
                  />
                  <div>
                    <h4>Signed in as {user.displayName}</h4>
                    <p>Your preferences will be synced across devices</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* App Preferences */}
          <div className="privacy-section">
            <h3 className="section-title">
              <span className="section-icon">⚙️</span>
              App preferences
            </h3>
            <div className="preference-options">
              <label className="preference-option">
                <input
                  type="checkbox"
                  checked={preferences.dataSync}
                  onChange={(e) => updatePreferences('dataSync', e.target.checked)}
                  disabled={!user && !wantsToSignIn}
                />
                <div className="preference-content">
                  <div className="preference-text">
                    <div className="preference-label">Sync data across devices</div>
                    <div className="preference-description">
                      Keep favorites and trips synchronized
                      {!user && !wantsToSignIn && ' (requires sign in)'}
                    </div>
                  </div>
                </div>
              </label>

              <label className="preference-option">
                <input
                  type="checkbox"
                  checked={preferences.notifications}
                  onChange={(e) => updatePreferences('notifications', e.target.checked)}
                />
                <div className="preference-content">
                  <div className="preference-text">
                    <div className="preference-label">Helpful notifications</div>
                    <div className="preference-description">
                      Get notified about new features and travel tips
                    </div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="privacy-section">
            <h3 className="section-title">
              <span className="section-icon">🔒</span>
              Privacy settings
            </h3>
            <div className="privacy-options">
              <label className="privacy-option">
                <input
                  type="checkbox"
                  checked={privacy.analyticsConsent}
                  onChange={(e) => updatePrivacy('analyticsConsent', e.target.checked)}
                />
                <div className="privacy-content">
                  <div className="privacy-text">
                    <div className="privacy-label">Anonymous analytics</div>
                    <div className="privacy-description">
                      Help improve Explora by sharing anonymous usage patterns
                    </div>
                  </div>
                </div>
              </label>

              <div className="privacy-option-group">
                <div className="privacy-group-title">Data retention</div>
                <div className="radio-options">
                  {[
                    { value: 'session', label: 'This session only', description: 'Delete when I close the app' },
                    { value: '1year', label: '1 year', description: 'Keep for 1 year then delete' },
                    { value: 'indefinite', label: 'Keep indefinitely', description: 'Store until I delete my account' }
                  ].map(option => (
                    <label key={option.value} className="radio-option">
                      <input
                        type="radio"
                        name="dataRetention"
                        value={option.value}
                        checked={privacy.dataRetention === option.value}
                        onChange={(e) => updatePrivacy('dataRetention', e.target.value)}
                      />
                      <div className="radio-content">
                        <div className="radio-label">{option.label}</div>
                        <div className="radio-description">{option.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Privacy Promise */}
          <div className="privacy-promise">
            <div className="promise-content">
              <h4>Our privacy promise</h4>
              <ul>
                <li>🔒 Your location data stays on your device</li>
                <li>🚫 We never sell your personal information</li>
                <li>📱 You control what data is shared and stored</li>
                <li>🗑️ You can delete your account and data anytime</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="privacy-actions">
          <button 
            className="back-button"
            onClick={onBack}
          >
            ← Back
          </button>
          
          <button 
            className="complete-button"
            onClick={handleComplete}
          >
            {wantsToSignIn && !user ? 'Sign In & Start Exploring' : 'Start Exploring'} 🎉
          </button>
        </div>

        <div className="privacy-note">
          <p>You can change these settings anytime in your account preferences</p>
        </div>
      </div>
    </div>
  )
}

export default OnboardingPrivacy