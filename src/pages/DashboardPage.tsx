import type { User } from 'firebase/auth'
import LocationCard from '../components/location/LocationCard'
import { sampleLocations } from '../data/sampleLocations'
import './DashboardPage.css'

interface DashboardPageProps {
  user: User | null
  favorites: string[]
  onToggleFavorite: (locationId: string) => void
}

const DashboardPage: React.FC<DashboardPageProps> = ({ user, favorites, onToggleFavorite }) => {
  const favoriteLocations = sampleLocations.filter(location => 
    favorites.includes(location.id)
  )

  const categoryStats = favorites.reduce((stats, favoriteId) => {
    const location = sampleLocations.find(loc => loc.id === favoriteId)
    if (location) {
      stats[location.category] = (stats[location.category] || 0) + 1
    }
    return stats
  }, {} as Record<string, number>)

  const topCategory = Object.entries(categoryStats)
    .sort(([,a], [,b]) => b - a)[0]?.[0]

  if (!user) {
    return (
      <div className="dashboard-page">
        <div className="auth-prompt">
          <h2>🔐 Sign In Required</h2>
          <p>Sign in with Google to access your personal dashboard and save your favorite places.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="user-welcome">
          <img 
            src={user.photoURL || '/default-avatar.png'} 
            alt={user.displayName || 'User'} 
            className="dashboard-avatar"
          />
          <div>
            <h1>Welcome back, {user.displayName?.split(' ')[0]}!</h1>
            <p>Your personal travel dashboard</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{favorites.length}</div>
            <div className="stat-label">Favorite Places</div>
            <div className="stat-icon">❤️</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-number">{Object.keys(categoryStats).length}</div>
            <div className="stat-label">Categories Explored</div>
            <div className="stat-icon">🗂️</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-number">{topCategory || 'None'}</div>
            <div className="stat-label">Top Category</div>
            <div className="stat-icon">🏆</div>
          </div>
        </div>

        {/* Favorites Section */}
        <div className="favorites-section">
          <h2>Your Favorite Places</h2>
          
          {favoriteLocations.length > 0 ? (
            <div className="favorites-grid">
              {favoriteLocations.map(location => (
                <LocationCard
                  key={location.id}
                  location={location}
                  isFavorite={true}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </div>
          ) : (
            <div className="empty-favorites">
              <div className="empty-icon">📍</div>
              <h3>No favorites yet</h3>
              <p>Start exploring and save your favorite places to see them here!</p>
              <a href="/" className="explore-btn">🧭 Start Exploring</a>
            </div>
          )}
        </div>

        {/* Category Breakdown */}
        {Object.keys(categoryStats).length > 0 && (
          <div className="category-breakdown">
            <h2>Your Travel Interests</h2>
            <div className="category-stats">
              {Object.entries(categoryStats).map(([category, count]) => (
                <div key={category} className="category-stat">
                  <span className="category-name">{category}</span>
                  <span className="category-count">{count} places</span>
                  <div className="category-bar">
                    <div 
                      className="category-progress" 
                      style={{
                        width: `${(count / favorites.length) * 100}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardPage