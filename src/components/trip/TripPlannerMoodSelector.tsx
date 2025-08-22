import React, { useState } from 'react'
import { MOOD_TAG_MAPPING } from '../../data/tagSystem'
import type { MoodType } from '../common/MoodMatcher'
import './TripPlannerMoodSelector.css'

interface TripPlannerMoodSelectorProps {
  onMoodSelect: (mood: MoodType | null) => void
  selectedMood: MoodType | null
  dayNumber?: number
}

const MOOD_INFO = {
  Romantic: {
    emoji: '💕',
    description: 'Intimate spots for couples',
    keywords: 'scenic, sunset, quiet',
    color: '#E91E63'
  },
  Adventurous: {
    emoji: '🗺️', 
    description: 'Hidden gems & exploration',
    keywords: 'rooftop, tunnels, off-beaten-path',
    color: '#FF5722'
  },
  Peaceful: {
    emoji: '🌿',
    description: 'Relaxing nature escapes',
    keywords: 'parks, calm walks, shaded areas',
    color: '#4CAF50'
  },
  Curious: {
    emoji: '🤔',
    description: 'Museums & learning',
    keywords: 'interactive, historical, collections',
    color: '#9C27B0'
  },
  Energetic: {
    emoji: '⚡',
    description: 'Vibrant street culture',
    keywords: 'markets, squares, street art',
    color: '#FF9800'
  },
  Contemplative: {
    emoji: '🧘',
    description: 'Historic & spiritual',
    keywords: 'heritage, library, monuments',
    color: '#607D8B'
  }
} as const

const TripPlannerMoodSelector: React.FC<TripPlannerMoodSelectorProps> = ({ 
  onMoodSelect, 
  selectedMood, 
  dayNumber 
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleMoodClick = (mood: MoodType) => {
    if (selectedMood === mood) {
      onMoodSelect(null) // Deselect if clicking the same mood
    } else {
      onMoodSelect(mood)
    }
    setIsExpanded(false) // Collapse after selection
  }

  const dayTitle = dayNumber ? `Day ${dayNumber}` : 'Trip'

  return (
    <div className="trip-mood-selector">
      <div className="trip-mood-header">
        <span className="trip-mood-label">
          {dayNumber ? `${dayTitle} mood:` : 'Filter by mood:'}
        </span>
        <button 
          className="trip-mood-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span className="trip-mood-display">
            {selectedMood ? (
              <>
                <span className="trip-mood-emoji">{MOOD_INFO[selectedMood].emoji}</span>
                <span className="trip-mood-name">{selectedMood}</span>
              </>
            ) : (
              <>
                <span className="trip-mood-emoji">🎭</span>
                <span className="trip-mood-name">Choose mood</span>
              </>
            )}
          </span>
          <span className={`trip-mood-arrow ${isExpanded ? 'expanded' : ''}`}>▼</span>
        </button>
      </div>

      {isExpanded && (
        <div className="trip-mood-dropdown">
          <div className="trip-mood-options">
            {(Object.keys(MOOD_INFO) as MoodType[]).map(mood => (
              <button
                key={mood}
                className={`trip-mood-option ${selectedMood === mood ? 'active' : ''}`}
                onClick={() => handleMoodClick(mood)}
                style={{
                  '--mood-color': MOOD_INFO[mood].color
                } as React.CSSProperties}
              >
                <div className="trip-mood-option-content">
                  <div className="trip-mood-option-header">
                    <span className="trip-mood-option-emoji">{MOOD_INFO[mood].emoji}</span>
                    <span className="trip-mood-option-name">{mood}</span>
                  </div>
                  <div className="trip-mood-option-description">{MOOD_INFO[mood].description}</div>
                  <div className="trip-mood-option-keywords">{MOOD_INFO[mood].keywords}</div>
                </div>
              </button>
            ))}
          </div>
          
          {selectedMood && (
            <button 
              className="trip-mood-clear"
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

export default TripPlannerMoodSelector