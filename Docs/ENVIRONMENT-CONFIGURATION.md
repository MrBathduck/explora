# 🔧 Environment Configuration Guide

> **Purpose:** Manage different environments (development, staging, production) with proper configuration  
> **Status:** ✅ Complete - Professional environment management system implemented  
> **Date:** January 2025

---

## 📋 Overview

Your Explora project now has a **professional environment configuration system** that:
- ✅ Manages different environments (dev, staging, production)
- ✅ Validates required environment variables
- ✅ Provides type-safe configuration access
- ✅ Supports feature flags and environment-specific settings
- ✅ Includes comprehensive documentation and examples

---

## 📁 Environment Files Structure

### **Core Files Created**
```
├── .env                    # Your current working environment (gitignored)
├── .env.example           # Template for new developers
├── .env.development       # Development-specific settings
├── .env.production        # Production-specific settings
└── src/config/
    ├── environment.ts     # Configuration management system
    └── firebase.ts        # Updated to use new config system
```

### **Environment File Hierarchy**
1. **`.env`** - Your active environment (already exists)
2. **`.env.development`** - Development defaults and overrides
3. **`.env.production`** - Production settings for deployment
4. **`.env.example`** - Template for new team members

---

## 🔧 How to Use

### **For Development (Current Setup)**
Your existing `.env` file continues to work as-is. The new system is backward compatible.

### **For Production Deployment**
1. **Copy production template:**
   ```bash
   cp .env.production .env
   ```
2. **Update with your production Firebase project:**
   - Get values from Firebase Console → Project Settings
   - Replace placeholder values with real production keys
3. **Deploy with production settings**

### **For New Team Members**
1. **Copy example template:**
   ```bash
   cp .env.example .env
   ```
2. **Fill in their own Firebase project details**
3. **Start development immediately**

---

## ⚙️ Configuration Management

### **Accessing Configuration in Code**
```typescript
import { config } from '../config/environment';

// Environment info
console.log('Environment:', config.environment);
console.log('Is Development:', config.isDevelopment);

// Firebase settings (automatically configured)
console.log('Firebase Project:', config.firebase.projectId);

// Feature flags
if (config.features.maps) {
  // Enable map functionality
}

// Data limits
const maxFavorites = config.limits.maxFavorites; // 1000

// External services
const apiUrl = config.services.apiBaseUrl;
```

### **Built-in Validation**
```typescript
import { validateConfig } from '../config/environment';

const validation = validateConfig();
if (!validation.isValid) {
  console.error('Missing:', validation.missingVars);
}
```

---

## 🚀 Environment-Specific Features

### **Development Environment**
```bash
VITE_APP_ENV=development
VITE_DEV_MODE=true
VITE_DEBUG_MODE=true
VITE_ENABLE_CONSOLE_LOGS=true
VITE_SHOW_DEV_TOOLS=true
```

**Features Enabled:**
- ✅ Console logging and debugging
- ✅ Development tools and helpers
- ✅ Relaxed data limits
- ✅ Mock data support (if needed)

### **Production Environment**
```bash
VITE_APP_ENV=production
VITE_DEV_MODE=false
VITE_DEBUG_MODE=false
VITE_ENABLE_CONSOLE_LOGS=false
VITE_SHOW_DEV_TOOLS=false
```

**Features Enabled:**
- ✅ Optimized performance
- ✅ Analytics and monitoring
- ✅ Production data limits
- ✅ Error tracking (Sentry)

---

## 🎛️ Available Configuration Options

### **Environment Variables**

