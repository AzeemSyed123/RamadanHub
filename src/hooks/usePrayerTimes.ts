'use client';

import { useState, useEffect } from 'react';
import { PrayerTimesResponse, Location } from '@/lib/types';

export function usePrayerTimes(location: Location | null) {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimesResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!location) {
      return;
    }

    const fetchPrayerTimes = async () => {
      setLoading(true);
      setError(null);

      try {
        let url: string;
        
        if (location.city && location.state) {
          url = `/api/prayer-times?city=${encodeURIComponent(location.city)}&state=${encodeURIComponent(location.state)}`;
        } else {
          url = `/api/prayer-times?lat=${location.latitude}&lng=${location.longitude}`;
        }

        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Failed to fetch prayer times');
        }

        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }

        setPrayerTimes(data);
      } catch (err) {
        console.error('Error fetching prayer times:', err);
        setError(err instanceof Error ? err.message : 'Failed to load prayer times');
      } finally {
        setLoading(false);
      }
    };

    fetchPrayerTimes();
  }, [location]);

  return { prayerTimes, loading, error };
}
