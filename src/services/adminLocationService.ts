// 🛠️ Admin Location Service - Firebase CRUD operations for location management
// Handles all database operations for the admin dashboard

import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Location } from '../types/Location';
import { validateLocationWithQualityControl, analyzePerformanceConcerns } from '../utils/validateLocationTags';
import type { LocationValidationResult } from '../utils/validateLocationTags';

// Enhanced location type for database operations
export interface DatabaseLocation extends Location {
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  createdBy?: string;
  verified?: boolean;
  verifiedBy?: string;
  verifiedAt?: Timestamp;
}

// Collection reference
const LOCATIONS_COLLECTION = 'locations';

// ================================================
// READ OPERATIONS
// ================================================

/**
 * Get all locations from Firebase
 */
export async function getAllLocations(): Promise<DatabaseLocation[]> {
  try {
    const locationsRef = collection(db, LOCATIONS_COLLECTION);
    const q = query(locationsRef, orderBy('updatedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const locations: DatabaseLocation[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      locations.push({
        id: doc.id,
        ...data,
        // Ensure coordinates are properly formatted
        coordinates: data.coordinates || { lat: 0, lng: 0 },
        // Ensure tags structure exists
        tags: {
          primary: data.tags?.primary || [],
          secondary: data.tags?.secondary || [],
          hidden: data.tags?.hidden || [],
          contextual: data.tags?.contextual || []
        }
      } as DatabaseLocation);
    });
    
    return locations;
  } catch (error) {
    console.error('Error fetching locations:', error);
    throw new Error('Failed to fetch locations from database');
  }
}

/**
 * Get a single location by ID
 */
export async function getLocationById(locationId: string): Promise<DatabaseLocation | null> {
  try {
    const locationRef = doc(db, LOCATIONS_COLLECTION, locationId);
    const querySnapshot = await getDocs(query(collection(db, LOCATIONS_COLLECTION), where('__name__', '==', locationId)));
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const docSnap = querySnapshot.docs[0];
    const data = docSnap.data();
    
    return {
      id: docSnap.id,
      ...data,
      coordinates: data.coordinates || { lat: 0, lng: 0 },
      tags: {
        primary: data.tags?.primary || [],
        secondary: data.tags?.secondary || [],
        hidden: data.tags?.hidden || [],
        contextual: data.tags?.contextual || []
      }
    } as DatabaseLocation;
  } catch (error) {
    console.error('Error fetching location:', error);
    throw new Error(`Failed to fetch location: ${locationId}`);
  }
}

// ================================================
// WRITE OPERATIONS
// ================================================

/**
 * Add a new location to Firebase
 */
