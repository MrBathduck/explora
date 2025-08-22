import React from 'react';
import type { User } from 'firebase/auth';
import type { Location } from '../../types/Location';
import { getCategoryIcon, getPrimaryTagColor } from '../../utils/categoryIcons';
import AddToTripButton from '../trip/AddToTripButton';
import './LocationCard.css';

interface LocationCardProps {
  location: Location;
  isFavorite?: boolean;
  onToggleFavorite?: (locationId: string) => void;
  onClick?: (location: Location) => void;
  user?: User | null;
  showQuickAdd?: boolean;
  isInTrip?: boolean;
  tripNames?: string[];
  onTripChanged?: () => void;
  targetTripId?: string | null;
  targetDayDate?: string | null;
  userPreferredTags?: string[];
  compact?: boolean; // For location suggestions display
  showDistance?: boolean; // Show distance for nearby suggestions
}

const LocationCard: React.FC<LocationCardProps> = ({ location, isFavorite = false, onToggleFavorite, onClick, user, showQuickAdd = true, isInTrip = false, tripNames = [], onTripChanged, targetTripId, targetDayDate, userPreferredTags = [], compact = false, showDistance = false }) => {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking favorite button
    if (onToggleFavorite) {
      onToggleFavorite(location.id);
    }
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(location);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  };

  // Calculate recommendation reason based on tag matches
  const getRecommendationReason = () => {
    if (!userPreferredTags.length) return null;
    
    const primaryMatches = location.tags.primary.filter(tag => userPreferredTags.includes(tag));
    const secondaryMatches = location.tags.secondary.filter(tag => userPreferredTags.includes(tag));
    
    const allMatches = [...primaryMatches, ...secondaryMatches];
    
    if (allMatches.length === 0) return null;
    
    if (allMatches.length === 1) {
      return `Because you're interested in ${allMatches[0]}`;
    }
    
    if (allMatches.length === 2) {
      return `Because you like ${allMatches[0]} and ${allMatches[1]}`;
    }
    
    // For 3+ matches, show the first 2 and indicate there are more
    return `Because you like ${allMatches[0]}, ${allMatches[1]} and more`;
  };
  
  const recommendationReason = getRecommendationReason();

  return (
    <div 
      className="explora-place-card location-card" 
      data-testid="location-card" 
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${location.name}`}
    >
      <div className="location-image-container">
        <img 
          src={location.image} 
          alt={location.name}
          className="location-image"
        />
        <div className="location-actions">
          <button 
            className={`favorite-button ${isFavorite ? 'favorite' : ''}`}
            onClick={handleFavoriteClick}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite ? '❤️' : '🤍'}
          </button>
          
          {user && showQuickAdd && (
            <AddToTripButton 
              user={user}
              locationId={location.id}
              locationName={location.name}
              onAdded={onTripChanged}
              onRemoved={onTripChanged}
              targetTripId={targetTripId}
              targetDayDate={targetDayDate}
            />
          )}
        </div>
      </div>
      <div className="explora-place-card-content location-content">
        <h3 className="location-name">{location.name}</h3>
        <p className="location-description">{location.description}</p>
        
        {/* Primary Tags (3-5 tags, larger text) */}
        <div className="explora-tags-primary-container">
          {location.tags.primary.slice(0, 5).map((tag, index) => (
            <span 
              key={index} 
              className="explora-tag-primary"
              style={{ borderColor: getPrimaryTagColor(tag) }}
            >
              {tag}
            </span>
          ))}
        </div>
        
        {/* Secondary Tags (2-5 tags, smaller text) */}
        <div className="explora-tags-secondary-container">
          {location.tags.secondary.slice(0, 5).map((tag, index) => (
            <span key={index} className="explora-tag-secondary">
              {tag}
            </span>
          ))}
        </div>
        
        {recommendationReason && (
          <div className="recommendation-reason">
            <span className="recommendation-icon">💡</span>
            <span className="recommendation-text">{recommendationReason}</span>
          </div>
        )}
        
        {location.rating && (
          <div className="location-rating">
            ⭐ {location.rating}/5
          </div>
        )}
        {location.address && (
          <p className="location-address">📍 {location.address}</p>
        )}
        
      </div>
    </div>
  );
};

export default LocationCard;