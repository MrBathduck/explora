export interface LocationTags {
  primary: string[];
  secondary: string[];
  hidden: string[];
  contextual: string[];
}

export interface Location {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string; // Legacy - will be replaced by tags.primary[0]
  tags: LocationTags;
  rating?: number;
  duration?: string;
  address?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  // Enhanced details for modal
  images?: string[];
  hours?: string;
  priceRange?: string;
  website?: string;
  phone?: string;
  highlights?: string[];
}