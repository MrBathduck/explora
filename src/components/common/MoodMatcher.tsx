import { useState } from 'react'
import { MOOD_TAG_MAPPING } from '../../data/tagSystem'
import './MoodMatcher.css'

export type MoodType = keyof typeof MOOD_TAG_MAPPING

interface MoodMatcherProps {
  onMoodSelect: (mood: MoodType | null) => void
  selectedMood: MoodType | null
}

const MOOD_INFO = {
  Romantic: {
    emoji: '💕',
    description: 'Scenic spots for intimate moments',
    color: '#E91E63'
  },
  Adventurous: {
    emoji: '🗺️',
    description: 'Urban exploration and hidden gems',
    color: '#FF5722'
  },
  Peaceful: {
    emoji: '🌿',
    description: 'Calm spaces for relaxation',
    color: '#4CAF50'
  },
  Curious: {
    emoji: '🤔',
    description: 'Museums and learning experiences',
    color: '#9C27B0'
  },
  Energetic: {
    emoji: '⚡',
    description: 'Vibrant culture and street life',
    color: '#FF9800'
  },
  Contemplative: {
    emoji: '🧘',
    description: 'Historic and spiritual places',
    color: '#607D8B'
  }
} as const

const MoodMatcher: React.FC<MoodMatcherProps> = ({ onMoodSelect, selectedMood }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleMoodClick = (mood: MoodType) => {
    if (selectedMood === mood) {
      onMoodSelect(null) // Deselect if clicking the same mood
    } else {
      onMoodSelect(mood)
    }
  }

  return (
    <div className="mood-matcher">
      <div className="mood-matcher-header">
        <button 
          className="mood-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span className="mood-toggle-text">
            {selectedMood ? `${MOOD_INFO[selectedMood].emoji} ${selectedMood} mood` : '🎭 Choose your mood'}
          </span>
          <span className={`mood-toggle-arrow ${isExpanded ? 'expanded' : ''}`}>▼</span>
        </button>
      </div>

      {isExpanded && (
        <div className="mood-options">
          <div className="mood-grid">
            {(Object.keys(MOOD_INFO) as MoodType[]).map(mood => (
              <button
                key={mood}
                className={`mood-option ${selectedMood === mood ? 'active' : ''}`}
                onClick={() => handleMoodClick(mood)}
                style={{
                  '--mood-color': MOOD_INFO[mood].color
                } as React.CSSProperties}
              >
                <div className="mood-emoji">{MOOD_INFO[mood].emoji}</div>
                <div className="mood-name">{mood}</div>
                <div className="mood-description">{MOOD_INFO[mood].description}</div>
              </button>
            ))}
          </div>
          
          {selectedMood && (
            <button 
              className="clear-mood"
              onClick={() => onMoodSelect(null)}
            >
              Clear mood filter
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default MoodMatcher