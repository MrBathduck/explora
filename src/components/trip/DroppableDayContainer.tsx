import React from 'react';
import { useDrop, useDrag } from 'react-dnd';
import type { TripDay } from '../../types/Trip';
import type { Location } from '../../types/Location';
import './DroppableDayContainer.css';

interface DroppableDayContainerProps {
  day: TripDay;
  dayIndex: number;
  onLocationDrop: (locationId: string, dayIndex: number) => void;
  onLocationRemove: (locationId: string, dayIndex: number) => void;
  onLocationMove?: (locationId: string, fromDayIndex: number, toDayIndex: number) => void;
  onLocationClick?: (location: Location) => void;
}

const DroppableDayContainer: React.FC<DroppableDayContainerProps> = ({
  day,
  dayIndex,
  onLocationDrop,
  onLocationRemove,
  onLocationMove,
  onLocationClick,
}) => {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'location',
    drop: (item: { id: string; location: Location; fromDayIndex?: number }) => {
      console.log('🎯 DROP EVENT:', item.location?.name || item.id, 'to day', dayIndex, 'from day', item.fromDayIndex);
      
      // If item has fromDayIndex, it's a move between days
      if (item.fromDayIndex !== undefined && onLocationMove && item.fromDayIndex !== dayIndex) {
        console.log('🎯 CALLING onLocationMove:', item.id, item.fromDayIndex, '->', dayIndex);
        onLocationMove(item.id, item.fromDayIndex, dayIndex);
      } else if (item.fromDayIndex === undefined) {
        // It's a new location being added
        console.log('🎯 CALLING onLocationDrop:', item.id, dayIndex);
        onLocationDrop(item.id, dayIndex);
      } else {
        console.log('🎯 SAME DAY DROP - ignoring');
      }
      // If moving to the same day, do nothing
    },
    hover: (item, monitor) => {
      console.log('🎯 HOVER over day', dayIndex, 'with', item.location?.name || item.id);
    },
    canDrop: (item, monitor) => {
      console.log('🎯 CAN DROP check for day', dayIndex, '- item:', item.location?.name || item.id, 'from day:', item.fromDayIndex);
      return true; // Always allow dropping for debugging
    },
    collect: (monitor) => {
      // Only log when there's actually an item being dragged
      const item = monitor.getItem();
      if (item) {
        console.log('🎯 DROP ZONE COLLECT for day', dayIndex, '- isOver:', monitor.isOver(), 'canDrop:', monitor.canDrop(), 'item:', item?.location?.name || 'none');
      }
      return {
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      };
    },
  }));

  const isActive = isOver && canDrop;

  // Internal draggable location item component
  const DraggableLocationItem: React.FC<{ 
    location: Location; 
    index: number; 
    dayIndex: number;
    onRemove: () => void;
    onLocationClick?: (location: Location) => void;
  }> = ({ location, index, dayIndex, onRemove, onLocationClick }) => {
    const [{ isDragging }, dragRef] = useDrag(() => ({
      type: 'location',
      item: () => {
        console.log('🎯 DRAG BEGIN:', location.name, 'from day', dayIndex);
        return { 
          id: location.id, 
          location, 
          fromDayIndex: dayIndex // Mark this as coming from a specific day
        };
      },
      end: (item, monitor) => {
        console.log('🎯 DRAG END:', location.name, 'success:', monitor.didDrop());
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }));

    const handleCardClick = (e: React.MouseEvent) => {
      // Don't open modal if clicking on remove button
      if ((e.target as HTMLElement).closest('.remove-btn')) {
        return;
      }
      // Open location modal
      if (onLocationClick) {
        onLocationClick(location);
      }
    };

    return (
      <div 
        ref={dragRef}
        className={`day-location-item ${isDragging ? 'dragging' : ''}`}
        style={{ opacity: isDragging ? 0.5 : 1, cursor: isDragging ? 'grabbing' : 'grab' }}
        onClick={handleCardClick}
        onMouseDown={() => console.log('🎯 MOUSE DOWN on', location.name)}
        onDragStart={() => console.log('🎯 NATIVE DRAG START on', location.name)}
        title="Click to view details, drag to move between days"
      >
        <div className="location-order">{index + 1}</div>
        <div className="location-image">
          <img src={location.image} alt={location.name} />
        </div>
        <div className="location-details">
          <h4>{location.name}</h4>
          <p className="location-category">{location.category}</p>
          <div className="location-meta">
            <span>⭐ {location.rating}</span>
            <span>🕒 {location.duration}</span>
          </div>
        </div>
        <button
          className="remove-btn"
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click when removing
            onRemove();
          }}
          title="Remove from this day"
        >
          ✕
        </button>
        <div className="drag-handle" title="Drag handle">
          ⋮⋮
        </div>
      </div>
    );
  };

  // Only log rendering once per day
  React.useEffect(() => {
    console.log('🎯 DroppableDayContainer MOUNTED for day', dayIndex, '- drop ref attached:', !!drop);
  }, []);

  return (
    <div
      ref={drop}
      className={`droppable-day-container ${isActive ? 'active' : ''} ${isOver ? 'over' : ''}`}
      onMouseEnter={() => console.log('🎯 MOUSE ENTER day container', dayIndex)}
    >
      <div className="day-header">
        <h3>Day {day.day}</h3>
        <span className="location-count">{day.locations.length} locations</span>
      </div>

      <div className="day-content">
        {day.locations.length === 0 ? (
          <div className="empty-day">
            <div className="empty-icon">📍</div>
            <p>Drop locations here for Day {day.day}</p>
          </div>
        ) : (
          <div className="day-locations">
            {day.locations.map((location, index) => (
              <DraggableLocationItem
                key={location.id}
                location={location}
                index={index}
                dayIndex={dayIndex}
                onRemove={() => onLocationRemove(location.id, dayIndex)}
                onLocationClick={onLocationClick}
              />
            ))}
          </div>
        )}

        {isActive && (
          <div className="drop-indicator">
            Drop here to add to Day {day.day}
          </div>
        )}
      </div>
    </div>
  );
};

export default DroppableDayContainer;