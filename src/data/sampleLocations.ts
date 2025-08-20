import type { Location } from '../types/Location';

export const sampleLocations: Location[] = [
  {
    id: '1',
    name: 'Café Central',
    description: 'Historic Viennese coffeehouse with beautiful architecture and amazing pastries. Perfect for a morning coffee break.',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop',
    category: 'Café',
    rating: 4.8,
    address: 'Herrengasse 14, 1010 Vienna'
  },
  {
    id: '2',
    name: 'Schönbrunn Palace',
    description: 'Imperial summer palace with stunning gardens and rich history. A must-visit for any Vienna trip.',
    image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400&h=300&fit=crop',
    category: 'Attraction',
    rating: 4.9,
    address: 'Schönbrunner Schloßstraße 47, 1130 Vienna'
  },
  {
    id: '3',
    name: 'Naschmarkt',
    description: 'Vibrant market with fresh produce, international cuisine, and unique finds. Great for food lovers!',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    category: 'Market',
    rating: 4.6,
    address: 'Linke Wienzeile, 1060 Vienna'
  },
  {
    id: '4',
    name: 'Stadtpark',
    description: 'Beautiful urban park perfect for a relaxing stroll. Home to the famous Johann Strauss monument.',
    image: 'https://images.unsplash.com/photo-1571847140471-1d7766e825ea?w=400&h=300&fit=crop',
    category: 'Park',
    rating: 4.5,
    address: 'Parking, 1030 Vienna'
  }
];