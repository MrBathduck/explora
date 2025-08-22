import './AboutPage.css'

const AboutPage = () => {
  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="about-hero-content">
          <h1>About Explora</h1>
          <p>Your smart city guide that learns your style while respecting your privacy</p>
        </div>
      </div>

      <div className="about-content">
        <section className="mission-section">
          <h2>🎯 Our Mission</h2>
          <p>
            Travel planning shouldn't be overwhelming. We built Explora to end decision fatigue 
            and help you discover amazing places that match your personal style. Whether you're 
            a tourist exploring Vienna or a local looking to rediscover your city, Explora 
            makes finding your next adventure simple and delightful.
          </p>
        </section>

        <section className="features-section">
          <h2>✨ What Makes Explora Special</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🗺️</div>
              <h3>Interactive Maps</h3>
              <p>Explore locations with our beautiful OpenStreetMap integration. See exactly where places are and plan your perfect route.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">❤️</div>
              <h3>Personal Favorites</h3>
              <p>Save places you love and sync them across all your devices. Your favorites are always with you, online or offline.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🔐</div>
              <h3>Privacy First</h3>
              <p>Your data belongs to you. We use privacy-first design and never track your location without permission.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🎨</div>
              <h3>Smart Categories</h3>
              <p>Find places by mood and style. Whether you want culture, adventure, or relaxation, we help you discover what fits.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Works Everywhere</h3>
              <p>Responsive design that works perfectly on your phone, tablet, or computer. Take Explora with you anywhere.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Lightning Fast</h3>
              <p>Built for speed with modern technology. No waiting, no frustration - just smooth exploration.</p>
            </div>
          </div>
        </section>

        <section className="story-section">
          <h2>📖 The Story Behind Explora</h2>
          <p>
            Explora was born from a simple frustration: spending hours planning a trip to Porto, 
            only to end up with 47 bookmarked places and no clear plan. We realized that having 
            too many options can be just as paralyzing as having too few.
          </p>
          <p>
            What if travel planning could feel like having a knowledgeable local friend who knows 
            your taste, has infinite patience, and can adapt plans in real-time? That's the vision 
            driving Explora - making travel discovery delightful instead of overwhelming.
          </p>
        </section>

        <section className="tech-section">
          <h2>🛠️ Built With Care</h2>
          <p>
            Explora is built with modern, reliable technology that prioritizes your experience:
          </p>
          <div className="tech-stack">
            <div className="tech-item">
              <strong>React & TypeScript</strong> - For a fast, reliable user interface
            </div>
            <div className="tech-item">
              <strong>OpenStreetMap</strong> - Community-driven maps with no API limits
            </div>
            <div className="tech-item">
              <strong>Firebase</strong> - Secure cloud storage for your personal data
            </div>
            <div className="tech-item">
              <strong>Progressive Web App</strong> - Works offline and installs like a native app
            </div>
          </div>
        </section>

        <section className="values-section">
          <h2>💝 Our Values</h2>
          <div className="values-grid">
            <div className="value-item">
              <h4>🌟 Quality over Quantity</h4>
              <p>Better to have 50 perfect recommendations than 500 mediocre ones.</p>
            </div>
            <div className="value-item">
              <h4>🎯 Context Awareness</h4>
              <p>Plans should adapt to weather, mood, time, and energy levels.</p>
            </div>
            <div className="value-item">
              <h4>👥 Dual Perspectives</h4>
              <p>Local insights combined with traveler experiences for the complete picture.</p>
            </div>
            <div className="value-item">
              <h4>🔒 Privacy Respect</h4>
              <p>Your personal data and location information belong to you, period.</p>
            </div>
          </div>
        </section>

        <section className="contact-section">
          <h2>💌 Get in Touch</h2>
          <p>
            Explora is currently in active development. We'd love to hear your feedback, 
            suggestions, or just chat about travel and technology.
          </p>
          <div className="contact-info">
            <p>✉️ <strong>Email:</strong> hello@explora-app.com</p>
            <p>🐙 <strong>GitHub:</strong> github.com/explora-travel</p>
            <p>🗺️ <strong>Currently Available:</strong> Vienna, Austria</p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default AboutPage