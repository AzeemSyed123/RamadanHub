'use client';

import { usePrayerTimes } from '@/hooks/usePrayerTimes';
import { useLocation } from '@/hooks/useLocation';
import IftarCountdown from './IftarCountdown';
import PrayerTimes from './PrayerTimes';
import LocationPicker from './LocationPicker';
import WorkplaceRights from './WorkplaceRights';
import { calculateFastingDuration, getCurrentRamadanDay, isCurrentlyFasting } from '@/lib/helpers';

export default function HomeTab() {
  const { location, loading: locationLoading, error: locationError, updateLocation } = useLocation();
  const { prayerTimes, loading: prayerLoading, error: prayerError } = usePrayerTimes(location);

  const ramadanDay = getCurrentRamadanDay();
  const iftarTime = prayerTimes?.timings.Maghrib || null;
  const suhoorDeadline = prayerTimes?.timings.Fajr || null;
  const fastingDuration = prayerTimes
    ? calculateFastingDuration(prayerTimes.timings.Fajr, prayerTimes.timings.Maghrib)
    : null;
  const currentlyFasting =
    prayerTimes && isCurrentlyFasting(prayerTimes.timings.Fajr, prayerTimes.timings.Maghrib);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg shadow-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Ramadan Mubarak! 🌙</h1>
        <p className="text-lg opacity-90">Day {ramadanDay} of Ramadan</p>
        {prayerTimes?.hijri && (
          <p className="text-sm opacity-80 mt-1">
            {prayerTimes.hijri.day} {prayerTimes.hijri.month.en} {prayerTimes.hijri.year}
          </p>
        )}
      </div>

      {/* Location Picker */}
      {(locationLoading || !location || locationError) && (
        <LocationPicker location={location} onLocationChange={updateLocation} />
      )}

      {/* Errors */}
      {locationError && !location && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">{locationError}</p>
        </div>
      )}
      {prayerError && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">{prayerError}</p>
        </div>
      )}

      {/* Iftar Countdown */}
      <IftarCountdown iftarTime={iftarTime} />

      {/* Fasting Info */}
      {suhoorDeadline && fastingDuration && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
            ⏰ Today&apos;s Fast
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Suhoor Deadline</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {new Date(`2000-01-01T${suhoorDeadline}`).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Fasting Duration</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{fastingDuration}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {currentlyFasting ? '🌙 Fasting' : '✨ Not Fasting'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Prayer Times */}
      <PrayerTimes timings={prayerTimes?.timings || null} loading={prayerLoading} />

      {/* Quick Links */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          🔗 Quick Links
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href="#events"
            className="flex items-center gap-3 p-3 bg-primary-50 dark:bg-primary-900/30 rounded-lg 
                     hover:bg-primary-100 dark:hover:bg-primary-900/50 transition"
          >
            <span className="text-2xl">🎉</span>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Iftar Events</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Find events near you</p>
            </div>
          </a>
          <a
            href="#meals"
            className="flex items-center gap-3 p-3 bg-primary-50 dark:bg-primary-900/30 rounded-lg 
                     hover:bg-primary-100 dark:hover:bg-primary-900/50 transition"
          >
            <span className="text-2xl">🍽️</span>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Meal Plans</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">7-day meal ideas</p>
            </div>
          </a>
          <a
            href="#charity"
            className="flex items-center gap-3 p-3 bg-primary-50 dark:bg-primary-900/30 rounded-lg 
                     hover:bg-primary-100 dark:hover:bg-primary-900/50 transition"
          >
            <span className="text-2xl">💝</span>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Charity</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Track Zakat & Sadaqah</p>
            </div>
          </a>
          <a
            href="https://quran.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 bg-primary-50 dark:bg-primary-900/30 rounded-lg 
                     hover:bg-primary-100 dark:hover:bg-primary-900/50 transition"
          >
            <span className="text-2xl">📖</span>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Quran</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Read online</p>
            </div>
          </a>
        </div>
      </div>

      {/* Workplace Rights */}
      <WorkplaceRights />
    </div>
  );
}
