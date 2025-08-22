import React, { useState } from 'react'
import { type UserProfile } from '../../types/UserProfile'

interface AppPreferencesProps {
  profile: UserProfile
  onUpdate: (updates: Partial<UserProfile>) => void
  isSaving: boolean
}

// Helper functions for date/time formatting
const formatDate = (date: Date, format: string): string => {
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()

  switch (format) {
    case 'DD/MM/YYYY':
      return `${day}/${month}/${year}`
    case 'MM/DD/YYYY':
      return `${month}/${day}/${year}`
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`
    default:
      return `${day}/${month}/${year}`
  }
}

const formatTime = (date: Date, format: string): string => {
  if (format === '12h') {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
  } else {
    return date.toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    })
  }
}

const AppPreferences: React.FC<AppPreferencesProps> = ({ profile, onUpdate, isSaving }) => {
  const [preferences, setPreferences] = useState(profile.preferences)
  const [hasChanges, setHasChanges] = useState(false)

  const updatePreference = (field: keyof typeof preferences, value: any) => {
    const newPreferences = { ...preferences, [field]: value }
    setPreferences(newPreferences)
    setHasChanges(true)
  }

  const handleSave = () => {
    onUpdate({ preferences })
    setHasChanges(false)
  }

  const handleReset = () => {
    setPreferences(profile.preferences)
    setHasChanges(false)
  }

  return (
    <div className="app-preferences">
      <div className="section-header">
        <h2>App Preferences</h2>
        <p>Customize how the app looks and behaves</p>
      </div>

      <div className="settings-section">
        <h3>Display Settings</h3>
        
        <div className="preference-item">
          <label htmlFor="defaultView">Default Map View</label>
          <select
            id="defaultView"
            value={preferences.defaultMapView}
            onChange={(e) => updatePreference('defaultMapView', e.target.value)}
          >
            <option value="list">List View</option>
            <option value="map">Map View</option>
            <option value="split">Split View</option>
          </select>
        </div>

        <div className="preference-item">
          <label htmlFor="language">Language</label>
          <select
            id="language"
            value={preferences.language}
            onChange={(e) => updatePreference('language', e.target.value)}
          >
            <option value="en">English</option>
            <option value="de">Deutsch</option>
            <option value="pt">Português</option>
          </select>
        </div>
      </div>

      <div className="settings-section">
        <h3>Date & Time Format</h3>
        
        <div className="preference-grid">
          <div className="preference-item">
            <label htmlFor="dateFormat">Date Format</label>
            <select
              id="dateFormat"
              value={preferences.dateFormat}
              onChange={(e) => updatePreference('dateFormat', e.target.value)}
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY (European)</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY (US)</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
            </select>
            <div className="preference-description">
              Example: {formatDate(new Date(), preferences.dateFormat)}
            </div>
          </div>

          <div className="preference-item">
            <label htmlFor="timeFormat">Time Format</label>
            <select
              id="timeFormat"
              value={preferences.timeFormat}
              onChange={(e) => updatePreference('timeFormat', e.target.value)}
            >
              <option value="24h">24-hour (14:30)</option>
              <option value="12h">12-hour (2:30 PM)</option>
            </select>
            <div className="preference-description">
              Example: {formatTime(new Date(), preferences.timeFormat)}
            </div>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3>Notifications & Sync</h3>
        
        <div className="checkbox-list">
          <label className="checkbox-item">
            <input
              type="checkbox"
              checked={preferences.notifications}
              onChange={(e) => updatePreference('notifications', e.target.checked)}
            />
            <div className="checkbox-content">
              <span className="checkbox-icon">🔔</span>
              <div className="checkbox-text">
                <div className="checkbox-label">Notifications</div>
                <div className="checkbox-description">Get notified about new features and tips</div>
              </div>
            </div>
          </label>

          <label className="checkbox-item">
            <input
              type="checkbox"
              checked={preferences.dataSync}
              onChange={(e) => updatePreference('dataSync', e.target.checked)}
            />
            <div className="checkbox-content">
              <span className="checkbox-icon">☁️</span>
              <div className="checkbox-text">
                <div className="checkbox-label">Data Sync</div>
                <div className="checkbox-description">Sync favorites and trips across devices</div>
              </div>
            </div>
          </label>
        </div>
      </div>

      {hasChanges && (
        <div className="settings-actions">
          <button 
            className="reset-button"
            onClick={handleReset}
            disabled={isSaving}
          >
            Reset
          </button>
          <button 
            className="save-button"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}
    </div>
  )
}

export default AppPreferences