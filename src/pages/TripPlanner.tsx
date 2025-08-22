import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { createTrip, getTrip, updateTrip } from '../services/trips';
import type { PlannerTrip, Trip } from '../types/Trip';
import DroppableDayContainer from '../components/trip/DroppableDayContainer';
import DraggableLocationCard from '../components/trip/DraggableLocationCard';
import TripPlannerMoodSelector from '../components/trip/TripPlannerMoodSelector';
import type { MoodType } from '../components/common/MoodMatcher';
import { sampleLocations as locations } from '../data/sampleLocations';
import { MOOD_TAG_MAPPING } from '../data/tagSystem';
import './TripPlanner.css';

interface TripPlannerProps {
  mode: 'create' | 'edit'
}

const TripPlanner: React.FC<TripPlannerProps> = ({ mode }) => {
  const { user } = useAuth();
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const [currentTrip, setCurrentTrip] = useState<PlannerTrip | null>(null);
  const [tripName, setTripName] = useState('My Vienna Trip');
  const [numberOfDays, setNumberOfDays] = useState(3);
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && tripId && user) {
      loadTripForEditing(tripId);
    } else if (mode === 'create') {
      // For create mode, start fresh
      setCurrentTrip(null);
      setTripName('My Vienna Trip');
      setNumberOfDays(3);
    }
  }, [mode, tripId, user]);

  const loadTripForEditing = async (tripId: string) => {
    if (!user) return;
    setIsLoading(true);
    try {
      const trip = await getTrip(tripId);
      if (trip && trip.userId === user.uid) {
        // Convert Trip to PlannerTrip format if needed
        const plannerTrip: PlannerTrip = {
          id: trip.id,
          name: trip.name,
          userId: trip.userId,
          days: trip.days.map((day, index) => ({
            day: index + 1,
            locations: day.locations || []
          })),
          createdAt: trip.createdAt,
          updatedAt: trip.updatedAt
        };
        setCurrentTrip(plannerTrip);
        setTripName(trip.name);
        setNumberOfDays(trip.days.length);
      } else {
        console.error('Trip not found or access denied');
        navigate('/trips');
      }
    } catch (error) {
      console.error('Failed to load trip:', error);
      navigate('/trips');
    } finally {
      setIsLoading(false);
    }
  };

  const createNewTrip = () => {
    const newTrip: PlannerTrip = {
      id: `trip-${Date.now()}`,
      name: tripName,
      userId: user?.uid || '',
      days: Array.from({ length: numberOfDays }, (_, index) => ({
        day: index + 1,
        locations: []
      })),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setCurrentTrip(newTrip);
  };

  const saveTrip = async () => {
    if (!currentTrip || !user) return;
    setIsLoading(true);
    try {
      if (mode === 'create') {
        // Create new trip using the trips service
        const tripData = {
          name: currentTrip.name,
          description: '',
          city: 'Vienna', // Default city for now
          startDate: new Date().toISOString().split('T')[0], // Default to today
          endDate: new Date(Date.now() + (currentTrip.days.length - 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          isPublic: false,
          days: currentTrip.days.map((day, index) => ({
            date: new Date(Date.now() + index * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            locations: day.locations,
            notes: ''
          })),
          tags: []
        };
        await createTrip(user, tripData);
      } else {
        // Update existing trip using the trips service
        const tripData: Trip = {
          id: currentTrip.id,
          userId: currentTrip.userId,
          name: currentTrip.name,
          description: '',
          city: 'Vienna',
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(Date.now() + (currentTrip.days.length - 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          isPublic: false,
          days: currentTrip.days.map((day, index) => ({
            date: new Date(Date.now() + index * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            locations: day.locations,
            notes: ''
          })),
          tags: [],
          createdBy: currentTrip.userId,
          createdAt: currentTrip.createdAt,
          updatedAt: new Date()
        };
        await updateTrip(currentTrip.id, tripData);
      }
      alert(`Trip ${mode === 'create' ? 'created' : 'updated'} successfully!`);
      navigate('/trips');
    } catch (error) {
      console.error('Failed to save trip:', error);
      alert('Failed to save trip. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-create trip in create mode when user makes changes
  const autoCreateTrip = () => {
    if (mode === 'create' && !currentTrip) {
      createNewTrip();
    }
  };

  const handleLocationDrop = (locationId: string, dayIndex: number) => {
    if (!currentTrip) return;

    const location = locations.find(loc => loc.id === locationId);
    if (!location) return;

    const updatedTrip = { ...currentTrip };
    
    // Remove location from any existing day
    updatedTrip.days.forEach(day => {
      day.locations = day.locations.filter(loc => loc.id !== locationId);
    });

    // Add location to the target day
    updatedTrip.days[dayIndex].locations.push(location);
    updatedTrip.updatedAt = new Date();

    setCurrentTrip(updatedTrip);
  };

  const removeLocationFromDay = (locationId: string, dayIndex: number) => {
    if (!currentTrip) return;

    const updatedTrip = { ...currentTrip };
    updatedTrip.days[dayIndex].locations = updatedTrip.days[dayIndex].locations.filter(
      loc => loc.id !== locationId
    );
    updatedTrip.updatedAt = new Date();

    setCurrentTrip(updatedTrip);
  };

  const handleLocationMove = (locationId: string, fromDayIndex: number, toDayIndex: number) => {
    if (!currentTrip || fromDayIndex === toDayIndex) return;

    const updatedTrip = { ...currentTrip };
    
    // Find the location in the source day
    const location = updatedTrip.days[fromDayIndex].locations.find(loc => loc.id === locationId);
    if (!location) return;

    // Remove from source day
    updatedTrip.days[fromDayIndex].locations = updatedTrip.days[fromDayIndex].locations.filter(
      loc => loc.id !== locationId
    );

    // Add to target day
    updatedTrip.days[toDayIndex].locations.push(location);
    updatedTrip.updatedAt = new Date();

    setCurrentTrip(updatedTrip);
  };

  // Filter locations based on selected mood
  const getFilteredLocations = () => {
    if (!selectedMood) return locations;
    
    const moodTags = MOOD_TAG_MAPPING[selectedMood];
    
    return locations.filter(location => {
      // Get all location tags from the structured tags object
      const allLocationTags = [
        ...(location.tags?.primary || []),
        ...(location.tags?.secondary || []),
        ...(location.tags?.hidden || []),
        ...(location.tags?.contextual || [])
      ];
      
      // Check if any location tag matches any mood tag (partial match for flexibility)
      return moodTags.some(moodTag => 
        allLocationTags.some(locationTag => 
          locationTag.toLowerCase().includes(moodTag.toLowerCase()) ||
          moodTag.toLowerCase().includes(locationTag.toLowerCase())
        )
      );
    });
  };

  return (
    <div className="trip-planner">
      <div className="trip-planner-header">
        <div className="header-top">
          <Link to="/trips" className="back-link">← Back to Trips</Link>
          <h1>{mode === 'create' ? 'Create New Trip' : 'Edit Trip'}</h1>
        </div>
        
        {isLoading ? (
          <div className="loading-state">Loading trip...</div>
        ) : mode === 'create' && !currentTrip ? (
          <div className="trip-creation">
            <div className="trip-form">
              <input
                type="text"
                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
                placeholder="Trip name"
                className="trip-name-input"
              />
              <select
                value={numberOfDays}
                onChange={(e) => setNumberOfDays(Number(e.target.value))}
                className="days-select"
              >
                {[1, 2, 3, 4, 5, 6, 7].map(days => (
                  <option key={days} value={days}>{days} day{days > 1 ? 's' : ''}</option>
                ))}
              </select>
              <button onClick={createNewTrip} className="create-trip-btn">
                Start Planning
              </button>
            </div>
          </div>
        ) : currentTrip && (
          <div className="trip-controls">
            <h2>{currentTrip.name}</h2>
            <div className="trip-actions">
              <button 
                onClick={saveTrip} 
                className="save-btn"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : mode === 'create' ? 'Create Trip' : 'Save Changes'}
              </button>
              <Link to="/trips" className="cancel-btn">Cancel</Link>
            </div>
          </div>
        )}
      </div>

      {currentTrip && (
        <div className="trip-content">
          <div className="available-locations">
            <div className="locations-header">
              <h3>Available Locations</h3>
              <TripPlannerMoodSelector
                onMoodSelect={setSelectedMood}
                selectedMood={selectedMood}
              />
            </div>
            <div className="locations-grid">
              {getFilteredLocations().map(location => {
                const isUsed = currentTrip.days.some(day => 
                  day.locations.some(loc => loc.id === location.id)
                );
                return (
                  <DraggableLocationCard
                    key={location.id}
                    location={location}
                    isUsed={isUsed}
                  />
                );
              })}
            </div>
            {selectedMood && getFilteredLocations().length === 0 && (
              <div className="no-mood-results">
                <p>No locations match the <strong>{selectedMood}</strong> mood.</p>
                <p>Try a different mood or clear the filter to see all locations.</p>
              </div>
            )}
          </div>

          <div className="trip-days">
            <h3>Your Itinerary</h3>
            <div className="days-container">
              {(() => {
                console.log('🎯 TRIP DAYS:', currentTrip.days.length, 'days:', currentTrip.days.map(d => ({ day: d.day, locations: d.locations.length })));
                return currentTrip.days.map((day, index) => (
                  <DroppableDayContainer
                    key={day.day}
                    day={day}
                    dayIndex={index}
                    onLocationDrop={handleLocationDrop}
                    onLocationRemove={removeLocationFromDay}
                    onLocationMove={handleLocationMove}
                    onLocationClick={(location) => console.log('Location clicked:', location.name)}
                  />
                ));
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripPlanner;