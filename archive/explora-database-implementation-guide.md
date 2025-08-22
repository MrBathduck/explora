# Explora Database Implementation Guide

## 🎯 Database Strategy for Claude Code

This document provides specific implementation instructions for building Explora's location database based on OpenStreetMap data with a 3-level category system.

## 📋 Phase 1: Core Database Setup

### Step 1: Database & Extensions Setup
```bash
claude-code --task="Set up PostgreSQL database with PostGIS extension for Explora. Create database 'explora_db' and enable PostGIS, uuid-ossp, and pg_trgm extensions. Set up spatial reference system for geographic coordinates."
```

### Step 2: Core Tables Creation
```bash
claude-code --task="Create the core Explora database schema with these tables: 1) places table with UUID, OSM data, geometry fields, and basic info, 2) categories table with 3-level hierarchy, 3) admin_areas for geographic hierarchy, 4) place_categories junction table, 5) tags table for personalization. Use the exact schema from the research document."
```

## 🗂️ Database Schema Implementation

### Core Places Table
```sql
-- Primary places table
CREATE TABLE places (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    osm_type VARCHAR(20) CHECK (osm_type IN ('node', 'way', 'relation')),
    osm_id BIGINT NOT NULL,
    name TEXT NOT NULL,
    name_alt JSONB,                    -- Multilingual names
    geom GEOMETRY,                     -- Point or polygon
    centroid GEOMETRY(Point, 4326),    -- Always point for distance calc
    address JSONB,                     -- Structured address
    city_id UUID REFERENCES admin_areas(id),
    phone TEXT,
    website TEXT,
    opening_hours TEXT,                -- Raw OSM opening_hours
    price_level SMALLINT CHECK (price_level BETWEEN 1 AND 4),
    source_trust INTEGER DEFAULT 50,   -- Quality scoring 0-100
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE(osm_type, osm_id)
);

-- Auto-generate centroid from geometry
CREATE OR REPLACE FUNCTION update_centroid() RETURNS TRIGGER AS $$
BEGIN
    NEW.centroid = ST_Centroid(NEW.geom);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_centroid 
    BEFORE INSERT OR UPDATE ON places 
    FOR EACH ROW EXECUTE FUNCTION update_centroid();
```

### Category System (3-Level)
```sql
-- Hierarchical categories
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    level INTEGER CHECK (level IN (1, 2, 3)),
    parent_id UUID REFERENCES categories(id),
    slug VARCHAR(100) UNIQUE NOT NULL,
    name_en TEXT NOT NULL,
    name_de TEXT,                      -- German for Vienna
    icon VARCHAR(50),
    color VARCHAR(7),                  -- Hex color for UI
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE
);

-- Place to category mapping
CREATE TABLE place_categories (
    place_id UUID REFERENCES places(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id),
    is_primary BOOLEAN DEFAULT FALSE,
    confidence DECIMAL(3,2) DEFAULT 1.00,
    PRIMARY KEY (place_id, category_id)
);
```

### Geographic Hierarchy
```sql
-- Administrative areas
CREATE TABLE admin_areas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    level VARCHAR(20) CHECK (level IN ('country', 'region', 'city', 'neighborhood')),
    name TEXT NOT NULL,
    slug VARCHAR(100),
    geom GEOMETRY,
    centroid GEOMETRY(Point, 4326),
    bbox GEOMETRY(Polygon, 4326),      -- Bounding box for quick filters
    parent_id UUID REFERENCES admin_areas(id),
    population INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## 🏗️ Phase 2: Advanced Features

### Step 3: Tag System for Personalization
```bash
claude-code --task="Create the tag system tables: 1) tags table with slug, name, type (system/user), and synonyms array, 2) place_tags junction table with weighted scores, 3) category_rules table for mapping OSM tags to our categories, 4) Add indexes for performance on tag queries."
```

### Tag Implementation
```sql
-- Flexible tagging system
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    name_en TEXT NOT NULL,
    name_de TEXT,
    type VARCHAR(20) CHECK (type IN ('system', 'user', 'mood')),
    synonyms TEXT[],                   -- For search matching
    color VARCHAR(7),
    icon VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE
);

-- Place to tag mapping with weights
CREATE TABLE place_tags (
    place_id UUID REFERENCES places(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id),
    weight DECIMAL(3,2) DEFAULT 1.00,  -- 0.00 to 1.00 for recommendation strength
    source VARCHAR(20) DEFAULT 'system', -- system, user_review, behavior
    PRIMARY KEY (place_id, tag_id)
);

