'use client';

import { useState, useRef, useEffect } from 'react';
import {
  type LandingCaseStudy,
  type RoleFocus,
  landingCaseStudies,
  roleFocusColors,
  roleFocusLabels,
  filterCaseStudiesByRole,
} from '@/lib/caseStudies';

// Case Study Detail Modal
function CaseStudyModal({
  study,
  isOpen,
  onClose,
}: {
  study: LandingCaseStudy | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen || !study) return null;

  const roleColors = roleFocusColors[study.roleFocus];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-navy-800 rounded-2xl border border-navy-600 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-navy-600 bg-gradient-to-r from-navy-800 to-navy-700">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-1 text-xs rounded-full ${roleColors.bg} ${roleColors.text} ${roleColors.border} border`}>
                  {study.roleFocus}
                </span>
                <span className="text-xs text-gray-400">{study.industry}</span>
                <span className="text-xs text-gray-500">-</span>
                <span className="text-xs text-gray-400">{study.region}</span>
              </div>
              <h2 className="text-xl font-semibold text-white">{study.title}</h2>
              <p className="text-sm text-gray-400 mt-1">{study.company}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-navy-600 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 overflow-y-auto max-h-[60vh]">
          {/* Headline Metric */}
          <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-teal-500/10 to-purple-500/10 border border-teal-500/20">
            <div className="text-center">
              <div className="text-3xl font-bold text-gradient mb-1">{study.headlineMetric}</div>
              <div className="text-sm text-gray-400">Key Result</div>
            </div>
          </div>

          {/* Summary */}
          <p className="text-gray-300 mb-6">{study.summary}</p>

          {/* Challenge */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider mb-2">Challenge</h3>
            <p className="text-gray-400 text-sm">{study.challenge}</p>
          </div>

          {/* Solution */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-teal-400 uppercase tracking-wider mb-2">Solution</h3>
            <p className="text-gray-400 text-sm">{study.solution}</p>
          </div>

          {/* Outcomes */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-lime-400 uppercase tracking-wider mb-2">Outcomes</h3>
            <ul className="space-y-2">
              {study.outcomes.map((outcome, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-400">
                  <svg className="w-4 h-4 text-lime-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {outcome}
                </li>
              ))}
            </ul>
          </div>

          {/* Timeframe */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Delivered in {study.timeframe}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-navy-600 bg-navy-800/50">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Want similar results? Talk to our strategy team.
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-teal-500/20 text-teal-400 text-sm font-medium rounded-lg hover:bg-teal-500/30 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Case Study Card
function CaseStudyCard({
  study,
  onClick,
}: {
  study: LandingCaseStudy;
  onClick: () => void;
}) {
  const roleColors = roleFocusColors[study.roleFocus];

  return (
    <button
      onClick={onClick}
      className="flex-shrink-0 w-[340px] p-5 rounded-xl bg-gradient-to-br from-navy-700/80 to-navy-800/90 border border-navy-600 hover:border-teal-500/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-teal-500/10 text-left group"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${roleColors.bg} ${roleColors.text} ${roleColors.border} border`}>
          {study.roleFocus}
        </span>
        <span className="text-[10px] text-gray-500">{study.industry}</span>
      </div>

      {/* Title */}
      <h3 className="text-white font-semibold mb-2 group-hover:text-teal-400 transition-colors line-clamp-2">
        {study.title}
      </h3>

      {/* Summary */}
      <p className="text-xs text-gray-400 mb-4 line-clamp-2">{study.summary}</p>

      {/* Headline Metric */}
      <div className="flex items-center justify-between">
        <div className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-teal-500/20 to-purple-500/20 border border-teal-500/20">
          <span className="text-sm font-bold text-gradient">{study.headlineMetric}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {study.region}
        </div>
      </div>

      {/* Read More */}
      <div className="mt-3 flex items-center gap-1 text-xs text-teal-400 opacity-0 group-hover:opacity-100 transition-opacity">
        <span>Read case study</span>
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
}

// Filter Chips
function FilterChips({
  activeFilter,
  onFilterChange,
}: {
  activeFilter: RoleFocus | 'All';
  onFilterChange: (filter: RoleFocus | 'All') => void;
}) {
  const filters: (RoleFocus | 'All')[] = ['All', 'CSO', 'CRO', 'CTO', 'Ops'];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {filters.map((filter) => {
        const isActive = activeFilter === filter;
        const colors = filter === 'All'
          ? { bg: 'bg-teal-500/20', text: 'text-teal-400', border: 'border-teal-500/30' }
          : roleFocusColors[filter];

        return (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
              isActive
                ? `${colors.bg} ${colors.text} ${colors.border}`
                : 'bg-navy-700/50 text-gray-400 border-navy-600 hover:border-gray-500'
            }`}
          >
            {filter === 'All' ? 'All Stories' : filter}
          </button>
        );
      })}
    </div>
  );
}

