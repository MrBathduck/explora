/**
 * Data Migration Service for Explora
 * Handles migration from current data structure to enhanced Firebase schema
 */

import { GeoPoint, Timestamp } from 'firebase/firestore';
import { LocationDatabaseService, CategoryService, TagService, DB_CONFIG } from './locationDatabase';
import type { EnhancedLocation, Category, Tag, AdminArea } from './locationDatabase';
import { PRIMARY_CATEGORIES, SECONDARY_TAGS, HIDDEN_TAGS, CONTEXTUAL_TAGS, validateLocationTags } from '../data/tagSystem';
import type { Location } from '../types/Location';
import { sampleLocations } from '../data/sampleLocations';

/**
 * Migration service for upgrading data structure
 */
export class DataMigrationService {
  
  /**
   * Migrate existing locations to enhanced schema
   */
  static async migrateExistingLocations(): Promise<void> {
    console.log('Starting data migration...');
    
    try {
      // First ensure categories and tags exist
      await this.seedCategoriesAndTags();
      
      // Get Vienna as default city
      const viennaId = await this.ensureViennaExists();
      
      // Convert existing locations to enhanced format
      const enhancedLocations = await this.convertLocationsToEnhanced(sampleLocations, viennaId);
      
      // Batch import enhanced locations
      await LocationDatabaseService.batchImportLocations(enhancedLocations);
      
      console.log('✅ Data migration completed successfully');
    } catch (error) {
      console.error('❌ Data migration failed:', error);
      throw error;
    }
  }
  
  /**
   * Convert legacy Location objects to EnhancedLocation format
   */
  private static async convertLocationsToEnhanced(
    locations: Location[], 
    cityId: string
  ): Promise<Omit<EnhancedLocation, 'id' | 'createdAt' | 'updatedAt'>[]> {
    
    const enhanced: Omit<EnhancedLocation, 'id' | 'createdAt' | 'updatedAt'>[] = [];
    
    // Get category mappings
    const categoryMap = await this.buildCategoryMapping();
    
    for (const location of locations) {
      // Validate existing tags according to explora tag system
      const validation = validateLocationTags(location.tags);
      if (validation.errors.length > 0) {
        console.warn(`Location ${location.name} has tag validation errors:`, validation.errors);
      }
      
      // Determine primary category from tags
      const primaryCategory = this.determinePrimaryCategoryFromTags(location.tags.primary);
      
      const enhancedLocation: Omit<EnhancedLocation, 'id' | 'createdAt' | 'updatedAt'> = {
        name: location.name,
        description: location.description,
        coordinates: new GeoPoint(location.coordinates.lat, location.coordinates.lng),
        address: location.address,
        cityId: cityId,
        
        // Keep existing tag structure (already follows explora 4-level system)
        tags: {
          primary: location.tags.primary,
          secondary: location.tags.secondary,
          hidden: location.tags.hidden,
          contextual: location.tags.contextual
        },
        
        // Set primary category based on tags
        primaryCategory: primaryCategory,
        
        // Quality and trust
        sourceTrust: 85, // High trust for manually curated locations
        isActive: true,
        
        // Media
        primaryImage: location.image,
        images: location.images,
        
        // Details
        rating: location.rating,
        duration: location.duration,
        hours: location.hours,
        priceRange: location.priceRange,
        website: location.website,
        phone: location.phone,
        highlights: location.highlights
      };
      
      enhanced.push(enhancedLocation);
    }
    
    return enhanced;
  }
  