-- OSM to category mapping rules
CREATE TABLE category_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    osm_key TEXT NOT NULL,
    osm_value TEXT,
    extra_filter JSONB,               -- Additional OSM tag requirements
    category_l1_id UUID REFERENCES categories(id),
    category_l2_id UUID REFERENCES categories(id),
    category_l3_id UUID REFERENCES categories(id),
    system_tags TEXT[],               -- Auto-assign these tags
    confidence DECIMAL(3,2) DEFAULT 1.00,
    is_active BOOLEAN DEFAULT TRUE
);
```

### Step 4: Photos & Media
```bash
claude-code --task="Create photos table with place_id foreign key, URL, dimensions, source, license info, and is_primary flag. Add photo_sources table for attribution tracking. Include indexes for fast photo retrieval by place."
```

## 🎨 Phase 3: User Experience Tables

### Step 5: Reviews & Ratings
```bash
claude-code --task="Create reviews table with place_id, user_id, rating, text, reviewer_type (local/tourist), language, and status for moderation. Create place_aggregates table for cached ratings, review counts, and popularity scores."
```

### Review System
```sql
-- User reviews
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    place_id UUID REFERENCES places(id) ON DELETE CASCADE,
    user_id UUID,                     -- Reference to your user system
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    title TEXT,
    text TEXT,
    reviewer_type VARCHAR(20) CHECK (reviewer_type IN ('local', 'tourist', 'business')),
    language VARCHAR(5) DEFAULT 'en',
    review_tags TEXT[],               -- User-applied tags
    helpful_votes INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'flagged'))
);

-- Cached aggregates for performance
CREATE TABLE place_aggregates (
    place_id UUID PRIMARY KEY REFERENCES places(id) ON DELETE CASCADE,
    rating_overall_avg DECIMAL(3,2),
    rating_local_avg DECIMAL(3,2),
    rating_tourist_avg DECIMAL(3,2),
    review_count INTEGER DEFAULT 0,
    popularity_score INTEGER DEFAULT 0,    -- Computed score for ranking
    tag_scores JSONB,                      -- Tag frequency/strength scores
    last_review_at TIMESTAMP,
    last_updated TIMESTAMP DEFAULT NOW()
);
```

## 🚀 Phase 4: Performance & Search

### Step 6: Indexes and Search
```bash
claude-code --task="Create all necessary indexes for Explora database: 1) Spatial GIST indexes on geometry and centroid, 2) GIN indexes for JSONB fields, 3) Trigram indexes for fuzzy name search, 4) Composite indexes for common query patterns, 5) Partial indexes for active records only."
```

### Critical Indexes
```sql
-- Spatial indexes (most important for location queries)
CREATE INDEX idx_places_geom ON places USING GIST(geom);
CREATE INDEX idx_places_centroid ON places USING GIST(centroid);
CREATE INDEX idx_admin_areas_geom ON admin_areas USING GIST(geom);

-- Search indexes
CREATE INDEX idx_places_name_trgm ON places USING GIN(name gin_trgm_ops);
CREATE INDEX idx_places_name_alt ON places USING GIN(name_alt jsonb_path_ops);

-- Query performance indexes
CREATE INDEX idx_places_city_category ON places(city_id, is_active);
CREATE INDEX idx_place_categories_primary ON place_categories(place_id) WHERE is_primary = true;
CREATE INDEX idx_reviews_place_status ON reviews(place_id, status);
CREATE INDEX idx_place_tags_weight ON place_tags(place_id, weight DESC);

-- Partial indexes for active records only
CREATE INDEX idx_places_active ON places(city_id, updated_at) WHERE is_active = true;
CREATE INDEX idx_categories_active ON categories(level, parent_id) WHERE is_active = true;
```

## 📊 Phase 5: Data Population

### Step 7: Seed Data Creation
```bash
claude-code --task="Create seed data scripts for Explora: 1) Insert Vienna as primary city in admin_areas, 2) Create the 3-level category hierarchy starting with main categories (Food & Drink, Culture, etc.), 3) Create common tags for personalization, 4) Insert category mapping rules for common OSM tags."
```

### Seed Categories (Vienna Focus)
```sql
-- Level 1 Categories
INSERT INTO categories (level, slug, name_en, name_de, icon, color, sort_order) VALUES
(1, 'food-drink', 'Food & Drink', 'Essen & Trinken', 'utensils', '#FF6E40', 1),
(1, 'culture', 'Culture & Arts', 'Kultur & Kunst', 'palette', '#17a2b8', 2),
(1, 'nature-parks', 'Nature & Parks', 'Natur & Parks', 'tree', '#4CAF50', 3),
(1, 'nightlife', 'Nightlife', 'Nachtleben', 'glass-cheers', '#7B1FA2', 4),
(1, 'shopping', 'Shopping', 'Einkaufen', 'shopping-bag', '#FFC107', 5),
(1, 'scenic', 'Scenic & Views', 'Aussichten', 'mountain', '#2196F3', 6);

