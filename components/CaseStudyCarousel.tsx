'use client';

import { useRef, useState, useEffect } from 'react';
import { CaseStudy } from '@/lib/demoData';

interface CaseStudyCarouselProps {
  caseStudies: CaseStudy[];
}

const accentColors = {
  teal: {
    border: 'border-teal-500/30',
    bg: 'bg-teal-500/10',
    text: 'text-teal-400',
    glow: 'hover:shadow-teal-500/20',
    pill: 'bg-teal-500/20 text-teal-400',
  },
  amber: {
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    glow: 'hover:shadow-amber-500/20',
    pill: 'bg-amber-500/20 text-amber-400',
  },
  magenta: {
    border: 'border-fuchsia-500/30',
    bg: 'bg-fuchsia-500/10',
    text: 'text-fuchsia-400',
    glow: 'hover:shadow-fuchsia-500/20',
    pill: 'bg-fuchsia-500/20 text-fuchsia-400',
  },
  lime: {
    border: 'border-lime-500/30',
    bg: 'bg-lime-500/10',
    text: 'text-lime-400',
    glow: 'hover:shadow-lime-500/20',
    pill: 'bg-lime-500/20 text-lime-400',
  },
  purple: {
    border: 'border-purple-500/30',
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    glow: 'hover:shadow-purple-500/20',
    pill: 'bg-purple-500/20 text-purple-400',
  },
};

function CaseStudyCard({ study }: { study: CaseStudy }) {
  const colors = accentColors[study.accentColor];
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`flex-shrink-0 w-[400px] bg-gradient-to-br from-navy-700/80 to-navy-800/90 rounded-xl border ${colors.border} p-6 transition-all duration-300 hover:scale-[1.02] ${colors.glow} hover:shadow-xl cursor-pointer`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`text-3xl ${colors.bg} p-2 rounded-lg`}>
            {study.logo}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{study.company}</h3>
            <span className="text-xs text-gray-400">{study.industry} • {study.year}</span>
          </div>
        </div>
      </div>

      {/* Title */}
      <h4 className={`text-sm font-semibold ${colors.text} mb-3`}>
        {study.title}
      </h4>

      {/* Challenge & Strategy */}
      <div className="space-y-3 mb-4">
        <div>
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Challenge</span>
          <p className={`text-xs text-gray-300 mt-1 ${isExpanded ? '' : 'line-clamp-2'}`}>
            {study.challenge}
          </p>
        </div>
        <div>
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Strategy</span>
          <p className={`text-xs text-gray-300 mt-1 ${isExpanded ? '' : 'line-clamp-2'}`}>
            {study.strategy}
          </p>
        </div>
        {isExpanded && (
          <div>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Outcome</span>
            <p className="text-xs text-gray-300 mt-1">
              {study.outcome}
            </p>
          </div>
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {study.keyMetrics.map((metric, idx) => (
          <div key={idx} className={`${colors.bg} rounded-lg p-2 text-center`}>
            <div className={`text-sm font-bold ${colors.text}`}>{metric.value}</div>
            <div className="text-[10px] text-gray-400">{metric.label}</div>
            <div className="text-[10px] text-green-400">{metric.improvement}</div>
          </div>
        ))}
      </div>

      {/* Strategic Pillars */}
      <div className="flex flex-wrap gap-1.5">
        {study.strategicPillars.slice(0, isExpanded ? undefined : 3).map((pillar, idx) => (
          <span
            key={idx}
            className={`text-[10px] px-2 py-1 rounded-full ${colors.pill}`}
          >
            {pillar}
          </span>
        ))}
        {!isExpanded && study.strategicPillars.length > 3 && (
          <span className="text-[10px] px-2 py-1 rounded-full bg-navy-600 text-gray-400">
            +{study.strategicPillars.length - 3}
          </span>
        )}
      </div>

      {/* Expand hint */}
      <div className="mt-3 text-center">
        <span className="text-[10px] text-gray-500">
          {isExpanded ? 'Click to collapse' : 'Click to expand'}
        </span>
      </div>
    </div>
  );
}

export default function CaseStudyCarousel({ caseStudies }: CaseStudyCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      setIsAutoScrolling(false);
      const scrollAmount = 420;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Auto-scroll effect
  useEffect(() => {
    if (!isAutoScrolling) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

        // If we've reached the end, scroll back to start
        if (scrollLeft >= scrollWidth - clientWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: 1, behavior: 'auto' });
        }
      }
    }, 30);

    return () => clearInterval(interval);
  }, [isAutoScrolling]);

  // Resume auto-scroll after 10 seconds of inactivity
  useEffect(() => {
    if (isAutoScrolling) return;

    const timeout = setTimeout(() => {
      setIsAutoScrolling(true);
    }, 10000);

    return () => clearTimeout(timeout);
  }, [isAutoScrolling]);

  return (
    <div className="relative">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="text-2xl">📊</span>
            Strategic Excellence Case Studies
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            World-class examples of strategic management and transformation
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`p-2 rounded-lg transition-all ${
              canScrollLeft
                ? 'bg-navy-600 hover:bg-navy-500 text-white'
                : 'bg-navy-700 text-gray-600 cursor-not-allowed'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`p-2 rounded-lg transition-all ${
              canScrollRight
                ? 'bg-navy-600 hover:bg-navy-500 text-white'
                : 'bg-navy-700 text-gray-600 cursor-not-allowed'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Auto-scroll indicator */}
      <div className="absolute top-0 right-24 flex items-center gap-2">
        <span className={`text-xs ${isAutoScrolling ? 'text-teal-400' : 'text-gray-500'}`}>
          {isAutoScrolling ? '● Auto-scrolling' : '○ Paused'}
        </span>
      </div>

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        onScroll={checkScrollButtons}
        onMouseEnter={() => setIsAutoScrolling(false)}
        onMouseLeave={() => setIsAutoScrolling(true)}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-track-navy-700 scrollbar-thumb-navy-500 scroll-smooth"
        style={{ scrollbarWidth: 'thin' }}
      >
        {caseStudies.map((study) => (
          <CaseStudyCard key={study.id} study={study} />
        ))}
      </div>

      {/* Gradient Fades */}
      <div className="absolute left-0 top-16 bottom-4 w-8 bg-gradient-to-r from-[#0B0B0F] to-transparent pointer-events-none" />
      <div className="absolute right-0 top-16 bottom-4 w-8 bg-gradient-to-l from-[#0B0B0F] to-transparent pointer-events-none" />
    </div>
  );
}
