import React, { useState, useEffect } from 'react';
import type { Location } from '../types/Location';
import { getCategoryIcon, getCategoryColor } from '../utils/categoryIcons';
import './LocationModal.css';

interface LocationModalProps {
  location: Location;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (locationId: string) => void;
}

const LocationModal: React.FC<LocationModalProps> = ({ 
  location, 
  isOpen, 
  onClose, 
  isFavorite, 
  onToggleFavorite 
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Handle ESC key press
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      // Prevent body scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      // Restore body scrolling when modal closes
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const images = location.images && location.images.length > 0 
    ? location.images 
    : [location.image];

  const handleGetDirections = () => {
    const { lat, lng } = location.coordinates;
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(googleMapsUrl, '_blank');
  };

  const handleWebsite = () => {
    if (location.website) {
      window.open(location.website, '_blank');
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        {/* Image Gallery */}
        <div className="modal-image-gallery">
          <img 
            src={images[currentImageIndex]} 
            alt={location.name}
            className="modal-image"
          />
          {images.length > 1 && (
            <>
              <button className="image-nav prev" onClick={prevImage}>‹</button>
              <button className="image-nav next" onClick={nextImage}>›</button>
              <div className="image-indicators">
                {images.map((_, index) => (
                  <button
                    key={index}
                    className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Content */}
        <div className="modal-body">
          <div className="modal-header">
            <div className="modal-title-section">
              <h2 className="modal-title">{location.name}</h2>
              <div className="modal-category-badge">
                <span className="category-icon">{getCategoryIcon(location.category)}</span>
                <span className="category-text">{location.category}</span>
              </div>
            </div>
            <button 
              className={`modal-favorite-btn ${isFavorite ? 'favorite' : ''}`}
              onClick={() => onToggleFavorite(location.id)}
            >
              {isFavorite ? '❤️' : '🤍'}
            </button>
          </div>

          <div className="modal-info-grid">
            {location.rating && (
              <div className="info-item">
                <span className="info-label">⭐ Rating</span>
                <span className="info-value">{location.rating}/5</span>
              </div>
            )}
            
            {location.priceRange && (
              <div className="info-item">
                <span className="info-label">💰 Price</span>
                <span className="info-value">{location.priceRange}</span>
              </div>
            )}
            
            {location.hours && (
              <div className="info-item">
                <span className="info-label">🕒 Hours</span>
                <span className="info-value">{location.hours}</span>
              </div>
            )}
            
            {location.phone && (
              <div className="info-item">
                <span className="info-label">📞 Phone</span>
                <span className="info-value">{location.phone}</span>
              </div>
            )}
          </div>

          <p className="modal-description">{location.description}</p>

          {location.highlights && location.highlights.length > 0 && (
            <div className="modal-highlights">
              <h4>✨ Highlights</h4>
              <ul>
                {location.highlights.map((highlight, index) => (
                  <li key={index}>{highlight}</li>
                ))}
              </ul>
            </div>
          )}

          {location.address && (
            <div className="modal-address">
              <span className="info-label">📍 Address</span>
              <span className="info-value">{location.address}</span>
            </div>
          )}

          <div className="modal-actions">
            <button className="action-btn primary" onClick={handleGetDirections}>
              🗺️ Get Directions
            </button>
            {location.website && (
              <button className="action-btn secondary" onClick={handleWebsite}>
                🌐 Visit Website
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;