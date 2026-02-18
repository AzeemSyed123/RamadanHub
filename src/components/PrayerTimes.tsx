'use client';

import { PrayerTimings } from '@/lib/types';
import { formatTime12Hour, getNextPrayer } from '@/lib/helpers';

interface PrayerTimesProps {
  timings: PrayerTimings | null;
  loading?: boolean;
}

export default function PrayerTimes({ timings, loading }: PrayerTimesProps) {
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          🕌 Prayer Times
        </h3>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex justify-between items-center animate-pulse">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!timings) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          🕌 Prayer Times
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Enable location to see prayer times
        </p>
      </div>
    );
  }

  const nextPrayer = getNextPrayer(timings);
  const prayers = [
    { name: 'Fajr', time: timings.Fajr, icon: '🌅' },
    { name: 'Sunrise', time: timings.Sunrise, icon: '☀️' },
    { name: 'Dhuhr', time: timings.Dhuhr, icon: '🌞' },
    { name: 'Asr', time: timings.Asr, icon: '🌤️' },
    { name: 'Maghrib', time: timings.Maghrib, icon: '🌆' },
    { name: 'Isha', time: timings.Isha, icon: '🌙' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        🕌 Prayer Times
      </h3>
      <div className="space-y-3">
        {prayers.map((prayer) => {
          const isNext = nextPrayer?.name === prayer.name;
          return (
            <div
              key={prayer.name}
              className={`flex justify-between items-center p-3 rounded-lg transition ${
                isNext
                  ? 'bg-primary-50 dark:bg-primary-900/30 border-2 border-primary-500'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">{prayer.icon}</span>
                <span
                  className={`font-semibold ${
                    isNext
                      ? 'text-primary-700 dark:text-primary-300'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {prayer.name}
                  {isNext && (
                    <span className="ml-2 text-xs bg-primary-500 text-white px-2 py-1 rounded-full">
                      Next
                    </span>
                  )}
                </span>
              </div>
              <span
                className={`font-mono text-lg ${
                  isNext
                    ? 'text-primary-700 dark:text-primary-300 font-bold'
                    : 'text-gray-900 dark:text-white'
                }`}
              >
                {formatTime12Hour(prayer.time)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
