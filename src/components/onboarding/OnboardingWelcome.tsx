import React from 'react'
import './OnboardingWelcome.css'

interface OnboardingWelcomeProps {
  onContinue: () => void
}

const OnboardingWelcome: React.FC<OnboardingWelcomeProps> = ({ onContinue }) => {
  return (
    <div className="onboarding-welcome">
      <div className="welcome-content">
        <div className="welcome-hero">
          <div className="welcome-logo">🧭</div>
          <h1 className="welcome-title">Welcome to Explora!</h1>
          <p className="welcome-subtitle">Let's find places you'll love to explore</p>
        </div>

        <div className="welcome-benefits">
          <div className="benefit-item">
            <div className="benefit-icon">🎯</div>
            <div className="benefit-text">
              <h3>Personalized</h3>
              <p>Discover places that match your travel style and mood</p>
            </div>
          </div>
          
          <div className="benefit-item">
            <div className="benefit-icon">🔒</div>
            <div className="benefit-text">
              <h3>Privacy-first</h3>
              <p>Your preferences stay private and under your control</p>
            </div>
          </div>
          
          <div className="benefit-item">
            <div className="benefit-icon">⚡</div>
            <div className="benefit-text">
              <h3>Adaptive</h3>
              <p>Smart suggestions that learn and adapt to your needs</p>
            </div>
          </div>
        </div>

        <div className="welcome-preview">
          <p className="preview-text">
            In just 2 minutes, we'll help you discover amazing places that fit your style. 
            Ready to get started?
          </p>
        </div>

        <div className="welcome-actions">
          <button 
            className="continue-button"
            onClick={onContinue}
          >
            Let's Begin 🚀
          </button>
          
          <p className="skip-note">
            You can always change your preferences later in settings
          </p>
        </div>
      </div>

      <div className="welcome-background">
        <div className="floating-icon">🏛️</div>
        <div className="floating-icon">🎨</div>
        <div className="floating-icon">🌳</div>
        <div className="floating-icon">🌅</div>
        <div className="floating-icon">🏙️</div>
      </div>
    </div>
  )
}

export default OnboardingWelcome