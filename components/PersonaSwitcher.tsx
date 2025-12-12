'use client';

import { useState, useRef, useEffect } from 'react';
import { useAppState } from '../state/useAppState';
import { personas, type Persona } from '../lib/demoData';

export default function PersonaSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentPersona, setPersona } = useAppState();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentPersonaInfo = personas.find((p) => p.id === currentPersona);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (personaId: Persona) => {
    setPersona(personaId);
    setIsOpen(false);
  };

  const getPersonaColor = (id: Persona): string => {
    switch (id) {
      case 'strategy-leader':
        return 'from-teal-400 to-teal-600';
      case 'risk-officer':
        return 'from-amber-400 to-amber-600';
      case 'product-owner':
        return 'from-purple-400 to-purple-600';
      case 'admin':
        return 'from-magenta-400 to-magenta-600';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-3 py-2 bg-navy-700 hover:bg-navy-600 rounded-xl border border-navy-600 transition-colors"
      >
        <div
          className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getPersonaColor(
            currentPersona
          )} flex items-center justify-center text-white text-sm font-medium`}
        >
          {currentPersonaInfo?.avatar}
        </div>
        <div className="hidden md:block text-left">
          <div className="text-sm font-medium text-white">{currentPersonaInfo?.name}</div>
          <div className="text-xs text-gray-400">{currentPersonaInfo?.role}</div>
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-navy-700 rounded-xl border border-navy-600 shadow-xl overflow-hidden z-50">
          <div className="p-3 border-b border-navy-600">
            <span className="text-xs text-gray-400 uppercase tracking-wider">Switch Persona</span>
          </div>
          <div className="p-2">
            {personas.map((persona) => (
              <button
                key={persona.id}
                onClick={() => handleSelect(persona.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                  currentPersona === persona.id
                    ? 'bg-teal-500/10 border border-teal-500/30'
                    : 'hover:bg-navy-600'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getPersonaColor(
                    persona.id
                  )} flex items-center justify-center text-white font-medium`}
                >
                  {persona.avatar}
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium text-white">{persona.name}</div>
                  <div className="text-xs text-gray-400">{persona.role}</div>
                </div>
                {currentPersona === persona.id && (
                  <svg className="w-5 h-5 text-teal-400 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
