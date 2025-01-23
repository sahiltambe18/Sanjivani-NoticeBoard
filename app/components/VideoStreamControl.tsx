'use client'

import { useState, useEffect } from 'react';

export default function VideoStreamControl() {
  const [streamUrl, setStreamUrl] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    // Fetch initial state
    const fetchStreamState = async () => {
      try {
        const response = await fetch('/api/stream');
        const data = await response.json();
        setStreamUrl(data.streamUrl || '');
        setIsEnabled(data.isEnabled || false);
      } catch (error) {
        console.error('Error fetching stream state:', error);
      }
    };
    fetchStreamState();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ streamUrl, isEnabled }),
      });
      
      if (!response.ok) throw new Error('Failed to update stream URL');
      alert('Stream settings updated successfully!');
    } catch (error) {
      console.error('Error updating stream URL:', error);
      alert('Failed to update stream settings');
    }
  };

  const toggleStream = async () => {
    try {
      const response = await fetch('/api/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ streamUrl, isEnabled: !isEnabled }),
      });
      
      if (!response.ok) throw new Error('Failed to toggle stream');
      setIsEnabled(!isEnabled);
    } catch (error) {
      console.error('Error toggling stream:', error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto mt-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Stream Settings</h2>
        <button
          onClick={toggleStream}
          className={`px-4 py-2 rounded-md text-white transition-colors ${
            isEnabled 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {isEnabled ? 'Disable Stream' : 'Enable Stream'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="streamUrl" className="block text-sm font-medium text-gray-700">
            Stream URL
          </label>
          <input
            type="url"
            id="streamUrl"
            value={streamUrl}
            onChange={(e) => setStreamUrl(e.target.value)}
            placeholder="Enter stream URL"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300"
        >
          Update Stream
        </button>
      </form>

      <div className="mt-4 p-4 bg-gray-50 rounded-md">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Current Status</h4>
        <p className="text-sm text-gray-600">
          Stream is currently: <span className={isEnabled ? 'text-green-600' : 'text-red-600'}>
            {isEnabled ? 'Enabled' : 'Disabled'}
          </span>
        </p>
      </div>
    </div>
  );
} 