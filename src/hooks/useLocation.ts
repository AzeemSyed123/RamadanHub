'use client';

import { useState, useEffect } from 'react';
import { Location } from '@/lib/types';

export function useLocation() {
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check localStorage for saved location
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      try {
        setLocation(JSON.parse(savedLocation));
        setLoading(false);
        return;
      } catch (e) {
        console.error('Failed to parse saved location', e);
      }
    }

    // Try to get GPS location
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation: Location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setLocation(newLocation);
          localStorage.setItem('userLocation', JSON.stringify(newLocation));
          setLoading(false);
        },
        (err) => {
          console.error('Geolocation error:', err);
          setError('Unable to get location. Please enter manually.');
          setLoading(false);
        },
        {
          timeout: 10000,
          maximumAge: 3600000, // Cache for 1 hour
        }
      );
    } else {
      setError('Geolocation not supported by your browser');
      setLoading(false);
    }
  }, []);

  const updateLocation = (newLocation: Location) => {
    setLocation(newLocation);
    localStorage.setItem('userLocation', JSON.stringify(newLocation));
    setError(null);
  };

  return { location, loading, error, updateLocation };
}
