import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { User } from 'firebase/auth'
import LocationCard from '../components/location/LocationCard'
import LocationModal from '../components/location/LocationModal'
import LocationSuggestions from '../components/location/LocationSuggestions'
import { sampleLocations } from '../data/sampleLocations'
import { getAllPrimaryCategories } from '../data/tagSystem'
import { getCategoryIcon } from '../utils/categoryIcons'
import { getTripNamesForLocation } from '../utils/tripLocationUtils'
import type { Location } from '../types/Location'
import type { UserProfile } from '../types/UserProfile'
import './HomePage.css'

interface HomePageProps {
  user: User | null
  favorites: string[]
  onToggleFavorite: (locationId: string) => void
  userProfile?: UserProfile | null
  onUpdateProfile?: (updates: Partial<UserProfile>) => void
}

const HomePage: React.FC<HomePageProps> = ({ user, favorites, onToggleFavorite, userProfile, onUpdateProfile }) => {
  const [searchParams] = useSearchParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [locationTripData, setLocationTripData] = useState(new Map<string, {isInTrip: boolean, tripNames: string[]}>())

  
  // Get trip and day info from URL parameters
  const targetTripId = searchParams.get('tripId')
  const targetDayDate = searchParams.get('dayDate')

  // Get primary categories from tag system, including special categories
  const categories = ['All', 'Favorites', ...getAllPrimaryCategories()]

  // Load trip data for visible locations
  useEffect(() => {
    if (user) {
      loadTripDataForLocations()
    }
  }, [user])

  const loadTripDataForLocations = async () => {
    if (!user) return

    const newTripDataMap = new Map<string, {isInTrip: boolean, tripNames: string[]}>()
    
    // Load trip data for all locations (or just visible ones for performance)
    for (const location of sampleLocations.slice(0, 20)) { // Limit to first 20 for performance
      try {
        const tripNames = await getTripNamesForLocation(user, location.id)
        newTripDataMap.set(location.id, {
          isInTrip: tripNames.length > 0,
          tripNames: tripNames
        })
      } catch (error) {
        console.error('Error loading trip data for location:', location.id, error)
      }
    }
    
    setLocationTripData(newTripDataMap)
  }

  // Helper function to normalize text (remove accents, convert to lowercase)
  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
  }

  // Calculate personalization scores and filter locations
  const calculateLocationScore = (location: Location) => {
    let score = 0
    
    // Base score for all locations
    score += 1
    
    // Tag-based personalization scoring
    if (userProfile?.travelStyle.preferredTags && userProfile.travelStyle.preferredTags.length > 0) {
      const userTags = userProfile.travelStyle.preferredTags
      
      // Primary tag matches (higher weight)
      const primaryMatches = location.tags.primary.filter(tag => userTags.includes(tag)).length
      score += primaryMatches * 3
      
      // Secondary tag matches (medium weight)  
      const secondaryMatches = location.tags.secondary.filter(tag => userTags.includes(tag)).length
      score += secondaryMatches * 2
      
      // Bonus for multiple tag matches (shows strong alignment)
      const totalMatches = primaryMatches + secondaryMatches
      if (totalMatches >= 3) score += 2
      else if (totalMatches >= 2) score += 1
    }
    
    // Favorite locations get a boost
    if (favorites.includes(location.id)) {
      score += 5
    }
    
    return score
  }

  // Filter and sort locations based on search term, category, and user preferences
  const filteredLocations = sampleLocations
    .filter(location => {
      const normalizedSearchTerm = normalizeText(searchTerm.trim())
      
      // Category filter
      const matchesCategory = selectedCategory === 'All' || 
                             location.tags.primary.includes(selectedCategory) ||
                             (selectedCategory === 'Favorites' && favorites.includes(location.id))
      
      // User accessibility preferences filter
      let matchesAccessibility = true
      if (userProfile?.accessibility) {
        const { wheelchairNeeded, avoidStairs } = userProfile.accessibility
        
        if (wheelchairNeeded && !location.tags.secondary.includes('Wheelchair Accessible')) {
          matchesAccessibility = false
        }
        
        if (avoidStairs && location.tags.secondary.includes('Lots of Stairs')) {
          matchesAccessibility = false
        }
      }
      
      // Search filter
      if (normalizedSearchTerm === '') {
        return matchesCategory && matchesAccessibility
      }
      
      const nameMatch = normalizeText(location.name).includes(normalizedSearchTerm)
      const descMatch = normalizeText(location.description).includes(normalizedSearchTerm)
      const catMatch = normalizeText(location.category).includes(normalizedSearchTerm) // Legacy support
      const tagMatch = location.tags.primary.some(tag => normalizeText(tag).includes(normalizedSearchTerm)) ||
                      location.tags.secondary.some(tag => normalizeText(tag).includes(normalizedSearchTerm))
      const addrMatch = location.address && normalizeText(location.address).includes(normalizedSearchTerm)
      
      const matchesSearch = nameMatch || descMatch || catMatch || tagMatch || addrMatch
      
      return matchesSearch && matchesCategory && matchesAccessibility
    })
    .sort((a, b) => {
      // Sort by personalization score (highest first)
      const scoreA = calculateLocationScore(a)
      const scoreB = calculateLocationScore(b)
      
      if (scoreA !== scoreB) {
        return scoreB - scoreA
      }
      
      // If scores are equal, sort alphabetically by name
      return a.name.localeCompare(b.name)
    })

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="explora-header">
        <h1>🧭 Discover Amazing Places</h1>
        <p>Explore Vienna's hidden gems and popular destinations</p>
        
        {/* Search Input */}
        <div className="explora-search-container">
          <input
            type="text"
            placeholder="Search places..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="explora-search-input"
          />
        </div>

        {/* Category Filter Buttons */}
        <div className="explora-mood-tags">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category)
                if (category === 'All') {
                  setSearchTerm('') // Clear search when "All" is clicked
                }
              }}
              className={`explora-mood-tag ${selectedCategory === category ? 'active' : ''}`}
            >
              <span className="category-button-icon">{getCategoryIcon(category)}</span>
              <span className="category-button-text">{category}</span>
            </button>
          ))}
        </div>

      </section>

      {/* Location-Based Suggestions (GDPR Compliant) */}
      {userProfile && (
        <LocationSuggestions
          userProfile={userProfile}
          allLocations={sampleLocations}
          onLocationSelect={setSelectedLocation}
          onUpdateProfile={onUpdateProfile}
        />
      )}
      
      {/* Main Content */}
      <div className="explora-content-container">
        <div className="locations-grid">
          {filteredLocations.length > 0 ? (
            filteredLocations.map(location => (
              <LocationCard 
                key={location.id} 
                location={location}
                isFavorite={favorites.includes(location.id)}
                onToggleFavorite={onToggleFavorite}
                onClick={setSelectedLocation}
                user={user}
                isInTrip={locationTripData.get(location.id)?.isInTrip || false}
                tripNames={locationTripData.get(location.id)?.tripNames || []}
                onTripChanged={loadTripDataForLocations}
                targetTripId={targetTripId}
                targetDayDate={targetDayDate}
                userPreferredTags={userProfile?.travelStyle.preferredTags || []}
              />
            ))
          ) : (
            <div className="no-results">
              <p>No places found matching your criteria.</p>
              <p>Try adjusting your search or category filter.</p>
            </div>
          )}
        </div>
        
        {/* Load More Section */}
        <div className="load-more-section">
          <button className="load-more-btn">
            Load More Places
          </button>
          <div className="pagination-info">
            Showing {filteredLocations.length} of {sampleLocations.length} places
          </div>
        </div>
      </div>

      {/* Location Modal */}
      {selectedLocation && (
        <LocationModal
          location={selectedLocation}
          isOpen={selectedLocation !== null}
          onClose={() => setSelectedLocation(null)}
          isFavorite={favorites.includes(selectedLocation.id)}
          onToggleFavorite={onToggleFavorite}
          user={user}
          onLocationRemoved={() => {
            // Refresh trip data when location is removed
            loadTripDataForLocations()
          }}
        />
      )}
    </div>
  )
}

export default HomePage