  /**
   * Seed the database with Vienna-focused categories and tags
   */
  static async seedCategoriesAndTags(): Promise<void> {
    console.log('Seeding categories and tags...');
    
    // Create Level 1 Categories (Main categories)
    const level1Categories = [
      {
        level: 1 as const,
        slug: 'food-drink',
        name: { en: 'Food & Drink', de: 'Essen & Trinken' },
        icon: 'utensils',
        color: '#FF6E40',
        sortOrder: 1
      },
      {
        level: 1 as const,
        slug: 'culture-arts',
        name: { en: 'Culture & Arts', de: 'Kultur & Kunst' },
        icon: 'palette',
        color: '#17a2b8',
        sortOrder: 2
      },
      {
        level: 1 as const,
        slug: 'nature-parks',
        name: { en: 'Nature & Parks', de: 'Natur & Parks' },
        icon: 'tree',
        color: '#4CAF50',
        sortOrder: 3
      },
      {
        level: 1 as const,
        slug: 'nightlife',
        name: { en: 'Nightlife', de: 'Nachtleben' },
        icon: 'glass-cheers',
        color: '#7B1FA2',
        sortOrder: 4
      },
      {
        level: 1 as const,
        slug: 'shopping',
        name: { en: 'Shopping', de: 'Einkaufen' },
        icon: 'shopping-bag',
        color: '#FFC107',
        sortOrder: 5
      },
      {
        level: 1 as const,
        slug: 'scenic-views',
        name: { en: 'Scenic & Views', de: 'Aussichten' },
        icon: 'mountain',
        color: '#2196F3',
        sortOrder: 6
      },
      {
        level: 1 as const,
        slug: 'historic-sites',
        name: { en: 'Historic Sites', de: 'Historische Stätten' },
        icon: 'landmark',
        color: '#8B4513',
        sortOrder: 7
      }
    ];
    
    // Create categories
    const categoryIds: Record<string, string> = {};
    for (const category of level1Categories) {
      const id = await CategoryService.createCategory(category);
      categoryIds[category.slug] = id;
    }
    
    // Create Level 2 Categories (Subcategories)
    const level2Categories = [
      // Food & Drink subcategories
      {
        level: 2 as const,
        parentId: categoryIds['food-drink'],
        slug: 'cafes',
        name: { en: 'Cafés', de: 'Kaffeehäuser' },
        icon: 'coffee',
        color: '#8B4513',
        sortOrder: 1
      },
      {
        level: 2 as const,
        parentId: categoryIds['food-drink'],
        slug: 'restaurants',
        name: { en: 'Restaurants', de: 'Restaurants' },
        icon: 'utensils',
        color: '#FF6E40',
        sortOrder: 2
      },
      {
        level: 2 as const,
        parentId: categoryIds['food-drink'],
        slug: 'bars',
        name: { en: 'Bars', de: 'Bars' },
        icon: 'wine-glass',
        color: '#7B1FA2',
        sortOrder: 3
      },
      {
        level: 2 as const,
        parentId: categoryIds['food-drink'],
        slug: 'markets',
        name: { en: 'Markets', de: 'Märkte' },
        icon: 'store',
        color: '#4CAF50',
        sortOrder: 4
      },
      
      // Culture & Arts subcategories
      {
        level: 2 as const,
        parentId: categoryIds['culture-arts'],
        slug: 'museums',
        name: { en: 'Museums', de: 'Museen' },
        icon: 'building-columns',
        color: '#17a2b8',
        sortOrder: 1
      },
      {
        level: 2 as const,
        parentId: categoryIds['culture-arts'],
        slug: 'palaces',
        name: { en: 'Palaces', de: 'Paläste' },
        icon: 'crown',
        color: '#FFD700',
        sortOrder: 2
      },
      {
        level: 2 as const,
        parentId: categoryIds['culture-arts'],
        slug: 'churches',
        name: { en: 'Churches', de: 'Kirchen' },
        icon: 'church',
        color: '#8B4513',
        sortOrder: 3
      },
      
      // Historic Sites subcategories
      {
        level: 2 as const,
        parentId: categoryIds['historic-sites'],
        slug: 'monuments',
        name: { en: 'Monuments', de: 'Denkmäler' },
        icon: 'monument',
        color: '#6B7280',
        sortOrder: 1
      },
      {
        level: 2 as const,
        parentId: categoryIds['historic-sites'],
        slug: 'architecture',
        name: { en: 'Architecture', de: 'Architektur' },
        icon: 'building',
        color: '#9CA3AF',
        sortOrder: 2
      }
    ];
    
    for (const category of level2Categories) {
      await CategoryService.createCategory(category);
    }
    
    // Create common tags
    const commonTags = [
      // System tags
      { slug: 'historic', name: { en: 'Historic', de: 'Historisch' }, type: 'system' as const, color: '#8B4513' },
      { slug: 'tourist-friendly', name: { en: 'Tourist Friendly', de: 'Touristenfreundlich' }, type: 'system' as const, color: '#32CD32' },
      { slug: 'local-favorite', name: { en: 'Local Favorite', de: 'Lokaler Favorit' }, type: 'system' as const, color: '#FFD700' },
      { slug: 'family-friendly', name: { en: 'Family Friendly', de: 'Familienfreundlich' }, type: 'system' as const, color: '#98FB98' },
      { slug: 'wheelchair-accessible', name: { en: 'Wheelchair Accessible', de: 'Rollstuhlgerecht' }, type: 'system' as const, color: '#4169E1' },
      
      // Mood tags
      { slug: 'cozy', name: { en: 'Cozy', de: 'Gemütlich' }, type: 'mood' as const, color: '#FF69B4' },
      { slug: 'romantic', name: { en: 'Romantic', de: 'Romantisch' }, type: 'mood' as const, color: '#FF1493' },
      { slug: 'instagram-worthy', name: { en: 'Instagram Worthy', de: 'Fotogen' }, type: 'mood' as const, color: '#FF6347' },
      { slug: 'authentic', name: { en: 'Authentic', de: 'Authentisch' }, type: 'mood' as const, color: '#8B4513' },
      { slug: 'hidden-gem', name: { en: 'Hidden Gem', de: 'Geheimtipp' }, type: 'mood' as const, color: '#4B0082' },
      
      // User preference tags
      { slug: 'solo-friendly', name: { en: 'Solo Friendly', de: 'Für Alleinreisende' }, type: 'user' as const, color: '#20B2AA' },
      { slug: 'group-friendly', name: { en: 'Group Friendly', de: 'Für Gruppen' }, type: 'user' as const, color: '#32CD32' },
      { slug: 'budget-friendly', name: { en: 'Budget Friendly', de: 'Preiswert' }, type: 'user' as const, color: '#228B22' },
      { slug: 'luxury', name: { en: 'Luxury', de: 'Luxus' }, type: 'user' as const, color: '#B8860B' }
    ];
    
    for (const tag of commonTags) {
      await TagService.createTag(tag);
    }
    
    console.log('✅ Categories and tags seeded successfully');
  }
  
