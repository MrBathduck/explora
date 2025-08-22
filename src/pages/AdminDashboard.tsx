// 🛠️ Firebase Admin Dashboard for Location Management
// Backend portal for adding and managing locations with quality control

import React, { useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { 
  getAllLocations, 
  analyzeLocationQuality, 
  addLocation, 
  updateLocation, 
  deleteLocation, 
  verifyLocation,
  type DatabaseLocation 
} from '../services/adminLocationService';
import { validateLocationWithQualityControl, type LocationValidationResult, analyzePerformanceConcerns } from '../utils/validateLocationTags';
import { getAllPrimaryTags, getAllSecondaryTags, HIDDEN_TAGS, CONTEXTUAL_TAGS } from '../data/tagSystem';
import { initializeDatabaseWithSampleData } from '../utils/setupDatabase';
import type { Location } from '../types/Location';

interface AdminStats {
  totalLocations: number;
  validLocations: number;
  averageQuality: number;
  crossCategoryLocations: number;
}

interface AdminDashboardProps {
  user: User | null;
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const [locations, setLocations] = useState<DatabaseLocation[]>([]);
  const [validationResults, setValidationResults] = useState<LocationValidationResult[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<DatabaseLocation | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadLocations();
  }, []);

  useEffect(() => {
    if (locations.length > 0) {
      analyzeAllLocations();
    }
  }, [locations]);

  const loadLocations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const firebaseLocations = await getAllLocations();
      setLocations(firebaseLocations);
    } catch (err) {
      console.error('Error loading locations:', err);
      setError('Failed to load locations from Firebase');
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeAllLocations = () => {
    const results = locations.map(location => validateLocationWithQualityControl(location));
    setValidationResults(results);

    const validCount = results.filter(r => r.isValid).length;
    const averageQuality = results.reduce((sum, r) => sum + r.qualityScore, 0) / results.length;
    const crossCategoryCount = results.filter(r => r.crossCategoryAnalysis.diversity > 0.33).length;

    setStats({
      totalLocations: locations.length,
      validLocations: validCount,
      averageQuality: Math.round(averageQuality || 0),
      crossCategoryLocations: crossCategoryCount
    });
  };

  const getQualityColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const performanceAnalysis = locations.length > 0 ? analyzePerformanceConcerns(locations) : null;

  // Check if user has admin access (basic check - enhance with proper role-based auth)
  if (!user) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--explora-background-secondary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{
            fontSize: 'var(--explora-font-size-3xl)',
            fontWeight: 'var(--explora-font-weight-bold)',
            color: 'var(--explora-text-primary)',
            marginBottom: 'var(--explora-space-4)'
          }}>Admin Access Required</h1>
          <p style={{
            color: 'var(--explora-text-secondary)',
            fontSize: 'var(--explora-font-size-lg)'
          }}>Please sign in to access the admin dashboard.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--explora-background-secondary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '2px solid var(--explora-primary-teal)',
            borderBottom: '2px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto var(--explora-space-4) auto'
          }}></div>
          <p style={{
            color: 'var(--explora-text-secondary)',
            fontSize: 'var(--explora-font-size-lg)'
          }}>Loading locations from Firebase...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--explora-background-secondary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{
            fontSize: 'var(--explora-font-size-3xl)',
            fontWeight: 'var(--explora-font-weight-bold)',
            color: 'var(--explora-error-red)',
            marginBottom: 'var(--explora-space-4)'
          }}>Error Loading Data</h1>
          <p style={{
            color: 'var(--explora-text-secondary)',
            fontSize: 'var(--explora-font-size-lg)',
            marginBottom: 'var(--explora-space-4)'
          }}>{error}</p>
          <button 
            onClick={loadLocations}
            className="btn-base"
            style={{
              backgroundColor: 'var(--explora-button-secondary)',
              color: 'var(--explora-white)'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = 'var(--explora-button-secondary-hover)'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'var(--explora-button-secondary)'}
          >
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--explora-background-secondary)' }}>
      <div className="max-w-7xl mx-auto" style={{ padding: 'var(--explora-spacing-page-padding)' }}>
        {/* Header */}
        <div className="explora-header" style={{ 
          borderRadius: 'var(--explora-radius-2xl)', 
          marginBottom: 'var(--explora-space-8)',
          textAlign: 'left'
        }}>
          <h1 style={{
            fontFamily: 'var(--explora-font-family-display)',
            fontSize: 'var(--explora-font-size-4xl)',
            fontWeight: 'var(--explora-font-weight-bold)',
            color: 'var(--explora-white)',
            margin: '0 0 var(--explora-space-2) 0'
          }}>🛠️ Admin Dashboard</h1>
          <p style={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: 'var(--explora-font-size-lg)',
            margin: '0 0 var(--explora-space-1) 0'
          }}>Location database management with quality control</p>
          <p style={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: 'var(--explora-font-size-sm)'
          }}>Signed in as: {user.email}</p>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 'var(--explora-spacing-component-gap)',
            marginBottom: 'var(--explora-space-8)'
          }}>
            <div className="card-base">
              <h3 style={{
                fontSize: 'var(--explora-font-size-sm)',
                fontWeight: 'var(--explora-font-weight-medium)',
                color: 'var(--explora-text-secondary)',
                marginBottom: 'var(--explora-space-2)'
              }}>Total Locations</h3>
              <p style={{
                fontSize: 'var(--explora-font-size-3xl)',
                fontWeight: 'var(--explora-font-weight-bold)',
                color: 'var(--explora-text-primary)',
                margin: 0
              }}>{stats.totalLocations}</p>
            </div>
            <div className="card-base">
              <h3 style={{
                fontSize: 'var(--explora-font-size-sm)',
                fontWeight: 'var(--explora-font-weight-medium)',
                color: 'var(--explora-text-secondary)',
                marginBottom: 'var(--explora-space-2)'
              }}>Valid Locations</h3>
              <p style={{
                fontSize: 'var(--explora-font-size-3xl)',
                fontWeight: 'var(--explora-font-weight-bold)',
                color: 'var(--explora-success-green)',
                margin: 0
              }}>{stats.validLocations}</p>
              <p style={{
                fontSize: 'var(--explora-font-size-xs)',
                color: 'var(--explora-text-secondary)',
                margin: '4px 0 0 0'
              }}>{Math.round(stats.validLocations/stats.totalLocations*100)}% valid</p>
            </div>
            <div className="card-base">
              <h3 style={{
                fontSize: 'var(--explora-font-size-sm)',
                fontWeight: 'var(--explora-font-weight-medium)',
                color: 'var(--explora-text-secondary)',
                marginBottom: 'var(--explora-space-2)'
              }}>Average Quality</h3>
              <p style={{
                fontSize: 'var(--explora-font-size-3xl)',
                fontWeight: 'var(--explora-font-weight-bold)',
                color: stats.averageQuality >= 80 ? 'var(--explora-success-green)' : 
                       stats.averageQuality >= 60 ? 'var(--explora-warning-yellow)' : 'var(--explora-error-red)',
                margin: 0
              }}>{stats.averageQuality}</p>
              <p style={{
                fontSize: 'var(--explora-font-size-xs)',
                color: 'var(--explora-text-secondary)',
                margin: '4px 0 0 0'
              }}>out of 100</p>
            </div>
            <div className="card-base">
              <h3 style={{
                fontSize: 'var(--explora-font-size-sm)',
                fontWeight: 'var(--explora-font-weight-medium)',
                color: 'var(--explora-text-secondary)',
                marginBottom: 'var(--explora-space-2)'
              }}>Cross-Category</h3>
              <p style={{
                fontSize: 'var(--explora-font-size-3xl)',
                fontWeight: 'var(--explora-font-weight-bold)',
                color: 'var(--explora-primary-teal)',
                margin: 0
              }}>{stats.crossCategoryLocations}</p>
              <p style={{
                fontSize: 'var(--explora-font-size-xs)',
                color: 'var(--explora-text-secondary)',
                margin: '4px 0 0 0'
              }}>{Math.round(stats.crossCategoryLocations/stats.totalLocations*100)}% diverse</p>
            </div>
          </div>
        )}

        {/* Performance Analysis */}
        {performanceAnalysis && (
          <div className="card-base" style={{ marginBottom: 'var(--explora-space-8)' }}>
            <h2 style={{
              fontSize: 'var(--explora-font-size-xl)',
              fontWeight: 'var(--explora-font-weight-semibold)',
              color: 'var(--explora-text-primary)',
              marginBottom: 'var(--explora-space-4)'
            }}>🚀 Performance & Scalability Analysis</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 'var(--explora-spacing-component-gap)'
            }}>
              <div>
                <h3 style={{
                  fontWeight: 'var(--explora-font-weight-medium)',
                  color: 'var(--explora-text-primary)',
                  marginBottom: 'var(--explora-space-2)'
                }}>Concerns</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--explora-space-2)' }}>
                  {performanceAnalysis.indexingConcerns.map((concern, i) => (
                    <p key={i} style={{
                      fontSize: 'var(--explora-font-size-sm)',
                      color: 'var(--explora-warning-yellow)',
                      margin: 0
                    }}>⚠️ {concern}</p>
                  ))}
                  {performanceAnalysis.queryConcerns.map((concern, i) => (
                    <p key={i} style={{
                      fontSize: 'var(--explora-font-size-sm)',
                      color: 'var(--explora-warning-yellow)',
                      margin: 0
                    }}>⚡ {concern}</p>
                  ))}
                  {performanceAnalysis.scalabilityConcerns.map((concern, i) => (
                    <p key={i} style={{
                      fontSize: 'var(--explora-font-size-sm)',
                      color: 'var(--explora-info-blue)',
                      margin: 0
                    }}>📈 {concern}</p>
                  ))}
                </div>
              </div>
              <div>
                <h3 style={{
                  fontWeight: 'var(--explora-font-weight-medium)',
                  color: 'var(--explora-text-primary)',
                  marginBottom: 'var(--explora-space-2)'
                }}>Recommendations</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--explora-space-2)' }}>
                  {performanceAnalysis.recommendations.map((rec, i) => (
                    <p key={i} style={{
                      fontSize: 'var(--explora-font-size-sm)',
                      color: 'var(--explora-success-green)',
                      margin: 0
                    }}>✅ {rec}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{
          marginBottom: 'var(--explora-spacing-component-gap)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--explora-space-4)'
        }}>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-base"
            style={{
              backgroundColor: 'var(--explora-button-secondary)',
              color: 'var(--explora-white)'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = 'var(--explora-button-secondary-hover)'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'var(--explora-button-secondary)'}
          >
            ➕ Add New Location
          </button>
          <button
            onClick={async () => {
              try {
                const analysis = await analyzeLocationQuality();
                console.log('Quality analysis complete:', analysis);
                alert(`Analysis complete: ${analysis.totalLocations} total, ${analysis.validLocations} valid locations`);
              } catch (error) {
                console.error('Analysis failed:', error);
                alert('Failed to analyze location quality');
              }
            }}
            className="btn-base"
            style={{
              backgroundColor: 'var(--explora-success-green)',
              color: 'var(--explora-white)'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#45a049'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'var(--explora-success-green)'}
          >
            📊 Full Quality Analysis
          </button>
          <button
            onClick={() => {
              loadLocations();
              analyzeAllLocations();
            }}
            className="btn-base"
            style={{
              backgroundColor: 'var(--explora-gray-medium)',
              color: 'var(--explora-white)'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = 'var(--explora-gray-charcoal)'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'var(--explora-gray-medium)'}
          >
            🔄 Reload & Re-analyze
          </button>
          <button
            onClick={async () => {
              try {
                setIsLoading(true);
                await initializeDatabaseWithSampleData();
                await loadLocations();
                alert('Database initialized with sample Vienna locations!');
              } catch (error) {
                console.error('Initialization failed:', error);
                alert('Failed to initialize database');
              } finally {
                setIsLoading(false);
              }
            }}
            className="btn-base"
            style={{
              backgroundColor: '#8B5CF6',
              color: 'var(--explora-white)'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#7C3AED'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#8B5CF6'}
          >
            🔧 Initialize Sample Data
          </button>
        </div>

        {/* Location List with Quality Scores */}
        <div className="card-base" style={{ padding: 0 }}>
          <div style={{
            padding: 'var(--explora-card-padding)',
            borderBottom: '1px solid var(--explora-gray-border)'
          }}>
            <h2 style={{
              fontSize: 'var(--explora-font-size-xl)',
              fontWeight: 'var(--explora-font-weight-semibold)',
              color: 'var(--explora-text-primary)',
              margin: 0
            }}>📍 Location Quality Report</h2>
          </div>
          <div>
            {validationResults.map((result) => (
              <div 
                key={result.locationId} 
                style={{
                  padding: 'var(--explora-space-4)',
                  borderBottom: '1px solid var(--explora-gray-border)',
                  cursor: 'pointer',
                  transition: 'var(--explora-transition-fast)'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = 'var(--explora-background-subtle)'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 'var(--explora-space-3)', 
                      marginBottom: 'var(--explora-space-2)' 
                    }}>
                      <h3 style={{
                        fontWeight: 'var(--explora-font-weight-medium)',
                        color: 'var(--explora-text-primary)',
                        margin: 0
                      }}>{result.locationName}</h3>
                      <span style={{
                        fontSize: 'var(--explora-font-size-sm)',
                        fontWeight: 'var(--explora-font-weight-medium)',
                        color: result.qualityScore >= 80 ? 'var(--explora-success-green)' : 
                               result.qualityScore >= 60 ? 'var(--explora-warning-yellow)' : 'var(--explora-error-red)'
                      }}>
                        {result.qualityScore}/100
                      </span>
                      {result.isValid ? (
                        <span style={{
                          fontSize: 'var(--explora-font-size-xs)',
                          backgroundColor: 'rgba(76, 175, 80, 0.1)',
                          color: 'var(--explora-success-green)',
                          padding: '2px 8px',
                          borderRadius: 'var(--explora-radius-base)'
                        }}>✅ Valid</span>
                      ) : (
                        <span style={{
                          fontSize: 'var(--explora-font-size-xs)',
                          backgroundColor: 'rgba(244, 67, 54, 0.1)',
                          color: 'var(--explora-error-red)',
                          padding: '2px 8px',
                          borderRadius: 'var(--explora-radius-base)'
                        }}>❌ Issues</span>
                      )}
                    </div>

                    {/* Tag Breakdown */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--explora-space-4)',
                      fontSize: 'var(--explora-font-size-xs)',
                      color: 'var(--explora-text-secondary)',
                      marginBottom: 'var(--explora-space-2)'
                    }}>
                      <span>Primary: {result.tagBreakdown.primary.count}</span>
                      <span>Secondary: {result.tagBreakdown.secondary.count}</span>
                      <span>Hidden: {result.tagBreakdown.hidden.count}</span>
                      <span>Categories: {result.tagBreakdown.primary.categories.join(', ')}</span>
                    </div>

                    {/* Cross-category analysis */}
                    <div style={{
                      fontSize: 'var(--explora-font-size-xs)',
                      color: 'var(--explora-info-blue)',
                      marginBottom: 'var(--explora-space-2)'
                    }}>
                      🏷️ Cross-category diversity: {Math.round(result.crossCategoryAnalysis.diversity * 100)}%
                      {result.crossCategoryAnalysis.dominantCategory && (
                        <span style={{ marginLeft: 'var(--explora-space-2)' }}>Dominant: {result.crossCategoryAnalysis.dominantCategory}</span>
                      )}
                    </div>

                    {/* Errors and warnings */}
                    {result.errors.length > 0 && (
                      <div style={{
                        fontSize: 'var(--explora-font-size-xs)',
                        color: 'var(--explora-error-red)',
                        marginBottom: '4px'
                      }}>
                        ❌ Errors: {result.errors.join(', ')}
                      </div>
                    )}
                    {result.warnings.length > 0 && (
                      <div style={{
                        fontSize: 'var(--explora-font-size-xs)',
                        color: 'var(--explora-warning-yellow)',
                        marginBottom: '4px'
                      }}>
                        ⚠️ Warnings: {result.warnings.join(', ')}
                      </div>
                    )}
                    {result.suggestions.length > 0 && (
                      <div style={{
                        fontSize: 'var(--explora-font-size-xs)',
                        color: 'var(--explora-success-green)'
                      }}>
                        💡 Suggestions: {result.suggestions.join(', ')}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: 'var(--explora-space-2)' }}>
                    <button
                      onClick={() => setSelectedLocation(locations.find(l => l.id === result.locationId) || null)}
                      style={{
                        fontSize: 'var(--explora-font-size-xs)',
                        padding: '4px 12px',
                        backgroundColor: 'rgba(33, 150, 243, 0.1)',
                        color: 'var(--explora-info-blue)',
                        border: 'none',
                        borderRadius: 'var(--explora-radius-base)',
                        cursor: 'pointer',
                        transition: 'var(--explora-transition-fast)'
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(33, 150, 243, 0.2)'}
                      onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(33, 150, 243, 0.1)'}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add/Edit Location Modal */}
      {(showAddForm || selectedLocation) && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--explora-space-4)',
          zIndex: 'var(--explora-z-modal)'
        }}>
          <div className="card-base" style={{
            maxWidth: '640px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h2 style={{
              fontSize: 'var(--explora-font-size-2xl)',
              fontWeight: 'var(--explora-font-weight-semibold)',
              color: 'var(--explora-text-primary)',
              marginBottom: 'var(--explora-space-4)'
            }}>
              {selectedLocation ? 'Edit Location' : 'Add New Location'}
            </h2>
            
            {selectedLocation ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Location Details</h3>
                  <p><strong>Name:</strong> {selectedLocation.name}</p>
                  <p><strong>Category:</strong> {selectedLocation.category}</p>
                  <p><strong>Description:</strong> {selectedLocation.description}</p>
                  <p><strong>Coordinates:</strong> {selectedLocation.coordinates.lat}, {selectedLocation.coordinates.lng}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Tags</h3>
                  <div className="space-y-2">
                    <div>
                      <strong>Primary:</strong> {selectedLocation.tags.primary.join(', ')}
                    </div>
                    <div>
                      <strong>Secondary:</strong> {selectedLocation.tags.secondary.join(', ')}
                    </div>
                    <div>
                      <strong>Hidden:</strong> {selectedLocation.tags.hidden.join(', ')}
                    </div>
                    <div>
                      <strong>Contextual:</strong> {selectedLocation.tags.contextual.join(', ')}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={async () => {
                      if (!selectedLocation.verified) {
                        try {
                          setIsSaving(true);
                          await verifyLocation(selectedLocation.id, user?.uid);
                          alert('Location verified successfully!');
                          loadLocations();
                        } catch (error) {
                          alert('Failed to verify location');
                        } finally {
                          setIsSaving(false);
                        }
                      }
                    }}
                    disabled={selectedLocation.verified || isSaving}
                    className="btn-base"
                    style={{
                      backgroundColor: selectedLocation.verified ? 'rgba(76, 175, 80, 0.1)' : 'var(--explora-success-green)',
                      color: selectedLocation.verified ? 'var(--explora-success-green)' : 'var(--explora-white)',
                      cursor: selectedLocation.verified ? 'not-allowed' : 'pointer',
                      opacity: isSaving ? 0.7 : 1
                    }}
                    onMouseOver={(e) => {
                      if (!selectedLocation.verified) e.target.style.backgroundColor = '#45a049';
                    }}
                    onMouseOut={(e) => {
                      if (!selectedLocation.verified) e.target.style.backgroundColor = 'var(--explora-success-green)';
                    }}
                  >
                    {selectedLocation.verified ? '✅ Verified' : '✅ Verify Location'}
                  </button>
                  
                  <button
                    onClick={async () => {
                      if (confirm('Are you sure you want to delete this location? This action cannot be undone.')) {
                        try {
                          setIsSaving(true);
                          await deleteLocation(selectedLocation.id);
                          alert('Location deleted successfully!');
                          setSelectedLocation(null);
                          loadLocations();
                        } catch (error) {
                          alert('Failed to delete location');
                        } finally {
                          setIsSaving(false);
                        }
                      }
                    }}
                    disabled={isSaving}
                    className="btn-base"
                    style={{
                      backgroundColor: 'var(--explora-error-red)',
                      color: 'var(--explora-white)',
                      opacity: isSaving ? 0.5 : 1
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#d32f2f'}
                    onMouseOut={(e) => e.target.style.backgroundColor = 'var(--explora-error-red)'}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-gray-600 mb-4">
                  Add new location functionality will be implemented in the next phase.
                  For now, locations can be managed through the Firebase console.
                </p>
                <p className="text-sm text-blue-600">
                  💡 Tip: You can view existing sample locations in the database and modify them directly.
                </p>
              </div>
            )}
            
            <div className="flex gap-3 mt-6 pt-4 border-t">
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setSelectedLocation(null);
                }}
                disabled={isSaving}
                className="btn-base"
                style={{
                  backgroundColor: 'var(--explora-gray-light)',
                  color: 'var(--explora-gray-charcoal)',
                  opacity: isSaving ? 0.5 : 1
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = 'var(--explora-gray-border)'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'var(--explora-gray-light)'}
              >
                {isSaving ? 'Processing...' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}