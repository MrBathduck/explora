import React from 'react';
import { useDrag } from 'react-dnd';
import type { Location } from '../../types/Location';
import './DraggableLocationCard.css';

interface DraggableLocationCardProps {
  location: Location;
  isUsed?: boolean;
}

const DraggableLocationCard: React.FC<DraggableLocationCardProps> = ({ 
  location, 
  isUsed = false 
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'location',
    item: { id: location.id, location },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: !isUsed,
  }));

  return (
    <div
      ref={drag}
      className={`draggable-location-card ${isDragging ? 'dragging' : ''} ${isUsed ? 'used' : ''}`}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: isUsed ? 'not-allowed' : 'grab',
      }}
    >
      <div className="location-image">
        <img src={location.image} alt={location.name} />
        {isUsed && <div className="used-overlay">✓ Added</div>}
      </div>
      
      <div className="location-info">
        <h4 className="location-name">{location.name}</h4>
        <p className="location-category">{location.category}</p>
        <div className="location-details">
          <span className="location-rating">⭐ {location.rating}</span>
          <span className="location-duration">🕒 {location.duration}</span>
        </div>
      </div>
    </div>
  );
};

export default DraggableLocationCard;