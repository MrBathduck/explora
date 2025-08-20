import { useState } from 'react'
import LocationCard from './components/LocationCard'
import { sampleLocations } from './data/sampleLocations'
import './App.css'

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  // Get unique categories from our locations
  const categories = ['All', ...new Set(sampleLocations.map(location => location.category))]

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
      return selectedCategory === 'All' || location.category === selectedCategory
    }
    
    const nameMatch = normalizeText(location.name).includes(normalizedSearchTerm)
    const descMatch = normalizeText(location.description).includes(normalizedSearchTerm)
    const catMatch = normalizeText(location.category).includes(normalizedSearchTerm)
    const addrMatch = location.address && normalizeText(location.address).includes(normalizedSearchTerm)
    
    const matchesSearch = nameMatch || descMatch || catMatch || addrMatch
    const matchesCategory = selectedCategory === 'All' || location.category === selectedCategory
    
    
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
              {category}
            </button>
          ))}
        </div>
      </header>
      
      <main className="locations-grid">
        {filteredLocations.length > 0 ? (
          filteredLocations.map(location => (
            <LocationCard 
              key={location.id} 
              location={location} 
            />
          ))
        ) : (
          <div className="no-results">
            <p>No places found matching your criteria.</p>
            <p>Try adjusting your search or category filter.</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
