import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { config, validateConfig, logConfig } from './environment';

// Validate configuration
const validation = validateConfig();
if (!validation.isValid) {
  console.error('❌ Missing required environment variables:', validation.missingVars);
  throw new Error(`Missing required environment variables: ${validation.missingVars.join(', ')}`);
}

// Log configuration in development
logConfig();

const firebaseConfig = config.firebase;

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;