#### **Required (Firebase)**
```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

#### **Application Settings**
```bash
VITE_APP_ENV=development                    # Environment name
VITE_APP_NAME=Explora                      # App display name
VITE_APP_DESCRIPTION="Your smart city guide" # App description
VITE_BASE_URL=https://your-domain.com      # Production URL
```

#### **Feature Flags**
```bash
VITE_ENABLE_MAPS=true                      # Enable map functionality
VITE_ENABLE_TRIPS=true                     # Enable trip planning
VITE_ENABLE_SOCIAL_LOGIN=true              # Enable Google login
VITE_DEV_MODE=true                         # Development features
```

#### **Data Limits**
```bash
VITE_MAX_FAVORITES=1000                    # Maximum favorites per user
VITE_MAX_TRIP_DAYS=30                      # Maximum days per trip
```

#### **External Services**
```bash
VITE_API_BASE_URL=http://localhost:3000    # API endpoint
VITE_GOOGLE_MAPS_API_KEY=your_key          # Google Maps (optional)
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX        # Google Analytics
VITE_SENTRY_DSN=your_sentry_dsn           # Error tracking
```

---

## 🔒 Security Best Practices

### **Environment Variable Security**
- ✅ **Never commit `.env` files** (already in .gitignore)
- ✅ **Use `.env.example` for templates** (safe to commit)
- ✅ **Validate required variables** (automatic validation included)
- ✅ **Different Firebase projects** for dev/staging/production

### **API Key Management**
```bash
# Development - Use development Firebase project
VITE_FIREBASE_PROJECT_ID=explora-travel-dev

# Production - Use production Firebase project  
VITE_FIREBASE_PROJECT_ID=explora-travel-prod
```

### **Sensitive Data Handling**
- 🔒 Firebase API keys are public (safe for client-side)
- 🔒 Server-side secrets never go in VITE_ variables
- 🔒 Use Firebase security rules for data protection
- 🔒 Production secrets managed via deployment platform

---

## 🚀 Deployment Configurations

### **Development Deployment**
```bash
# Use development environment
cp .env.development .env
npm run build
npm run preview
```

### **Staging Deployment**
```bash
# Create staging environment file
cp .env.production .env.staging
# Update with staging Firebase project
# Deploy to staging environment
```

### **Production Deployment**
```bash
# Use production environment
cp .env.production .env
# Update with production Firebase project
npm run build
# Deploy to production (Netlify, Vercel, etc.)
```

---

## 🧪 Testing Environment Configuration

### **Validate Configuration**
```bash
# Check if all required variables are set
npm run dev
# Look for "🔧 App Configuration" in console
```

### **Test Different Environments**
```bash
# Test development config
cp .env.development .env && npm run dev

# Test production config (locally)
cp .env.production .env && npm run build && npm run preview
```

### **Debug Configuration Issues**
```typescript
// In browser console (development only):
console.log(window.__APP_CONFIG__); // If exposed
```

---

## 📋 Migration from Current Setup

### **Your Current Setup** ✅
- Your existing `.env` file continues to work unchanged
- No breaking changes to your current development workflow
- Firebase connection remains exactly the same

### **New Capabilities Added** 🚀
- Type-safe configuration access throughout the app
- Automatic validation of required environment variables
- Support for multiple environments (dev, staging, production)
- Feature flags for enabling/disabling functionality
- Professional deployment configuration management

### **Optional Upgrades**
1. **Update imports** to use new config system:
   ```typescript
   // Before:
   import.meta.env.VITE_FIREBASE_API_KEY
   
   // After (optional):
   import { config } from '../config/environment';
   config.firebase.apiKey
   ```

2. **Use feature flags** for conditional functionality:
   ```typescript
   if (config.features.maps) {
     // Render map component
   }
   ```

---

## 🎯 Benefits Achieved

### **Developer Experience**
- ✅ **Type Safety:** Configuration is fully typed
- ✅ **Validation:** Missing variables caught at startup
- ✅ **Documentation:** All options clearly documented
- ✅ **Templates:** Easy onboarding for new developers

### **Deployment Readiness**
- ✅ **Multi-Environment:** Support dev, staging, production
- ✅ **Feature Flags:** Enable/disable features per environment
- ✅ **Security:** Proper separation of environment secrets
- ✅ **Professional:** Industry-standard configuration management

### **Maintenance**
- ✅ **Centralized:** All configuration in one place
- ✅ **Validated:** Automatic checks for required settings
- ✅ **Documented:** Clear examples and usage guides
- ✅ **Flexible:** Easy to add new configuration options

---

*Your Explora project now has enterprise-grade environment configuration management! 🚀*