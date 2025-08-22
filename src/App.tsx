import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { auth } from './config/firebase'
import Navigation from './components/common/Navigation'
import Footer from './components/layout/Footer'
import HomePage from './pages/HomePage'
import TripsPage from './pages/TripsPage'
import TripDetailPage from './pages/TripDetailPage'
import TripPlanner from './pages/TripPlanner'
import DashboardPage from './pages/DashboardPage'
import AboutPage from './pages/AboutPage'
import SettingsPage from './pages/SettingsPage'
import AdminDashboard from './pages/AdminDashboard'
import OnboardingFlow from './components/onboarding/OnboardingFlow'
import { signInWithGoogle, signOut } from './services/auth'
import { addFavorite, removeFavorite, syncFavorites } from './services/favorites'
import { getOrCreateUserProfile, needsOnboarding, updateUserProfile } from './services/userProfile'
import { type UserProfile } from './types/UserProfile'
import { DropdownProvider } from './contexts/DropdownContext'
import './App.css'

// Helper functions for localStorage
const loadFavorites = (): string[] => {
  try {
    const saved = localStorage.getItem('explora-favorites')
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

const saveFavorites = (favorites: string[]): void => {
  try {
    localStorage.setItem('explora-favorites', JSON.stringify(favorites))
  } catch {
    // Handle localStorage errors silently
  }
}

function App() {
  const [favorites, setFavorites] = useState<string[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [isLoadingProfile, setIsLoadingProfile] = useState(false)

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        setIsLoadingProfile(true);
        try {
          // Get or create user profile
          const profile = await getOrCreateUserProfile(user);
          setUserProfile(profile);
          
          // Check if onboarding is needed
          const needsOnboardingFlow = await needsOnboarding(user.uid);
          setShowOnboarding(needsOnboardingFlow);
          
          // Sync favorites
          const localFavorites = loadFavorites();
          const syncedFavorites = await syncFavorites(user, localFavorites);
          setFavorites(syncedFavorites);
          saveFavorites(syncedFavorites);
        } catch (error) {
          console.error('Error loading user profile:', error);
        } finally {
          setIsLoadingProfile(false);
        }
      } else {
        // User signed out - reset everything
        setUserProfile(null);
        setShowOnboarding(false);
        setFavorites(loadFavorites());
      }
    });

    return () => unsubscribe();
  }, [])

  // Toggle favorite function with Firebase sync
  const toggleFavorite = async (locationId: string) => {
    const isCurrentlyFavorite = favorites.includes(locationId);
    const newFavorites = isCurrentlyFavorite
      ? favorites.filter(id => id !== locationId)
      : [...favorites, locationId];
    
    // Update local state immediately
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
    
    // Sync with Firebase if user is signed in
    if (user) {
      if (isCurrentlyFavorite) {
        await removeFavorite(user, locationId);
      } else {
        await addFavorite(user, locationId);
      }
    }
  }

  // Update user profile function (GDPR compliant)
  const handleUpdateProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !userProfile) return;

    try {
      const updatedProfile = await updateUserProfile(user.uid, updates);
      setUserProfile(updatedProfile);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  // Authentication handlers
  const handleSignIn = async () => {
    const signedInUser = await signInWithGoogle();
    if (signedInUser) {
      const localFavorites = loadFavorites();
      const syncedFavorites = await syncFavorites(signedInUser, localFavorites);
      setFavorites(syncedFavorites);
      saveFavorites(syncedFavorites);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    // State will be updated by onAuthStateChanged listener
  };

  // Onboarding handlers
  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    setShowOnboarding(false);
  };

  const handleOnboardingSignIn = async (): Promise<User | null> => {
    return await signInWithGoogle();
  };

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
  };


  return (
    <DndProvider backend={HTML5Backend}>
      <DropdownProvider>
        <Router>
          <div className="app">
            <Navigation 
              user={user} 
              onSignIn={handleSignIn} 
              onSignOut={handleSignOut} 
            />
            
            <main className="main-content">
              <Routes>
                <Route 
                  path="/" 
                  element={
                    <HomePage 
                      user={user}
                      favorites={favorites}
                      onToggleFavorite={toggleFavorite}
                      userProfile={userProfile}
                      onUpdateProfile={handleUpdateProfile}
                    />
                  } 
                />
                <Route 
                  path="/trips" 
                  element={
                    <TripsPage 
                      user={user}
                    />
                  } 
                />
                <Route 
                  path="/trips/new" 
                  element={<TripPlanner mode="create" />} 
                />
                <Route 
                  path="/trips/:tripId" 
                  element={
                    <TripDetailPage 
                      user={user}
                      favorites={favorites}
                      onToggleFavorite={toggleFavorite}
                    />
                  } 
                />
                <Route 
                  path="/trips/:tripId/edit" 
                  element={<TripPlanner mode="edit" />} 
                />
                <Route 
                  path="/dashboard" 
                  element={
                    <DashboardPage 
                      user={user}
                      favorites={favorites}
                      onToggleFavorite={toggleFavorite}
                    />
                  } 
                />
                <Route path="/about" element={<AboutPage />} />
                <Route 
                  path="/settings" 
                  element={<SettingsPage user={user} />} 
                />
                <Route 
                  path="/admin" 
                  element={<AdminDashboard user={user} />} 
                />
              </Routes>
            </main>
            
            <Footer />
          </div>

          {/* Onboarding Overlay */}
          {showOnboarding && (
            <OnboardingFlow
              user={user}
              onComplete={handleOnboardingComplete}
              onSignInRequested={handleOnboardingSignIn}
              onClose={handleCloseOnboarding}
            />
          )}
        </Router>
      </DropdownProvider>
    </DndProvider>
  )
}

export default App
