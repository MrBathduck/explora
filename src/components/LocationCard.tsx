import React from 'react';
import type { Location } from '../types/Location';
import { getCategoryIcon, getCategoryColor } from '../utils/categoryIcons';
import './LocationCard.css';

interface LocationCardProps {
  location: Location;
  isFavorite?: boolean;
  onToggleFavorite?: (locationId: string) => void;
  onClick?: (location: Location) => void;
}

const LocationCard: React.FC<LocationCardProps> = ({ location, isFavorite = false, onToggleFavorite, onClick }) => {
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

  return (
    <div className="location-card" onClick={handleCardClick}>
      <div className="location-image-container">
        <img 
          src={location.image} 
          alt={location.name}
          className="location-image"
        />
        <button 
          className={`favorite-button ${isFavorite ? 'favorite' : ''}`}
          onClick={handleFavoriteClick}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>
      <div className="location-content">
        <h3 className="location-name">{location.name}</h3>
        <div className="location-category-badge">
          <span className="category-icon">{getCategoryIcon(location.category)}</span>
          <span className="category-text">{location.category}</span>
        </div>
        <p className="location-description">{location.description}</p>
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