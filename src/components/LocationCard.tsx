import React from 'react';
import type { Location } from '../types/Location';
import './LocationCard.css';

interface LocationCardProps {
  location: Location;
}

const LocationCard: React.FC<LocationCardProps> = ({ location }) => {
  return (
    <div className="location-card">
      <img 
        src={location.image} 
        alt={location.name}
        className="location-image"
      />
      <div className="location-content">
        <h3 className="location-name">{location.name}</h3>
        <p className="location-category">{location.category}</p>
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