'use client';

import { useState, useEffect } from 'react';
import { Event, DiscoveredEvent } from '@/types/event';
import EventSubmissionForm from './EventSubmissionForm';

export default function EventsTab() {
  const [events, setEvents] = useState<Event[]>([]);
  const [discoveredEvents, setDiscoveredEvents] = useState<DiscoveredEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [showDiscovery, setShowDiscovery] = useState(false);
  const [discoveryCity, setDiscoveryCity] = useState('');
  const [discovering, setDiscovering] = useState(false);
  const [discoveryError, setDiscoveryError] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('/api/events');
      
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load events');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDiscoverEvents = async () => {
    if (!discoveryCity.trim()) {
      setDiscoveryError('Please enter a city name');
      return;
    }

    try {
      setDiscovering(true);
      setDiscoveryError('');
      const response = await fetch('/api/events/discover', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ city: discoveryCity }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to discover events');
      }

      setDiscoveredEvents(data.events || []);
    } catch (err) {
      setDiscoveryError(err instanceof Error ? err.message : 'Failed to discover events');
    } finally {
      setDiscovering(false);
    }
  };

  const handleSubmitDiscoveredEvent = async (event: DiscoveredEvent) => {
    try {
      const response = await fetch('/api/events/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...event,
          submitted_by: 'AI Discovery',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit event');
      }

      alert('Event submitted successfully and is pending approval!');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to submit event');
    }
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      searchTerm === '' ||
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.state && event.state.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (event.organization && event.organization.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesState = selectedState === 'all' || event.state === selectedState;

    return matchesSearch && matchesState;
  });

  const uniqueStates = Array.from(new Set(events.map((e) => e.state).filter(Boolean))).sort();

  if (showSubmitForm) {
    return (
      <div className="space-y-6">
        <EventSubmissionForm
          onSuccess={() => {
            setShowSubmitForm(false);
            fetchEvents();
          }}
          onCancel={() => setShowSubmitForm(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          🎉 Iftar Events Nationwide
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Find and attend community iftars across the United States
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setShowSubmitForm(true)}
          className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition"
        >
          ➕ Submit an Event
        </button>
        <button
          onClick={() => setShowDiscovery(!showDiscovery)}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition"
        >
          🔍 {showDiscovery ? 'Hide' : 'Find Events Near Me'}
        </button>
      </div>

      {/* AI Discovery Section */}
      {showDiscovery && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg shadow-md p-6 border-2 border-purple-200 dark:border-purple-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            ✨ AI-Powered Event Discovery
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Let our AI discover iftar events near your city using web search
          </p>
          
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              placeholder="Enter city name (e.g., Boston, New York, Los Angeles)"
              value={discoveryCity}
              onChange={(e) => setDiscoveryCity(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              onClick={handleDiscoverEvents}
              disabled={discovering}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold
                       disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {discovering ? '🔄 Searching...' : '🔍 Discover Events'}
            </button>
          </div>

          {discoveryError && (
            <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 rounded-lg">
              <p className="text-red-800 dark:text-red-300">✗ {discoveryError}</p>
            </div>
          )}

          {discoveredEvents.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Found {discoveredEvents.length} event{discoveredEvents.length !== 1 ? 's' : ''}:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {discoveredEvents.map((event, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                  >
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">{event.title}</h4>
                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1 mb-3">
                      <p>📅 {event.date} at {event.time}</p>
                      <p>📍 {event.location}</p>
                      {event.organization && <p>👥 {event.organization}</p>}
                    </div>
                    <button
                      onClick={() => handleSubmitDiscoveredEvent(event)}
                      className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm font-medium transition"
                    >
                      Submit to Database
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!discovering && discoveredEvents.length === 0 && discoveryCity && !discoveryError && (
            <p className="text-gray-600 dark:text-gray-400 text-center py-4">
              No events found. Try a different city or check back later!
            </p>
          )}
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-4">
        <div>
          <input
            type="text"
            placeholder="🔍 Search by city, event name, or organizer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              State
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All States</option>
              {uniqueStates.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedState('all');
              }}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600
                       text-gray-900 dark:text-white rounded-lg font-medium transition"
            >
              Clear Filters
            </button>
          </div>
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredEvents.length} of {events.length} events
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading events...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <p className="text-red-800 dark:text-red-300 mb-2">✗ {error}</p>
          <button
            onClick={fetchEvents}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Events Grid */}
      {!loading && !error && filteredEvents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition overflow-hidden"
            >
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  {event.title}
                </h3>

                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <p className="flex items-center gap-2">
                    <span>📅</span>
                    <span>{event.date} at {event.time}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span>📍</span>
                    <span>{event.location}</span>
                  </p>
                  {event.organization && (
                    <p className="flex items-center gap-2">
                      <span>👥</span>
                      <span>{event.organization}</span>
                    </p>
                  )}
                  {event.contact_email && (
                    <p className="flex items-center gap-2">
                      <span>✉️</span>
                      <span className="truncate">{event.contact_email}</span>
                    </p>
                  )}
                  {event.website && (
                    <p className="flex items-center gap-2">
                      <span>🌐</span>
                      <a
                        href={event.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 dark:text-primary-400 hover:underline truncate"
                      >
                        Visit Website
                      </a>
                    </p>
                  )}
                </div>

                {event.description && (
                  <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">
                    {event.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredEvents.length === 0 && events.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
            No events available yet
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
            Be the first to submit an event to the community!
          </p>
          <button
            onClick={() => setShowSubmitForm(true)}
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition"
          >
            Submit an Event
          </button>
        </div>
      )}

      {/* No Results State */}
      {!loading && !error && filteredEvents.length === 0 && events.length > 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
            No events found matching your filters
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Try adjusting your search criteria
          </p>
        </div>
      )}
    </div>
  );
}
