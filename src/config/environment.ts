// 🔧 Environment Configuration Management
// Centralized configuration with single .env file

export interface AppConfig {
  // Environment Info (simplified)
  isDevelopment: boolean;
  
  // App Settings
  appName: string;
  appDescription: string;
  baseUrl: string;
  
  // Firebase Configuration
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
  
  // Feature Flags
  features: {
    maps: boolean;
    trips: boolean;
    socialLogin: boolean;
    mockData: boolean;
    consoleLogs: boolean;
    devTools: boolean;
  };
  
  // Data Limits
  limits: {
    maxFavorites: number;
    maxTripDays: number;
  };
  
  // External Services
  services: {
    apiBaseUrl: string;
    googleMapsApiKey?: string;
    analyticsId?: string;
    sentryDsn?: string;
    cdnUrl?: string;
  };
}

// Helper function to get environment variable with fallback
function getEnvVar(key: string, fallback: string = ''): string {
  return import.meta.env[key] || fallback;
}

// Helper function to get boolean environment variable
function getEnvBool(key: string, fallback: boolean = false): boolean {
  const value = import.meta.env[key];
  if (value === undefined) return fallback;
  return value === 'true';
}

// Helper function to get number environment variable
function getEnvNumber(key: string, fallback: number = 0): number {
  const value = import.meta.env[key];
  if (value === undefined) return fallback;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? fallback : parsed;
}

// Create configuration based on environment variables
export const config: AppConfig = {
  // Environment Info (simplified)
  isDevelopment: getEnvVar('VITE_APP_ENV', 'development') === 'development',
  
  // App Settings
  appName: getEnvVar('VITE_APP_NAME', 'Explora'),
  appDescription: getEnvVar('VITE_APP_DESCRIPTION', 'Your smart city guide'),
  baseUrl: getEnvVar('VITE_BASE_URL', window.location.origin),
  
  // Firebase Configuration
  firebase: {
    apiKey: getEnvVar('VITE_FIREBASE_API_KEY'),
    authDomain: getEnvVar('VITE_FIREBASE_AUTH_DOMAIN'),
    projectId: getEnvVar('VITE_FIREBASE_PROJECT_ID'),
    storageBucket: getEnvVar('VITE_FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID'),
    appId: getEnvVar('VITE_FIREBASE_APP_ID'),
  },
  
  // Feature Flags
  features: {
    maps: getEnvBool('VITE_ENABLE_MAPS', true),
    trips: getEnvBool('VITE_ENABLE_TRIPS', true),
    socialLogin: getEnvBool('VITE_ENABLE_SOCIAL_LOGIN', true),
    mockData: getEnvBool('VITE_ENABLE_MOCK_DATA', false),
    consoleLogs: getEnvBool('VITE_ENABLE_CONSOLE_LOGS', true),
    devTools: getEnvBool('VITE_SHOW_DEV_TOOLS', false),
  },
  
  // Data Limits
  limits: {
    maxFavorites: getEnvNumber('VITE_MAX_FAVORITES', 1000),
    maxTripDays: getEnvNumber('VITE_MAX_TRIP_DAYS', 30),
  },
  
  // External Services
  services: {
    apiBaseUrl: getEnvVar('VITE_API_BASE_URL', 'http://localhost:3000'),
    googleMapsApiKey: getEnvVar('VITE_GOOGLE_MAPS_API_KEY'),
    analyticsId: getEnvVar('VITE_GA_MEASUREMENT_ID'),
    sentryDsn: getEnvVar('VITE_SENTRY_DSN'),
    cdnUrl: getEnvVar('VITE_CDN_URL'),
  },
};

// Validation function to check if required environment variables are set
export function validateConfig(): { isValid: boolean; missingVars: string[] } {
  const requiredVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID',
  ];
  
  const missingVars = requiredVars.filter(varName => !getEnvVar(varName));
  
  return {
    isValid: missingVars.length === 0,
    missingVars,
  };
}

// Development helper to log configuration (only in development)
export function logConfig(): void {
  if (config.isDevelopment && config.features.consoleLogs) {
    console.group('🔧 App Configuration');
    console.log('Firebase Project:', config.firebase.projectId);
    console.log('Features:', config.features);
    console.log('Limits:', config.limits);
    console.groupEnd();
  }
}

// Export default configuration
export default config;