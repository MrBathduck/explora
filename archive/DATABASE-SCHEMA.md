# Explora Firebase Database Schema

## 🎯 Overview

This document describes the enhanced Firebase/Firestore database schema for Explora, adapted from the PostgreSQL design to work with NoSQL document storage while maintaining the same functionality.

## 📊 Database Collections

### 1. Enhanced Places Collection (`places`)

```typescript
interface EnhancedLocation {
  id: string;
  name: string;
  description: string;
  
  // Geographic data
  coordinates: GeoPoint; // Firebase GeoPoint
  address?: string;
  cityId: string; // Reference to admin_areas collection
  
  // 4-Level tagging system (aligned with explora tag system)
  tags: {
    primary: string[]; // Layer 1 tags - specific tags like "Historical Sites"
    secondary: string[]; // Layer 2 tags - filters like "Indoor", "1-Hour Visit"
    hidden: string[]; // Layer 3 tags - algorithmic only like "Tourist Trap"
    contextual: string[]; // Layer 4 tags - seasonal like "Best in Spring"
  };
  
  // Primary category (organizational, derived from primary tags)
  primaryCategory: string; // Must be exactly 1 from Layer 1 categories like "Culture & History"
  
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
```

### 2. Categories Collection (`categories`)

Hierarchical 3-level category system:

```typescript
interface Category {
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
```

**Level 1 Categories (Main):**
- Food & Drink
- Culture & Arts  
- Nature & Parks
- Nightlife
- Shopping
- Scenic & Views
- Historic Sites

**Level 2 Categories (Sub):**
- Cafés, Restaurants, Bars, Markets (under Food & Drink)
- Museums, Palaces, Churches (under Culture & Arts)
- Monuments, Architecture (under Historic Sites)

**Level 3 Categories (Specific):**
- To be added as needed for specific location types

### 3. Tags Collection (`tags`)

Enhanced tagging for personalization:

```typescript
interface Tag {
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
```

**Tag Types:**
- **System tags:** historic, tourist-friendly, local-favorite, family-friendly
- **Mood tags:** cozy, romantic, instagram-worthy, authentic, hidden-gem
- **User tags:** solo-friendly, group-friendly, budget-friendly, luxury

### 4. Admin Areas Collection (`admin_areas`)

Geographic hierarchy:

```typescript
interface AdminArea {
  id: string;
  level: 'country' | 'region' | 'city' | 'neighborhood';
  name: string;
  slug: string;
  coordinates?: GeoPoint; // Center point
  parentId?: string; // Reference to parent area
  population?: number;
  createdAt: Timestamp;
}
```

## 🔧 Implementation Services

### LocationDatabaseService

Core database operations:
- `createLocation()` - Add new locations with validation
- `getLocation()` - Get single location by ID
- `getLocationsByCity()` - Get locations with filtering
- `searchLocations()` - Text-based search

### CategoryService  

Category management:
- `createCategory()` - Add new categories
- `getCategoryHierarchy()` - Get full category tree
- `getCategoriesByLevel()` - Get categories by level

### TagService

Tag management:
- `createTag()` - Add new tags
- `getAllTags()` - Get all active tags
- `getTagsByType()` - Get tags by type (system/mood/user)

### EnhancedLocationService

Backward compatibility layer:
- `getLocationsForHomePage()` - Returns legacy format
- `getLocationById()` - Single location in legacy format
- `advancedSearch()` - Multi-filter search
- `getPersonalizedRecommendations()` - AI-like recommendations

## 🚀 Setup Process

### Phase 1: Database Initialization

Run the setup utility:

```typescript
import setupDatabase from '/src/utils/setupDatabase';
await setupDatabase();
```

This will:
1. Create all collections
2. Seed Vienna categories and tags
3. Migrate existing location data
4. Validate the migration

### Phase 2: Component Integration

Update your existing components:

```typescript
// Before (legacy)
import { sampleLocations } from '../data/sampleLocations';

// After (enhanced)
import EnhancedLocationService from '../services/enhancedLocationService';

// Get locations (backward compatible)
const locations = await EnhancedLocationService.getLocationsForHomePage({
  categoryFilter: 'food-drink',
  limit: 20
});
```

### Phase 3: Advanced Features

Add new filtering capabilities:

```typescript
// Advanced search with multiple filters
const results = await EnhancedLocationService.advancedSearch({
  text: 'coffee',
  categories: ['cafes'],
  tags: ['cozy', 'local-favorite'],
  priceRange: ['€', '€€'],
  rating: 4.0
});

// Personalized recommendations
const recommendations = await EnhancedLocationService.getPersonalizedRecommendations({
  favoriteCategories: ['food-drink'],
  favoriteTags: ['cozy', 'authentic'],
  avoidTags: ['tourist-trap'],
  pricePreference: ['€', '€€']
});
```

## 📋 Data Quality Standards

### Location Requirements
- ✅ Minimum 3 primary tags
- ✅ Valid coordinates (GeoPoint)
- ✅ Source trust score 30-100
- ✅ Active status flag

### Category Requirements  
- ✅ Unique slug per level
- ✅ Proper parent-child relationships
- ✅ Localized names (en + de for Vienna)

### Tag Requirements
- ✅ Unique slug
- ✅ Proper type classification
- ✅ Localized names

## 🔍 Query Patterns

### Common Queries

```typescript
// Get popular locations in Vienna
const popular = await LocationDatabaseService.getLocationsByCity('vienna-austria', {
  minRating: 4.5,
  limit: 10
});

// Get cafés in Vienna
const cafes = await EnhancedLocationService.getLocationsByCategory('cafes', {
  level: 2,
  cityId: 'vienna-austria'
});

// Search for romantic restaurants
const romantic = await EnhancedLocationService.advancedSearch({
  categories: ['restaurants'],
  tags: ['romantic'],
  cityId: 'vienna-austria'
});
```

### Performance Considerations

- **Firestore queries** are limited to single field filters
- **Complex filtering** done in-memory after basic query
- **Pagination** implemented with limit() and startAfter()
- **Search** uses basic text matching (consider Algolia for production)

## 🔄 Migration Strategy

### Backward Compatibility

The `EnhancedLocationService` provides full backward compatibility:
- Existing components continue to work unchanged
- Legacy `Location` type still supported
- Gradual migration path for new features

### Data Migration

Existing data is automatically converted:
- Legacy categories mapped to new hierarchy
- Existing 4-level tags preserved
- Geographic coordinates converted to GeoPoint
- Quality scores assigned based on manual curation

## 🎯 Next Steps

1. **Run database setup** using the provided utilities
2. **Test backward compatibility** with existing components  
3. **Implement advanced filtering** in your UI
4. **Add personalization features** based on user preferences
5. **Consider search optimization** with external service

This schema provides a solid foundation for Explora's enhanced location discovery while maintaining compatibility with your existing Firebase-based architecture.