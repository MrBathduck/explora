// Category icons mapping
export const getCategoryIcon = (category: string): string => {
  const icons: { [key: string]: string } = {
    // New Primary Categories from Tag System
    'Culture & History': '🏛️',
    'Museums & Art': '🖼️',
    'Parks & Nature': '🌳',
    'Urban Exploration': '🏙️',
    'Creative & Street Culture': '🎨',
    'Scenic & Panoramic': '🌅',
    
    // Legacy categories (for backward compatibility)
    'Café': '☕',
    'Restaurant': '🍽️',
    'Attraction': '🏛️',
    'Museum': '🖼️',
    'Park': '🌳',
    'Market': '🛒',
    'Bar': '🍺',
    'Shopping': '🛍️',
    'Church': '⛪',
    'Viewpoint': '📸',
    'Entertainment': '🎭',
    'Hotel': '🏨',
    'Transport': '🚇',
    
    // Special categories
    'All': '🌟',
    'Favorites': '❤️'
  };
  
  return icons[category] || '📍';
};

// Category colors for consistent theming (using CSS variables)
export const getCategoryColor = (category: string): string => {
  const colors: { [key: string]: string } = {
    // New Primary Categories from Tag System
    'Culture & History': 'var(--explora-category-culture)',
    'Museums & Art': 'var(--explora-category-museums)',
    'Parks & Nature': 'var(--explora-category-parks)',
    'Urban Exploration': 'var(--explora-category-urban)',
    'Creative & Street Culture': 'var(--explora-category-creative)',
    'Scenic & Panoramic': 'var(--explora-category-scenic)',
    
    // Legacy categories (for backward compatibility)
    'Café': 'var(--explora-category-culture)',
    'Restaurant': '#FF6B35',
    'Attraction': 'var(--explora-category-culture)',
    'Museum': 'var(--explora-category-museums)',
    'Park': 'var(--explora-category-parks)',
    'Market': '#F39C12',
    'Bar': '#E74C3C',
    'Shopping': '#E91E63',
    'Church': 'var(--explora-category-culture)',
    'Viewpoint': 'var(--explora-category-scenic)',
    'Entertainment': '#FF5722',
    'Hotel': '#607D8B',
    'Transport': 'var(--explora-category-urban)'
  };
  
  return colors[category] || 'var(--explora-category-default)';
};

