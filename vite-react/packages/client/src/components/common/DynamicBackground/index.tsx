import { FC, useEffect, useState } from 'react';
import './index.css';

const DynamicBackground: FC = () => {
  const [bgUrl, setBgUrl] = useState<string>('');

  const fetchWallpaper = async () => {
    try {
      const res = await fetch('/api/wallpapers/random');
      const data = await res.json();
      if (data.success && data.data.url) {
        setBgUrl(data.data.url);
      }
    } catch (err) {
      console.error('Failed to fetch wallpaper:', err);
    }
  };

  useEffect(() => {
    fetchWallpaper();
    
    // Refresh every 10 minutes (600,000 ms)
    const intervalId = setInterval(() => {
      fetchWallpaper();
    }, 10 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  if (!bgUrl) return null;

  return (
    <div 
      className="dynamic-background"
      style={{ backgroundImage: `url(${bgUrl})` }}
    />
  );
};

export default DynamicBackground;
