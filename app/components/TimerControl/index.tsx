'use client';

import { useState } from 'react';
import axios from 'axios';

export default function TimerControl() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setError('');
      const totalSeconds = (hours * 3600) + (minutes * 60);
      await axios.post('/api/timer', {
        isEnabled,
        duration: totalSeconds
      });
      alert('Timer settings updated successfully!');
    } catch (error) {
      console.error('Failed to update timer:', error);
      setError('Failed to update timer settings');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Timer Control</h2>
      
      {error && (
        <div className="text-red-500 mb-4">{error}</div>
      )}
      
      <div className="space-y-4">
        <div className="flex items-center">
          <label className="mr-2">Enable Timer:</label>
          <input
            type="checkbox"
            checked={isEnabled}
            onChange={(e) => setIsEnabled(e.target.checked)}
            className="form-checkbox"
          />
        </div>

        <div className="flex space-x-4">
          <div>
            <label className="block">Hours:</label>
            <input
              type="number"
              min="0"
              value={hours}
              onChange={(e) => setHours(Math.max(0, parseInt(e.target.value) || 0))}
              className="form-input mt-1 p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block">Minutes:</label>
            <input
              type="number"
              min="0"
              max="59"
              value={minutes}
              onChange={(e) => setMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
              className="form-input mt-1 p-2 border rounded"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={`${
            isLoading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
          } text-white px-4 py-2 rounded transition-colors`}
        >
          {isLoading ? 'Updating...' : (isEnabled ? 'Start Timer' : 'Save Settings')}
        </button>
      </div>
    </div>
  );
} 