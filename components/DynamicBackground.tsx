'use client';

import { useState, useEffect } from 'react';

// City skyline images from Unsplash - stunning global metropolises
const cityBackgrounds = [
  {
    url: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1920&h=1080&fit=crop&q=80',
    city: 'Singapore',
  },
  {
    url: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=1920&h=1080&fit=crop&q=80',
    city: 'New York',
  },
  {
    url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1920&h=1080&fit=crop&q=80',
    city: 'London',
  },
  {
    url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1920&h=1080&fit=crop&q=80',
    city: 'Tokyo',
  },
  {
    url: 'https://images.unsplash.com/photo-1617581629397-a72507c3de9e?w=1920&h=1080&fit=crop&q=80',
    city: 'Washington DC',
  },
  {
    url: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1920&h=1080&fit=crop&q=80',
    city: 'Sydney',
  },
  {
    url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1920&h=1080&fit=crop&q=80',
    city: 'Paris',
  },
  {
    url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&h=1080&fit=crop&q=80',
    city: 'Dubai',
  },
  {
    url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920&h=1080&fit=crop&q=80',
    city: 'Hong Kong',
  },
  {
    url: 'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=1920&h=1080&fit=crop&q=80',
    city: 'Shanghai',
  },
  {
    url: 'https://images.unsplash.com/photo-1555217851-6141535bd771?w=1920&h=1080&fit=crop&q=80',
    city: 'Seoul',
  },
  {
    url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1920&h=1080&fit=crop&q=80',
    city: 'Rome',
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
  const [isZooming, setIsZooming] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setIsZooming(false);

      setTimeout(() => {
        setCurrentIndex(nextIndex);
        setNextIndex((nextIndex + 1) % cityBackgrounds.length);
        setIsTransitioning(false);
        // Start zoom effect on new image
        setTimeout(() => setIsZooming(true), 100);
      }, 1500); // Transition duration
    }, 10000); // Change every 10 seconds for better appreciation

    return () => clearInterval(interval);
  }, [nextIndex]);

  const currentBg = cityBackgrounds[currentIndex];
  const nextBg = cityBackgrounds[nextIndex];

  return (
    <div className={`relative min-h-screen ${className}`}>
      {/* Current Background with Ken Burns zoom effect */}
      <div
        className={`fixed inset-0 z-0 transition-opacity duration-[1500ms] ease-in-out overflow-hidden ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <img
          src={currentBg.url}
          alt={currentBg.city}
          className={`w-full h-full object-cover transition-transform duration-[10000ms] ease-out ${
            isZooming ? 'scale-110' : 'scale-100'
          }`}
        />
      </div>

      {/* Next Background (for smooth transition) */}
      <div
        className={`fixed inset-0 z-0 transition-opacity duration-[1500ms] ease-in-out overflow-hidden ${
          isTransitioning ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <img
          src={nextBg.url}
          alt={nextBg.city}
          className="w-full h-full object-cover scale-100"
        />
      </div>

      {/* Overlay - adapts to theme */}
      <div className="fixed inset-0 z-[1] bg-overlay-dark transition-colors duration-300" />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* City indicator with globe icon */}
      <div
        className="fixed bottom-4 right-4 z-20 flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md text-[var(--text-primary)] text-sm font-medium border border-[var(--border-color)] shadow-lg transition-all duration-500"
        style={{ backgroundColor: 'var(--overlay-bg)' }}
      >
        <svg className="w-4 h-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className={`transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          {currentBg.city}
        </span>
      </div>
    </div>
  );
}