// Get category for a primary tag
export const getTagCategory = (tag: string): string => {
  const tagCategories: { [key: string]: string } = {
    // Culture & History
    'Monuments & Landmarks': 'Culture & History',
    'Historical Sites': 'Culture & History',
    'Archaeological Sites': 'Culture & History',
    'Memorials': 'Culture & History',
    'Religious & Spiritual Sites': 'Culture & History',
    'World Heritage Sites': 'Culture & History',
    'Ancient Architecture': 'Culture & History',
    'Historic Neighborhoods': 'Culture & History',
    'Heritage Trails': 'Culture & History',
    'Palace or Castle': 'Culture & History',
    'Famous Historical Figures': 'Culture & History',
    'Royal Sites': 'Culture & History',
    'Civil Rights Sites': 'Culture & History',
    'Political History': 'Culture & History',
    'Colonial Architecture': 'Culture & History',
    'Medieval Architecture': 'Culture & History',
    'Philanthropic Heritage': 'Culture & History',
    'Former Hospitals': 'Culture & History',
    'Baroque Architecture': 'Culture & History',
    'Library Landmark': 'Culture & History',
    'Royal Patronage': 'Culture & History',

    // Museums & Art
    'Art Museums': 'Museums & Art',
    'History Museums': 'Museums & Art',
    'Science Museums': 'Museums & Art',
    'Modern Art Spaces': 'Museums & Art',
    'Niche Collections': 'Museums & Art',
    'Rotating Exhibitions': 'Museums & Art',
    'Temporary Galleries': 'Museums & Art',
    'Interactive Museums': 'Museums & Art',
    'Photography Exhibits': 'Museums & Art',
    'Immersive Installations': 'Museums & Art',
    'Children\'s Museums': 'Museums & Art',
    'Open-Air Museums': 'Museums & Art',
    'Local Artist Features': 'Museums & Art',
    'Permanent Collections': 'Museums & Art',
    'Cabinet of Curiosities': 'Museums & Art',
    'Unusual Exhibits': 'Museums & Art',
    'Animal-Themed': 'Museums & Art',
    'Contemporary Culture': 'Museums & Art',
    'Subversive Themes': 'Museums & Art',

    // Parks & Nature
    'Urban Parks': 'Parks & Nature',
    'Botanical Gardens': 'Parks & Nature',
    'Riverside Walks': 'Parks & Nature',
    'Forest Trails': 'Parks & Nature',
    'Wildlife Areas': 'Parks & Nature',
    'Green Escape': 'Parks & Nature',
    'Shaded Areas': 'Parks & Nature',
    'Natural Water Features': 'Parks & Nature',
    'Urban Biodiversity': 'Parks & Nature',
    'Outdoor Sculpture Gardens': 'Parks & Nature',
    'Picnic Friendly': 'Parks & Nature',
    'Cherry Blossom Spots': 'Parks & Nature',
    'Seasonal Highlights': 'Parks & Nature',
    'Dog-Friendly Zones': 'Parks & Nature',
    'Calm Walks': 'Parks & Nature',
    'Converted Railway Space': 'Parks & Nature',
    'Multi-Use Park': 'Parks & Nature',
    'Local Weekend Spot': 'Parks & Nature',
    'Event-Driven Park': 'Parks & Nature',
    'International Exhibitions': 'Parks & Nature',

    // Urban Exploration
    'Iconic Architecture': 'Urban Exploration',
    'Public Squares': 'Urban Exploration',
    'Neighborhood Walks': 'Urban Exploration',
    'Bridges & Tunnels': 'Urban Exploration',
    'Industrial Heritage': 'Urban Exploration',
    'Historic Streets': 'Urban Exploration',
    'Urban Photo Spots': 'Urban Exploration',
    'Rooftop Access': 'Urban Exploration',
    'Open Courtyards': 'Urban Exploration',
    'Covered Passages': 'Urban Exploration',
    'Famous Boulevards': 'Urban Exploration',
    'Decorative Facades': 'Urban Exploration',
    'City Gates': 'Urban Exploration',
    'Artists\' District': 'Urban Exploration',
    'Silk Industry Heritage': 'Urban Exploration',
    'Urban Redevelopment': 'Urban Exploration',
    'Graffiti Corridors': 'Urban Exploration',

    // Creative & Street Culture
    'Street Art': 'Creative & Street Culture',
    'Design Installations': 'Creative & Street Culture',
    'Creative Hubs': 'Creative & Street Culture',
    'Artisan Markets': 'Creative & Street Culture',
    'Indie Galleries': 'Creative & Street Culture',
    'Local Craft Centers': 'Creative & Street Culture',
    'Public Art Projects': 'Creative & Street Culture',
    'Community Murals': 'Creative & Street Culture',
    'Experimental Art Spaces': 'Creative & Street Culture',
    'Independent Art Shops': 'Creative & Street Culture',
    'Open Studios': 'Creative & Street Culture',
    'Zines & DIY Culture': 'Creative & Street Culture',
    'Artist Collectives': 'Creative & Street Culture',
    'Squatter Art Spaces': 'Creative & Street Culture',
    'DIY Events': 'Creative & Street Culture',
    'Reclaimed Spaces': 'Creative & Street Culture',
    'Artist Residency Complex': 'Creative & Street Culture',

    // Scenic & Panoramic
    'Rooftop Views': 'Scenic & Panoramic',
    'Hilltop Lookouts': 'Scenic & Panoramic',
    'Riverbanks': 'Scenic & Panoramic',
    'Sunset Spots': 'Scenic & Panoramic',
    'Panoramic Vistas': 'Scenic & Panoramic',
    'Skyline Overlook': 'Scenic & Panoramic',
    'Viewpoints with Seating': 'Scenic & Panoramic',
    'Photogenic Angles': 'Scenic & Panoramic',
    'Elevated Walkways': 'Scenic & Panoramic',
    'Cityscape Reflections': 'Scenic & Panoramic',
    'Observation Decks': 'Scenic & Panoramic',
    'Open-Air Platforms': 'Scenic & Panoramic',
    'Quiet Lookout': 'Scenic & Panoramic',
    'Locals\' Favorite View': 'Scenic & Panoramic',
    '360° View': 'Scenic & Panoramic',
    'Religious Panoramic Spot': 'Scenic & Panoramic'
  };
  
  return tagCategories[tag] || 'Unknown';
};

// Get color for a primary tag based on its category
export const getPrimaryTagColor = (tag: string): string => {
  const category = getTagCategory(tag);
  return getCategoryColor(category);
};