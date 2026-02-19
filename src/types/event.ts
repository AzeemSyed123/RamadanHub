// TypeScript interface for events matching Supabase schema
export interface Event {
  id?: number;
  created_at?: string;
  title: string;
  description?: string;
  location: string;
  city: string;
  state?: string;
  date: string; // DATE format: YYYY-MM-DD
  time: string;
  organization?: string;
  contact_email?: string;
  contact_phone?: string;
  website?: string;
  is_approved?: boolean;
  submitted_by?: string;
}

// Form data type for event submission
export interface EventSubmissionData {
  title: string;
  description?: string;
  location: string;
  city: string;
  state?: string;
  date: string;
  time: string;
  organization?: string;
  contact_email?: string;
  contact_phone?: string;
  website?: string;
  submitted_by?: string;
}

// Type for discovered events from Claude API
export interface DiscoveredEvent {
  title: string;
  description?: string;
  location: string;
  city: string;
  state?: string;
  date: string;
  time: string;
  organization?: string;
  contact_email?: string;
  contact_phone?: string;
  website?: string;
}
