import React, { useState } from 'react'
import { type UserProfile, type TravelStyle, type AccessibilityPreferences, DEFAULT_TRAVEL_STYLE } from '../../types/UserProfile'
import './ProfileSettings.css'

interface ProfileSettingsProps {
  profile: UserProfile
  onUpdate: (updates: Partial<UserProfile>) => void
  isSaving: boolean
}

// Layer 1 Categories and Tags from explora-tag-system-mvp.md (subset for settings)
const TAG_CATEGORIES = {
  'Culture & History': {
    emoji: '🏛️',
    color: '#8B4513',
    tags: ['Monuments & Landmarks', 'Historical Sites', 'Religious & Spiritual Sites', 'World Heritage Sites', 'Ancient Architecture', 'Historic Neighborhoods', 'Heritage Trails', 'Palace or Castle']
  },
  'Museums & Art': {
    emoji: '🖼️',
    color: '#9C27B0',
    tags: ['Art Museums', 'History Museums', 'Science Museums', 'Modern Art Spaces', 'Interactive Museums', 'Photography Exhibits', 'Local Artist Features']
  },
  'Parks & Nature': {
    emoji: '🌿',
    color: '#4CAF50',
    tags: ['Urban Parks', 'Botanical Gardens', 'Riverside Walks', 'Forest Trails', 'Wildlife Areas', 'Green Escape', 'Shaded Areas', 'Picnic Friendly']
  },
  'Urban Exploration': {
    emoji: '🏙️',
    color: '#607D8B',
    tags: ['Iconic Architecture', 'Public Squares', 'Neighborhood Walks', 'Bridges & Tunnels', 'Historic Streets', 'Urban Photo Spots', 'Rooftop Access']
  },
  'Creative & Street Culture': {
    emoji: '🎨',
    color: '#FF5722',
    tags: ['Street Art', 'Design Installations', 'Creative Hubs', 'Artisan Markets', 'Indie Galleries', 'Local Craft Centers', 'Public Art Projects']
  },
  'Scenic & Panoramic': {
    emoji: '🌅',
    color: '#FF9800',
    tags: ['Rooftop Views', 'Hilltop Lookouts', 'Riverbanks', 'Sunset Spots', 'Panoramic Vistas', 'Skyline Overlook', 'Viewpoints with Seating']
  }
} as const

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ profile, onUpdate, isSaving }) => {
  const [travelStyle, setTravelStyle] = useState<TravelStyle>({
    ...DEFAULT_TRAVEL_STYLE,
    ...profile.travelStyle,
    preferredTags: profile.travelStyle?.preferredTags || DEFAULT_TRAVEL_STYLE.preferredTags
  })
  const [accessibility, setAccessibility] = useState<AccessibilityPreferences>(profile.accessibility)
  const [hasChanges, setHasChanges] = useState(false)

  const updateTravelStyle = (field: keyof TravelStyle, value: any) => {
    const newTravelStyle = { ...travelStyle, [field]: value }
    setTravelStyle(newTravelStyle)
    setHasChanges(true)
  }

  const updateAccessibility = (field: keyof AccessibilityPreferences, value: boolean) => {
    const newAccessibility = { ...accessibility, [field]: value }
    setAccessibility(newAccessibility)
    setHasChanges(true)
  }

  const handleTagToggle = (tag: string) => {
    const currentTags = travelStyle.preferredTags
    let newTags: string[]
    
    if (currentTags.includes(tag)) {
      newTags = currentTags.filter(t => t !== tag)
    } else if (currentTags.length < 10) {
      newTags = [...currentTags, tag]
    } else {
      // Replace oldest selection
      newTags = [...currentTags.slice(1), tag]
    }
    
    updateTravelStyle('preferredTags', newTags)
  }

  const handleSave = () => {
    onUpdate({
      travelStyle,
      accessibility
    })
    setHasChanges(false)
  }

  const handleReset = () => {
    setTravelStyle(profile.travelStyle)
    setAccessibility(profile.accessibility)
    setHasChanges(false)
  }

  const handleRestartOnboarding = () => {
    if (confirm('This will restart the onboarding process. Are you sure?')) {
      onUpdate({ onboardingCompleted: false })
    }
  }

  return (
    <div className="profile-settings">
      <div className="section-header">
        <h2>Profile & Travel Style</h2>
        <p>Customize how Explora suggests places based on your preferences</p>
      </div>

      {/* Basic Profile Info */}
      <div className="settings-section">
        <h3>Basic Information</h3>
        <div className="profile-info">
          <div className="profile-avatar">
            <img 
              src={profile.photoURL || '/default-avatar.png'} 
              alt={profile.displayName}
            />
          </div>
          <div className="profile-details">
            <div className="profile-field">
              <label>Name</label>
              <div className="field-value">{profile.displayName}</div>
            </div>
            <div className="profile-field">
              <label>Email</label>
              <div className="field-value">{profile.email}</div>
            </div>
            <p className="profile-note">
              Basic information is managed through your Google account
            </p>
          </div>
        </div>
      </div>

      {/* Travel Interests Tags */}
      <div className="settings-section">
        <h3>Your Travel Interests</h3>
        <p className="section-description">
          Choose up to 10 tags that match your interests. These help personalize your recommendations.
        </p>
        
        <div className="tag-selector">
          {Object.entries(TAG_CATEGORIES).map(([categoryName, categoryInfo]) => (
            <div key={categoryName} className="tag-category-section">
              <h4 className="category-header">
                <span className="category-emoji">{categoryInfo.emoji}</span>
                <span className="category-name">{categoryName}</span>
              </h4>
              <div className="tag-grid">
                {categoryInfo.tags.map(tag => {
                  const isSelected = travelStyle.preferredTags.includes(tag)
                  
                  return (
                    <button
                      key={tag}
                      className={`tag-chip ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleTagToggle(tag)}
                      style={{
                        '--tag-color': categoryInfo.color
                      } as React.CSSProperties}
                    >
                      <span className="tag-name">{tag}</span>
                      {isSelected && <span className="tag-check">✓</span>}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
          
          <div className="tag-counter">
            <span className="counter-text">
              {travelStyle.preferredTags.length} of 10 tags selected
            </span>
            {travelStyle.preferredTags.length === 10 && (
              <span className="tag-limit"> (maximum reached)</span>
            )}
          </div>
        </div>
      </div>

      {/* Travel Preferences */}
      <div className="settings-section">
        <h3>Travel Preferences</h3>
        
        <div className="preference-grid">
          <div className="preference-item">
            <label htmlFor="mobility">Preferred Transportation</label>
            <select
              id="mobility"
              value={travelStyle.mobilityPreference}
              onChange={(e) => updateTravelStyle('mobilityPreference', e.target.value)}
            >
              <option value="walk">Walking</option>
              <option value="transit">Public Transit</option>
              <option value="car">Car/Taxi</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>

          <div className="preference-item">
            <label htmlFor="timeStyle">Time Style</label>
            <select
              id="timeStyle"
              value={travelStyle.timeStyle}
              onChange={(e) => updateTravelStyle('timeStyle', e.target.value)}
            >
              <option value="quick">Quick Visits (15-30 min)</option>
              <option value="deep">Deep Exploration (1-3+ hours)</option>
              <option value="mixed">It Depends</option>
            </select>
          </div>

          <div className="preference-item">
            <label htmlFor="groupType">Usually Travel With</label>
            <select
              id="groupType"
              value={travelStyle.groupType}
              onChange={(e) => updateTravelStyle('groupType', e.target.value)}
            >
              <option value="solo">Solo</option>
              <option value="couple">As a Couple</option>
              <option value="family">Family</option>
              <option value="friends">Friends</option>
              <option value="mixed">Various</option>
            </select>
          </div>
        </div>
      </div>

      {/* Accessibility */}
      <div className="settings-section">
        <h3>Accessibility Preferences</h3>
        <p className="section-description">
          Help us show places that work for your needs
        </p>
        
        <div className="checkbox-list">
          <label className="checkbox-item">
            <input
              type="checkbox"
              checked={accessibility.wheelchairNeeded}
              onChange={(e) => updateAccessibility('wheelchairNeeded', e.target.checked)}
            />
            <div className="checkbox-content">
              <span className="checkbox-icon">♿</span>
              <div className="checkbox-text">
                <div className="checkbox-label">Wheelchair accessible</div>
                <div className="checkbox-description">Show only wheelchair-friendly places</div>
              </div>
            </div>
          </label>

          <label className="checkbox-item">
            <input
              type="checkbox"
              checked={accessibility.avoidStairs}
              onChange={(e) => updateAccessibility('avoidStairs', e.target.checked)}
            />
            <div className="checkbox-content">
              <span className="checkbox-icon">🚫</span>
              <div className="checkbox-text">
                <div className="checkbox-label">Avoid lots of stairs</div>
                <div className="checkbox-description">Prefer places without many stairs</div>
              </div>
            </div>
          </label>

          <label className="checkbox-item">
            <input
              type="checkbox"
              checked={accessibility.elderFriendly}
              onChange={(e) => updateAccessibility('elderFriendly', e.target.checked)}
            />
            <div className="checkbox-content">
              <span className="checkbox-icon">👴</span>
              <div className="checkbox-text">
                <div className="checkbox-label">Elder-friendly</div>
                <div className="checkbox-description">Places with seating and easier access</div>
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="settings-actions">
        <div className="action-buttons">
          {hasChanges && (
            <>
              <button 
                className="reset-button"
                onClick={handleReset}
                disabled={isSaving}
              >
                Reset Changes
              </button>
              <button 
                className="save-button"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          )}
        </div>
        
        <div className="secondary-actions">
          <button 
            className="restart-onboarding-button"
            onClick={handleRestartOnboarding}
          >
            🔄 Restart Setup Process
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProfileSettings