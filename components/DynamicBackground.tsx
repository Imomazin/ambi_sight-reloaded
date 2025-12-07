'use client';

import { useState, useEffect } from 'react';

// City skyline images from Unsplash
const cityBackgrounds = [
  {
    url: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1920&h=1080&fit=crop',
    city: 'Singapore',
  },
  {
    url: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=1920&h=1080&fit=crop',
    city: 'New York',
  },
  {
    url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1920&h=1080&fit=crop',
    city: 'London',
  },
  {
    url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1920&h=1080&fit=crop',
    city: 'Tokyo',
  },
  {
    url: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1920&h=1080&fit=crop',
    city: 'Sydney',
  },
  {
    url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1920&h=1080&fit=crop',
    city: 'Paris',
  },
  {
    url: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=1920&h=1080&fit=crop',
    city: 'Dubai',
  },
  {
    url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920&h=1080&fit=crop',
    city: 'Hong Kong',
  },
];

interface DynamicBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export default function DynamicBackground({ children, className = '' }: DynamicBackgroundProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);

      setTimeout(() => {
        setCurrentIndex(nextIndex);
        setNextIndex((nextIndex + 1) % cityBackgrounds.length);
        setIsTransitioning(false);
      }, 1000);
    }, 8000); // Change every 8 seconds

    return () => clearInterval(interval);
  }, [nextIndex]);

  const currentBg = cityBackgrounds[currentIndex];
  const nextBg = cityBackgrounds[nextIndex];

  return (
    <div className={`relative min-h-screen ${className}`}>
      {/* Current Background */}
      <div
        className={`fixed inset-0 z-0 transition-opacity duration-1000 ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <img
          src={currentBg.url}
          alt={currentBg.city}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Next Background (for smooth transition) */}
      <div
        className={`fixed inset-0 z-0 transition-opacity duration-1000 ${
          isTransitioning ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <img
          src={nextBg.url}
          alt={nextBg.city}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Overlay - adapts to theme */}
      <div className="fixed inset-0 z-[1] bg-overlay-dark transition-colors duration-300" />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* City indicator */}
      <div className="fixed bottom-4 right-4 z-20 px-3 py-1.5 rounded-full backdrop-blur-md text-[var(--text-muted)] text-xs font-medium border border-[var(--border-color)]" style={{ backgroundColor: 'var(--overlay-bg)' }}>
        {currentBg.city}
      </div>
    </div>
  );
}
