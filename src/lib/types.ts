// TypeScript interfaces for the application

export interface PrayerTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export interface HijriDate {
  date: string;
  format: string;
  day: string;
  weekday: {
    en: string;
    ar: string;
  };
  month: {
    number: number;
    en: string;
    ar: string;
  };
  year: string;
  designation: {
    abbreviated: string;
    expanded: string;
  };
}

export interface GregorianDate {
  date: string;
  format: string;
  day: string;
  weekday: {
    en: string;
  };
  month: {
    number: number;
    en: string;
  };
  year: string;
  designation: {
    abbreviated: string;
    expanded: string;
  };
}

export interface PrayerTimesMeta {
  latitude: number;
  longitude: number;
  timezone: string;
  method: {
    id: number;
    name: string;
  };
  school: {
    id: number;
    name: string;
  };
}

export interface PrayerTimesResponse {
  timings: PrayerTimings;
  hijri: HijriDate;
  gregorian: GregorianDate;
  meta: PrayerTimesMeta;
}

export interface Location {
  latitude: number;
  longitude: number;
  city?: string;
  state?: string;
}

export interface IftarEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  city: string;
  state: string;
  region: 'Northeast' | 'Midwest' | 'South' | 'West';
  type: 'free' | 'paid';
  spots?: number;
  organizer: string;
  registration: boolean;
  description?: string;
}

export interface MealPlan {
  day: number;
  suhoor: {
    title: string;
    items: string[];
    prepTime: string;
    focus: string;
  };
  iftar: {
    title: string;
    items: string[];
    prepTime: string;
    focus: string;
  };
}

export interface Charity {
  id: number;
  name: string;
  description: string;
  website: string;
  donateUrl: string;
  categories: string[];
  logo?: string;
}

export interface CountdownTime {
  hours: number;
  minutes: number;
  seconds: number;
  isOver: boolean;
}

export interface ZakatCalculation {
  savings: number;
  zakat: number;
}

export interface SadaqahEntry {
  id: string;
  amount: number;
  date: string;
  charity: string;
  notes?: string;
}
