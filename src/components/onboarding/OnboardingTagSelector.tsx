import React, { useState } from 'react'
import './OnboardingTagSelector.css'

interface OnboardingTagSelectorProps {
  onContinue: (selectedTags: string[]) => void
  onBack: () => void
  initialTags?: string[]
}

// Layer 1 Categories and Tags from explora-tag-system-mvp.md
const TAG_CATEGORIES = {
  'Culture & History': {
    emoji: '🏛️',
    color: '#8B4513',
    tags: [
      'Monuments & Landmarks',
      'Historical Sites', 
      'Archaeological Sites',
      'Memorials',
      'Religious & Spiritual Sites',
      'World Heritage Sites',
      'Ancient Architecture',
      'Historic Neighborhoods',
      'Heritage Trails',
      'Palace or Castle',
      'Royal Sites',
      'Medieval Architecture',
      'Baroque Architecture',
      'Library Landmark'
    ]
  },
  'Museums & Art': {
    emoji: '🖼️',
    color: '#9C27B0',
    tags: [
      'Art Museums',
      'History Museums',
      'Science Museums',
      'Modern Art Spaces',
      'Niche Collections',
      'Rotating Exhibitions',
      'Interactive Museums',
      'Photography Exhibits',
      'Immersive Installations',
      'Children\'s Museums',
      'Open-Air Museums',
      'Local Artist Features',
      'Contemporary Culture'
    ]
  },
  'Parks & Nature': {
    emoji: '🌿',
    color: '#4CAF50',
    tags: [
      'Urban Parks',
      'Botanical Gardens',
      'Riverside Walks',
      'Forest Trails',
      'Wildlife Areas',
      'Green Escape',
      'Shaded Areas',
      'Natural Water Features',
      'Urban Biodiversity',
      'Outdoor Sculpture Gardens',
      'Picnic Friendly',
      'Cherry Blossom Spots',
      'Seasonal Highlights',
      'Dog-Friendly Zones',
      'Calm Walks'
    ]
  },
  'Urban Exploration': {
    emoji: '🏙️',
    color: '#607D8B',
    tags: [
      'Iconic Architecture',
      'Public Squares',
      'Neighborhood Walks',
      'Bridges & Tunnels',
      'Industrial Heritage',
      'Historic Streets',
      'Urban Photo Spots',
      'Rooftop Access',
      'Open Courtyards',
      'Covered Passages',
      'Famous Boulevards',
      'Decorative Facades',
      'City Gates',
      'Artists\' District'
    ]
  },
  'Creative & Street Culture': {
    emoji: '🎨',
    color: '#FF5722',
    tags: [
      'Street Art',
      'Design Installations',
      'Creative Hubs',
      'Artisan Markets',
      'Indie Galleries',
      'Local Craft Centers',
      'Public Art Projects',
      'Community Murals',
      'Experimental Art Spaces',
      'Independent Art Shops',
      'Open Studios',
      'Graffiti Corridors',
      'Artist Collectives'
    ]
  },
  'Scenic & Panoramic': {
    emoji: '🌅',
    color: '#FF9800',
    tags: [
      'Rooftop Views',
      'Hilltop Lookouts',
      'Riverbanks',
      'Sunset Spots',
      'Panoramic Vistas',
      'Skyline Overlook',
      'Viewpoints with Seating',
      'Photogenic Angles',
      'Elevated Walkways',
      'Cityscape Reflections',
      'Observation Decks',
      'Open-Air Platforms',
      'Quiet Lookout',
      '360° View'
    ]
  }
} as const

