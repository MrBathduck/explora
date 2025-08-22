// 🔍 Enhanced Location Tag Validation System
// Quality control for cross-category tagging with detailed feedback

import { sampleLocations } from '../data/sampleLocations';
import { analyzeLocationTagging, validateLocationTags, getCategoriesForTags } from '../data/tagSystem';
import type { Location } from '../types/Location';

export const validateAllLocationTags = () => {
  console.log('🏷️ LOCATION TAG VALIDATION REPORT');
  console.log('==================================\n');

  const results = sampleLocations.map(location => 
    analyzeLocationTagging({
      name: location.name,
      category: location.category,
      tags: location.tags
    })
  );

  // Summary statistics
  const totalLocations = results.length;
  const locationsWithMinTags = results.filter(r => r.meets3PlusRule).length;
  const locationsWithErrors = results.filter(r => r.validation.errors.length > 0).length;
  const locationsWithWarnings = results.filter(r => r.validation.warnings.length > 0).length;

  console.log('📊 SUMMARY STATISTICS:');
  console.log(`Total locations: ${totalLocations}`);
  console.log(`✅ Meet 3+ tag rule: ${locationsWithMinTags}/${totalLocations}`);
  console.log(`❌ Have errors: ${locationsWithErrors}/${totalLocations}`);
  console.log(`⚠️  Have warnings: ${locationsWithWarnings}/${totalLocations}`);
  console.log('');

  // Detailed analysis for each location
  results.forEach((result, index) => {
    const status = result.meets3PlusRule ? '✅' : '❌';
    const errorCount = result.validation.errors.length;
    const warningCount = result.validation.warnings.length;
    
    console.log(`${status} ${result.name} (${result.category})`);
    console.log(`   Visible tags: ${result.stats.totalVisible}/3+ required`);
    console.log(`   Breakdown: ${result.stats.breakdown.primary}P + ${result.stats.breakdown.secondary}S + ${result.stats.breakdown.hidden}H + ${result.stats.breakdown.contextual}C`);
    
    if (errorCount > 0) {
      console.log(`   ❌ ERRORS (${errorCount}):`);
      result.validation.errors.forEach(error => console.log(`      • ${error}`));
    }
    
    if (warningCount > 0) {
      console.log(`   ⚠️  WARNINGS (${warningCount}):`);
      result.validation.warnings.forEach(warning => console.log(`      • ${warning}`));
    }
    
    console.log('');
  });

  return results;
};

// Cross-category quality control system
export interface LocationValidationResult {
  locationId: string;
  locationName: string;
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
  crossCategoryAnalysis: {
    categories: { [categoryName: string]: string[] };
    diversity: number; // 0-1 score for cross-category richness
    dominantCategory: string | null;
  };
  tagBreakdown: {
    primary: { count: number; categories: string[] };
    secondary: { count: number; coverage: string[] };
    hidden: { count: number; insights: string[] };
    contextual: { count: number; timing: string[] };
  };
  qualityScore: number; // 0-100 overall quality rating
}

export function validateLocationWithQualityControl(location: Location): LocationValidationResult {
  const validation = validateLocationTags(location.tags);
  const crossCategoryData = getCategoriesForTags(location.tags.primary);
  const categoryCount = Object.keys(crossCategoryData).length;
  
  // Calculate diversity score (cross-category richness)
  const diversityScore = Math.min(categoryCount / 3, 1); // Ideal: 3+ categories
  const dominantCategory = Object.entries(crossCategoryData)
    .reduce((max, [cat, tags]) => tags.length > (max.tags?.length || 0) ? { category: cat, tags } : max, 
            { category: null, tags: [] }).category;

  // Generate suggestions for improvement
  const suggestions: string[] = [];
  
  // Cross-category suggestions
  if (categoryCount === 1) {
    suggestions.push("Consider adding tags from other categories for richer description");
  }
  if (categoryCount >= 3) {
    suggestions.push("Excellent cross-category diversity! This will improve discoverability");
  }
  
  // Quality score calculation (0-100)
  let qualityScore = 0;
  qualityScore += validation.errors.length === 0 ? 40 : 0; // Basic validity
  qualityScore += Math.min(location.tags.primary.length * 8, 40); // Primary tag richness (3-5 tags = 24-40 points)
  qualityScore += Math.min(location.tags.secondary.length * 4, 20); // Secondary coverage
  qualityScore += diversityScore * 20; // Cross-category bonus
  qualityScore += location.tags.hidden.length > 0 ? 10 : 0; // Hidden tag bonus
  qualityScore += location.tags.contextual.length > 0 ? 10 : 0; // Contextual bonus
  
  return {
    locationId: location.id,
    locationName: location.name,
    isValid: validation.errors.length === 0,
    errors: validation.errors,
    warnings: validation.warnings,
    suggestions,
    crossCategoryAnalysis: {
      categories: crossCategoryData,
      diversity: diversityScore,
      dominantCategory
    },
    tagBreakdown: {
      primary: { 
        count: location.tags.primary.length, 
        categories: Object.keys(crossCategoryData) 
      },
      secondary: { 
        count: location.tags.secondary.length, 
        coverage: [] // Simplified for now
      },
      hidden: { 
        count: location.tags.hidden.length, 
        insights: location.tags.hidden 
      },
      contextual: { 
        count: location.tags.contextual.length, 
        timing: location.tags.contextual 
      }
    },
    qualityScore: Math.round(qualityScore)
  };
}

// Performance and scalability analysis
export function analyzePerformanceConcerns(locations: Location[]): {
  indexingConcerns: string[];
  queryConcerns: string[];
  scalabilityConcerns: string[];
  recommendations: string[];
} {
  const totalTags = locations.reduce((sum, loc) => 
    sum + loc.tags.primary.length + loc.tags.secondary.length + 
    loc.tags.hidden.length + loc.tags.contextual.length, 0);
  
  const averageTagsPerLocation = totalTags / locations.length;
  const uniquePrimaryTags = new Set(locations.flatMap(loc => loc.tags.primary)).size;
  const uniqueSecondaryTags = new Set(locations.flatMap(loc => loc.tags.secondary)).size;
  
  const concerns = {
    indexingConcerns: [] as string[],
    queryConcerns: [] as string[],
    scalabilityConcerns: [] as string[],
    recommendations: [] as string[]
  };
  
  // Firestore indexing concerns
  if (uniquePrimaryTags > 50) {
    concerns.indexingConcerns.push(`High primary tag variety (${uniquePrimaryTags}). Consider composite indexes.`);
  }
  
  if (averageTagsPerLocation > 15) {
    concerns.queryConcerns.push(`High average tags per location (${averageTagsPerLocation.toFixed(1)}). May impact query performance.`);
  }
  
  // Scalability concerns
  if (locations.length > 100) {
    concerns.scalabilityConcerns.push("Approaching scale where caching layer becomes critical");
  }
  
  // Recommendations
  concerns.recommendations.push("Implement Firestore composite indexes for common tag combinations");
  concerns.recommendations.push("Consider tag popularity scoring for search optimization");
  concerns.recommendations.push("Plan tag hierarchy caching for frequent queries");
  
  if (locations.length > 500) {
    concerns.recommendations.push("Implement pagination for tag-based queries");
    concerns.recommendations.push("Consider tag denormalization for performance");
  }
  
  return concerns;
}

// Export for use in development console
if (typeof window !== 'undefined') {
  (window as any).validateLocationTags = validateAllLocationTags;
  (window as any).validateLocationWithQualityControl = validateLocationWithQualityControl;
  (window as any).analyzePerformanceConcerns = () => analyzePerformanceConcerns(sampleLocations);
}