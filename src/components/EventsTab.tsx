'use client';

import { useState, useMemo } from 'react';
import eventsData from '@/data/events.json';
import { IftarEvent } from '@/lib/types';

export default function EventsTab() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const events = eventsData as IftarEvent[];

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        searchTerm === '' ||
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.organizer.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRegion = selectedRegion === 'all' || event.region === selectedRegion;
      const matchesState = selectedState === 'all' || event.state === selectedState;
      const matchesType = selectedType === 'all' || event.type === selectedType;

      return matchesSearch && matchesRegion && matchesState && matchesType;
    });
  }, [events, searchTerm, selectedRegion, selectedState, selectedType]);

  const uniqueStates = useMemo(() => {
    const states = new Set(events.map((e) => e.state));
    return Array.from(states).sort();
  }, [events]);

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Region
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Regions</option>
              <option value="Northeast">Northeast</option>
              <option value="Midwest">Midwest</option>
              <option value="South">South</option>
              <option value="West">West</option>
            </select>
          </div>

          <div>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Types</option>
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedRegion('all');
                setSelectedState('all');
                setSelectedType('all');
              }}
              className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600
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

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white pr-2">
                  {event.title}
                </h3>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
                    event.type === 'free'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                  }`}
                >
                  {event.type === 'free' ? 'FREE' : 'PAID'}
                </span>
              </div>

              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p className="flex items-center gap-2">
                  <span>📅</span>
                  <span>{event.date} at {event.time}</span>
                </p>
                <p className="flex items-center gap-2">
                  <span>📍</span>
                  <span>{event.location}</span>
                </p>
                <p className="flex items-center gap-2">
                  <span>👥</span>
                  <span>{event.organizer}</span>
                </p>
                {event.spots && (
                  <p className="flex items-center gap-2">
                    <span>🎫</span>
                    <span>{event.spots} spots available</span>
                  </p>
                )}
              </div>

              {event.registration && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-xs text-primary-600 dark:text-primary-400 font-semibold">
                    ⚠️ Registration Required
                  </span>
                </div>
              )}

              {event.description && (
                <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">
                  {event.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
            No events found matching your filters
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Try adjusting your search criteria
          </p>
        </div>
      )}

      {/* Submit Event CTA */}
      <div className="bg-primary-50 dark:bg-primary-900/30 border-2 border-primary-200 dark:border-primary-800 rounded-lg p-6 text-center">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Hosting an Iftar Event?
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Submit your event to be featured on Ramadan Hub USA
        </p>
        <button
          className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition"
          onClick={() => alert('Event submission feature coming soon!')}
        >
          Submit Your Event
        </button>
      </div>
    </div>
  );
}
