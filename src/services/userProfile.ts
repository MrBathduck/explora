import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  Timestamp,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore'
import { type User } from 'firebase/auth'
import { db } from '../config/firebase'
import { 
  type UserProfile, 
  type UserProfileUpdate,
  createUserProfileFromAuth,
  validateUserProfile
} from '../types/UserProfile'

const USERS_COLLECTION = 'users'
const APP_VERSION = '1.0.0' // TODO: Get from package.json or environment

// Get user profile from Firestore
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userDocRef = doc(db, USERS_COLLECTION, uid)
    const userDoc = await getDoc(userDocRef)
    
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile
    }
    
    return null
  } catch (error) {
    console.error('Error fetching user profile:', error)
    throw new Error('Failed to fetch user profile')
  }
}

// Create a new user profile
export const createUserProfile = async (authUser: User): Promise<UserProfile> => {
  try {
    const newProfile = createUserProfileFromAuth(authUser, APP_VERSION)
    
    // Validate the profile
    const validationErrors = validateUserProfile(newProfile)
    if (validationErrors.length > 0) {
      throw new Error(`Profile validation failed: ${validationErrors.join(', ')}`)
    }
    
    const userDocRef = doc(db, USERS_COLLECTION, authUser.uid)
    await setDoc(userDocRef, newProfile)
    
    return newProfile
  } catch (error) {
    console.error('Error creating user profile:', error)
    throw new Error('Failed to create user profile')
  }
}

// Update user profile
export const updateUserProfile = async (
  uid: string, 
  updates: UserProfileUpdate
): Promise<UserProfile> => {
  try {
    const userDocRef = doc(db, USERS_COLLECTION, uid)
    
    // Add timestamp for last updated
    const updateData = {
      ...updates,
      lastUpdated: Timestamp.now()
    }
    
    await updateDoc(userDocRef, updateData)
    
    // Fetch and return the updated profile
    const updatedProfile = await getUserProfile(uid)
    if (!updatedProfile) {
      throw new Error('Profile not found after update')
    }
    
    return updatedProfile
  } catch (error) {
    console.error('Error updating user profile:', error)
    throw new Error('Failed to update user profile')
  }
}

// Get or create user profile (for first-time users)
export const getOrCreateUserProfile = async (authUser: User): Promise<UserProfile> => {
  try {
    // Try to get existing profile first
    let profile = await getUserProfile(authUser.uid)
    
    if (!profile) {
      // Create new profile if doesn't exist
      profile = await createUserProfile(authUser)
    } else {
      // Update basic auth info in case it changed
      await updateUserProfile(authUser.uid, {
        email: authUser.email || profile.email,
        displayName: authUser.displayName || profile.displayName,
        photoURL: authUser.photoURL || profile.photoURL
      })
    }
    
    return profile
  } catch (error) {
    console.error('Error getting or creating user profile:', error)
    throw new Error('Failed to initialize user profile')
  }
}

// Mark onboarding as completed
export const completeOnboarding = async (uid: string): Promise<void> => {
  try {
    await updateUserProfile(uid, {
      onboardingCompleted: true
    })
  } catch (error) {
    console.error('Error completing onboarding:', error)
    throw new Error('Failed to complete onboarding')
  }
}

// Update travel style preferences
export const updateTravelStyle = async (
  uid: string, 
  travelStyle: UserProfile['travelStyle']
): Promise<void> => {
  try {
    await updateUserProfile(uid, { travelStyle })
  } catch (error) {
    console.error('Error updating travel style:', error)
    throw new Error('Failed to update travel style')
  }
}

// Update accessibility preferences
export const updateAccessibilityPreferences = async (
  uid: string, 
  accessibility: UserProfile['accessibility']
): Promise<void> => {
  try {
    await updateUserProfile(uid, { accessibility })
  } catch (error) {
    console.error('Error updating accessibility preferences:', error)
    throw new Error('Failed to update accessibility preferences')
  }
}

// Update app preferences
export const updateAppPreferences = async (
  uid: string, 
  preferences: UserProfile['preferences']
): Promise<void> => {
  try {
    await updateUserProfile(uid, { preferences })
  } catch (error) {
    console.error('Error updating app preferences:', error)
    throw new Error('Failed to update app preferences')
  }
}

// Update privacy settings
export const updatePrivacySettings = async (
  uid: string, 
  privacy: UserProfile['privacy']
): Promise<void> => {
  try {
    await updateUserProfile(uid, { privacy })
  } catch (error) {
    console.error('Error updating privacy settings:', error)
    throw new Error('Failed to update privacy settings')
  }
}

// Delete user profile (for account deletion)
export const deleteUserProfile = async (uid: string): Promise<void> => {
  try {
    const userDocRef = doc(db, USERS_COLLECTION, uid)
    await deleteDoc(userDocRef)
  } catch (error) {
    console.error('Error deleting user profile:', error)
    throw new Error('Failed to delete user profile')
  }
}

// Export user data (for GDPR compliance)
export const exportUserData = async (uid: string): Promise<UserProfile | null> => {
  try {
    return await getUserProfile(uid)
  } catch (error) {
    console.error('Error exporting user data:', error)
    throw new Error('Failed to export user data')
  }
}

// Check if user needs onboarding
export const needsOnboarding = async (uid: string): Promise<boolean> => {
  try {
    const profile = await getUserProfile(uid)
    return !profile || !profile.onboardingCompleted
  } catch (error) {
    console.error('Error checking onboarding status:', error)
    // If we can't check, assume they need onboarding for safety
    return true
  }
}

// Migrate existing users (for backward compatibility)
export const migrateExistingUser = async (authUser: User): Promise<UserProfile> => {
  try {
    const existingProfile = await getUserProfile(authUser.uid)
    
    if (existingProfile) {
      // Profile already exists, just update auth info
      return await updateUserProfile(authUser.uid, {
        email: authUser.email || existingProfile.email,
        displayName: authUser.displayName || existingProfile.displayName,
        photoURL: authUser.photoURL || existingProfile.photoURL
      })
    } else {
      // Create new profile with onboarding skipped for existing users
      const newProfile = createUserProfileFromAuth(authUser, APP_VERSION)
      newProfile.onboardingCompleted = true // Skip onboarding for migrated users
      
      const userDocRef = doc(db, USERS_COLLECTION, authUser.uid)
      await setDoc(userDocRef, newProfile)
      
      return newProfile
    }
  } catch (error) {
    console.error('Error migrating existing user:', error)
    throw new Error('Failed to migrate user profile')
  }
}