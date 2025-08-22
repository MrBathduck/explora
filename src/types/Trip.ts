import type { Location } from './Location';

export interface ItineraryDay {
  date: string; // YYYY-MM-DD format
  locations: string[]; // Array of location IDs
  notes?: string;
}

// Simplified day interface for trip planner
export interface TripDay {
  day: number;
  locations: Location[]; // Array of full Location objects
}

export interface Trip {
  id: string;
  name: string;
  description?: string;
  city: string;
  startDate: string; // YYYY-MM-DD format
  endDate: string; // YYYY-MM-DD format
  days: ItineraryDay[];
  userId: string; // User ID
  createdBy: string; // Deprecated: Use userId instead
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  tags?: string[];
}

export interface TripSummary {
  id: string;
  name: string;
  city: string;
  startDate: string;
  endDate: string;
  dayCount: number;
  locationCount: number;
  createdAt: Date;
}

// Simplified trip interface for trip planner
export interface PlannerTrip {
  id: string;
  name: string;
  userId: string;
  days: TripDay[];
  createdAt: Date;
  updatedAt: Date;
}