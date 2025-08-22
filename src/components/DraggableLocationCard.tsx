import React from 'react';
import { useDrag } from 'react-dnd';
import LocationCard from './location/LocationCard';
import type { Location } from '../types/Location';
import type { User } from 'firebase/auth';

interface DragItem {
  type: string;
  locationId: string;
  fromDayDate: string;
}

interface DraggableLocationCardProps {
  location: Location;
  isFavorite: boolean;
  onToggleFavorite: (locationId: string) => void;
  onClick: (location: Location) => void;
  user: User | null;
  fromDayDate: string;
  onRemove?: () => void;
}

const ITEM_TYPE = 'LOCATION_CARD';

const DraggableLocationCard: React.FC<DraggableLocationCardProps> = ({
  location,
  isFavorite,
  onToggleFavorite,
  onClick,
  user,
  fromDayDate,
  onRemove
}) => {
  const [{ isDragging }, dragRef] = useDrag({
    type: ITEM_TYPE,
    item: (): DragItem => ({
      type: ITEM_TYPE,
      locationId: location.id,
      fromDayDate: fromDayDate
    }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div 
      ref={dragRef} 
      style={{ 
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
        transition: 'opacity 0.2s ease'
      }}
      className="draggable-location-card"
    >
      <LocationCard
        location={location}
        isFavorite={isFavorite}
        onToggleFavorite={onToggleFavorite}
        onClick={onClick}
        user={user}
        showQuickAdd={false}
      />
      {onRemove && (
        <button
          className="remove-from-trip-btn"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          title="Remove from trip"
        >
          🗑️ Remove
        </button>
      )}
    </div>
  );
};

export { ITEM_TYPE };
export default DraggableLocationCard;