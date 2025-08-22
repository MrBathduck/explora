import React, { useState, useEffect } from 'react'
import { type User } from 'firebase/auth'
import { type UserProfile } from '../types/UserProfile'
import { getUserProfile, updateUserProfile } from '../services/userProfile'
import ProfileSettings from '../components/settings/ProfileSettings'
import AppPreferences from '../components/settings/AppPreferences'
import PrivacySettings from '../components/settings/PrivacySettings'
import SupportInfo from '../components/settings/SupportInfo'
import './SettingsPage.css'

interface SettingsPageProps {
  user: User | null
}

type SettingsSection = 'profile' | 'app' | 'privacy' | 'support'

const SettingsPage: React.FC<SettingsPageProps> = ({ user }) => {
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile')
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Load user profile
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        setIsLoading(false)
        return
      }

      try {
        const userProfile = await getUserProfile(user.uid)
        setProfile(userProfile)
      } catch (err) {
        console.error('Error loading profile:', err)
        setError('Failed to load profile settings')
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [user])

  // Save profile updates
  const handleProfileUpdate = async (updates: Partial<UserProfile>) => {
    if (!user || !profile) return

    setIsSaving(true)
    setError(null)

    try {
      const updatedProfile = await updateUserProfile(user.uid, updates)
      setProfile(updatedProfile)
      setSuccessMessage('Settings saved successfully!')
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      console.error('Error updating profile:', err)
      setError('Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  // Navigation items
  const navigationItems = [
    {
      id: 'profile' as SettingsSection,
      label: 'Profile & Travel Style',
      icon: '👤',
      description: 'Your preferences and travel style'
    },
    {
      id: 'app' as SettingsSection,
      label: 'App Preferences',
      icon: '⚙️',
      description: 'Display and notification settings'
    },
    {
      id: 'privacy' as SettingsSection,
      label: 'Privacy & Data',
      icon: '🔒',
      description: 'Privacy controls and data management'
    },
    {
      id: 'support' as SettingsSection,
      label: 'Support & Info',
      icon: '❓',
      description: 'Help, about, and contact information'
    }
  ]

  if (!user) {
    return (
      <div className="settings-page">
        <div className="settings-container">
          <div className="settings-header">
            <h1>Settings</h1>
          </div>
          <div className="settings-content">
            <div className="no-user-message">
              <div className="no-user-icon">🔑</div>
              <h2>Sign in to manage your settings</h2>
              <p>Create an account to save your preferences and sync across devices.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="settings-page">
        <div className="settings-container">
          <div className="settings-loading">
            <div className="loading-spinner"></div>
            <h3>Loading your settings...</h3>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="settings-page">
      <div className="settings-container">
        {/* Header */}
        <div className="settings-header">
          <h1>Settings</h1>
          {profile && (
            <div className="user-summary">
              <img 
                src={profile.photoURL || '/default-avatar.png'} 
                alt={profile.displayName} 
                className="user-avatar"
              />
              <div className="user-info">
                <div className="user-name">{profile.displayName}</div>
                <div className="user-email">{profile.email}</div>
              </div>
            </div>
          )}
        </div>

        {/* Status Messages */}
        {error && (
          <div className="status-message error">
            <span className="status-icon">⚠️</span>
            {error}
            <button 
              className="dismiss-button"
              onClick={() => setError(null)}
            >
              ✕
            </button>
          </div>
        )}

        {successMessage && (
          <div className="status-message success">
            <span className="status-icon">✅</span>
            {successMessage}
          </div>
        )}

        <div className="settings-layout">
          {/* Navigation Sidebar */}
          <div className="settings-nav">
            <nav className="nav-menu">
              {navigationItems.map(item => (
                <button
                  key={item.id}
                  className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
                  onClick={() => setActiveSection(item.id)}
                >
                  <div className="nav-item-icon">{item.icon}</div>
                  <div className="nav-item-content">
                    <div className="nav-item-label">{item.label}</div>
                    <div className="nav-item-description">{item.description}</div>
                  </div>
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="settings-content">
            <div className="content-section">
              {activeSection === 'profile' && profile && (
                <ProfileSettings
                  profile={profile}
                  onUpdate={handleProfileUpdate}
                  isSaving={isSaving}
                />
              )}

              {activeSection === 'app' && profile && (
                <AppPreferences
                  profile={profile}
                  onUpdate={handleProfileUpdate}
                  isSaving={isSaving}
                />
              )}

              {activeSection === 'privacy' && profile && (
                <PrivacySettings
                  profile={profile}
                  user={user}
                  onUpdate={handleProfileUpdate}
                  isSaving={isSaving}
                />
              )}

              {activeSection === 'support' && (
                <SupportInfo profile={profile} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage