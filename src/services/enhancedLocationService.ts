/**
 * Enhanced Location Service
 * Provides backward compatibility while adding new database features
 */

import { LocationDatabaseService, CategoryService, TagService } from './locationDatabase';
import type { EnhancedLocation, Category, Tag } from './locationDatabase';
import type { Location } from '../types/Location';
import { GeoPoint } from 'firebase/firestore';

/**
 * Service that bridges old and new location systems
 * Maintains compatibility with existing components
 */
export class EnhancedLocationService {
  
  /**
   * Get locations for the home page (backward compatible)
   * Returns locations in the legacy format for existing components
   */
  static async getLocationsForHomePage(options?: {
    cityId?: string;
    categoryFilter?: string;
    searchText?: string;
    limit?: number;
  }): Promise<Location[]> {
    
    const cityId = options?.cityId || 'vienna-austria';
    
    let enhancedLocations: EnhancedLocation[];
    
    if (options?.searchText) {
      enhancedLocations = await LocationDatabaseService.searchLocations(
        options.searchText,
        cityId,
        { limit: options?.limit }
      );
    } else {
      enhancedLocations = await LocationDatabaseService.getLocationsByCity(
        cityId,
        {
          categoryLevel1: options?.categoryFilter, // This maps to primaryCategory
          limit: options?.limit || 20
        }
      );
    }
    
    // Convert to legacy format for existing components
    return enhancedLocations.map(this.convertToLegacyFormat);
  }
  
  /**
   * Get a single location by ID (backward compatible)
   */
  static async getLocationById(locationId: string): Promise<Location | null> {
    const enhanced = await LocationDatabaseService.getLocation(locationId);
    return enhanced ? this.convertToLegacyFormat(enhanced) : null;
  }
  
  /**
   * Get locations by category with enhanced filtering
   */
  static async getLocationsByCategory(
    categorySlug: string,
    options?: {
      level?: 1 | 2 | 3;
      cityId?: string;
      tags?: string[];
      limit?: number;
    }
  ): Promise<Location[]> {
    
    const cityId = options?.cityId || 'vienna-austria';
    
    // Get category ID from slug
    const categories = await CategoryService.getCategoryHierarchy();
    const category = categories.find(cat => 
      cat.slug === categorySlug && cat.level === (options?.level || 1)
    );
    
    if (!category) {
      console.warn(`Category not found: ${categorySlug}`);
      return [];
    }
    
    const enhancedLocations = await LocationDatabaseService.getLocationsByCity(
      cityId,
      {
        categoryLevel1: options?.level === 1 ? category.id : undefined,
        categoryLevel2: options?.level === 2 ? category.id : undefined,
        tags: options?.tags,
        limit: options?.limit
      }
    );
    
    return enhancedLocations.map(this.convertToLegacyFormat);
  }
  
  /**
   * Advanced search with multiple filters
   */
  static async advancedSearch(filters: {
    text?: string;
    categories?: string[]; // Category slugs
    tags?: string[]; // Tag slugs
    priceRange?: string[];
    rating?: number;
    duration?: string[];
    cityId?: string;
    limit?: number;
  }): Promise<Location[]> {
    
    const cityId = filters.cityId || 'vienna-austria';
    
    // First get base results
    let enhancedLocations: EnhancedLocation[];
    
    if (filters.text) {
      enhancedLocations = await LocationDatabaseService.searchLocations(
        filters.text,
        cityId,
        { limit: filters.limit }
      );
    } else {
      enhancedLocations = await LocationDatabaseService.getLocationsByCity(
        cityId,
        {
          minRating: filters.rating,
          limit: filters.limit || 50
        }
      );
    }
    
    // Apply additional filters
    let filteredLocations = enhancedLocations;
    
    // Filter by categories (using primary category)
    if (filters.categories && filters.categories.length > 0) {
      filteredLocations = filteredLocations.filter(loc => 
        filters.categories!.includes(loc.primaryCategory)
      );
    }
    
    // Filter by tags
    if (filters.tags && filters.tags.length > 0) {
      filteredLocations = filteredLocations.filter(loc => {
        const allTags = [
          ...loc.tags.primary,
          ...loc.tags.secondary,
          ...loc.tags.hidden,
          ...loc.tags.contextual
        ];
        return filters.tags!.some(tag => allTags.includes(tag));
      });
    }
    
    // Filter by price range
    if (filters.priceRange && filters.priceRange.length > 0) {
      filteredLocations = filteredLocations.filter(loc => 
        loc.priceRange && filters.priceRange!.includes(loc.priceRange)
      );
    }
    
    // Filter by duration
    if (filters.duration && filters.duration.length > 0) {
      filteredLocations = filteredLocations.filter(loc => 
        loc.duration && filters.duration!.some(dur => loc.duration!.includes(dur))
      );
    }
    
    return filteredLocations.map(this.convertToLegacyFormat);
  }
  
  /**
   * Get personalized recommendations based on user preferences
   */
  static async getPersonalizedRecommendations(
    userPreferences: {
      favoriteCategories?: string[];
      favoriteTags?: string[];
      avoidTags?: string[];
      pricePreference?: string[];
      durationPreference?: string[];
    },
    options?: {
      cityId?: string;
      limit?: number;
    }
  ): Promise<Location[]> {
    
    const cityId = options?.cityId || 'vienna-austria';
    
    // Get all locations first
    const allLocations = await LocationDatabaseService.getLocationsByCity(
      cityId,
      { limit: 100 }
    );
    
    // Score locations based on preferences
    const scoredLocations = allLocations.map(location => ({
      location,
      score: this.calculatePersonalizationScore(location, userPreferences)
    }));
    
    // Sort by score and return top results
    const topLocations = scoredLocations
      .filter(item => item.score > 0) // Only include positive matches
      .sort((a, b) => b.score - a.score)
      .slice(0, options?.limit || 10)
      .map(item => item.location);
    
    return topLocations.map(this.convertToLegacyFormat);
  }
  
  /**
   * Get available filters for the current data set
   */
  static async getAvailableFilters(cityId: string = 'vienna-austria'): Promise<{
    categories: { level1: Category[]; level2: Category[]; level3: Category[] };
    tags: { system: Tag[]; mood: Tag[]; user: Tag[] };
    priceRanges: string[];
    durations: string[];
  }> {
    
    // Get all categories and tags
    const [categories, systemTags, moodTags, userTags] = await Promise.all([
      CategoryService.getCategoryHierarchy(),
      TagService.getTagsByType('system'),
      TagService.getTagsByType('mood'),
      TagService.getTagsByType('user')
    ]);
    
    // Get actual data for dynamic filters
    const locations = await LocationDatabaseService.getLocationsByCity(cityId, { limit: 100 });
    
    const priceRanges = [...new Set(
      locations
        .map(loc => loc.priceRange)
        .filter(Boolean)
    )].sort();
    
    const durations = [...new Set(
      locations
        .map(loc => loc.duration)
        .filter(Boolean)
    )].sort();
    
    return {
      categories: {
        level1: categories.filter(cat => cat.level === 1),
        level2: categories.filter(cat => cat.level === 2),
        level3: categories.filter(cat => cat.level === 3)
      },
      tags: {
        system: systemTags,
        mood: moodTags,
        user: userTags
      },
      priceRanges,
      durations
    };
  }
  
  /**
   * Convert enhanced location to legacy format for backward compatibility
   */
  private static convertToLegacyFormat(enhanced: EnhancedLocation): Location {
    return {
      id: enhanced.id,
      name: enhanced.name,
      description: enhanced.description,
      image: enhanced.primaryImage,
      category: 'Enhanced Location', // Legacy field, less important now
      tags: enhanced.tags,
      rating: enhanced.rating,
      duration: enhanced.duration,
      address: enhanced.address,
      coordinates: {
        lat: enhanced.coordinates.latitude,
        lng: enhanced.coordinates.longitude
      },
      images: enhanced.images,
      hours: enhanced.hours,
      priceRange: enhanced.priceRange,
      website: enhanced.website,
      phone: enhanced.phone,
      highlights: enhanced.highlights
    };
  }
  
  /**
   * Calculate personalization score for a location
   */
  private static calculatePersonalizationScore(
    location: EnhancedLocation,
    preferences: {
      favoriteCategories?: string[];
      favoriteTags?: string[];
      avoidTags?: string[];
      pricePreference?: string[];
      durationPreference?: string[];
    }
  ): number {
    let score = 0;
    
    const allLocationTags = [
      ...location.tags.primary,
      ...location.tags.secondary,
      ...location.tags.hidden,
      ...location.tags.contextual
    ];
    
    // Positive scoring
    if (preferences.favoriteTags) {
      const matchingTags = preferences.favoriteTags.filter(tag => 
        allLocationTags.includes(tag)
      );
      score += matchingTags.length * 10;
    }
    
    if (preferences.pricePreference && location.priceRange) {
      if (preferences.pricePreference.includes(location.priceRange)) {
        score += 5;
      }
    }
    
    if (preferences.durationPreference && location.duration) {
      const matchesDuration = preferences.durationPreference.some(dur => 
        location.duration!.includes(dur)
      );
      if (matchesDuration) {
        score += 5;
      }
    }
    
    // Negative scoring (avoid tags)
    if (preferences.avoidTags) {
      const avoidMatches = preferences.avoidTags.filter(tag => 
        allLocationTags.includes(tag)
      );
      score -= avoidMatches.length * 15; // Heavier penalty for avoid tags
    }
    
    // Base quality score
    score += location.sourceTrust / 10;
    if (location.rating) {
      score += location.rating * 2;
    }
    
    return Math.max(0, score); // Don't allow negative scores
  }
}

export default EnhancedLocationService;