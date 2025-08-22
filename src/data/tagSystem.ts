// 🏷️ Explora Tag Categorization System
// Based on explora-tag-system-mvp.md specification

// LAYER 1: Primary Categories (User-Selected Themes)
export const PRIMARY_CATEGORIES = {
  CULTURE_HISTORY: {
    name: "Culture & History",
    tags: [
      "Monuments & Landmarks",
      "Historical Sites", 
      "Archaeological Sites",
      "Memorials",
      "Religious & Spiritual Sites",
      "World Heritage Sites",
      "Ancient Architecture",
      "Historic Neighborhoods",
      "Heritage Trails",
      "Palace or Castle",
      "Famous Historical Figures",
      "Royal Sites",
      "Civil Rights Sites",
      "Political History",
      "Colonial Architecture",
      "Medieval Architecture",
      "Philanthropic Heritage",
      "Former Hospitals",
      "Baroque Architecture",
      "Library Landmark",
      "Royal Patronage"
    ]
  },
  MUSEUMS_ART: {
    name: "Museums & Art",
    tags: [
      "Art Museums",
      "History Museums",
      "Science Museums",
      "Modern Art Spaces",
      "Niche Collections",
      "Rotating Exhibitions",
      "Temporary Galleries",
      "Interactive Museums",
      "Photography Exhibits",
      "Immersive Installations",
      "Children's Museums",
      "Open-Air Museums",
      "Local Artist Features",
      "Permanent Collections",
      "Cabinet of Curiosities",
      "Unusual Exhibits",
      "Animal-Themed",
      "Contemporary Culture",
      "Subversive Themes"
    ]
  },
  PARKS_NATURE: {
    name: "Parks & Nature",
    tags: [
      "Urban Parks",
      "Botanical Gardens",
      "Riverside Walks",
      "Forest Trails",
      "Wildlife Areas",
      "Green Escape",
      "Shaded Areas",
      "Natural Water Features",
      "Urban Biodiversity",
      "Outdoor Sculpture Gardens",
      "Picnic Friendly",
      "Cherry Blossom Spots",
      "Seasonal Highlights",
      "Dog-Friendly Zones",
      "Calm Walks",
      "Converted Railway Space",
      "Multi-Use Park",
      "Local Weekend Spot",
      "Event-Driven Park",
      "International Exhibitions"
    ]
  },
  URBAN_EXPLORATION: {
    name: "Urban Exploration",
    tags: [
      "Iconic Architecture",
      "Public Squares",
      "Neighborhood Walks",
      "Bridges & Tunnels",
      "Industrial Heritage",
      "Historic Streets",
      "Urban Photo Spots",
      "Rooftop Access",
      "Open Courtyards",
      "Covered Passages",
      "Famous Boulevards",
      "Decorative Facades",
      "City Gates",
      "Artists' District",
      "Silk Industry Heritage",
      "Urban Redevelopment",
      "Graffiti Corridors"
    ]
  },
  CREATIVE_STREET: {
    name: "Creative & Street Culture",
    tags: [
      "Street Art",
      "Design Installations",
      "Creative Hubs",
      "Artisan Markets",
      "Indie Galleries",
      "Local Craft Centers",
      "Public Art Projects",
      "Community Murals",
      "Experimental Art Spaces",
      "Independent Art Shops",
      "Open Studios",
      "Zines & DIY Culture",
      "Graffiti Corridors",
      "Artist Collectives",
      "Squatter Art Spaces",
      "DIY Events",
      "Reclaimed Spaces",
      "Artist Residency Complex"
    ]
  },
  SCENIC_PANORAMIC: {
    name: "Scenic & Panoramic",
    tags: [
      "Rooftop Views",
      "Hilltop Lookouts",
      "Riverbanks",
      "Sunset Spots",
      "Panoramic Vistas",
      "Skyline Overlook",
      "Viewpoints with Seating",
      "Photogenic Angles",
      "Elevated Walkways",
      "Cityscape Reflections",
      "Observation Decks",
      "Open-Air Platforms",
      "Quiet Lookout",
      "Locals' Favorite View",
      "360° View",
      "Religious Panoramic Spot"
    ]
  }
} as const;

