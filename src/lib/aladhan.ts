// AlAdhan API client functions

import { PrayerTimesResponse } from './types';

const ALADHAN_BASE_URL = 'https://api.aladhan.com/v1';

export interface FetchPrayerTimesParams {
  latitude?: number;
  longitude?: number;
  city?: string;
  state?: string;
  method?: number; // Calculation method (2 = ISNA)
  school?: number; // Juristic school (0 = Shafi, 1 = Hanafi)
}

/**
 * Fetch prayer times from AlAdhan API
 */
export async function fetchPrayerTimes(
  params: FetchPrayerTimesParams
): Promise<PrayerTimesResponse> {
  const { latitude, longitude, city, state, method = 2, school = 0 } = params;

  let url: string;
  
  if (city && state) {
    // Use address-based endpoint
    const address = encodeURIComponent(`${city}, ${state}, USA`);
    url = `${ALADHAN_BASE_URL}/timingsByAddress?address=${address}&method=${method}&school=${school}`;
  } else if (latitude !== undefined && longitude !== undefined) {
    // Use coordinate-based endpoint
    url = `${ALADHAN_BASE_URL}/timings?latitude=${latitude}&longitude=${longitude}&method=${method}&school=${school}`;
  } else {
    throw new Error('Either coordinates or city/state must be provided');
  }

  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch prayer times: ${response.statusText}`);
  }

  const data = await response.json();
  
  if (data.code !== 200 || !data.data) {
    throw new Error('Invalid response from AlAdhan API');
  }

  return {
    timings: data.data.timings,
    hijri: data.data.date.hijri,
    gregorian: data.data.date.gregorian,
    meta: data.data.meta,
  };
}

/**
 * Get city name from coordinates using reverse geocoding
 * (In production, you might want to use a proper geocoding API)
 */
export async function getCityFromCoordinates(
  latitude: number,
  longitude: number
): Promise<{ city: string; state: string } | null> {
  try {
    // This is a simplified version - in production use a proper geocoding service
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
    );
    
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    
    return {
      city: data.address?.city || data.address?.town || data.address?.village || 'Unknown',
      state: data.address?.state || 'Unknown',
    };
  } catch (error) {
    console.error('Error fetching city from coordinates:', error);
    return null;
  }
}
