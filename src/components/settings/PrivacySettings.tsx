import React, { useState } from 'react'
import { type User } from 'firebase/auth'
import { type UserProfile } from '../../types/UserProfile'
import { deleteUserProfile, exportUserData } from '../../services/userProfile'

interface PrivacySettingsProps {
  profile: UserProfile
  user: User
  onUpdate: (updates: Partial<UserProfile>) => void
  isSaving: boolean
}

const PrivacySettings: React.FC<PrivacySettingsProps> = ({ profile, user, onUpdate, isSaving }) => {
  const [privacy, setPrivacy] = useState(profile.privacy)
  const [hasChanges, setHasChanges] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const updatePrivacy = (field: keyof typeof privacy, value: any) => {
    const newPrivacy = { ...privacy, [field]: value }
    setPrivacy(newPrivacy)
    setHasChanges(true)
  }

  const handleSave = () => {
    onUpdate({ privacy })
    setHasChanges(false)
  }

  const handleReset = () => {
    setPrivacy(profile.privacy)
    setHasChanges(false)
  }

  const handleExportData = async () => {
    setIsExporting(true)
    try {
      const data = await exportUserData(user.uid)
      if (data) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'explora-user-data.json'
        a.click()
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      alert('Failed to export data. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm('This will permanently delete your account and all data. This cannot be undone. Are you sure?')) {
      return
    }

    setIsDeleting(true)
    try {
      await deleteUserProfile(user.uid)
      alert('Account deleted successfully. You will be signed out.')
      // The parent component should handle sign out
    } catch (error) {
      alert('Failed to delete account. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="privacy-settings">
      <div className="section-header">
        <h2>Privacy & Data</h2>
        <p>Control your privacy settings and manage your data</p>
      </div>

      <div className="settings-section">
        <h3>Privacy Preferences</h3>
        
        <div className="checkbox-list">
          <label className="checkbox-item">
            <input
              type="checkbox"
              checked={privacy.analyticsConsent}
              onChange={(e) => updatePrivacy('analyticsConsent', e.target.checked)}
            />
            <div className="checkbox-content">
              <span className="checkbox-icon">📊</span>
              <div className="checkbox-text">
                <div className="checkbox-label">Anonymous Analytics</div>
                <div className="checkbox-description">Help improve Explora with anonymous usage data</div>
              </div>
            </div>
          </label>

          <label className="checkbox-item">
            <input
              type="checkbox"
              checked={privacy.marketingConsent}
              onChange={(e) => updatePrivacy('marketingConsent', e.target.checked)}
            />
            <div className="checkbox-content">
              <span className="checkbox-icon">📧</span>
              <div className="checkbox-text">
                <div className="checkbox-label">Marketing Communications</div>
                <div className="checkbox-description">Receive updates about new features and cities</div>
              </div>
            </div>
          </label>

          <label className="checkbox-item">
            <input
              type="checkbox"
              checked={privacy.locationConsent}
              onChange={(e) => updatePrivacy('locationConsent', e.target.checked)}
            />
            <div className="checkbox-content">
              <span className="checkbox-icon">📍</span>
              <div className="checkbox-text">
                <div className="checkbox-label">Location-Based Suggestions</div>
                <div className="checkbox-description">Get activity recommendations based on your location</div>
              </div>
            </div>
          </label>
        </div>

        <div className="preference-item">
          <label htmlFor="dataRetention">Data Retention</label>
          <select
            id="dataRetention"
            value={privacy.dataRetention}
            onChange={(e) => updatePrivacy('dataRetention', e.target.value)}
          >
            <option value="session">This session only</option>
            <option value="1year">1 year</option>
            <option value="indefinite">Keep indefinitely</option>
          </select>
        </div>

        {privacy.locationConsent && (
          <div className="preference-item">
            <label htmlFor="locationSharingLevel">Location Precision</label>
            <select
              id="locationSharingLevel"
              value={privacy.locationSharingLevel}
              onChange={(e) => updatePrivacy('locationSharingLevel', e.target.value)}
            >
              <option value="none">No location sharing</option>
              <option value="city">City level only</option>
              <option value="neighborhood">Neighborhood level</option>
              <option value="precise">Precise location</option>
            </select>
            <div className="preference-description">
              Choose how precise location data can be used for suggestions
            </div>
          </div>
        )}
      </div>

      <div className="settings-section">
        <h3>Data Management</h3>
        
        <div className="data-actions">
          <div className="data-action">
            <div className="action-info">
              <h4>Export Your Data</h4>
              <p>Download a copy of all your data stored in Explora</p>
            </div>
            <button 
              className="export-button"
              onClick={handleExportData}
              disabled={isExporting}
            >
              {isExporting ? 'Exporting...' : '📥 Export Data'}
            </button>
          </div>

          <div className="data-action danger">
            <div className="action-info">
              <h4>Delete Account</h4>
              <p>Permanently delete your account and all associated data</p>
            </div>
            <button 
              className="delete-button"
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : '🗑️ Delete Account'}
            </button>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3>Privacy Promise</h3>
        <div className="privacy-promise">
          <ul>
            <li>🔒 Your location data stays on your device</li>
            <li>🚫 We never sell your personal information</li>
            <li>📱 You control what data is shared and stored</li>
            <li>🗑️ You can delete your account and data anytime</li>
          </ul>
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

export default PrivacySettings