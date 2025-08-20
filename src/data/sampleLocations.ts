import type { Location } from '../types/Location';

export const sampleLocations: Location[] = [
  {
    id: '1',
    name: 'Café Central',
    description: 'Historic Viennese coffeehouse with beautiful architecture and amazing pastries. Perfect for a morning coffee break.',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop',
    category: 'Café',
    rating: 4.8,
    address: 'Herrengasse 14, 1010 Vienna',
    coordinates: { lat: 48.2108, lng: 16.3693 },
    images: [
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=300&fit=crop'
    ],
    hours: 'Mon-Sat 7:30-22:00, Sun 10:00-22:00',
    priceRange: '€€',
    website: 'https://cafecentral.wien',
    phone: '+43 1 533 3763',
    highlights: [
      'Historic coffeehouse since 1876',
      'Famous for Sachertorte and Apfelstrudel',
      'Beautiful neo-Renaissance architecture',
      'Live piano music on weekends'
    ]
  },
  {
    id: '2',
    name: 'Schönbrunn Palace',
    description: 'Imperial summer palace with stunning gardens and rich history. A must-visit for any Vienna trip.',
    image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400&h=300&fit=crop',
    category: 'Attraction',
    rating: 4.9,
    address: 'Schönbrunner Schloßstraße 47, 1130 Vienna',
    coordinates: { lat: 48.1847, lng: 16.3124 }
  },
  {
    id: '3',
    name: 'Naschmarkt',
    description: 'Vibrant market with fresh produce, international cuisine, and unique finds. Great for food lovers!',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    category: 'Market',
    rating: 4.6,
    address: 'Linke Wienzeile, 1060 Vienna',
    coordinates: { lat: 48.1985, lng: 16.3636 }
  },
  {
    id: '4',
    name: 'Stadtpark',
    description: 'Beautiful urban park perfect for a relaxing stroll. Home to the famous Johann Strauss monument.',
    image: 'https://images.unsplash.com/photo-1571847140471-1d7766e825ea?w=400&h=300&fit=crop',
    category: 'Park',
    rating: 4.5,
    address: 'Stadtpark, 1030 Vienna',
    coordinates: { lat: 48.2054, lng: 16.3789 }
  },
  {
    id: '5',
    name: 'Figlmüller',
    description: 'Famous traditional Viennese restaurant known for enormous schnitzels and authentic Austrian atmosphere.',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop',
    category: 'Restaurant',
    rating: 4.7,
    address: 'Wollzeile 5, 1010 Vienna',
    coordinates: { lat: 48.2084, lng: 16.3731 },
    images: [
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop'
    ],
    hours: 'Daily 11:30-23:00',
    priceRange: '€€€',
    website: 'https://figlmueller.at',
    phone: '+43 1 512 6177',
    highlights: [
      'Home of the original Wiener Schnitzel since 1905',
      'Schnitzels are larger than the plate',
      'Traditional Austrian beer and wine selection',
      'Historic restaurant with vintage decor'
    ]
  },
  {
    id: '6',
    name: 'Belvedere Museum',
    description: 'Baroque palace complex housing Austrian art including Klimt\'s "The Kiss". Stunning gardens and city views.',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    category: 'Museum',
    rating: 4.8,
    address: 'Prinz Eugen-Straße 27, 1030 Vienna',
    coordinates: { lat: 48.1916, lng: 16.3803 }
  },
  {
    id: '7',
    name: 'St. Stephen\'s Cathedral',
    description: 'Gothic cathedral and symbol of Vienna. Climb the tower for panoramic city views and explore centuries of history.',
    image: 'https://images.unsplash.com/photo-1578662779175-62a82c4d6b50?w=400&h=300&fit=crop',
    category: 'Church',
    rating: 4.6,
    address: 'Stephansplatz 3, 1010 Vienna',
    coordinates: { lat: 48.2085, lng: 16.3721 }
  },
  {
    id: '8',
    name: 'Loos American Bar',
    description: 'Iconic cocktail bar designed by Adolf Loos. Tiny space with huge reputation for perfect classic cocktails.',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=300&fit=crop',
    category: 'Bar',
    rating: 4.5,
    address: 'Kärntner Durchgang 10, 1010 Vienna',
    coordinates: { lat: 48.2068, lng: 16.3705 }
  }
];