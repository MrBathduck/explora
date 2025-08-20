import { useState, useEffect } from 'react'
import LocationCard from './components/LocationCard'
import LocationModal from './components/LocationModal'
import Map from './components/Map'
import { sampleLocations } from './data/sampleLocations'
import { getCategoryIcon } from './utils/categoryIcons'
import type { Location } from './types/Location'
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
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [favorites, setFavorites] = useState<string[]>([])
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)

  // Load favorites from localStorage on component mount
  useEffect(() => {
    setFavorites(loadFavorites())
  }, [])

  // Toggle favorite function
  const toggleFavorite = (locationId: string) => {
    const newFavorites = favorites.includes(locationId)
      ? favorites.filter(id => id !== locationId)
      : [...favorites, locationId]
    
    setFavorites(newFavorites)
    saveFavorites(newFavorites)
  }

  // Get unique categories from our locations, including Favorites
  const categories = ['All', 'Favorites', ...new Set(sampleLocations.map(location => location.category))]

  // Helper function to normalize text (remove accents, convert to lowercase)
  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
  }

  // Filter locations based on search term and category
  const filteredLocations = sampleLocations.filter(location => {
    const normalizedSearchTerm = normalizeText(searchTerm.trim())
    
    if (normalizedSearchTerm === '') {
      return selectedCategory === 'All' || 
             location.category === selectedCategory ||
             (selectedCategory === 'Favorites' && favorites.includes(location.id))
    }
    
    const nameMatch = normalizeText(location.name).includes(normalizedSearchTerm)
    const descMatch = normalizeText(location.description).includes(normalizedSearchTerm)
    const catMatch = normalizeText(location.category).includes(normalizedSearchTerm)
    const addrMatch = location.address && normalizeText(location.address).includes(normalizedSearchTerm)
    
    const matchesSearch = nameMatch || descMatch || catMatch || addrMatch
    const matchesCategory = selectedCategory === 'All' || 
                           location.category === selectedCategory ||
                           (selectedCategory === 'Favorites' && favorites.includes(location.id))
    
    
    return matchesSearch && matchesCategory
  })

  return (
    <div className="app">
      <header className="app-header">
        <h1>🧭 Explora</h1>
        <p>Discover amazing places in Vienna</p>
        
        {/* Search Input */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search places..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Category Filter Buttons */}
        <div className="category-filters">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category)
                if (category === 'All') {
                  setSearchTerm('') // Clear search when "All" is clicked
                }
              }}
              className={`category-button ${selectedCategory === category ? 'active' : ''}`}
            >
              <span className="category-button-icon">{getCategoryIcon(category)}</span>
              <span className="category-button-text">{category}</span>
            </button>
          ))}
        </div>
      </header>
      
      <main className="main-content">
        <div className="content-container">
          <div className="locations-panel">
            <div className="locations-grid">
              {filteredLocations.length > 0 ? (
                filteredLocations.map(location => (
                  <LocationCard 
                    key={location.id} 
                    location={location}
                    isFavorite={favorites.includes(location.id)}
                    onToggleFavorite={toggleFavorite}
                    onClick={setSelectedLocation}
                  />
                ))
              ) : (
                <div className="no-results">
                  <p>No places found matching your criteria.</p>
                  <p>Try adjusting your search or category filter.</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="map-panel">
            <Map locations={filteredLocations} favorites={favorites} />
          </div>
        </div>
      </main>

      {/* Location Modal */}
      {selectedLocation && (
        <LocationModal
          location={selectedLocation}
          isOpen={selectedLocation !== null}
          onClose={() => setSelectedLocation(null)}
          isFavorite={favorites.includes(selectedLocation.id)}
          onToggleFavorite={toggleFavorite}
        />
      )}
    </div>
  )
}

export default App
