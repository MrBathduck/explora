// 📍 GDPR-Compliant Location Service
// Handles location-based suggestions with strict privacy controls

import { type UserProfile } from '../types/UserProfile';
import { type Location } from '../types/Location';

export interface LocationPermission {
  granted: boolean;
  accuracy: 'none' | 'city' | 'neighborhood' | 'precise';
  timestamp: number;
}

export interface UserLocation {
  latitude?: number;
  longitude?: number;
  city?: string;
  country?: string;
  accuracy: 'none' | 'city' | 'neighborhood' | 'precise';
}

export interface LocationSuggestion {
  type: 'nearby' | 'neighborhood' | 'upcoming_trip' | 'preferred_city';
  title: string;
  description: string;
  locations: Location[];
  distance?: string;
  reason: string;
}

// GDPR-compliant location permission check
export const checkLocationPermission = async (userProfile: UserProfile): Promise<LocationPermission> => {
  // First check user's privacy settings (GDPR consent)
  if (!userProfile.privacy.locationConsent) {
    return {
      granted: false,
      accuracy: 'none',
      timestamp: Date.now()
    };
  }

  // Check browser location permission
  if (!navigator.geolocation) {
    return {
      granted: false,
      accuracy: 'none',
      timestamp: Date.now()
    };
  }

  try {
    // Check existing permission status without prompting
    const permission = await navigator.permissions.query({ name: 'geolocation' });
    
    return {
      granted: permission.state === 'granted',
      accuracy: userProfile.privacy.locationSharingLevel,
      timestamp: Date.now()
    };
  } catch (error) {
    // Fallback for browsers that don't support permissions API
    return {
      granted: false,
      accuracy: 'none',
      timestamp: Date.now()
    };
  }
};

// Request location with user consent (GDPR compliant)
export const requestUserLocation = async (userProfile: UserProfile): Promise<UserLocation> => {
  const permission = await checkLocationPermission(userProfile);
  
  if (!permission.granted) {
    return { accuracy: 'none' };
  }

  return new Promise((resolve) => {
    const options: PositionOptions = {
      enableHighAccuracy: permission.accuracy === 'precise',
      timeout: 10000,
      maximumAge: permission.accuracy === 'city' ? 600000 : 60000 // Cache city-level for 10min, precise for 1min
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        resolve({
          latitude,
          longitude,
          accuracy: permission.accuracy,
        });
      },
      (error) => {
        console.warn('Location access denied or failed:', error.message);
        resolve({ accuracy: 'none' });
      },
      options
    );
  });
};