// LAYER 2: Secondary Tags (User-Facing Filters)
export const SECONDARY_TAGS = {
  ACCESSIBILITY_EFFORT: {
    name: "Accessibility & Effort",
    tags: [
      "Wheelchair Accessible",
      "Steep Terrain",
      "Lots of Stairs",
      "Elder-Friendly",
      "Kid-Friendly"
    ]
  },
  TIME_COMMITMENT: {
    name: "Time Commitment",
    tags: [
      "Quick Stop (<15 min)",
      "1-Hour Visit",
      "Half-Day Activity",
      "Full-Day Attraction"
    ]
  },
  WEATHER_SUITABILITY: {
    name: "Weather Suitability",
    tags: [
      "Indoor",
      "Outdoor",
      "Good for Rainy Days",
      "Best in Sunshine"
    ]
  },
  MOBILITY_CONTEXT: {
    name: "Mobility Context",
    tags: [
      "Walkable From Center",
      "Requires Public Transport",
      "Off-the-Beaten Path"
    ]
  },
  AUDIENCE_SUITABILITY: {
    name: "Audience Suitability",
    tags: [
      "Great for Families",
      "Solo-Friendly",
      "Group-Friendly",
      "Romantic Spot"
    ]
  }
} as const;

// LAYER 3: Hidden Tags (Algorithmic Only)
export const HIDDEN_TAGS = [
  "FOMO Magnet",
  "High Tourist Traffic",
  "Quiet Retreat",
  "Cultural Immersion",
  "Relaxing Vibe",
  "Panoramic Photo Spot",
  "Educational Value",
  "Experiential",
  "Gamified Content Available",
  "Local Favorite",
  "Overrated",
  "Instagram Hotspot",
  "Authentic Experience",
  "Tourist Trap",
  "Hidden Gem Verified",
  "Crowd-Sensitive",
  "Weather-Dependent",
  "Time-Sensitive Visit"
] as const;

// LAYER 4: Seasonal & Contextual Tags
export const CONTEXTUAL_TAGS = [
  "Peak Season Only",
  "Off-Season Recommended",
  "Event Nearby",
  "Open During Holidays",
  "Shaded in Summer",
  "Best in Spring",
  "Sunset Spot",
  "Evening Recommended",
  "Weekend Crowded",
  "Early Morning Best",
  "Rainy Day Alternative",
  "Summer Festival Venue",
  "Winter Warm Spot",
  "Holiday Decorations",
  "Seasonal Exhibition"
] as const;

// Mood Matcher Integration
export const MOOD_TAG_MAPPING = {
  Romantic: ["Scenic & Panoramic", "Sunset Spots", "Quiet Lookout", "Riverbanks"],
  Adventurous: ["Urban Exploration", "Off-the-Beaten Path", "Bridges & Tunnels", "Rooftop Access"],
  Peaceful: ["Parks & Nature", "Shaded Areas", "Calm Walks", "Religious & Spiritual Sites"],
  Curious: ["Museums & Art", "Interactive Museums", "Historical Sites", "Niche Collections"],
  Energetic: ["Creative & Street Culture", "Public Squares", "Artisan Markets", "Event-Driven Park"],
  Contemplative: ["Culture & History", "Heritage Trails", "Library Landmark", "Quiet Retreat"]
} as const;

// Helper functions
export const getAllPrimaryCategories = () => Object.values(PRIMARY_CATEGORIES).map(cat => cat.name);

export const getAllTagsForCategory = (categoryName: string) => {
  const category = Object.values(PRIMARY_CATEGORIES).find(cat => cat.name === categoryName);
  return category ? category.tags : [];
};

export const getAllPrimaryTags = () => 
  Object.values(PRIMARY_CATEGORIES).flatMap(cat => cat.tags);

export const getAllSecondaryTags = () => 
  Object.values(SECONDARY_TAGS).flatMap(group => group.tags);

export const getTagsForMood = (mood: keyof typeof MOOD_TAG_MAPPING) => 
  MOOD_TAG_MAPPING[mood] || [];

// Cross-category analysis
export const getCategoriesForTags = (tags: string[]) => {
  const categories: { [categoryName: string]: string[] } = {};
  
  tags.forEach(tag => {
    Object.values(PRIMARY_CATEGORIES).forEach(category => {
      if (category.tags.includes(tag)) {
        if (!categories[category.name]) {
          categories[category.name] = [];
        }
        categories[category.name].push(tag);
      }
    });
  });
  
  return categories;
};

export const getTagCategory = (tag: string): string | null => {
  for (const category of Object.values(PRIMARY_CATEGORIES)) {
    if (category.tags.includes(tag)) {
      return category.name;
    }
  }
  return null;
};

