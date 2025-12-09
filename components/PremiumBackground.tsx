'use client';

import { useState, useEffect, useRef } from 'react';

// Premium global financial centers with night skylines
const premiumCities = [
  {
    url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1920&h=1080&fit=crop&q=80',
    city: 'Manhattan at Dusk',
    accent: 'from-amber-500/20 to-orange-500/10',
  },
  {
    url: 'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=1920&h=1080&fit=crop&q=80',
    city: 'Singapore Marina Bay',
    accent: 'from-teal-500/20 to-cyan-500/10',
  },
  {
    url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1920&h=1080&fit=crop&q=80',
    city: 'Tokyo Skyline',
    accent: 'from-purple-500/20 to-pink-500/10',
  },
  {
    url: 'https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=1920&h=1080&fit=crop&q=80',
    city: 'New York Night',
    accent: 'from-blue-500/20 to-indigo-500/10',
  },
  {
    url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&h=1080&fit=crop&q=80',
    city: 'Hong Kong Harbor',
    accent: 'from-rose-500/20 to-red-500/10',
  },
  {
    url: 'https://images.unsplash.com/photo-1496568816309-51d7c20e3b21?w=1920&h=1080&fit=crop&q=80',
    city: 'Dubai Downtown',
    accent: 'from-amber-500/20 to-yellow-500/10',
  },
];

interface PremiumBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export default function PremiumBackground({ children, className = '' }: PremiumBackgroundProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax effect on mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Background rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);

      setTimeout(() => {
        setCurrentIndex(nextIndex);
        setNextIndex((nextIndex + 1) % premiumCities.length);
        setIsTransitioning(false);
      }, 2000);
    }, 12000);

    return () => clearInterval(interval);
  }, [nextIndex]);

  const currentBg = premiumCities[currentIndex];
  const nextBg = premiumCities[nextIndex];

  // Subtle parallax offset
  const offsetX = (mousePosition.x - 0.5) * 20;
  const offsetY = (mousePosition.y - 0.5) * 20;

  return (
    <div ref={containerRef} className={`relative min-h-screen overflow-hidden ${className}`}>
      {/* Base layer - City skyline with parallax */}
      <div
        className={`fixed inset-0 z-0 transition-opacity duration-[2000ms] ease-in-out`}
        style={{
          transform: `translate(${offsetX}px, ${offsetY}px) scale(1.1)`,
          transition: 'transform 0.3s ease-out',
        }}
      >
        <img
          src={currentBg.url}
          alt={currentBg.city}
          className={`w-full h-full object-cover transition-all duration-[12000ms] ease-out ${
            !isTransitioning ? 'scale-110 opacity-100' : 'scale-100 opacity-0'
          }`}
          style={{ filter: 'brightness(0.7) saturate(1.2)' }}
        />
        <img
          src={nextBg.url}
          alt={nextBg.city}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] ${
            isTransitioning ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ filter: 'brightness(0.7) saturate(1.2)' }}
        />
      </div>

      {/* Ultra-transparent gradient overlay */}
      <div className="fixed inset-0 z-[1] bg-gradient-to-br from-navy-900/80 via-navy-800/70 to-navy-900/80" />

      {/* Animated mesh gradient layer */}
      <div
        className={`fixed inset-0 z-[2] opacity-30 bg-gradient-to-br ${currentBg.accent} transition-all duration-[2000ms]`}
        style={{
          backgroundSize: '400% 400%',
          animation: 'gradientShift 15s ease infinite',
        }}
      />

      {/* Floating orbs */}
      <div className="fixed inset-0 z-[3] overflow-hidden pointer-events-none">
        <div
          className="absolute w-[600px] h-[600px] rounded-full blur-[120px] opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(45, 212, 191, 0.4) 0%, transparent 70%)',
            top: `${30 + mousePosition.y * 10}%`,
            left: `${10 + mousePosition.x * 10}%`,
            transition: 'top 0.5s ease-out, left 0.5s ease-out',
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full blur-[100px] opacity-15"
          style={{
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 70%)',
            top: `${50 + mousePosition.y * -10}%`,
            right: `${10 + mousePosition.x * -10}%`,
            transition: 'top 0.5s ease-out, right 0.5s ease-out',
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full blur-[80px] opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.4) 0%, transparent 70%)',
            bottom: `${20 + mousePosition.y * 5}%`,
            left: `${40 + mousePosition.x * 5}%`,
            transition: 'bottom 0.5s ease-out, left 0.5s ease-out',
          }}
        />
      </div>

      {/* Subtle grid pattern overlay */}
      <div
        className="fixed inset-0 z-[4] opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Animated scan lines (very subtle) */}
      <div
        className="fixed inset-0 z-[5] opacity-[0.02] pointer-events-none overflow-hidden"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
          animation: 'scanMove 8s linear infinite',
        }}
      />

      {/* Vignette effect */}
      <div
        className="fixed inset-0 z-[6] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, transparent 50%, rgba(0,0,0,0.4) 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Premium city indicator */}
      <div
        className="fixed bottom-6 right-6 z-20 flex items-center gap-3 px-5 py-3 rounded-2xl backdrop-blur-xl text-white text-sm font-medium border border-white/10 shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        }}
      >
        <div className="relative">
          <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          <div className="absolute inset-0 w-2 h-2 rounded-full bg-teal-400 animate-ping opacity-75" />
        </div>
        <span className={`transition-all duration-700 ${isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
          {currentBg.city}
        </span>
        <svg className="w-4 h-4 text-teal-400 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes scanMove {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
      `}</style>
    </div>
  );
}
