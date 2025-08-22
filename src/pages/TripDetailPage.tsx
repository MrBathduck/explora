import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDrop, useDrag } from 'react-dnd'
import type { User } from 'firebase/auth'
import { getTrip, updateTrip, generateDateRange, removeLocationFromDay, moveLocationBetweenDays, checkDailyCapacity, TRIP_CONFIG } from '../services/trips'
import { sampleLocations } from '../data/sampleLocations'
import type { Trip } from '../types/Trip'
import type { Location } from '../types/Location'
import DraggableLocationCard from '../components/trip/DraggableLocationCard'
import DroppableDayContainer from '../components/trip/DroppableDayContainer'
import LocationModal from '../components/location/LocationModal'
import Map from '../components/location/Map'
import { useNotifications } from '../hooks/useNotifications'
import NotificationSystem from '../components/layout/NotificationSystem'
import './TripDetailPage.css'
import '../components/DragAndDrop.css'


// Simple draggable card for edit trip page
interface EditTripDraggableCardProps {
  location: Location;
  index: number;
  dayIndex: number;
  onRemove: () => void;
  onClick: () => void;
}

const EditTripDraggableCard: React.FC<EditTripDraggableCardProps> = ({
  location,
  index,
  dayIndex,
  onRemove,
  onClick
}) => {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: 'location',
    item: () => {
      console.log('🎯 DRAG BEGIN (Edit Trip):', location.name, 'from day', dayIndex);
      return {
        id: location.id,
        location,
        fromDayIndex: dayIndex
      };
    },
    end: (item, monitor) => {
      console.log('🎯 DRAG END (Edit Trip):', location.name, 'success:', monitor.didDrop());
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.remove-btn')) {
      return;
    }
    onClick();
  };

  return (
    <div
      ref={dragRef}
      className={`edit-trip-location-card ${isDragging ? 'dragging' : ''}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      onClick={handleCardClick}
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
          e.stopPropagation();
          onRemove();
        }}
        title="Remove from this day"
      >
        ✕
      </button>
      <div className="drag-handle" title="Drag to move to another day">
        ⋮⋮
      </div>
    </div>
  );
};

interface TripDetailPageProps {
  user: User | null
  favorites: string[]
  onToggleFavorite: (locationId: string) => void
}

const TripDetailPage: React.FC<TripDetailPageProps> = ({ user, favorites, onToggleFavorite }) => {
  const { tripId } = useParams<{ tripId: string }>()
  const [trip, setTrip] = useState<Trip | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedDay, setSelectedDay] = useState(0)
  const [editMode, setEditMode] = useState(false)
  const [editFormData, setEditFormData] = useState({ name: '', description: '', startDate: '', endDate: '' })
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [showLocationModal, setShowLocationModal] = useState(false)
  const { notifications, removeNotification, showSuccess, showError } = useNotifications()

  useEffect(() => {
    if (tripId) {
      loadTrip(tripId)
    }
  }, [tripId])

  const loadTrip = async (id: string) => {
    setLoading(true)
    try {
      const tripData = await getTrip(id)
      setTrip(tripData)
      if (tripData) {
        setEditFormData({
          name: tripData.name,
          description: tripData.description || '',
          startDate: tripData.startDate,
          endDate: tripData.endDate
        })
      }
    } catch (error) {
      console.error('Error loading trip:', error)
    }
    setLoading(false)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getDayNumber = (dateString: string, startDate: string) => {
    const start = new Date(startDate)
    const current = new Date(dateString)
    const diffTime = current.getTime() - start.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays + 1
  }

  const handleSaveEdit = async () => {
    if (!trip || !tripId) return
    
    // Date validation
    if (new Date(editFormData.endDate) < new Date(editFormData.startDate)) {
      showError('End date cannot be before start date')
      return
    }
    
    try {
      // Check if dates changed and regenerate days if needed
      let updatedTrip = { ...trip }
      
      if (editFormData.startDate !== trip.startDate || editFormData.endDate !== trip.endDate) {
        // Regenerate days for new date range
        const newDateRange = generateDateRange(editFormData.startDate, editFormData.endDate)
        const newDays = newDateRange.map(date => {
          // Try to preserve existing day data if it exists
          const existingDay = trip.days.find(day => day.date === date)
          return existingDay || {
            date,
            locations: [],
            notes: ''
          }
        })
        updatedTrip.days = newDays
      }
      
      const success = await updateTrip(tripId, {
        name: editFormData.name,
        description: editFormData.description,
        startDate: editFormData.startDate,
        endDate: editFormData.endDate,
        days: updatedTrip.days
      })
      
      if (success) {
        setTrip({
          ...updatedTrip,
          name: editFormData.name,
          description: editFormData.description,
          startDate: editFormData.startDate,
          endDate: editFormData.endDate
        })
        setEditMode(false)
        showSuccess('Trip updated successfully!')
      } else {
        showError('Failed to update trip')
      }
    } catch (error) {
      console.error('Error updating trip:', error)
      showError('Failed to update trip')
    }
  }

  const handleCancelEdit = () => {
    if (trip) {
      setEditFormData({
        name: trip.name,
        description: trip.description || '',
        startDate: trip.startDate,
        endDate: trip.endDate
      })
    }
    setEditMode(false)
  }

  const handleLocationClick = (location: Location) => {
    setSelectedLocation(location)
    setShowLocationModal(true)
  }

  const handleCloseLocationModal = () => {
    setShowLocationModal(false)
    setSelectedLocation(null)
  }

  const handleRemoveLocationFromTrip = async (locationId: string, dayDate: string) => {
    if (!trip || !tripId) return
    
    try {
      const success = await removeLocationFromDay(tripId, dayDate, locationId)
      if (success) {
        // Update local state
        const updatedTrip = {
          ...trip,
          days: trip.days.map(day => {
            if (day.date === dayDate) {
              return {
                ...day,
                locations: day.locations.filter(id => id !== locationId)
              }
            }
            return day
          })
        }
        setTrip(updatedTrip)
        showSuccess('Location removed from trip')
      } else {
        showError('Failed to remove location')
      }
    } catch (error) {
      console.error('Error removing location:', error)
      showError('Failed to remove location')
    }
  }

  const handleMoveLocationBetweenDays = async (locationId: string, fromDayDate: string, toDayDate: string) => {
    if (!trip || !tripId) return
    
    try {
      const success = await moveLocationBetweenDays(tripId, fromDayDate, toDayDate, locationId)
      if (success) {
        // Update local state
        const updatedTrip = {
          ...trip,
          days: trip.days.map(day => {
            if (day.date === fromDayDate) {
              // Remove from source day
              return {
                ...day,
                locations: day.locations.filter(id => id !== locationId)
              }
            } else if (day.date === toDayDate) {
              // Add to target day (avoid duplicates)
              if (!day.locations.includes(locationId)) {
                return {
                  ...day,
                  locations: [...day.locations, locationId]
                }
              }
            }
            return day
          })
        }
        setTrip(updatedTrip)
        showSuccess('Location moved to different day')
      } else {
        showError('Failed to move location')
      }
    } catch (error) {
      console.error('Error moving location between days:', error)
      showError('Failed to move location')
    }
  }

  // New handlers for the updated DroppableDayContainer interface
  const handleLocationDrop = async (locationId: string, dayIndex: number) => {
    // This handles adding new locations from outside sources (not implemented in edit mode)
    console.log('Location drop not implemented in edit mode')
  }

  const handleLocationMove = async (locationId: string, fromDayIndex: number, toDayIndex: number) => {
    if (!trip || fromDayIndex === toDayIndex) return
    
    const fromDay = trip.days[fromDayIndex]
    const toDay = trip.days[toDayIndex]
    
    if (!fromDay || !toDay) return
    
    await handleMoveLocationBetweenDays(locationId, fromDay.date, toDay.date)
  }

  const handleLocationRemoveFromDay = async (locationId: string, dayIndex: number) => {
    if (!trip) return
    
    const day = trip.days[dayIndex]
    if (!day) return
    
    await handleRemoveLocationFromTrip(locationId, day.date)
  }

  if (loading) {
    return (
      <div className="trip-detail-page">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading trip details...</p>
        </div>
      </div>
    )
  }

  if (!trip) {
    return (
      <div className="trip-detail-page">
        <div className="error-state">
          <h2>Trip Not Found</h2>
          <p>The trip you're looking for doesn't exist or you don't have permission to view it.</p>
          <Link to="/trips" className="back-button">← Back to Trips</Link>
        </div>
      </div>
    )
  }

  const currentDay = trip.days[selectedDay]
  const dayLocations = currentDay ? 
    sampleLocations.filter(location => currentDay.locations.includes(location.id)) : 
    []

  return (
    <div className="trip-detail-page">
      <NotificationSystem 
        notifications={notifications}
        onRemove={removeNotification}
      />
      {/* Trip Header */}
      <div className="trip-header">
        <div className="trip-header-content">
          <div className="trip-breadcrumb">
            <Link to="/trips">← All Trips</Link>
          </div>
          
          <div className="trip-title-section">
            {editMode ? (
              <div className="edit-form">
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                  className="edit-title-input"
                  placeholder="Trip name"
                />
                <textarea
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                  className="edit-description-input"
                  placeholder="Trip description (optional)"
                  rows={2}
                />
                <div className="edit-dates-row">
                  <div className="edit-date-field">
                    <label>Start Date</label>
                    <input
                      type="date"
                      value={editFormData.startDate}
                      onChange={(e) => setEditFormData({...editFormData, startDate: e.target.value})}
                      className="edit-date-input"
                    />
                  </div>
                  <div className="edit-date-field">
                    <label>End Date</label>
                    <input
                      type="date"
                      value={editFormData.endDate}
                      onChange={(e) => setEditFormData({...editFormData, endDate: e.target.value})}
                      className="edit-date-input"
                      min={editFormData.startDate}
                    />
                  </div>
                </div>
                <div className="edit-actions">
                  <button onClick={handleSaveEdit} className="save-btn">💾 Save</button>
                  <button onClick={handleCancelEdit} className="cancel-btn">❌ Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <div className="title-with-edit">
                  <h1>{trip.name}</h1>
                  {user && user.uid === trip.createdBy && (
                    <button onClick={() => setEditMode(true)} className="edit-trip-btn">✏️ Edit</button>
                  )}
                </div>
                {trip.description && <p className="trip-description">{trip.description}</p>}
              </>
            )}
          </div>
          
          <div className="trip-meta">
            <span className="trip-city">📍 {trip.city}</span>
            <span className="trip-dates">
              📅 {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
            </span>
            <span className="trip-duration">
              ⏱️ {trip.days.length} day{trip.days.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Day Tabs - Clean Navigation with Drop Zones */}
      <div className="day-tabs">
        <div className="day-tabs-container">
          {trip.days.map((day, index) => {
            // Each tab is a drop zone but looks like original tabs
            const [{ isOver, canDrop }, dropRef] = useDrop(() => ({
              accept: 'location',
              drop: (item: { id: string; location: Location; fromDayIndex?: number }) => {
                console.log('🎯 DROPPED on day tab', index, '- item:', item.location?.name || item.id, 'from day:', item.fromDayIndex);
                if (item.fromDayIndex !== undefined && item.fromDayIndex !== index) {
                  handleLocationMove(item.id, item.fromDayIndex, index);
                }
              },
              collect: (monitor) => ({
                isOver: monitor.isOver(),
                canDrop: monitor.canDrop(),
              }),
            }));

            return (
              <button
                key={day.date}
                ref={dropRef}
                className={`day-tab ${selectedDay === index ? 'active' : ''} ${isOver && canDrop ? 'day-tab-drop-active' : ''}`}
                onClick={() => setSelectedDay(index)}
              >
                <div className="day-tab-label">Day {getDayNumber(day.date, trip.startDate)}</div>
                <div className="day-tab-date">{new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                <div className="day-tab-count">{day.locations.length} places</div>
                {isOver && canDrop && (
                  <div className="drop-indicator-small">Drop here</div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Trip Content */}
      <div className="trip-content">
        <div className="content-container">
          <div className="itinerary-panel">
            <div className="day-header">
              <div className="day-header-main">
                <h2>Day {getDayNumber(currentDay.date, trip.startDate)}</h2>
                <p className="day-date">{formatDate(currentDay.date)}</p>
              </div>
              <div className="day-capacity-indicator">
                {(() => {
                  const locationCount = currentDay.locations.length;
                  const capacityCheck = checkDailyCapacity(locationCount);
                  const percentage = Math.min((locationCount / TRIP_CONFIG.MAX_ACTIVITIES_PER_DAY) * 100, 100);
                  
                  let statusClass = 'capacity-good';
                  if (capacityCheck.isAtLimit) statusClass = 'capacity-full';
                  else if (locationCount >= TRIP_CONFIG.MIN_ACTIVITIES_FOR_WARNING) statusClass = 'capacity-warning';
                  
                  return (
                    <div className={`capacity-bar ${statusClass}`}>
                      <div className="capacity-text">
                        {locationCount}/{TRIP_CONFIG.MAX_ACTIVITIES_PER_DAY} activities
                      </div>
                      <div className="capacity-progress">
                        <div 
                          className="capacity-fill" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      {capacityCheck.warning && (
                        <div className="capacity-warning-text">
                          {capacityCheck.warning}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>

            <div className="day-locations-list">
              {dayLocations.length > 0 ? (
                dayLocations.map((location, index) => (
                  <EditTripDraggableCard
                    key={location.id}
                    location={location}
                    index={index}
                    dayIndex={selectedDay}
                    onRemove={() => handleRemoveLocationFromTrip(location.id, currentDay.date)}
                    onClick={() => handleLocationClick(location)}
                  />
                ))
              ) : (
                <div className="empty-day">
                  <div className="empty-icon">📍</div>
                  <h3>No locations planned</h3>
                  <p>This day doesn't have any locations yet. Add some places to your itinerary!</p>
                </div>
              )}
            </div>

            <div className="add-more-locations">
              <Link to={`/?tripId=${tripId}&dayDate=${currentDay.date}`} className="add-more-btn">
                ➕ Add More Locations to This Day
              </Link>
            </div>

            {currentDay.notes && (
              <div className="day-notes">
                <h3>Notes</h3>
                <p>{currentDay.notes}</p>
              </div>
            )}
          </div>
          
          <div className="map-panel">
            <Map 
              locations={dayLocations} 
              favorites={favorites}
            />
          </div>
        </div>
      </div>
      
      {/* Location Modal */}
      {selectedLocation && (
        <LocationModal
          location={selectedLocation}
          isOpen={showLocationModal}
          onClose={handleCloseLocationModal}
          isFavorite={favorites.includes(selectedLocation.id)}
          onToggleFavorite={onToggleFavorite}
          user={user}
          onLocationRemoved={() => {
            // Refresh the trip data to show updated locations
            if (tripId) loadTrip(tripId)
          }}
        />
      )}
    </div>
  )
}

export default TripDetailPage