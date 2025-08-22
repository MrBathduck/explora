/**
 * Database Setup Utility for Explora
 * Run this to initialize the enhanced Firebase schema
 */

import DataMigrationService from '../services/dataMigration';
import { addLocation, getAllLocations } from '../services/adminLocationService';
import { sampleLocations } from '../data/sampleLocations';

/**
 * Setup and initialize the Explora database
 * This creates all necessary collections and seeds initial data
 */
export async function setupDatabase(): Promise<void> {
  console.log('🚀 Setting up Explora database...');
  
  try {
    // Step 1: Migrate existing data and seed categories/tags
    console.log('📊 Step 1: Migrating data and seeding categories...');
    await DataMigrationService.migrateExistingLocations();
    
    // Step 2: Validate migration
    console.log('✅ Step 2: Validating migration...');
    const validation = await DataMigrationService.validateMigration();
    
    if (!validation.success) {
      console.error('❌ Migration validation failed:');
      validation.errors.forEach(error => console.error(`  - ${error}`));
      throw new Error('Migration validation failed');
    }
    
    console.log('🎉 Database setup completed successfully!');
    console.log('');
    console.log('📋 What was created:');
    console.log('  ✅ Enhanced location collection with 3-level categorization');
    console.log('  ✅ Category hierarchy (Level 1, 2, 3)');
    console.log('  ✅ Tag system (system, mood, user tags)');
    console.log('  ✅ Vienna seed data with enhanced tagging');
    console.log('');
    console.log('🔧 Next steps:');
    console.log('  1. Update your components to use the new LocationDatabaseService');
    console.log('  2. Implement advanced filtering with categories and tags');
    console.log('  3. Add location search functionality');
    console.log('  4. Consider implementing user preference matching');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    throw error;
  }
}

/**
 * Reset database (for development/testing)
 * WARNING: This will delete all location data
 */
export async function resetDatabase(): Promise<void> {
  console.warn('⚠️  RESET DATABASE - This will delete all data!');
  console.log('This is not implemented for safety. Manually delete collections if needed.');
  // Intentionally not implemented for safety
}

// If running directly (for CLI usage)
if (typeof window === 'undefined' && require.main === module) {
  setupDatabase()
    .then(() => {
      console.log('✅ Database setup complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Setup failed:', error);
      process.exit(1);
    });
}

/**
 * Simple database initialization with sample data
 * Adds Vienna sample locations if database is empty
 */
export async function initializeDatabaseWithSampleData(): Promise<void> {
  try {
    console.log('🔧 Checking database initialization...');
    
    // Check if database already has locations
    const existingLocations = await getAllLocations();
    
    if (existingLocations.length > 0) {
      console.log(`✅ Database already has ${existingLocations.length} locations`);
      return;
    }
    
    console.log('📍 Database is empty, adding sample Vienna locations...');
    
    // Add each sample location to Firebase
    let addedCount = 0;
    for (const location of sampleLocations) {
      try {
        const { id, ...locationData } = location; // Remove id since Firebase generates it
        await addLocation(locationData, 'system-init');
        addedCount++;
        console.log(`✅ Added: ${location.name}`);
      } catch (error) {
        console.error(`❌ Failed to add ${location.name}:`, error);
      }
    }
    
    console.log(`🎉 Database initialization complete! Added ${addedCount}/${sampleLocations.length} locations`);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}

export default setupDatabase;