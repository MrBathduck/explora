import { 
  collection,
  doc, 
  setDoc, 
  getDoc,
  getDocs,
  updateDoc, 
  deleteDoc,
  query,
  where,
  limit
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { User } from 'firebase/auth';
import type { Trip, TripSummary, ItineraryDay } from '../types/Trip';

// Trip planning configuration
export const TRIP_CONFIG = {
  MAX_ACTIVITIES_PER_DAY: 8, // Maximum activities per day to prevent overplanning
  RECOMMENDED_ACTIVITIES_PER_DAY: 5, // Recommended number for optimal experience
  MIN_ACTIVITIES_FOR_WARNING: 6 // Show warning after this many activities
};

// Generate unique trip ID
const generateTripId = (): string => {
  return `trip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Generate date range for trip
export const generateDateRange = (startDate: string, endDate: string): string[] => {
  const dates: string[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    dates.push(d.toISOString().split('T')[0]);
  }
  
  return dates;
};

// Check if adding a location would exceed daily limits
export const checkDailyCapacity = (currentLocationCount: number): {
  canAdd: boolean;
  warning: string | null;
  isAtLimit: boolean;
} => {
  const isAtLimit = currentLocationCount >= TRIP_CONFIG.MAX_ACTIVITIES_PER_DAY;
  const isNearLimit = currentLocationCount >= TRIP_CONFIG.MIN_ACTIVITIES_FOR_WARNING;
  
  if (isAtLimit) {
    return {
      canAdd: false,
      warning: `Maximum ${TRIP_CONFIG.MAX_ACTIVITIES_PER_DAY} activities per day reached. Consider spreading activities across multiple days for a better experience.`,
      isAtLimit: true
    };
  }
  
  if (isNearLimit) {
    return {
      canAdd: true,
      warning: `You have ${currentLocationCount} activities planned. We recommend keeping it under ${TRIP_CONFIG.RECOMMENDED_ACTIVITIES_PER_DAY} for an enjoyable pace.`,
      isAtLimit: false
    };
  }
  
  return {
    canAdd: true,
    warning: null,
    isAtLimit: false
  };
};

// Create a new trip
export const createTrip = async (
  user: User, 
  tripData: Omit<Trip, 'id' | 'userId' | 'createdBy' | 'createdAt' | 'updatedAt'>
): Promise<Trip | null> => {
  try {
    console.log('Starting trip creation for user:', user.uid);
    console.log('Trip data received:', tripData);
    
    const tripId = generateTripId();
    const now = new Date();
    
    // Generate days array based on date range
    const dateRange = generateDateRange(tripData.startDate, tripData.endDate);
    console.log('Generated date range:', dateRange);
    
    const days: ItineraryDay[] = dateRange.map(date => ({
      date,
      locations: [],
      notes: ''
    }));
    
    const trip: Trip = {
      ...tripData,
      id: tripId,
      days,
      userId: user.uid,
      createdBy: user.uid, // Keep for backward compatibility
      createdAt: now,
      updatedAt: now
    };

    console.log('Attempting to save trip to Firestore:', tripId);
    await setDoc(doc(db, 'userTrips', tripId), trip);
    console.log('Trip saved successfully to Firestore:', tripId);
    
    return trip;
  } catch (error) {
    console.error('Error creating trip:', error);
    console.error('Error details:', (error as any).message, (error as any).code);
    return null;
  }
};

// Get user's trips
export const getUserTrips = async (user: User): Promise<TripSummary[]> => {
  try {
    const q = query(
      collection(db, 'userTrips'),
      where('userId', '==', user.uid)
    );
    
    const querySnapshot = await getDocs(q);
    const trips: TripSummary[] = [];
    
    querySnapshot.forEach((doc) => {
      const trip = doc.data() as Trip;
      // Handle Firestore timestamp conversion
      const createdAt = trip.createdAt instanceof Date 
        ? trip.createdAt 
        : new Date((trip.createdAt as any).seconds * 1000);
        
      trips.push({
        id: trip.id,
        name: trip.name,
        city: trip.city,
        startDate: trip.startDate,
        endDate: trip.endDate,
        dayCount: trip.days.length,
        locationCount: trip.days.reduce((total, day) => total + day.locations.length, 0),
        createdAt: createdAt
      });
    });
    
    // Sort by creation date on the client side instead
    trips.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    console.log('Retrieved trips:', trips);
    return trips;
  } catch (error) {
    console.error('Error getting user trips:', error);
    return [];
  }
};

// Get a specific trip
export const getTrip = async (tripId: string): Promise<Trip | null> => {
  try {
    const tripDoc = await getDoc(doc(db, 'userTrips', tripId));
    if (tripDoc.exists()) {
      return tripDoc.data() as Trip;
    }
    return null;
  } catch (error) {
    console.error('Error getting trip:', error);
    return null;
  }
};

// Update trip
export const updateTrip = async (tripId: string, updates: Partial<Trip>): Promise<boolean> => {
  try {
    await updateDoc(doc(db, 'userTrips', tripId), {
      ...updates,
      updatedAt: new Date()
    });
    return true;
  } catch (error) {
    console.error('Error updating trip:', error);
    return false;
  }
};

// Add location to specific day with capacity checking
export const addLocationToDay = async (
  tripId: string, 
  dayDate: string, 
  locationId: string
): Promise<{ success: boolean; warning?: string; error?: string }> => {
  try {
    const trip = await getTrip(tripId);
    if (!trip) return { success: false, error: 'Trip not found' };
    
    // Find the target day and check capacity
    const targetDay = trip.days.find(day => day.date === dayDate);
    if (!targetDay) return { success: false, error: 'Day not found' };
    
    // Check if location is already added
    if (targetDay.locations.includes(locationId)) {
      return { success: true }; // Already added, consider it success
    }
    
    // Check daily capacity before adding
    const capacityCheck = checkDailyCapacity(targetDay.locations.length);
    if (!capacityCheck.canAdd) {
      return { success: false, error: capacityCheck.warning || 'Daily limit reached' };
    }
    
    const updatedDays = trip.days.map(day => {
      if (day.date === dayDate) {
        return {
          ...day,
          locations: [...day.locations, locationId]
        };
      }
      return day;
    });
    
    const updateSuccess = await updateTrip(tripId, { days: updatedDays });
    
    return { 
      success: updateSuccess, 
      warning: capacityCheck.warning || undefined 
    };
  } catch (error) {
    console.error('Error adding location to day:', error);
    return { success: false, error: 'Failed to add location' };
  }
};

// Remove location from day
export const removeLocationFromDay = async (
  tripId: string, 
  dayDate: string, 
  locationId: string
): Promise<boolean> => {
  try {
    const trip = await getTrip(tripId);
    if (!trip) return false;
    
    const updatedDays = trip.days.map(day => {
      if (day.date === dayDate) {
        return {
          ...day,
          locations: day.locations.filter(id => id !== locationId)
        };
      }
      return day;
    });
    
    return await updateTrip(tripId, { days: updatedDays });
  } catch (error) {
    console.error('Error removing location from day:', error);
    return false;
  }
};

// Reorder locations within a day
export const reorderLocationsInDay = async (
  tripId: string, 
  dayDate: string, 
  newLocationOrder: string[]
): Promise<boolean> => {
  try {
    const trip = await getTrip(tripId);
    if (!trip) return false;
    
    const updatedDays = trip.days.map(day => {
      if (day.date === dayDate) {
        return {
          ...day,
          locations: newLocationOrder
        };
      }
      return day;
    });
    
    return await updateTrip(tripId, { days: updatedDays });
  } catch (error) {
    console.error('Error reordering locations:', error);
    return false;
  }
};

// Move location from one day to another
export const moveLocationBetweenDays = async (
  tripId: string,
  fromDayDate: string,
  toDayDate: string,
  locationId: string
): Promise<boolean> => {
  try {
    const trip = await getTrip(tripId);
    if (!trip) return false;
    
    const updatedDays = trip.days.map(day => {
      if (day.date === fromDayDate) {
        // Remove from source day
        return {
          ...day,
          locations: day.locations.filter(id => id !== locationId)
        };
      } else if (day.date === toDayDate) {
        // Add to target day (avoid duplicates)
        if (!day.locations.includes(locationId)) {
          return {
            ...day,
            locations: [...day.locations, locationId]
          };
        }
      }
      return day;
    });
    
    return await updateTrip(tripId, { days: updatedDays });
  } catch (error) {
    console.error('Error moving location between days:', error);
    return false;
  }
};

// Delete trip
export const deleteTrip = async (tripId: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'userTrips', tripId));
    return true;
  } catch (error) {
    console.error('Error deleting trip:', error);
    return false;
  }
};

// Get public trips (for sharing/discovery)
export const getPublicTrips = async (limitCount: number = 10): Promise<TripSummary[]> => {
  try {
    const q = query(
      collection(db, 'userTrips'),
      where('isPublic', '==', true),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const trips: TripSummary[] = [];
    
    querySnapshot.forEach((doc) => {
      const trip = doc.data() as Trip;
      // Handle Firestore timestamp conversion
      const createdAt = trip.createdAt instanceof Date 
        ? trip.createdAt 
        : new Date((trip.createdAt as any).seconds * 1000);
        
      trips.push({
        id: trip.id,
        name: trip.name,
        city: trip.city,
        startDate: trip.startDate,
        endDate: trip.endDate,
        dayCount: trip.days.length,
        locationCount: trip.days.reduce((total, day) => total + day.locations.length, 0),
        createdAt: createdAt
      });
    });
    
    // Sort by creation date on the client side and limit results
    trips.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return trips.slice(0, limitCount);
  } catch (error) {
    console.error('Error getting public trips:', error);
    return [];
  }
};