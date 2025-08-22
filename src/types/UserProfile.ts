import { Timestamp } from 'firebase/firestore'

export interface TravelStyle {
  preferredTags: string[]  // User-selected tags from Layer 1 categories during onboarding
  mobilityPreference: 'walk' | 'transit' | 'car' | 'mixed'
  timeStyle: 'quick' | 'deep' | 'mixed'
  groupType: 'solo' | 'couple' | 'family' | 'friends' | 'mixed'
}

export interface AccessibilityPreferences {
  wheelchairNeeded: boolean
  avoidStairs: boolean
  elderFriendly: boolean
}

export interface AppPreferences {
  defaultMapView: 'list' | 'map' | 'split'
  notifications: boolean
  dataSync: boolean
  language: 'en' | 'de' | 'pt'
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD'
  timeFormat: '12h' | '24h'
}

export interface PrivacySettings {
  analyticsConsent: boolean
  marketingConsent: boolean
  dataRetention: 'session' | '1year' | 'indefinite'
  locationConsent: boolean // GDPR: User consent for location-based suggestions
  locationSharingLevel: 'none' | 'city' | 'neighborhood' | 'precise' // How precise location data can be used
}

export interface UserProfile {
  // Basic Info
  uid: string
  email: string
  displayName: string
  photoURL?: string
  
  // Travel Preferences (from onboarding)
  travelStyle: TravelStyle
  
  // Accessibility & Practical
  accessibility: AccessibilityPreferences
  
  // App Preferences
  preferences: AppPreferences
  
  // Privacy & Consent
  privacy: PrivacySettings
  
  // Metadata
  createdAt: Timestamp
  lastUpdated: Timestamp
  onboardingCompleted: boolean
  appVersion: string
}

// Partial profile for updates
export type UserProfileUpdate = Partial<Omit<UserProfile, 'uid' | 'createdAt'>>

// Default values for new users
export const DEFAULT_TRAVEL_STYLE: TravelStyle = {
  preferredTags: [],
  mobilityPreference: 'mixed',
  timeStyle: 'mixed',
  groupType: 'mixed'
}

export const DEFAULT_ACCESSIBILITY: AccessibilityPreferences = {
  wheelchairNeeded: false,
  avoidStairs: false,
  elderFriendly: false
}

export const DEFAULT_APP_PREFERENCES: AppPreferences = {
  defaultMapView: 'split',
  notifications: true,
  dataSync: true,
  language: 'en',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '24h'
}

export const DEFAULT_PRIVACY_SETTINGS: PrivacySettings = {
  analyticsConsent: false,
  marketingConsent: false,
  dataRetention: '1year',
  locationConsent: false, // Default to NO location consent (GDPR compliant)
  locationSharingLevel: 'none' // Default to no location sharing
}

// Validation helpers
export const validateTravelStyle = (travelStyle: Partial<TravelStyle>): string[] => {
  const errors: string[] = []
  
  if (travelStyle.preferredTags && travelStyle.preferredTags.length > 10) {
    errors.push('Maximum 10 preferred tags allowed')
  }
  
  if (travelStyle.preferredTags && travelStyle.preferredTags.length < 3) {
    errors.push('Minimum 3 preferred tags required')
  }
  
  return errors
}

export const validateUserProfile = (profile: Partial<UserProfile>): string[] => {
  const errors: string[] = []
  
  if (!profile.uid) {
    errors.push('User ID is required')
  }
  
  if (!profile.email) {
    errors.push('Email is required')
  }
  
  if (!profile.displayName) {
    errors.push('Display name is required')
  }
  
  if (profile.travelStyle) {
    errors.push(...validateTravelStyle(profile.travelStyle))
  }
  
  return errors
}

// Helper function to create a new user profile from Firebase auth user
export const createUserProfileFromAuth = (
  authUser: { uid: string; email: string | null; displayName: string | null; photoURL: string | null },
  appVersion: string
): UserProfile => {
  return {
    uid: authUser.uid,
    email: authUser.email || '',
    displayName: authUser.displayName || 'User',
    photoURL: authUser.photoURL || undefined,
    travelStyle: DEFAULT_TRAVEL_STYLE,
    accessibility: DEFAULT_ACCESSIBILITY,
    preferences: DEFAULT_APP_PREFERENCES,
    privacy: DEFAULT_PRIVACY_SETTINGS,
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now(),
    onboardingCompleted: false,
    appVersion
  }
}