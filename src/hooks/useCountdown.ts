'use client';

import { useState, useEffect } from 'react';
import { CountdownTime } from '@/lib/types';
import { parseTimeString, formatTimeDifference } from '@/lib/helpers';

export function useCountdown(targetTime: string | null): CountdownTime {
  const [countdown, setCountdown] = useState<CountdownTime>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    isOver: false,
  });

  useEffect(() => {
    if (!targetTime) {
      return;
    }

    const updateCountdown = () => {
      const now = new Date();
      const target = parseTimeString(targetTime);

      // If target time is earlier than now, it's tomorrow
      if (target < now) {
        target.setDate(target.getDate() + 1);
      }

      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        setCountdown({ hours: 0, minutes: 0, seconds: 0, isOver: true });
        return;
      }

      const { hours, minutes, seconds } = formatTimeDifference(diff);
      setCountdown({ hours, minutes, seconds, isOver: false });
    };

    // Update immediately
    updateCountdown();

    // Update every second
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [targetTime]);

  return countdown;
}