-- Level 2 Categories (Food & Drink subcategories)
INSERT INTO categories (level, parent_id, slug, name_en, name_de, icon, sort_order) VALUES
(2, (SELECT id FROM categories WHERE slug = 'food-drink'), 'cafes', 'Cafés', 'Kaffeehäuser', 'coffee', 1),
(2, (SELECT id FROM categories WHERE slug = 'food-drink'), 'restaurants', 'Restaurants', 'Restaurants', 'utensils', 2),
(2, (SELECT id FROM categories WHERE slug = 'food-drink'), 'bars', 'Bars', 'Bars', 'wine-glass', 3),
(2, (SELECT id FROM categories WHERE slug = 'food-drink'), 'bakeries', 'Bakeries', 'Bäckereien', 'bread-slice', 4);
```

### Common Tags
```sql
INSERT INTO tags (slug, name_en, name_de, type, color) VALUES
('historic', 'Historic', 'Historisch', 'system', '#8B4513'),
('cozy', 'Cozy', 'Gemütlich', 'mood', '#FF69B4'),
('tourist-friendly', 'Tourist Friendly', 'Touristenfreundlich', 'system', '#32CD32'),
('local-favorite', 'Local Favorite', 'Lokaler Favorit', 'system', '#FFD700'),
('romantic', 'Romantic', 'Romantisch', 'mood', '#FF1493'),
('family-friendly', 'Family Friendly', 'Familienfreundlich', 'system', '#98FB98'),
('instagram-worthy', 'Instagram Worthy', 'Fotogen', 'mood', '#FF6347');
```

## 🔧 Phase 6: API Layer Preparation

### Step 8: Views and Functions
```bash
claude-code --task="Create database views and functions for Explora API: 1) place_cards_view for fast card rendering, 2) nearby_places function with distance parameter, 3) search_places function with text and filters, 4) place_recommendations function based on user tags."
```

### Performance Views
```sql
-- Fast place card rendering
CREATE MATERIALIZED VIEW place_cards AS
SELECT 
    p.id,
    p.name,
    p.centroid,
    c1.name_en as category_l1,
    c2.name_en as category_l2,
    c3.name_en as category_l3,
    c3.icon,
    c3.color,
    array_agg(DISTINCT t.name_en) as tags,
    pa.rating_overall_avg,
    pa.review_count,
    ph.url as primary_photo,
    aa.name as city_name
FROM places p
LEFT JOIN place_categories pc ON p.id = pc.place_id AND pc.is_primary = true
LEFT JOIN categories c3 ON pc.category_id = c3.id
LEFT JOIN categories c2 ON c3.parent_id = c2.id  
LEFT JOIN categories c1 ON c2.parent_id = c1.id
LEFT JOIN place_tags pt ON p.id = pt.place_id
LEFT JOIN tags t ON pt.tag_id = t.id
LEFT JOIN place_aggregates pa ON p.id = pa.place_id
LEFT JOIN photos ph ON p.id = ph.place_id AND ph.is_primary = true
LEFT JOIN admin_areas aa ON p.city_id = aa.id
WHERE p.is_active = true
GROUP BY p.id, p.name, p.centroid, c1.name_en, c2.name_en, c3.name_en, 
         c3.icon, c3.color, pa.rating_overall_avg, pa.review_count, ph.url, aa.name;

-- Refresh weekly
CREATE INDEX idx_place_cards_city ON place_cards(city_name);
```

## 🎯 Phase 7: Claude Code Integration

### Development Workflow
```bash
# 1. Set up development database
claude-code --task="Create local PostgreSQL setup script for Explora development with Docker Compose, include PostGIS, and set up connection pooling with PgBouncer."

# 2. Create migration system
claude-code --task="Set up database migration system using your preferred framework (Prisma/TypeORM/Sequelize) to manage schema changes and data migrations safely."

# 3. Build API endpoints
claude-code --task="Create REST API endpoints for Explora: GET /places (with filtering), GET /places/:id, GET /places/nearby, GET /categories, POST /reviews. Use the database views for optimal performance."

# 4. Add search functionality
claude-code --task="Implement full-text search for places using PostgreSQL trigram matching and ranking. Include filters for category, tags, rating, and distance."
```

## 📱 Mobile & Offline Considerations

### Offline Data Strategy
```sql
-- City data bundles for offline use
CREATE TABLE city_bundles (
    city_id UUID REFERENCES admin_areas(id),
    bundle_version INTEGER,
    data_json JSONB,           -- Compact place data
    bundle_size_kb INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);
```

```bash
claude-code --task="Create city bundle generation system that exports essential place data as compact JSON for offline PWA usage. Include only active places with photos under 50KB per city."
```

## 🔍 Analytics & Optimization

### User Behavior Tracking
```sql
-- Track user interactions for recommendations
CREATE TABLE user_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    place_id UUID REFERENCES places(id),
    interaction_type VARCHAR(20) CHECK (interaction_type IN ('view', 'save', 'visit', 'share', 'review')),
    session_id UUID,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_interactions_user_type ON user_interactions(user_id, interaction_type, created_at);
```

## 🚀 Implementation Timeline

### Week 1: Core Setup
- Database setup with PostGIS
- Core tables (places, categories, admin_areas)
- Basic indexes

### Week 2: Enhanced Features  
- Tag system and reviews
- Photo management
- Aggregation tables

### Week 3: Performance & Search
- All indexes and views
- Search functions
- API endpoints

### Week 4: Data Population
- Vienna seed data
- OSM import pipeline
- Testing and optimization

This database design provides a solid foundation for Explora's location discovery features while maintaining flexibility for future enhancements.