const OnboardingTagSelector: React.FC<OnboardingTagSelectorProps> = ({ 
  onContinue, 
  onBack, 
  initialTags = [] 
}) => {
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag)
      } else if (prev.length < 10) {
        return [...prev, tag]
      } else {
        // Replace oldest selection if at limit
        return [...prev.slice(1), tag]
      }
    })
  }

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(category)) {
        newSet.delete(category)
      } else {
        newSet.add(category)
      }
      return newSet
    })
  }

  const handleContinue = () => {
    onContinue(selectedTags)
  }

  const getTagsInCategory = (category: string) => {
    return selectedTags.filter(tag => 
      TAG_CATEGORIES[category as keyof typeof TAG_CATEGORIES].tags.includes(tag)
    ).length
  }

  return (
    <div className="onboarding-tag-selector">
      <div className="tag-selector-content">
        <div className="tag-selector-header">
          <h2 className="tag-selector-title">What interests you most?</h2>
          <p className="tag-selector-subtitle">
            Choose 3-10 tags that match your travel interests. 
            We'll use these to personalize your recommendations.
          </p>
        </div>

        <div className="tag-categories">
          {Object.entries(TAG_CATEGORIES).map(([category, info]) => {
            const isExpanded = expandedCategories.has(category)
            const tagsInCategory = getTagsInCategory(category)
            
            return (
              <div key={category} className="tag-category">
                <button 
                  className="category-header"
                  onClick={() => toggleCategory(category)}
                  style={{'--category-color': info.color} as React.CSSProperties}
                >
                  <div className="category-info">
                    <span className="category-emoji">{info.emoji}</span>
                    <span className="category-name">{category}</span>
                    {tagsInCategory > 0 && (
                      <span className="category-count">({tagsInCategory})</span>
                    )}
                  </div>
                  <span className={`category-arrow ${isExpanded ? 'expanded' : ''}`}>▼</span>
                </button>

                {isExpanded && (
                  <div className="tag-grid">
                    {info.tags.map(tag => {
                      const isSelected = selectedTags.includes(tag)
                      
                      return (
                        <button
                          key={tag}
                          className={`tag-button ${isSelected ? 'selected' : ''}`}
                          onClick={() => handleTagToggle(tag)}
                          style={{'--tag-color': info.color} as React.CSSProperties}
                        >
                          <span className="tag-name">{tag}</span>
                          {isSelected && (
                            <span className="tag-check">✓</span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="tag-selector-info">
          <div className="selection-counter">
            <span className="counter-text">
              {selectedTags.length} of 10 tags selected
            </span>
            <span className="counter-requirement">
              (minimum 3 required)
            </span>
          </div>
          
          {selectedTags.length > 0 && (
            <div className="selected-tags">
              <h4>Your selected interests:</h4>
              <div className="selected-tags-list">
                {selectedTags.map(tag => {
                  const category = Object.entries(TAG_CATEGORIES).find(
                    ([_, info]) => info.tags.includes(tag)
                  )
                  const categoryInfo = category ? TAG_CATEGORIES[category[0] as keyof typeof TAG_CATEGORIES] : null
                  
                  return (
                    <span 
                      key={tag} 
                      className="selected-tag-chip"
                      style={{'--chip-color': categoryInfo?.color || '#ccc'} as React.CSSProperties}
                    >
                      {categoryInfo?.emoji} {tag}
                      <button 
                        className="remove-tag"
                        onClick={() => handleTagToggle(tag)}
                        aria-label={`Remove ${tag}`}
                      >
                        ×
                      </button>
                    </span>
                  )
                })}
              </div>
            </div>
          )}
          
          {selectedTags.length === 10 && (
            <p className="selection-limit">
              💡 Tip: You've reached the maximum. Click a tag to replace it, or continue with your current selection.
            </p>
          )}
        </div>

        <div className="tag-selector-actions">
          <button 
            className="back-button"
            onClick={onBack}
          >
            ← Back
          </button>
          
          <button 
            className="continue-button"
            onClick={handleContinue}
            disabled={selectedTags.length < 3}
          >
            Continue {selectedTags.length >= 3 ? `(${selectedTags.length})` : ''}
          </button>
        </div>

        <div className="tag-selector-note">
          <p>Don't worry - you can always change these later in your settings!</p>
        </div>
      </div>
    </div>
  )
}

export default OnboardingTagSelector