'use client';

import { useState } from 'react';
import { Location } from '@/lib/types';

interface LocationPickerProps {
  location: Location | null;
  onLocationChange: (location: Location) => void;
}

export default function LocationPicker({ location, onLocationChange }: LocationPickerProps) {
  const [isManual, setIsManual] = useState(false);
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  const handleUseGPS = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          onLocationChange({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setIsManual(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsManual(true);
        }
      );
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city && state) {
      onLocationChange({
        latitude: 0, // Placeholder
        longitude: 0,
        city,
        state,
      });
      setIsManual(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
        📍 Your Location
      </h3>
      
      {location && !isManual ? (
        <div className="space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {location.city && location.state
              ? `${location.city}, ${location.state}`
              : `${location.latitude.toFixed(2)}, ${location.longitude.toFixed(2)}`}
          </p>
          <button
            onClick={() => setIsManual(true)}
            className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
          >
            Change location
          </button>
        </div>
      ) : isManual ? (
        <form onSubmit={handleManualSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              City
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g., Boston"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              State
            </label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="e.g., MA"
              maxLength={2}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-md font-medium transition"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsManual(false)}
              className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 
                       text-gray-900 dark:text-white py-2 px-4 rounded-md font-medium transition"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={handleUseGPS}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-md font-medium transition"
        >
          📍 Use My Location
        </button>
      )}
    </div>
  );
}
