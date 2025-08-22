import type { User } from 'firebase/auth'
import { getUserTrips } from '../services/trips'
import type { TripSummary } from '../types/Trip'

// Cache to store location-trip mappings to avoid repeated database calls
const locationTripCache = new Map<string, { trips: string[], timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export const getTripsContainingLocation = async (
  user: User | null, 
  locationId: string
): Promise<string[]> => {
  if (!user) return []

  // Check cache first
  const cacheKey = `${user.uid}-${locationId}`
  const cached = locationTripCache.get(cacheKey)
  
  if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
    return cached.trips
  }

  try {
    // Get all user trips
    const trips = await getUserTrips(user)
    const tripsContainingLocation: string[] = []

    // For each trip, check if any day contains this location
    for (const tripSummary of trips) {
      // We need to check the full trip data to see if location is in any day
      // For now, we'll use a simple approach - this could be optimized
      const { getTrip } = await import('../services/trips')
      const fullTrip = await getTrip(tripSummary.id)
      
      if (fullTrip) {
        const hasLocation = fullTrip.days.some(day => 
          day.locations.includes(locationId)
        )
        
        if (hasLocation) {
          tripsContainingLocation.push(tripSummary.id)
        }
      }
    }

    // Cache the result
    locationTripCache.set(cacheKey, {
      trips: tripsContainingLocation,
      timestamp: Date.now()
    })

    return tripsContainingLocation
  } catch (error) {
    console.error('Error getting trips containing location:', error)
    return []
  }
}

// Clear cache when a location is added or removed from a trip
export const invalidateLocationCache = (userId: string, locationId?: string) => {
  if (locationId) {
    locationTripCache.delete(`${userId}-${locationId}`)
  } else {
    // Clear all cache entries for this user
    const keysToDelete = Array.from(locationTripCache.keys()).filter(key => 
      key.startsWith(`${userId}-`)
    )
    keysToDelete.forEach(key => locationTripCache.delete(key))
  }
}

export const getTripNamesForLocation = async (
  user: User | null,
  locationId: string
): Promise<string[]> => {
  if (!user) return []

  try {
    const tripIds = await getTripsContainingLocation(user, locationId)
    const trips = await getUserTrips(user)
    
    return trips
      .filter(trip => tripIds.includes(trip.id))
      .map(trip => trip.name)
  } catch (error) {
    console.error('Error getting trip names for location:', error)
    return []
  }
}