  /**
   * Determine primary category from location's primary tags
   */
  private static determinePrimaryCategoryFromTags(primaryTags: string[]): string {
    // Map primary tags to their categories according to explora tag system
    const tagToCategoryMap: Record<string, string> = {};
    
    // Build mapping from PRIMARY_CATEGORIES
    Object.entries(PRIMARY_CATEGORIES).forEach(([key, categoryInfo]) => {
      categoryInfo.tags.forEach(tag => {
        tagToCategoryMap[tag] = categoryInfo.name;
      });
    });
    
    // Find the category for the first primary tag
    for (const tag of primaryTags) {
      if (tagToCategoryMap[tag]) {
        return tagToCategoryMap[tag];
      }
    }
    
    // Default fallback
    return 'Culture & History'; // Most locations in Vienna are historical
  }
  
  /**
   * Build category mapping for easier lookup
   */
  private static async buildCategoryMapping(): Promise<Record<string, { level1: string; level2?: string; level3?: string }>> {
    const categories = await CategoryService.getCategoryHierarchy();
    const mapping: Record<string, { level1: string; level2?: string; level3?: string }> = {};
    
    // Build hierarchy map
    const level1Map = new Map<string, string>();
    const level2Map = new Map<string, { id: string; parentId: string }>();
    
    categories.forEach(cat => {
      if (cat.level === 1) {
        level1Map.set(cat.slug, cat.id);
      } else if (cat.level === 2 && cat.parentId) {
        level2Map.set(cat.slug, { id: cat.id, parentId: cat.parentId });
      }
    });
    
    // Create mappings
    level2Map.forEach((level2Info, slug) => {
      mapping[slug] = {
        level1: level2Info.parentId,
        level2: level2Info.id
      };
    });
    
    level1Map.forEach((id, slug) => {
      if (!mapping[slug]) {
        mapping[slug] = { level1: id };
      }
    });
    
    return mapping;
  }
  
  /**
   * Ensure Vienna exists in admin areas
   */
  private static async ensureViennaExists(): Promise<string> {
    // For now, return a placeholder ID
    // In a real implementation, we'd create/check the admin_areas collection
    return 'vienna-austria';
  }
  
  /**
   * Validate migrated data
   */
  static async validateMigration(): Promise<{ success: boolean; errors: string[] }> {
    const errors: string[] = [];
    
    try {
      // Check if locations exist
      const viennaLocations = await LocationDatabaseService.getLocationsByCity('vienna-austria', { limit: 10 });
      if (viennaLocations.length === 0) {
        errors.push('No locations found after migration');
      }
      
      // Check if categories exist
      const categories = await CategoryService.getCategoryHierarchy();
      if (categories.length === 0) {
        errors.push('No categories found after migration');
      }
      
      // Check if tags exist
      const tags = await TagService.getAllTags();
      if (tags.length === 0) {
        errors.push('No tags found after migration');
      }
      
      // Validate tag requirements for locations
      for (const location of viennaLocations) {
        if (location.tags.primary.length < DB_CONFIG.MIN_PRIMARY_TAGS) {
          errors.push(`Location ${location.name} has insufficient primary tags`);
        }
      }
      
      return {
        success: errors.length === 0,
        errors
      };
      
    } catch (error) {
      errors.push(`Validation failed: ${error}`);
      return { success: false, errors };
    }
  }
}

export default DataMigrationService;