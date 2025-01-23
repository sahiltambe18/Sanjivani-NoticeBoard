'use client'

import { useEffect, useState } from 'react';

export default function VideoPlayer() {
  const [streamUrl, setStreamUrl] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    const fetchStreamUrl = async () => {
      try {
        const response = await fetch('/api/stream');
        const data = await response.json();
        setStreamUrl(data.streamUrl || '');
        setIsEnabled(data.isEnabled || false);
      } catch (error) {
        console.error('Error fetching stream URL:', error);
      }
    };

    fetchStreamUrl();
    const interval = setInterval(fetchStreamUrl, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!streamUrl || !isEnabled) return null;

  // Convert YouTube URL to embed URL
  const isYouTubeUrl = streamUrl.includes('youtu.be') || streamUrl.includes('youtube.com');
  const videoId = streamUrl.split('/').pop()?.split('?')[0];
  const embedUrl = isYouTubeUrl ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : streamUrl;

  return (
    <div className="fixed inset-0 w-full h-full z-[999]" style={{ backgroundColor: 'black' }}>
      {isYouTubeUrl ? (
        <iframe
          key={embedUrl}
          src={embedUrl}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      ) : (
        <video
          key={streamUrl}
          src={streamUrl}
          autoPlay
          playsInline
          controls
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
} 