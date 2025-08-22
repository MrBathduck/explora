import React, { useState, useEffect } from 'react'
import { type User } from 'firebase/auth'
import { 
  type UserProfile,
  type TravelStyle, 
  type AccessibilityPreferences,
  type PrivacySettings,
  type AppPreferences,
  DEFAULT_TRAVEL_STYLE,
  DEFAULT_ACCESSIBILITY,
  DEFAULT_PRIVACY_SETTINGS,
  DEFAULT_APP_PREFERENCES
} from '../../types/UserProfile'
import { 
  createUserProfile,
  updateUserProfile,
  completeOnboarding
} from '../../services/userProfile'
import OnboardingWelcome from './OnboardingWelcome'
import OnboardingTagSelector from './OnboardingTagSelector'
import OnboardingPreferences from './OnboardingPreferences'
import OnboardingPrivacy from './OnboardingPrivacy'
import './OnboardingFlow.css'

type OnboardingStep = 'welcome' | 'tags' | 'preferences' | 'privacy'

interface OnboardingFlowProps {
  user: User | null
  onComplete: (profile: UserProfile) => void
  onSignInRequested: () => Promise<User | null>
  onClose?: () => void
}

interface OnboardingData {
  selectedTags: string[]
  travelStyle: TravelStyle
  accessibility: AccessibilityPreferences
  privacy: PrivacySettings
  preferences: AppPreferences
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ 
  user, 
  onComplete, 
  onSignInRequested,
  onClose 
}) => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Onboarding data collection
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    selectedTags: [],
    travelStyle: DEFAULT_TRAVEL_STYLE,
    accessibility: DEFAULT_ACCESSIBILITY,
    privacy: DEFAULT_PRIVACY_SETTINGS,
    preferences: DEFAULT_APP_PREFERENCES
  })

  // Progress tracking
  const stepOrder: OnboardingStep[] = ['welcome', 'tags', 'preferences', 'privacy']
  const currentStepIndex = stepOrder.indexOf(currentStep)
  const progress = ((currentStepIndex + 1) / stepOrder.length) * 100

  // Navigation handlers
  const goToNextStep = () => {
    const nextIndex = currentStepIndex + 1
    if (nextIndex < stepOrder.length) {
      setCurrentStep(stepOrder[nextIndex])
    }
  }

  const goToPreviousStep = () => {
    const prevIndex = currentStepIndex - 1
    if (prevIndex >= 0) {
      setCurrentStep(stepOrder[prevIndex])
    }
  }

  // Step completion handlers
  const handleWelcomeContinue = () => {
    goToNextStep()
  }

  const handleTagsSelected = (selectedTags: string[]) => {
    setOnboardingData(prev => ({
      ...prev,
      selectedTags,
      travelStyle: {
        ...prev.travelStyle,
        preferredTags: selectedTags
      }
    }))
    goToNextStep()
  }

  const handlePreferencesSelected = (
    travelStyle: TravelStyle, 
    accessibility: AccessibilityPreferences
  ) => {
    setOnboardingData(prev => ({
      ...prev,
      travelStyle: {
        ...travelStyle,
        preferredTags: prev.selectedTags // Keep tags from previous step
      },
      accessibility
    }))
    goToNextStep()
  }

  const handlePrivacyComplete = async (
    privacy: PrivacySettings,
    preferences: AppPreferences,
    shouldSignIn: boolean
  ) => {
    setIsLoading(true)
    setError(null)

    try {
      let currentUser = user

      // Handle sign-in if requested
      if (shouldSignIn && !user) {
        currentUser = await onSignInRequested()
        if (!currentUser) {
          throw new Error('Sign-in failed')
        }
      }

      // Update onboarding data
      const finalData = {
        ...onboardingData,
        privacy,
        preferences: {
          ...preferences,
          dataSync: preferences.dataSync && !!currentUser // Only enable sync if signed in
        }
      }

      setOnboardingData(finalData)

      // Create or update user profile
      let profile: UserProfile

      if (currentUser) {
        // Create profile in Firebase
        profile = await createUserProfile(currentUser)
        
        // Update with onboarding data
        profile = await updateUserProfile(currentUser.uid, {
          travelStyle: finalData.travelStyle,
          accessibility: finalData.accessibility,
          privacy: finalData.privacy,
          preferences: finalData.preferences,
          onboardingCompleted: true
        })
      } else {
        // Create local-only profile
        profile = {
          uid: 'local-user',
          email: '',
          displayName: 'Local User',
          travelStyle: finalData.travelStyle,
          accessibility: finalData.accessibility,
          privacy: finalData.privacy,
          preferences: finalData.preferences,
          createdAt: new Date() as any,
          lastUpdated: new Date() as any,
          onboardingCompleted: true,
          appVersion: '1.0.0'
        }
      }

      onComplete(profile)
    } catch (err) {
      console.error('Error completing onboarding:', err)
      setError(err instanceof Error ? err.message : 'Failed to complete onboarding')
    } finally {
      setIsLoading(false)
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && onClose) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (isLoading) {
    return (
      <div className="onboarding-overlay">
        <div className="onboarding-loading">
          <div className="loading-spinner"></div>
          <h3>Setting up your profile...</h3>
          <p>This will just take a moment</p>
        </div>
      </div>
    )
  }

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-container">
        {/* Progress Bar */}
        <div className="onboarding-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="progress-text">
            Step {currentStepIndex + 1} of {stepOrder.length}
          </div>
        </div>

        {/* Close Button */}
        {onClose && (
          <button 
            className="onboarding-close"
            onClick={onClose}
            aria-label="Close onboarding"
          >
            ✕
          </button>
        )}

        {/* Error Display */}
        {error && (
          <div className="onboarding-error">
            <p>{error}</p>
            <button onClick={() => setError(null)}>Dismiss</button>
          </div>
        )}

        {/* Step Content */}
        <div className="onboarding-step">
          {currentStep === 'welcome' && (
            <OnboardingWelcome onContinue={handleWelcomeContinue} />
          )}

          {currentStep === 'tags' && (
            <OnboardingTagSelector
              onContinue={handleTagsSelected}
              onBack={goToPreviousStep}
              initialTags={onboardingData.selectedTags}
            />
          )}

          {currentStep === 'preferences' && (
            <OnboardingPreferences
              onContinue={handlePreferencesSelected}
              onBack={goToPreviousStep}
              initialTravelStyle={onboardingData.travelStyle}
              initialAccessibility={onboardingData.accessibility}
            />
          )}

          {currentStep === 'privacy' && (
            <OnboardingPrivacy
              onComplete={handlePrivacyComplete}
              onBack={goToPreviousStep}
              user={user}
              onSignIn={onSignInRequested}
              initialPrivacy={onboardingData.privacy}
              initialPreferences={onboardingData.preferences}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default OnboardingFlow