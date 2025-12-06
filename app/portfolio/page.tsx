'use client';

import { useState } from 'react';
import AppShell from '@/components/AppShell';
import PageContainer from '@/components/PageContainer';
import PortfolioCards from '@/components/PortfolioCards';
import { initiatives } from '@/lib/demoData';

export default function PortfolioPage() {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <AppShell>
      <PageContainer
        title="Portfolio"
        subtitle="Strategic assets and initiative tracking"
      >
        <PortfolioCards
          initiatives={initiatives}
          onAddClick={() => setShowAddModal(true)}
        />

        {/* Add Modal */}
        {showAddModal && (
          <>
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setShowAddModal(false)}
            />
            <div className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg bg-navy-800 rounded-2xl border border-navy-600 z-50 overflow-hidden animate-scale-in flex flex-col max-h-[90vh]">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-navy-600">
                <h2 className="text-xl font-bold text-white">Add Portfolio Item</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-navy-700 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Initiative Name
                  </label>
                  <input
                    type="text"
                    disabled
                    placeholder="Enter initiative name"
                    className="w-full px-4 py-3 bg-navy-700 border border-navy-600 rounded-lg text-gray-400 placeholder-gray-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Portfolio
                  </label>
                  <select
                    disabled
                    className="w-full px-4 py-3 bg-navy-700 border border-navy-600 rounded-lg text-gray-400 cursor-not-allowed"
                  >
                    <option>Select portfolio</option>
                    <option>Digital Transformation</option>
                    <option>Growth Markets</option>
                    <option>Infrastructure</option>
                    <option>Operations</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Estimated Value ($)
                    </label>
                    <input
                      type="number"
                      disabled
                      placeholder="0"
                      className="w-full px-4 py-3 bg-navy-700 border border-navy-600 rounded-lg text-gray-400 placeholder-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Risk Score (0-100)
                    </label>
                    <input
                      type="number"
                      disabled
                      placeholder="50"
                      className="w-full px-4 py-3 bg-navy-700 border border-navy-600 rounded-lg text-gray-400 placeholder-gray-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Time Horizon
                  </label>
                  <select
                    disabled
                    className="w-full px-4 py-3 bg-navy-700 border border-navy-600 rounded-lg text-gray-400 cursor-not-allowed"
                  >
                    <option>Select horizon</option>
                    <option>0-6 months</option>
                    <option>6-12 months</option>
                    <option>12-18 months</option>
                    <option>18-24 months</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Owner
                  </label>
                  <input
                    type="text"
                    disabled
                    placeholder="Assign owner"
                    className="w-full px-4 py-3 bg-navy-700 border border-navy-600 rounded-lg text-gray-400 placeholder-gray-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    disabled
                    rows={3}
                    placeholder="Brief description of the initiative"
                    className="w-full px-4 py-3 bg-navy-700 border border-navy-600 rounded-lg text-gray-400 placeholder-gray-500 resize-none cursor-not-allowed"
                  />
                </div>

                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                  <div className="flex items-center gap-2 text-amber-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-medium">Demo Mode</span>
                  </div>
                  <p className="text-sm text-amber-400/80 mt-1">
                    Form fields are disabled in this demo. Full functionality coming soon.
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-navy-600 flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-navy-700 text-gray-300 rounded-lg hover:bg-navy-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  disabled
                  className="px-4 py-2 bg-teal-500/50 text-white/50 rounded-lg cursor-not-allowed"
                >
                  Add Item
                </button>
              </div>
            </div>
          </>
        )}
      </PageContainer>
    </AppShell>
  );
}
