// Category icons mapping
export const getCategoryIcon = (category: string): string => {
  const icons: { [key: string]: string } = {
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
    'All': '🌟',
    'Favorites': '❤️'
  };
  
  return icons[category] || '📍';
};

// Category colors for consistent theming
export const getCategoryColor = (category: string): string => {
  const colors: { [key: string]: string } = {
    'Café': '#8B4513',
    'Restaurant': '#FF6B35',
    'Attraction': '#4A90E2',
    'Museum': '#9B59B6',
    'Park': '#27AE60',
    'Market': '#F39C12',
    'Bar': '#E74C3C',
    'Shopping': '#E91E63',
    'Church': '#795548',
    'Viewpoint': '#00BCD4',
    'Entertainment': '#FF5722',
    'Hotel': '#607D8B',
    'Transport': '#34495E'
  };
  
  return colors[category] || '#4A90E2';
};