import React from 'react';
import { useDrop } from 'react-dnd';
import { ITEM_TYPE } from './DraggableLocationCard';

interface DragItem {
  locationId: string;
  fromDayDate: string;
}

interface DroppableDayContainerProps {
  dayDate: string;
  children: React.ReactNode;
  onDropLocation: (locationId: string, fromDayDate: string, toDayDate: string) => void;
  className?: string;
}

const DroppableDayContainer: React.FC<DroppableDayContainerProps> = ({
  dayDate,
  children,
  onDropLocation,
  className = ""
}) => {
  const [{ isOver, canDrop }, dropRef] = useDrop({
    accept: ITEM_TYPE,
    drop: (item: DragItem) => {
      if (item.fromDayDate !== dayDate) {
        onDropLocation(item.locationId, item.fromDayDate, dayDate);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop() && monitor.getItem()?.fromDayDate !== dayDate,
    }),
  });

  const dropZoneStyle = {
    backgroundColor: isOver && canDrop ? 'rgba(74, 144, 226, 0.1)' : 'transparent',
    borderColor: isOver && canDrop ? '#4a90e2' : 'transparent',
    borderWidth: '2px',
    borderStyle: 'dashed',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    minHeight: '100px',
  };

  return (
    <div 
      ref={dropRef} 
      style={dropZoneStyle}
      className={`droppable-day-container ${className}`}
    >
      {isOver && canDrop && (
        <div className="drop-indicator">
          <span>📍 Drop location here</span>
        </div>
      )}
      {children}
    </div>
  );
};

export default DroppableDayContainer;