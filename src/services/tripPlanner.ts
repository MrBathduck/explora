import { 
  collection,
  doc, 
  setDoc, 
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { PlannerTrip } from '../types/Trip';

export const tripsService = {
  // Save a trip to Firebase
  saveTrip: async (trip: PlannerTrip): Promise<void> => {
    try {
      await setDoc(doc(db, 'userTrips', trip.id), {
        ...trip,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error saving trip:', error);
      throw error;
    }
  },

  // Get all trips for a user
  getUserTrips: async (userId: string): Promise<PlannerTrip[]> => {
    try {
      const q = query(
        collection(db, 'userTrips'),
        where('userId', '==', userId)
      );
      
      const querySnapshot = await getDocs(q);
      const trips: PlannerTrip[] = [];
      
      querySnapshot.forEach((doc) => {
        const tripData = doc.data();
        
        // Handle Firestore timestamp conversion
        const trip: PlannerTrip = {
          ...tripData,
          createdAt: tripData.createdAt instanceof Date 
            ? tripData.createdAt 
            : new Date(tripData.createdAt.seconds * 1000),
          updatedAt: tripData.updatedAt instanceof Date 
            ? tripData.updatedAt 
            : new Date(tripData.updatedAt.seconds * 1000),
        } as PlannerTrip;
        
        trips.push(trip);
      });
      
      // Sort by update date
      trips.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
      
      return trips;
    } catch (error) {
      console.error('Error getting user trips:', error);
      throw error;
    }
  },
};