import { useState, useEffect, useRef, useMemo } from 'react'
import type { User } from 'firebase/auth'
import { getUserTrips, addLocationToDay, removeLocationFromDay } from '../../services/trips'
import type { TripSummary } from '../../types/Trip'
import { getTripsContainingLocation, invalidateLocationCache } from '../../utils/tripLocationUtils'
import { useDropdown } from '../../contexts/DropdownContext'
import './AddToTripButton.css'

interface AddToTripButtonProps {
  user: User | null
  locationId: string
  locationName: string
  onAdded?: () => void
  onRemoved?: () => void
  currentTripIds?: string[]
  targetTripId?: string | null
  targetDayDate?: string | null
}

const AddToTripButton: React.FC<AddToTripButtonProps> = ({ 
  user, 
  locationId, 
  locationName,
  onAdded,
  onRemoved,
  currentTripIds = [],
  targetTripId,
  targetDayDate
}) => {
  const buttonId = useMemo(() => `add-to-trip-${locationId}-${Math.random().toString(36).substr(2, 9)}`, [locationId])
  const { activeDropdownId, setActiveDropdownId } = useDropdown()
  const showDropdown = activeDropdownId === buttonId
  const [trips, setTrips] = useState<TripSummary[]>([])
  const [loading, setLoading] = useState(false)
  const [actualCurrentTripIds, setActualCurrentTripIds] = useState<string[]>(currentTripIds)
  const [showSuccess, setShowSuccess] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (showDropdown && user) {
      loadUserTrips()
      loadCurrentTripIds()
      positionDropdown()
      
      // Reposition on window resize or scroll
      const handleReposition = () => positionDropdown()
      window.addEventListener('resize', handleReposition)
      window.addEventListener('scroll', handleReposition)
      
      return () => {
        window.removeEventListener('resize', handleReposition)
        window.removeEventListener('scroll', handleReposition)
      }
    }
  }, [showDropdown, user])

  const positionDropdown = () => {
    if (!containerRef.current || !dropdownRef.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    const dropdown = dropdownRef.current
    const viewportHeight = window.innerHeight
    const viewportWidth = window.innerWidth
    const dropdownHeight = 400 // max-height from CSS
    const dropdownWidth = 320
    
    // Calculate position with smart positioning
    let left = rect.left - dropdownWidth + 40 // Position to the left of button
    let top = rect.bottom + 8
    
    // Adjust horizontal position if it would go off-screen
    if (left < 10) {
      left = Math.min(rect.right - 40, viewportWidth - dropdownWidth - 10)
    }
    if (left + dropdownWidth > viewportWidth - 10) {
      left = viewportWidth - dropdownWidth - 10
    }
    
    // Adjust vertical position if it would go off-screen (show above button)
    if (top + dropdownHeight > viewportHeight - 20) {
      top = rect.top - dropdownHeight - 8
      // If still doesn't fit above, position in the middle of viewport
      if (top < 20) {
        top = Math.max(20, (viewportHeight - dropdownHeight) / 2)
      }
    }
    
    dropdown.style.left = `${left}px`
    dropdown.style.top = `${top}px`
  }

  const loadUserTrips = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const userTrips = await getUserTrips(user)
      setTrips(userTrips)
    } catch (error) {
      console.error('Error loading trips:', error)
    }
    setLoading(false)
  }

  const loadCurrentTripIds = async () => {
    if (!user) return
    
    try {
      const tripIds = await getTripsContainingLocation(user, locationId)
      setActualCurrentTripIds(tripIds)
    } catch (error) {
      console.error('Error loading current trip IDs:', error)
    }
  }

  const handleAddToTrip = async (tripId: string, tripName: string) => {
    if (!user) return
    
    try {
      // Get the full trip to find the target day or first day
      const { getTrip } = await import('../../services/trips')
      const trip = await getTrip(tripId)
      
      if (!trip || trip.days.length === 0) {
        console.error('Trip not found or has no days')
        return
      }
      
      // Use target day if provided and this is the target trip, otherwise use first day
      let dayToAddTo = trip.days[0].date
      if (targetTripId === tripId && targetDayDate) {
        // Verify the target day exists in this trip
        const targetDayExists = trip.days.some(day => day.date === targetDayDate)
        if (targetDayExists) {
          dayToAddTo = targetDayDate
        }
      }
      
      console.log(`Adding ${locationName} to trip ${tripName} on day ${dayToAddTo}`)
      
      const result = await addLocationToDay(tripId, dayToAddTo, locationId)
      if (result.success) {
        console.log(`Successfully added ${locationName} to ${tripName}`)
        // Invalidate cache and refresh current trip IDs
        invalidateLocationCache(user.uid, locationId)
        await loadCurrentTripIds()
        
        if (onAdded) onAdded()
        setActiveDropdownId(null)
        // Show success visual indicator
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 2000) // Hide after 2 seconds
        
        // Show warning if near capacity
        if (result.warning) {
          console.warn(`Planning warning: ${result.warning}`)
          // Could show a toast notification here
        }
      } else {
        console.error('Failed to add location to trip:', result.error)
        // Show error message to user
        alert(result.error || 'Failed to add location to trip')
      }
    } catch (error) {
      console.error('Error adding location to trip:', error)
      // Removed alert - will be handled by parent component
    }
  }

  const handleRemoveFromTrip = async (tripId: string, tripName: string) => {
    if (!user) return
    
    try {
      // Get the full trip to find the location on which day
      const { getTrip } = await import('../../services/trips')
      const trip = await getTrip(tripId)
      
      if (!trip) {
        console.error('Trip not found')
        return
      }
      
      // Find which day contains this location
      const dayWithLocation = trip.days.find(day => day.locations.includes(locationId))
      if (!dayWithLocation) {
        console.error('Location not found in any day of this trip')
        return
      }
      
      console.log(`Removing ${locationName} from trip ${tripName} on day ${dayWithLocation.date}`)
      
      const success = await removeLocationFromDay(tripId, dayWithLocation.date, locationId)
      if (success) {
        console.log(`Successfully removed ${locationName} from ${tripName}`)
        // Invalidate cache and refresh current trip IDs
        invalidateLocationCache(user.uid, locationId)
        await loadCurrentTripIds()
        
        if (onRemoved) onRemoved()
        setActiveDropdownId(null)
      } else {
        console.error('Failed to remove location from trip')
      }
    } catch (error) {
      console.error('Error removing location from trip:', error)
    }
  }

  if (!user) return null

  const isInAnyTrip = actualCurrentTripIds.length > 0
  const buttonTitle = showSuccess ? "Added to trip!" : (isInAnyTrip ? "In trip - click to manage" : "Add to trip")

  return (
    <div className="add-to-trip-container" ref={containerRef}>
      <button 
        className={`add-to-trip-btn ${showSuccess ? 'success' : ''} ${isInAnyTrip ? 'in-trip' : ''}`}
        onClick={(e) => {
          e.stopPropagation()
          if (!showSuccess) { // Prevent clicking when showing success state
            setActiveDropdownId(showDropdown ? null : buttonId)
          }
        }}
        title={buttonTitle}
        disabled={showSuccess}
      >
        {showSuccess ? '✅' : (isInAnyTrip ? '✅' : '➕')}
      </button>
      
      {showDropdown && (
        <div 
          className="trip-dropdown" 
          ref={dropdownRef}
        >
          <div className="dropdown-header">
            <h4>Add to Trip</h4>
            <button 
              className="close-dropdown"
              onClick={() => setActiveDropdownId(null)}
            >
              ✕
            </button>
          </div>
          
          {loading ? (
            <div className="dropdown-loading">Loading trips...</div>
          ) : trips.length === 0 ? (
            <div className="no-trips">
              <p>No trips yet</p>
              <a href="/trips" onClick={() => setActiveDropdownId(null)}>
                Create your first trip
              </a>
            </div>
          ) : (
            <div className="trips-list">
              {trips.map((trip) => {
                const isLocationInTrip = actualCurrentTripIds.includes(trip.id)
                return (
                  <div key={trip.id} className="trip-option-container">
                    <div className="trip-option-info">
                      <div className="trip-option-name">{trip.name}</div>
                      <div className="trip-option-dates">
                        {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                      </div>
                    </div>
                    
                    {isLocationInTrip ? (
                      <button
                        className="trip-option-btn remove"
                        onClick={() => handleRemoveFromTrip(trip.id, trip.name)}
                        title={`Remove from ${trip.name}`}
                      >
                        ➖ Remove
                      </button>
                    ) : (
                      <button
                        className="trip-option-btn add"
                        onClick={() => handleAddToTrip(trip.id, trip.name)}
                        title={`Add to ${trip.name}`}
                      >
                        ➕ Add
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AddToTripButton