// Main Component
export default function LandingCaseStudies() {
  const [activeFilter, setActiveFilter] = useState<RoleFocus | 'All'>('All');
  const [selectedStudy, setSelectedStudy] = useState<LandingCaseStudy | null>(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const filteredStudies = filterCaseStudiesByRole(activeFilter);

  // Check scroll buttons state
  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // Manual scroll
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      setIsAutoScrolling(false);
      const scrollAmount = 360;
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

        if (scrollLeft >= scrollWidth - clientWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: 1, behavior: 'auto' });
        }
      }
    }, 30);

    return () => clearInterval(interval);
  }, [isAutoScrolling]);

  // Resume auto-scroll after inactivity
  useEffect(() => {
    if (isAutoScrolling) return;

    const timeout = setTimeout(() => {
      setIsAutoScrolling(true);
    }, 8000);

    return () => clearTimeout(timeout);
  }, [isAutoScrolling]);

  // Reset scroll when filter changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
    checkScrollButtons();
  }, [activeFilter]);

  return (
    <section className="py-16 px-6 border-t border-navy-700 bg-gradient-to-b from-navy-800/30 to-transparent">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Real Case Stories
            </h2>
            <p className="text-gray-400">
              See how organizations transform their strategic decision-making with Ambi-Sight
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
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="mb-6 flex items-center justify-between">
          <FilterChips activeFilter={activeFilter} onFilterChange={setActiveFilter} />
          <span className={`text-xs ${isAutoScrolling ? 'text-teal-400' : 'text-gray-500'}`}>
            {isAutoScrolling ? '● Auto-scrolling' : '○ Paused'}
          </span>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div
            ref={scrollRef}
            onScroll={checkScrollButtons}
            onMouseEnter={() => setIsAutoScrolling(false)}
            onMouseLeave={() => setIsAutoScrolling(true)}
            className="flex gap-4 overflow-x-auto pb-4 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {filteredStudies.map((study) => (
              <CaseStudyCard
                key={study.id}
                study={study}
                onClick={() => setSelectedStudy(study)}
              />
            ))}
          </div>

          {/* Gradient Fades */}
          <div className="absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-[#0B0B0F] to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-[#0B0B0F] to-transparent pointer-events-none" />
        </div>

        {/* Stats Row */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: '150+', label: 'Organizations Transformed' },
            { value: '23%', label: 'Avg. Risk Reduction' },
            { value: '$2.4B', label: 'Value Created' },
            { value: '94%', label: 'Client Satisfaction' },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-4 rounded-xl bg-navy-700/30 border border-navy-600">
              <div className="text-2xl font-bold text-gradient mb-1">{stat.value}</div>
              <div className="text-xs text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Case Study Modal */}
      <CaseStudyModal
        study={selectedStudy}
        isOpen={!!selectedStudy}
        onClose={() => setSelectedStudy(null)}
      />
    </section>
  );
}
