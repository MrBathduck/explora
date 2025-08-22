/**
 * Explora Location Database Service
 * Firebase/Firestore implementation with enhanced schema
 * 
 * Adapted from PostgreSQL design for Firestore NoSQL structure
 */

import { 
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  writeBatch,
  GeoPoint,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { User } from 'firebase/auth';

// Enhanced Types for New Database Schema
export interface EnhancedLocation {
  id: string;
  name: string;
  description: string;
  
  // Geographic data
  coordinates: GeoPoint;
  address?: string;
  cityId: string; // Reference to admin_areas collection
  
  // Enhanced tagging system (aligned with explora tag system)
  tags: {
    primary: string[]; // Layer 1 tags - must have minimum 3 total visible tags
    secondary: string[]; // Layer 2 tags (secondary filters)
    hidden: string[]; // Layer 3 tags (algorithmic only)
    contextual: string[]; // Layer 4 tags (seasonal/contextual)
  };
  
  // Primary category (for organizational purposes)
  primaryCategory: string; // Must be exactly 1 from Layer 1 categories
  
  // Quality and trust
  sourceTrust: number; // 0-100 quality score
  isActive: boolean;
  
  // Media
  primaryImage: string;
  images?: string[];
  
  // Details
  rating?: number;
  duration?: string;
  hours?: string;
  priceRange?: string;
  website?: string;
  phone?: string;
  highlights?: string[];
  
  // Metadata
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy?: string; // User ID
}

export interface Category {
  id: string;
  level: 1 | 2 | 3; // Hierarchy level
  parentId?: string; // Reference to parent category
  slug: string; // URL-friendly identifier
  name: {
    en: string;
    de?: string; // German for Vienna
  };
  icon?: string; // Icon identifier
  color?: string; // Hex color for UI
  sortOrder: number;
  isActive: boolean;
  createdAt: Timestamp;
}

export interface Tag {
  id: string;
  slug: string; // URL-friendly identifier
  name: {
    en: string;
    de?: string;
  };
  type: 'system' | 'user' | 'mood'; // Tag classification
  synonyms?: string[]; // For search matching
  color?: string;
  icon?: string;
  isActive: boolean;
  createdAt: Timestamp;
}

export interface AdminArea {
  id: string;
  level: 'country' | 'region' | 'city' | 'neighborhood';
  name: string;
  slug: string;
  coordinates?: GeoPoint; // Center point
  parentId?: string; // Reference to parent area
  population?: number;
  createdAt: Timestamp;
}

// Database Configuration
export const DB_CONFIG = {
  // Quality thresholds
  MIN_SOURCE_TRUST: 30,
  HIGH_QUALITY_THRESHOLD: 80,
  
  // Tag requirements (from previous implementation)
  MIN_PRIMARY_TAGS: 3,
  MAX_TAGS_PER_LEVEL: 10,
  
  // Collection names
  COLLECTIONS: {
    PLACES: 'places',
    CATEGORIES: 'categories', 
    TAGS: 'tags',
    ADMIN_AREAS: 'admin_areas',
    PLACE_AGGREGATES: 'place_aggregates' // For cached statistics
  }
} as const;

/**
 * Location Database Service Class
 */
export class LocationDatabaseService {
  
  /**
   * Create a new enhanced location
   */
  static async createLocation(locationData: Omit<EnhancedLocation, 'id' | 'createdAt' | 'updatedAt'>, user?: User): Promise<string> {
    const now = Timestamp.now();
    
    // Validate tag requirements according to explora tag system
    const totalVisibleTags = locationData.tags.primary.length + locationData.tags.secondary.length;
    if (totalVisibleTags < DB_CONFIG.MIN_PRIMARY_TAGS) {
      throw new Error(`Minimum ${DB_CONFIG.MIN_PRIMARY_TAGS} total visible tags required (primary + secondary). Current: ${totalVisibleTags}`);
    }
    
    // Must have a primary category
    if (!locationData.primaryCategory) {
      throw new Error('Primary category is required');
    }
    
    const newLocation: Omit<EnhancedLocation, 'id'> = {
      ...locationData,
      createdAt: now,
      updatedAt: now,
      createdBy: user?.uid,
      isActive: true,
      sourceTrust: locationData.sourceTrust || 50
    };
    
    const docRef = await addDoc(collection(db, DB_CONFIG.COLLECTIONS.PLACES), newLocation);
    
    // Update aggregates
    await this.updateLocationAggregates(docRef.id);
    
    return docRef.id;
  }
  
  /**
   * Get location by ID with enhanced data
   */
  static async getLocation(locationId: string): Promise<EnhancedLocation | null> {
    try {
      const docRef = doc(db, DB_CONFIG.COLLECTIONS.PLACES, locationId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as EnhancedLocation;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching location:', error);
      return null;
    }
  }
  
  /**
   * Get locations by city with filtering and pagination
   */
  static async getLocationsByCity(
    cityId: string,
    filters?: {
      categoryLevel1?: string;
      categoryLevel2?: string;
      tags?: string[];
      minRating?: number;
      limit?: number;
    }
  ): Promise<EnhancedLocation[]> {
    try {
      let q = query(
        collection(db, DB_CONFIG.COLLECTIONS.PLACES),
        where('cityId', '==', cityId),
        where('isActive', '==', true),
        orderBy('sourceTrust', 'desc')
      );
      
      // Apply filters
      if (filters?.categoryLevel1) {
        q = query(q, where('primaryCategory', '==', filters.categoryLevel1));
      }
      
      if (filters?.minRating) {
        q = query(q, where('rating', '>=', filters.minRating));
      }
      
      if (filters?.limit) {
        q = query(q, limit(filters.limit));
      }
      
      const querySnapshot = await getDocs(q);
      const locations: EnhancedLocation[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Omit<EnhancedLocation, 'id'>;
        
        // Filter by tags if specified
        if (filters?.tags && filters.tags.length > 0) {
          const hasRequiredTags = filters.tags.some(tag => 
            data.tags.primary.includes(tag) ||
            data.tags.secondary.includes(tag) ||
            data.tags.hidden.includes(tag)
          );
          if (!hasRequiredTags) return;
        }
        
        locations.push({
          id: doc.id,
          ...data
        });
      });
      
      return locations;
    } catch (error) {
      console.error('Error fetching locations by city:', error);
      return [];
    }
  }
  
  /**
   * Search locations by text with enhanced matching
   */
  static async searchLocations(
    searchText: string,
    cityId?: string,
    options?: {
      limit?: number;
      categoryFilter?: string;
    }
  ): Promise<EnhancedLocation[]> {
    try {
      // For now, implement basic text matching
      // In production, consider using Algolia or similar for advanced search
      const searchLower = searchText.toLowerCase();
      
      let q = query(
        collection(db, DB_CONFIG.COLLECTIONS.PLACES),
        where('isActive', '==', true),
        orderBy('sourceTrust', 'desc')
      );
      
      if (cityId) {
        q = query(q, where('cityId', '==', cityId));
      }
      
      if (options?.limit) {
        q = query(q, limit(options.limit));
      }
      
      const querySnapshot = await getDocs(q);
      const locations: EnhancedLocation[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Omit<EnhancedLocation, 'id'>;
        
        // Basic text matching on name and description
        const nameMatch = data.name.toLowerCase().includes(searchLower);
        const descMatch = data.description.toLowerCase().includes(searchLower);
        const tagMatch = [
          ...data.tags.primary,
          ...data.tags.secondary,
          ...data.tags.hidden
        ].some(tag => tag.toLowerCase().includes(searchLower));
        
        if (nameMatch || descMatch || tagMatch) {
          locations.push({
            id: doc.id,
            ...data
          });
        }
      });
      
      return locations;
    } catch (error) {
      console.error('Error searching locations:', error);
      return [];
    }
  }
  
  /**
   * Update location aggregates for performance
   */
  private static async updateLocationAggregates(locationId: string): Promise<void> {
    // This would update cached statistics like tag frequencies, ratings, etc.
    // For now, we'll implement this as needed
    console.log(`Updating aggregates for location ${locationId}`);
  }
  
  /**
   * Batch import locations (for data migration/seeding)
   */
  static async batchImportLocations(locations: Omit<EnhancedLocation, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<void> {
    const batch = writeBatch(db);
    const now = Timestamp.now();
    
    locations.forEach((locationData) => {
      const docRef = doc(collection(db, DB_CONFIG.COLLECTIONS.PLACES));
      const enhancedLocation: Omit<EnhancedLocation, 'id'> = {
        ...locationData,
        createdAt: now,
        updatedAt: now,
        isActive: true,
        sourceTrust: locationData.sourceTrust || 50
      };
      
      batch.set(docRef, enhancedLocation);
    });
    
    await batch.commit();
    console.log(`Batch imported ${locations.length} locations`);
  }
}

/**
 * Category Management Service
 */
export class CategoryService {
  
  /**
   * Create a new category
   */
  static async createCategory(categoryData: Omit<Category, 'id' | 'createdAt'>): Promise<string> {
    const newCategory: Omit<Category, 'id'> = {
      ...categoryData,
      createdAt: Timestamp.now(),
      isActive: true
    };
    
    const docRef = await addDoc(collection(db, DB_CONFIG.COLLECTIONS.CATEGORIES), newCategory);
    return docRef.id;
  }
  
  /**
   * Get category hierarchy
   */
  static async getCategoryHierarchy(): Promise<Category[]> {
    try {
      const q = query(
        collection(db, DB_CONFIG.COLLECTIONS.CATEGORIES),
        where('isActive', '==', true),
        orderBy('level'),
        orderBy('sortOrder')
      );
      
      const querySnapshot = await getDocs(q);
      const categories: Category[] = [];
      
      querySnapshot.forEach((doc) => {
        categories.push({
          id: doc.id,
          ...doc.data()
        } as Category);
      });
      
      return categories;
    } catch (error) {
      console.error('Error fetching category hierarchy:', error);
      return [];
    }
  }
  
  /**
   * Get categories by level
   */
  static async getCategoriesByLevel(level: 1 | 2 | 3, parentId?: string): Promise<Category[]> {
    try {
      let q = query(
        collection(db, DB_CONFIG.COLLECTIONS.CATEGORIES),
        where('level', '==', level),
        where('isActive', '==', true),
        orderBy('sortOrder')
      );
      
      if (parentId) {
        q = query(q, where('parentId', '==', parentId));
      }
      
      const querySnapshot = await getDocs(q);
      const categories: Category[] = [];
      
      querySnapshot.forEach((doc) => {
        categories.push({
          id: doc.id,
          ...doc.data()
        } as Category);
      });
      
      return categories;
    } catch (error) {
      console.error('Error fetching categories by level:', error);
      return [];
    }
  }
}

/**
 * Tag Management Service
 */
export class TagService {
  
  /**
   * Create a new tag
   */
  static async createTag(tagData: Omit<Tag, 'id' | 'createdAt'>): Promise<string> {
    const newTag: Omit<Tag, 'id'> = {
      ...tagData,
      createdAt: Timestamp.now(),
      isActive: true
    };
    
    const docRef = await addDoc(collection(db, DB_CONFIG.COLLECTIONS.TAGS), newTag);
    return docRef.id;
  }
  
  /**
   * Get all active tags
   */
  static async getAllTags(): Promise<Tag[]> {
    try {
      const q = query(
        collection(db, DB_CONFIG.COLLECTIONS.TAGS),
        where('isActive', '==', true),
        orderBy('name.en')
      );
      
      const querySnapshot = await getDocs(q);
      const tags: Tag[] = [];
      
      querySnapshot.forEach((doc) => {
        tags.push({
          id: doc.id,
          ...doc.data()
        } as Tag);
      });
      
      return tags;
    } catch (error) {
      console.error('Error fetching tags:', error);
      return [];
    }
  }
  
  /**
   * Get tags by type
   */
  static async getTagsByType(type: 'system' | 'user' | 'mood'): Promise<Tag[]> {
    try {
      const q = query(
        collection(db, DB_CONFIG.COLLECTIONS.TAGS),
        where('type', '==', type),
        where('isActive', '==', true),
        orderBy('name.en')
      );
      
      const querySnapshot = await getDocs(q);
      const tags: Tag[] = [];
      
      querySnapshot.forEach((doc) => {
        tags.push({
          id: doc.id,
          ...doc.data()
        } as Tag);
      });
      
      return tags;
    } catch (error) {
      console.error('Error fetching tags by type:', error);
      return [];
    }
  }
}

export default LocationDatabaseService;