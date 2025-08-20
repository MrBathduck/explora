export interface Location {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  rating?: number;
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