// Helper functions for time parsing, formatting, and Ramadan calculations

/**
 * Parse time string in format "HH:MM" and return Date object for today
 */
export function parseTimeString(timeStr: string): Date {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

/**
 * Format time difference as countdown string
 */
export function formatTimeDifference(milliseconds: number): {
  hours: number;
  minutes: number;
  seconds: number;
} {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { hours, minutes, seconds };
}

/**
 * Format time string for display (e.g., "17:26" -> "5:26 PM")
 */
export function formatTime12Hour(timeStr: string): string {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
}

/**
 * Calculate fasting duration between Fajr and Maghrib
 */
export function calculateFastingDuration(fajr: string, maghrib: string): string {
  const fajrTime = parseTimeString(fajr);
  const maghribTime = parseTimeString(maghrib);
  
  const diff = maghribTime.getTime() - fajrTime.getTime();
  const { hours, minutes } = formatTimeDifference(diff);
  
  return `${hours}h ${minutes}m`;
}

/**
 * Get current Ramadan day (mock calculation - in production would use actual Islamic calendar)
 */
export function getCurrentRamadanDay(): number {
  // Mock: return day between 1-30 based on day of month
  const today = new Date();
  return (today.getDate() % 30) + 1;
}

/**
 * Check if current time is within Ramadan fasting hours
 */
export function isCurrentlyFasting(fajr: string, maghrib: string): boolean {
  const now = new Date();
  const fajrTime = parseTimeString(fajr);
  const maghribTime = parseTimeString(maghrib);
  
  return now >= fajrTime && now < maghribTime;
}

/**
 * Get next prayer name and time
 */
export function getNextPrayer(timings: { [key: string]: string }): {
  name: string;
  time: string;
} | null {
  const now = new Date();
  const prayers = [
    { name: 'Fajr', time: timings.Fajr },
    { name: 'Dhuhr', time: timings.Dhuhr },
    { name: 'Asr', time: timings.Asr },
    { name: 'Maghrib', time: timings.Maghrib },
    { name: 'Isha', time: timings.Isha },
  ];

  for (const prayer of prayers) {
    const prayerTime = parseTimeString(prayer.time);
    if (now < prayerTime) {
      return prayer;
    }
  }

  // If no prayer left today, return tomorrow's Fajr
  return { name: 'Fajr', time: timings.Fajr };
}

/**
 * Format date for display
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Calculate Zakat (2.5% of savings)
 */
export function calculateZakat(savings: number): number {
  return savings * 0.025;
}

/**
 * Format currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

/**
 * Generate unique ID
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