// Validation helpers
export const validateLocationTags = (tags: {
  primary: string[];
  secondary: string[];
  hidden: string[];
  contextual: string[];
}) => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Must have 3-5 primary tags (cross-category allowed)
  if (tags.primary.length < 3) {
    errors.push(`Minimum 3 primary tags required. Current: ${tags.primary.length}`);
  }
  if (tags.primary.length > 5) {
    errors.push(`Maximum 5 primary tags allowed. Current: ${tags.primary.length}`);
  }
  
  // All primary tags must be valid (from any category)
  const allValidPrimaryTags = Object.values(PRIMARY_CATEGORIES).flatMap(cat => cat.tags);
  const invalidPrimary = tags.primary.filter(tag => !allValidPrimaryTags.includes(tag));
  if (invalidPrimary.length > 0) {
    errors.push(`Invalid primary tags: ${invalidPrimary.join(", ")}`);
  }
  
  // Check for cross-category diversity (encourage but don't enforce)
  const usedPrimaryCategories = new Set();
  tags.primary.forEach(tag => {
    Object.entries(PRIMARY_CATEGORIES).forEach(([catKey, catData]) => {
      if (catData.tags.includes(tag)) {
        usedPrimaryCategories.add(catData.name);
      }
    });
  });
  
  if (usedPrimaryCategories.size === 1 && tags.primary.length >= 3) {
    warnings.push(`All primary tags from same category (${Array.from(usedPrimaryCategories)[0]}). Consider cross-category tags for richer location description.`);
  }
  
  // Secondary tags validation (2-5 for location cards)
  if (tags.secondary.length < 2) {
    errors.push("Minimum 2 secondary tags required for location card display");
  }
  if (tags.secondary.length > 5) {
    warnings.push("Maximum 5 secondary tags shown on location cards. Consider moving extras to hidden layer");
  }
  
  // Ensure coverage across secondary tag categories
  const requiredSecondaryCategories = [
    "Time Commitment", // Duration info
    "Weather Suitability", // Indoor/Outdoor
    "Mobility Context", // Accessibility 
    "Audience Suitability" // Who it's good for
  ];
  
  const usedSecondaryCategories = getSecondaryTagCategories(tags.secondary);
  const missingCategories = requiredSecondaryCategories.filter(cat => !usedSecondaryCategories.includes(cat));
  if (missingCategories.length > 0) {
    warnings.push(`Consider adding tags from categories: ${missingCategories.join(", ")}`);
  }
  
  // Secondary tags must be valid
  const validSecondaryTags = getAllSecondaryTags();
  const invalidSecondary = tags.secondary.filter(tag => !validSecondaryTags.includes(tag));
  if (invalidSecondary.length > 0) {
    errors.push(`Invalid secondary tags: ${invalidSecondary.join(", ")}`);
  }
  
  // Hidden tags should provide algorithmic insights (2-4 recommended)
  if (tags.hidden.length < 2) {
    warnings.push("Recommend 2-4 hidden tags for better algorithmic recommendations");
  }
  if (tags.hidden.length > 6) {
    warnings.push("Too many hidden tags. Keep only the most relevant algorithmic insights");
  }
  
  // Contextual tags for seasonal/temporal relevance (1-3 recommended)
  if (tags.contextual.length === 0) {
    warnings.push("Consider adding contextual tags for seasonal/timing recommendations");
  }
  if (tags.contextual.length > 4) {
    warnings.push("Too many contextual tags. Focus on the most important timing factors");
  }
  
  return { errors, warnings };
};

// Helper to determine which secondary tag categories are used
export const getSecondaryTagCategories = (secondaryTags: string[]): string[] => {
  const categories: string[] = [];
  
  Object.entries(SECONDARY_TAGS).forEach(([key, group]) => {
    const hasTagFromCategory = secondaryTags.some(tag => group.tags.includes(tag));
    if (hasTagFromCategory) {
      categories.push(group.name);
    }
  });
  
  return categories;
};

// Enhanced validation with suggestions
export const analyzeLocationTagging = (location: {
  name: string;
  category: string;
  tags: {
    primary: string[];
    secondary: string[];
    hidden: string[];
    contextual: string[];
  };
}) => {
  const validation = validateLocationTags(location.tags);
  const totalTags = location.tags.primary.length + location.tags.secondary.length + 
                   location.tags.hidden.length + location.tags.contextual.length;
  
  return {
    name: location.name,
    category: location.category,
    validation,
    stats: {
      totalVisible: location.tags.primary.length + location.tags.secondary.length,
      totalTags,
      breakdown: {
        primary: location.tags.primary.length,
        secondary: location.tags.secondary.length,
        hidden: location.tags.hidden.length,
        contextual: location.tags.contextual.length
      }
    },
    meets3PlusRule: (location.tags.primary.length + location.tags.secondary.length) >= 3
  };
};