import React, { useState } from 'react'
import { type MoodType } from '../common/MoodMatcher'
import './OnboardingMoodSelector.css'

interface OnboardingMoodSelectorProps {
  onContinue: (selectedMoods: MoodType[]) => void
  onBack: () => void
  initialMoods?: MoodType[]
}

const MOOD_INFO = {
  Romantic: {
    emoji: '💕',
    description: 'Scenic spots for intimate moments',
    color: '#E91E63',
    examples: ['Sunset viewpoints', 'Quiet gardens', 'Riverside walks']
  },
  Adventurous: {
    emoji: '🗺️',
    description: 'Urban exploration and hidden gems',
    color: '#FF5722',
    examples: ['Rooftop access', 'Underground tunnels', 'Off-beaten paths']
  },
  Peaceful: {
    emoji: '🌿',
    description: 'Calm spaces for relaxation',
    color: '#4CAF50',
    examples: ['Quiet parks', 'Meditation spaces', 'Nature trails']
  },
  Curious: {
    emoji: '🤔',
    description: 'Museums and learning experiences',
    color: '#9C27B0',
    examples: ['Interactive exhibits', 'Historical sites', 'Science centers']
  },
  Energetic: {
    emoji: '⚡',
    description: 'Vibrant culture and street life',
    color: '#FF9800',
    examples: ['Street art', 'Markets', 'Festival venues']
  },
  Contemplative: {
    emoji: '🧘',
    description: 'Historic and spiritual places',
    color: '#607D8B',
    examples: ['Ancient temples', 'Libraries', 'Heritage sites']
  }
} as const

const OnboardingMoodSelector: React.FC<OnboardingMoodSelectorProps> = ({ 
  onContinue, 
  onBack, 
  initialMoods = [] 
}) => {
  const [selectedMoods, setSelectedMoods] = useState<MoodType[]>(initialMoods)

  const handleMoodToggle = (mood: MoodType) => {
    setSelectedMoods(prev => {
      if (prev.includes(mood)) {
        return prev.filter(m => m !== mood)
      } else if (prev.length < 3) {
        return [...prev, mood]
      } else {
        // Replace oldest selection if at limit
        return [prev[1], prev[2], mood]
      }
    })
  }

  const handleContinue = () => {
    onContinue(selectedMoods)
  }

  return (
    <div className="onboarding-mood-selector">
      <div className="mood-selector-content">
        <div className="mood-selector-header">
          <h2 className="mood-selector-title">What's your travel vibe?</h2>
          <p className="mood-selector-subtitle">
            Choose up to 3 moods that best describe how you like to explore. 
            This helps us suggest places you'll love.
          </p>
        </div>

        <div className="mood-grid">
          {(Object.keys(MOOD_INFO) as MoodType[]).map(mood => {
            const isSelected = selectedMoods.includes(mood)
            const info = MOOD_INFO[mood]
            
            return (
              <button
                key={mood}
                className={`mood-card ${isSelected ? 'selected' : ''}`}
                onClick={() => handleMoodToggle(mood)}
                style={{
                  '--mood-color': info.color
                } as React.CSSProperties}
              >
                <div className="mood-card-emoji">{info.emoji}</div>
                <div className="mood-card-content">
                  <h3 className="mood-card-name">{mood}</h3>
                  <p className="mood-card-description">{info.description}</p>
                  <div className="mood-card-examples">
                    {info.examples.map(example => (
                      <span key={example} className="mood-example">
                        {example}
                      </span>
                    ))}
                  </div>
                </div>
                {isSelected && (
                  <div className="mood-card-check">✓</div>
                )}
              </button>
            )
          })}
        </div>

        <div className="mood-selector-info">
          <div className="selection-counter">
            <span className="counter-text">
              {selectedMoods.length} of 3 selected
            </span>
            {selectedMoods.length > 0 && (
              <div className="selected-moods">
                {selectedMoods.map(mood => (
                  <span key={mood} className="selected-mood-tag">
                    {MOOD_INFO[mood].emoji} {mood}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          {selectedMoods.length === 3 && (
            <p className="selection-limit">
              💡 Tip: Click a mood to replace it, or continue with your current selection
            </p>
          )}
        </div>

        <div className="mood-selector-actions">
          <button 
            className="back-button"
            onClick={onBack}
          >
            ← Back
          </button>
          
          <button 
            className="continue-button"
            onClick={handleContinue}
            disabled={selectedMoods.length === 0}
          >
            Continue {selectedMoods.length > 0 ? `(${selectedMoods.length})` : ''}
          </button>
        </div>

        <div className="mood-selector-note">
          <p>Don't worry - you can always change these later in your settings!</p>
        </div>
      </div>
    </div>
  )
}

export default OnboardingMoodSelector