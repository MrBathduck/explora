// 📍 Location-Based Suggestions Component
// GDPR-compliant location suggestions with privacy controls

import React, { useState, useEffect } from 'react';
import { type Location } from '../../types/Location';
import { type UserProfile } from '../../types/UserProfile';
import { 
  getLocationBasedSuggestions, 
  type LocationSuggestion,
  checkLocationPermission
} from '../../services/locationService';
import LocationCard from '../location/LocationCard';
import './LocationSuggestions.css';

interface LocationSuggestionsProps {
  userProfile: UserProfile | null;
  allLocations: Location[];
  onLocationSelect: (location: Location) => void;
  onUpdateProfile?: (updates: Partial<UserProfile>) => void;
}

const LocationSuggestions: React.FC<LocationSuggestionsProps> = ({
  userProfile,
  allLocations,
  onLocationSelect,
  onUpdateProfile
}) => {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);

  useEffect(() => {
    if (userProfile) {
      loadSuggestions();
      checkPermissions();
    }
  }, [userProfile, allLocations]);

  const checkPermissions = async () => {
    if (!userProfile) return;
    
    const permission = await checkLocationPermission(userProfile);
    setHasLocationPermission(permission.granted);
    
    // Show location prompt if user hasn't decided yet
    if (!userProfile.privacy.locationConsent && !localStorage.getItem('explora_location_prompt_dismissed')) {
      setShowLocationPrompt(true);
    }
  };

  const loadSuggestions = async () => {
    if (!userProfile) return;
    
    setIsLoading(true);
    try {
      const locationSuggestions = await getLocationBasedSuggestions(userProfile, allLocations);
      setSuggestions(locationSuggestions);
    } catch (error) {
      console.error('Failed to load location suggestions:', error);
      // Fallback to tag-based suggestions
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnableLocation = () => {
    if (!userProfile || !onUpdateProfile) return;
    
    // Update user privacy settings to enable location
    onUpdateProfile({
      privacy: {
        ...userProfile.privacy,
        locationConsent: true,
        locationSharingLevel: 'neighborhood' // Safe default
      }
    });
    
    setShowLocationPrompt(false);
    // Reload suggestions with location enabled
    setTimeout(loadSuggestions, 500);
  };

  const handleDismissLocationPrompt = () => {
    setShowLocationPrompt(false);
    localStorage.setItem('explora_location_prompt_dismissed', 'true');
  };

  if (!userProfile) {
    return null;
  }

  return (
    <div className="location-suggestions">
      {/* Privacy-First Location Prompt */}
      {showLocationPrompt && (
        <div className="location-prompt">
          <div className="location-prompt-content">
            <span className="location-prompt-icon">📍</span>
            <div className="location-prompt-text">
              <h3>Get personalized suggestions</h3>
              <p>Enable location to discover amazing places near you. Your privacy is protected - you control what data is shared.</p>
            </div>
            <div className="location-prompt-actions">
              <button 
                className="location-prompt-dismiss"
                onClick={handleDismissLocationPrompt}
              >
                Not now
              </button>
              <button 
                className="location-prompt-enable"
                onClick={handleEnableLocation}
              >
                Enable location
              </button>
            </div>
          </div>
          <div className="location-prompt-privacy">
            <small>🔒 Your location stays private and is never stored permanently</small>
          </div>
        </div>
      )}

      {/* Location Status Indicator */}
      {userProfile.privacy.locationConsent && (
        <div className="location-status">
          <span className={`location-indicator ${hasLocationPermission ? 'enabled' : 'disabled'}`}>
            📍 {hasLocationPermission ? 'Location enabled' : 'Location permission needed'}
          </span>
          {!hasLocationPermission && (
            <button 
              className="location-enable-browser"
              onClick={() => window.location.reload()}
            >
              Allow in browser
            </button>
          )}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="suggestions-loading">
          <div className="loading-spinner"></div>
          <p>Finding personalized suggestions...</p>
        </div>
      )}

      {/* Suggestions Sections */}
      {!isLoading && suggestions.map((suggestion, index) => (
        <div key={index} className="suggestion-section">
          <div className="suggestion-header">
            <h2>{suggestion.title}</h2>
            <p>{suggestion.description}</p>
            {suggestion.reason && (
              <div className="suggestion-reason">
                <small>💡 {suggestion.reason}</small>
              </div>
            )}
          </div>
          
          <div className="suggestion-locations">
            {suggestion.locations.map(location => (
              <LocationCard
                key={location.id}
                location={location}
                onClick={() => onLocationSelect(location)}
                showDistance={suggestion.type === 'nearby'}
                compact={true}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Privacy Notice */}
      {userProfile.privacy.locationConsent && (
        <div className="location-privacy-notice">
          <div className="privacy-notice-content">
            <span className="privacy-icon">🔒</span>
            <div className="privacy-text">
              <strong>Your privacy is protected</strong>
              <p>Location data is used only for suggestions and never stored permanently. You can disable this anytime in Settings.</p>
            </div>
          </div>
        </div>
      )}

      {/* No Suggestions Fallback */}
      {!isLoading && suggestions.length === 0 && (
        <div className="no-suggestions">
          <span className="no-suggestions-icon">🗺️</span>
          <h3>No suggestions available</h3>
          <p>
            {!userProfile.privacy.locationConsent 
              ? "Enable location in Settings to get personalized suggestions based on where you are."
              : "Try updating your preferred tags in Settings to get better recommendations."
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default LocationSuggestions;