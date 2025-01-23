'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function TimerDisplay() {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTimer = async () => {
      try {
        const response = await axios.get('/api/timer');
        const timer = response.data;
        
        if (timer && timer.isEnabled && timer.endTime) {
          setIsEnabled(true);
          const end = new Date(timer.endTime).getTime();
          const now = Date.now();
          setTimeLeft(Math.max(0, Math.floor((end - now) / 1000)));
        } else {
          setIsEnabled(false);
          setTimeLeft(null);
        }
        setError('');
      } catch (error) {
        console.error('Failed to fetch timer:', error);
        setError('Failed to load timer');
      }
    };

    fetchTimer();
    const interval = setInterval(fetchTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (!isEnabled || timeLeft === null) {
    return null;
  }

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50">
      <div className="text-white text-8xl font-bold">
        {timeLeft > 0 ? formatTime(timeLeft) : "Time's Up!"}
      </div>
    </div>
  );
} 