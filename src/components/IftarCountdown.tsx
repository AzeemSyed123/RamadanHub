'use client';

import { useCountdown } from '@/hooks/useCountdown';
import { formatTime12Hour } from '@/lib/helpers';

interface IftarCountdownProps {
  iftarTime: string | null;
}

export default function IftarCountdown({ iftarTime }: IftarCountdownProps) {
  const countdown = useCountdown(iftarTime);

  if (!iftarTime) {
    return (
      <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg shadow-lg p-6 text-white text-center">
        <p className="text-lg">Loading iftar time...</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg shadow-lg p-6 text-white">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">🌙 Time Until Iftar</h2>
        <p className="text-sm opacity-90 mb-4">Maghrib: {formatTime12Hour(iftarTime)}</p>
        
        {countdown.isOver ? (
          <div className="text-4xl font-bold">
            It&apos;s Iftar Time! 🎉
          </div>
        ) : (
          <div className="flex justify-center gap-4 md:gap-6">
            <div className="flex flex-col items-center">
              <div className="text-5xl md:text-6xl font-bold">
                {countdown.hours.toString().padStart(2, '0')}
              </div>
              <div className="text-sm mt-1 opacity-90">Hours</div>
            </div>
            <div className="text-5xl md:text-6xl font-bold self-center">:</div>
            <div className="flex flex-col items-center">
              <div className="text-5xl md:text-6xl font-bold">
                {countdown.minutes.toString().padStart(2, '0')}
              </div>
              <div className="text-sm mt-1 opacity-90">Minutes</div>
            </div>
            <div className="text-5xl md:text-6xl font-bold self-center">:</div>
            <div className="flex flex-col items-center">
              <div className="text-5xl md:text-6xl font-bold">
                {countdown.seconds.toString().padStart(2, '0')}
              </div>
              <div className="text-sm mt-1 opacity-90">Seconds</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