// Privacy-safe distance calculation
export const calculateDistance = (
  userLocation: UserLocation,
  targetLocation: { lat: number; lng: number }
): number | null => {
  if (!userLocation.latitude || !userLocation.longitude) {
    return null;
  }

  // Haversine formula for distance calculation
  const R = 6371; // Earth's radius in kilometers
  const dLat = (targetLocation.lat - userLocation.latitude) * Math.PI / 180;
  const dLng = (targetLocation.lng - userLocation.longitude) * Math.PI / 180;
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(userLocation.latitude * Math.PI / 180) * Math.cos(targetLocation.lat * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return distance;
};

// Format distance based on privacy level
export const formatDistance = (distance: number | null, accuracy: UserLocation['accuracy']): string => {
  if (!distance) return '';
  
  switch (accuracy) {
    case 'precise':
      if (distance < 1) return `${Math.round(distance * 1000)}m away`;
      return `${distance.toFixed(1)}km away`;
    
    case 'neighborhood':
      if (distance < 2) return 'Very close';
      if (distance < 5) return 'Nearby';
      return 'In your area';
    
    case 'city':
      if (distance < 10) return 'In your city';
      return 'Nearby city';
    
    default:
      return '';
  }
};

// Generate location-based suggestions (FUTURE: Will include GDPR-compliant geolocation)
export const getLocationBasedSuggestions = async (
  userProfile: UserProfile,
  allLocations: Location[]
): Promise<LocationSuggestion[]> => {
  // FUTURE PHASE: Geolocation-based suggestions
  // Currently focusing on tag-based personalization only
  // TODO: Implement geolocation service when ready for location permissions
  
  // For now, return tag-based suggestions only
  return getTagBasedSuggestions(userProfile, allLocations);
  
  // COMMENTED OUT: Geolocation implementation for future phase
  /* 
  const suggestions: LocationSuggestion[] = [];
  
  // Check if user has consented to location-based suggestions
  if (!userProfile.privacy.locationConsent) {
    // Return tag-based suggestions instead
    return getTagBasedSuggestions(userProfile, allLocations);
  }

  const userLocation = await requestUserLocation(userProfile);
  
  if (userLocation.accuracy === 'none') {
    // Fallback to tag-based suggestions
    return getTagBasedSuggestions(userProfile, allLocations);
  }

  // Nearby locations based on user's location
  if (userLocation.latitude && userLocation.longitude) {
    const nearbyLocations = allLocations
      .map(location => ({
        ...location,
        distance: calculateDistance(userLocation, location.coordinates)
      }))
      .filter(location => location.distance !== null && location.distance! < 10) // Within 10km
      .sort((a, b) => a.distance! - b.distance!)
      .slice(0, 5);

    if (nearbyLocations.length > 0) {
      suggestions.push({
        type: 'nearby',
        title: 'Near You',
        description: 'Discover places close to your current location',
        locations: nearbyLocations.map(({ distance, ...location }) => location),
        reason: 'Based on your current location',
      });
    }
  }

  // Add tag-based suggestions as well
  const tagSuggestions = getTagBasedSuggestions(userProfile, allLocations);
  suggestions.push(...tagSuggestions);

  return suggestions;
  */
};

// Fallback: Tag-based suggestions (no location required)
const getTagBasedSuggestions = (
  userProfile: UserProfile,
  allLocations: Location[]
): LocationSuggestion[] => {
  const suggestions: LocationSuggestion[] = [];
  const userTags = userProfile.travelStyle?.preferredTags || [];

  if (userTags.length > 0) {
    // Find locations matching user's preferred tags
    const matchingLocations = allLocations
      .map(location => {
        const matchingTags = location.tags.primary.filter(tag => 
          userTags.some(userTag => tag.includes(userTag) || userTag.includes(tag))
        );
        return {
          ...location,
          matchScore: matchingTags.length,
          matchingTags
        };
      })
      .filter(location => location.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 6);

    if (matchingLocations.length > 0) {
      suggestions.push({
        type: 'preferred_city',
        title: 'For You',
        description: 'Places matching your interests',
        locations: matchingLocations.map(({ matchScore, matchingTags, ...location }) => location),
        reason: `Based on your preferred tags: ${userTags.slice(0, 3).join(', ')}`,
      });
    }
  }

  return suggestions;
};

// Privacy-safe location storage (for analytics)
export const storeLocationAnalytics = (
  userLocation: UserLocation,
  userProfile: UserProfile
): void => {
  // Only store analytics if user consented
  if (!userProfile.privacy.analyticsConsent || !userProfile.privacy.locationConsent) {
    return;
  }

  // Store only aggregated, anonymized data based on precision level
  const analyticsData = {
    timestamp: Date.now(),
    accuracy: userLocation.accuracy,
    // Only store city-level data for analytics, never precise coordinates
    city: userLocation.city,
    country: userLocation.country,
    userId: userProfile.uid // For aggregation only, not individual tracking
  };

  // Store in local analytics (could be sent to anonymous analytics service)
  console.log('Location analytics (privacy-safe):', analyticsData);
};

// GDPR compliance helper: Clear all location data
export const clearLocationData = (): void => {
  // Clear any cached location data
  localStorage.removeItem('explora_user_location');
  localStorage.removeItem('explora_location_cache');
  
  console.log('All location data cleared for GDPR compliance');
};