export async function addLocation(
  locationData: Omit<Location, 'id'>, 
  userId?: string
): Promise<string> {
  try {
    // Validate the location data first
    const tempLocation = { ...locationData, id: 'temp' } as Location;
    const validation = validateLocationWithQualityControl(tempLocation);
    
    if (!validation.isValid) {
      throw new Error(`Location validation failed: ${validation.errors.join(', ')}`);
    }
    
    // Prepare data for Firebase
    const dbLocation: Omit<DatabaseLocation, 'id'> = {
      ...locationData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      createdBy: userId || 'anonymous',
      verified: false
    };
    
    const locationsRef = collection(db, LOCATIONS_COLLECTION);
    const docRef = await addDoc(locationsRef, dbLocation);
    
    console.log('Location added successfully:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding location:', error);
    throw new Error(`Failed to add location: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Update an existing location in Firebase
 */
export async function updateLocation(
  locationId: string, 
  locationData: Partial<Location>
): Promise<void> {
  try {
    // If updating core location data, validate it
    if (locationData.tags) {
      const tempLocation = { 
        id: locationId, 
        name: 'temp',
        description: 'temp',
        category: 'temp',
        image: 'temp',
        coordinates: { lat: 0, lng: 0 },
        ...locationData 
      } as Location;
      
      const validation = validateLocationWithQualityControl(tempLocation);
      
      if (!validation.isValid) {
        throw new Error(`Location validation failed: ${validation.errors.join(', ')}`);
      }
    }
    
    const locationRef = doc(db, LOCATIONS_COLLECTION, locationId);
    const updateData = {
      ...locationData,
      updatedAt: Timestamp.now()
    };
    
    await updateDoc(locationRef, updateData);
    console.log('Location updated successfully:', locationId);
  } catch (error) {
    console.error('Error updating location:', error);
    throw new Error(`Failed to update location: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Delete a location from Firebase
 */
export async function deleteLocation(locationId: string): Promise<void> {
  try {
    const locationRef = doc(db, LOCATIONS_COLLECTION, locationId);
    await deleteDoc(locationRef);
    console.log('Location deleted successfully:', locationId);
  } catch (error) {
    console.error('Error deleting location:', error);
    throw new Error(`Failed to delete location: ${locationId}`);
  }
}

// ================================================
// QUALITY CONTROL & ANALYTICS
// ================================================

/**
 * Analyze all locations and return quality report
 */
export async function analyzeLocationQuality(): Promise<{
  totalLocations: number;
  validLocations: number;
  averageQuality: number;
  crossCategoryLocations: number;
  topQuality: LocationValidationResult[];
  needsImprovement: LocationValidationResult[];
  performanceAnalysis: ReturnType<typeof analyzePerformanceConcerns>;
}> {
  try {
    const locations = await getAllLocations();
    const results = locations.map(location => validateLocationWithQualityControl(location));
    
    const validCount = results.filter(r => r.isValid).length;
    const averageQuality = results.reduce((sum, r) => sum + r.qualityScore, 0) / results.length;
    const crossCategoryCount = results.filter(r => r.crossCategoryAnalysis.diversity > 0.33).length;
    
    const topQuality = results
      .filter(r => r.qualityScore >= 80)
      .sort((a, b) => b.qualityScore - a.qualityScore)
      .slice(0, 5);
      
    const needsImprovement = results
      .filter(r => r.qualityScore < 60)
      .sort((a, b) => a.qualityScore - b.qualityScore)
      .slice(0, 10);
    
    const performanceAnalysis = analyzePerformanceConcerns(locations);
    
    return {
      totalLocations: locations.length,
      validLocations: validCount,
      averageQuality: Math.round(averageQuality),
      crossCategoryLocations: crossCategoryCount,
      topQuality,
      needsImprovement,
      performanceAnalysis
    };
  } catch (error) {
    console.error('Error analyzing location quality:', error);
    throw new Error('Failed to analyze location quality');
  }
}

/**
 * Get locations by quality score range
 */
export async function getLocationsByQuality(
  minScore: number = 0, 
  maxScore: number = 100
): Promise<LocationValidationResult[]> {
  try {
    const locations = await getAllLocations();
    const results = locations.map(location => validateLocationWithQualityControl(location));
    
    return results.filter(result => 
      result.qualityScore >= minScore && result.qualityScore <= maxScore
    ).sort((a, b) => b.qualityScore - a.qualityScore);
  } catch (error) {
    console.error('Error filtering locations by quality:', error);
    throw new Error('Failed to filter locations by quality');
  }
}

/**
 * Verify a location (mark as admin-approved)
 */
export async function verifyLocation(locationId: string, userId?: string): Promise<void> {
  try {
    await updateLocation(locationId, {
      verified: true,
      verifiedBy: userId || 'admin',
      verifiedAt: Timestamp.now()
    } as any);
    console.log('Location verified:', locationId);
  } catch (error) {
    console.error('Error verifying location:', error);
    throw new Error(`Failed to verify location: ${locationId}`);
  }
}

// ================================================
// BULK OPERATIONS
// ================================================

/**
 * Bulk import locations from JSON data
 */
export async function bulkImportLocations(
  locations: Omit<Location, 'id'>[], 
  userId?: string
): Promise<{
  successful: string[];
  failed: Array<{ location: Omit<Location, 'id'>; error: string }>;
}> {
  const successful: string[] = [];
  const failed: Array<{ location: Omit<Location, 'id'>; error: string }> = [];
  
  for (const location of locations) {
    try {
      const id = await addLocation(location, userId);
      successful.push(id);
    } catch (error) {
      failed.push({ location, error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }
  
  return { successful, failed };
}

/**
 * Export all locations to JSON format
 */
export async function exportLocations(): Promise<DatabaseLocation[]> {
  try {
    return await getAllLocations();
  } catch (error) {
    console.error('Error exporting locations:', error);
    throw new Error('Failed to export locations');
  }
}