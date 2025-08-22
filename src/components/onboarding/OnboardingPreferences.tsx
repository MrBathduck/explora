import React, { useState } from 'react'
import { 
  type TravelStyle, 
  type AccessibilityPreferences,
  DEFAULT_TRAVEL_STYLE,
  DEFAULT_ACCESSIBILITY
} from '../../types/UserProfile'
import './OnboardingPreferences.css'

interface OnboardingPreferencesProps {
  onContinue: (travelStyle: TravelStyle, accessibility: AccessibilityPreferences) => void
  onBack: () => void
  initialTravelStyle?: TravelStyle
  initialAccessibility?: AccessibilityPreferences
}

const OnboardingPreferences: React.FC<OnboardingPreferencesProps> = ({ 
  onContinue, 
  onBack, 
  initialTravelStyle = DEFAULT_TRAVEL_STYLE,
  initialAccessibility = DEFAULT_ACCESSIBILITY
}) => {
  const [travelStyle, setTravelStyle] = useState<TravelStyle>(initialTravelStyle)
  const [accessibility, setAccessibility] = useState<AccessibilityPreferences>(initialAccessibility)

  const handleContinue = () => {
    onContinue(travelStyle, accessibility)
  }

  const updateTravelStyle = (field: keyof TravelStyle, value: any) => {
    setTravelStyle(prev => ({ ...prev, [field]: value }))
  }

  const updateAccessibility = (field: keyof AccessibilityPreferences, value: boolean) => {
    setAccessibility(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="onboarding-preferences">
      <div className="preferences-content">
        <div className="preferences-header">
          <h2 className="preferences-title">Help us show relevant places</h2>
          <p className="preferences-subtitle">
            These preferences help us filter and suggest places that work best for you.
          </p>
        </div>

        <div className="preferences-sections">
          {/* Mobility Preference */}
          <div className="preference-section">
            <h3 className="section-title">
              <span className="section-icon">🚶</span>
              How do you prefer to get around?
            </h3>
            <div className="option-grid">
              {[
                { value: 'walk', label: 'Walking', description: 'I prefer to explore on foot', icon: '🚶‍♂️' },
                { value: 'transit', label: 'Public Transit', description: 'Metro, bus, tram - I use public transport', icon: '🚇' },
                { value: 'car', label: 'Car/Taxi', description: 'I drive or use ride-sharing', icon: '🚗' },
                { value: 'mixed', label: 'Mixed', description: 'I use different transportation methods', icon: '🚊' }
              ].map(option => (
                <button
                  key={option.value}
                  className={`option-card ${travelStyle.mobilityPreference === option.value ? 'selected' : ''}`}
                  onClick={() => updateTravelStyle('mobilityPreference', option.value)}
                >
                  <div className="option-icon">{option.icon}</div>
                  <div className="option-label">{option.label}</div>
                  <div className="option-description">{option.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Time Style */}
          <div className="preference-section">
            <h3 className="section-title">
              <span className="section-icon">⏰</span>
              How much time do you usually spend at places?
            </h3>
            <div className="option-grid">
              {[
                { value: 'quick', label: 'Quick Visits', description: '15-30 minutes, see the highlights', icon: '⚡' },
                { value: 'deep', label: 'Deep Exploration', description: '1-3+ hours, really dive in', icon: '🔍' },
                { value: 'mixed', label: 'It Depends', description: 'Varies by place and mood', icon: '🎯' }
              ].map(option => (
                <button
                  key={option.value}
                  className={`option-card ${travelStyle.timeStyle === option.value ? 'selected' : ''}`}
                  onClick={() => updateTravelStyle('timeStyle', option.value)}
                >
                  <div className="option-icon">{option.icon}</div>
                  <div className="option-label">{option.label}</div>
                  <div className="option-description">{option.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Group Type */}
          <div className="preference-section">
            <h3 className="section-title">
              <span className="section-icon">👥</span>
              Who do you usually travel with?
            </h3>
            <div className="option-grid">
              {[
                { value: 'solo', label: 'Solo', description: 'I explore on my own', icon: '🧑‍🦱' },
                { value: 'couple', label: 'As a Couple', description: 'With my partner', icon: '👫' },
                { value: 'family', label: 'Family', description: 'With kids or extended family', icon: '👨‍👩‍👧‍👦' },
                { value: 'friends', label: 'Friends', description: 'With a group of friends', icon: '👫' },
                { value: 'mixed', label: 'Various', description: 'Different situations', icon: '🎭' }
              ].map(option => (
                <button
                  key={option.value}
                  className={`option-card ${travelStyle.groupType === option.value ? 'selected' : ''}`}
                  onClick={() => updateTravelStyle('groupType', option.value)}
                >
                  <div className="option-icon">{option.icon}</div>
                  <div className="option-label">{option.label}</div>
                  <div className="option-description">{option.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Accessibility */}
          <div className="preference-section">
            <h3 className="section-title">
              <span className="section-icon">♿</span>
              Accessibility preferences
            </h3>
            <p className="section-description">
              Help us show places that work for your needs
            </p>
            <div className="checkbox-grid">
              <label className="checkbox-option">
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

              <label className="checkbox-option">
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

              <label className="checkbox-option">
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
        </div>

        <div className="preferences-actions">
          <button 
            className="back-button"
            onClick={onBack}
          >
            ← Back
          </button>
          
          <button 
            className="continue-button"
            onClick={handleContinue}
          >
            Continue
          </button>
        </div>

        <div className="preferences-note">
          <p>💡 These settings help us personalize your experience and can be changed anytime in settings</p>
        </div>
      </div>
    </div>
  )
}

export default OnboardingPreferences