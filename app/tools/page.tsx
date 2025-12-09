'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  strategyToolsLibrary,
  toolCategories,
  getToolsByCategory,
  searchTools,
  getRelatedTools,
  complexityColors,
  planColors,
  type StrategyToolFull,
  type ToolCategory,
} from '../../lib/strategyToolsLibrary';
import { useAppState } from '../../state/useAppState';
import type { Plan } from '../../lib/users';

// Tool Card Component
function ToolCard({
  tool,
  userPlan,
  onSelect,
}: {
  tool: StrategyToolFull;
  userPlan: Plan;
  onSelect: (tool: StrategyToolFull) => void;
}) {
  const planHierarchy: Record<Plan, number> = { 'Free': 0, 'Starter': 1, 'Pro': 2, 'Enterprise': 3 };
  const hasAccess = planHierarchy[userPlan] >= planHierarchy[tool.requiredPlan];

  return (
    <div
      onClick={() => onSelect(tool)}
      className={`relative bg-slate-800/50 border rounded-xl p-5 cursor-pointer transition-all hover:bg-slate-800 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 ${
        hasAccess ? 'border-slate-700' : 'border-slate-700/50 opacity-75'
      }`}
    >
      {/* Plan Badge */}
      {tool.requiredPlan !== 'Free' && (
        <div className="absolute top-3 right-3">
          <span className={`text-xs px-2 py-1 rounded-full border ${planColors[tool.requiredPlan]}`}>
            {tool.requiredPlan}
          </span>
        </div>
      )}

      {/* Icon and Name */}
      <div className="flex items-start gap-3 mb-3">
        <span className="text-2xl">{tool.icon}</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white truncate pr-16">{tool.name}</h3>
          <p className="text-sm text-slate-400 mt-1 line-clamp-2">{tool.description}</p>
        </div>
      </div>

      {/* Metadata */}
      <div className="flex items-center gap-2 mt-4 flex-wrap">
        <span className={`text-xs px-2 py-1 rounded-full border ${complexityColors[tool.complexity]}`}>
          {tool.complexity}
        </span>
        <span className="text-xs text-slate-500">•</span>
        <span className="text-xs text-slate-400">{tool.estimatedTime}</span>
      </div>

      {/* Lock Overlay */}
      {!hasAccess && (
        <div className="absolute inset-0 bg-slate-900/50 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <span className="text-2xl">🔒</span>
            <p className="text-xs text-slate-400 mt-1">Upgrade to {tool.requiredPlan}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Tool Detail Modal
function ToolDetailModal({
  tool,
  userPlan,
  onClose,
  onSelectRelated,
}: {
  tool: StrategyToolFull;
  userPlan: Plan;
  onClose: () => void;
  onSelectRelated: (tool: StrategyToolFull) => void;
}) {
  const planHierarchy: Record<Plan, number> = { 'Free': 0, 'Starter': 1, 'Pro': 2, 'Enterprise': 3 };
  const hasAccess = planHierarchy[userPlan] >= planHierarchy[tool.requiredPlan];
  const relatedTools = getRelatedTools(tool.id);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-slate-900 border-b border-slate-700 p-6 flex items-start justify-between">
          <div className="flex items-start gap-4">
            <span className="text-4xl">{tool.icon}</span>
            <div>
              <h2 className="text-2xl font-bold text-white">{tool.name}</h2>
              <p className="text-slate-400 mt-1">{tool.category}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Badges */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className={`text-sm px-3 py-1 rounded-full border ${complexityColors[tool.complexity]}`}>
              {tool.complexity}
            </span>
            <span className={`text-sm px-3 py-1 rounded-full border ${planColors[tool.requiredPlan]}`}>
              {tool.requiredPlan === 'Free' ? 'Free Access' : `${tool.requiredPlan} Plan Required`}
            </span>
            <span className="text-sm text-slate-400 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {tool.estimatedTime}
            </span>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Overview</h3>
            <p className="text-slate-300 leading-relaxed">{tool.longDescription}</p>
          </div>

          {/* Deliverable */}
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <h4 className="text-sm font-semibold text-blue-400 mb-1">Deliverable</h4>
            <p className="text-slate-300">{tool.deliverable}</p>
          </div>

          {/* Best For */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Best For</h3>
            <div className="flex flex-wrap gap-2">
              {tool.bestFor.map((role, idx) => (
                <span key={idx} className="text-sm bg-slate-800 text-slate-300 px-3 py-1 rounded-full">
                  {role}
                </span>
              ))}
            </div>
          </div>

          {/* Key Questions */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Key Questions Answered</h3>
            <ul className="space-y-2">
              {tool.keyQuestions.map((question, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-300">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>{question}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Related Tools */}
          {relatedTools.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Related Tools</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {relatedTools.map(relatedTool => (
                  <button
                    key={relatedTool.id}
                    onClick={() => onSelectRelated(relatedTool)}
                    className="flex items-center gap-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-blue-500/50 rounded-lg p-3 transition-all text-left"
                  >
                    <span className="text-xl">{relatedTool.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{relatedTool.name}</p>
                      <p className="text-xs text-slate-400">{relatedTool.category}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-4 border-t border-slate-700">
            {hasAccess ? (
              <Link
                href="/workspace"
                className="w-full block text-center bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Launch Tool in Workspace
              </Link>
            ) : (
              <div className="text-center">
                <div className="bg-slate-800 rounded-lg p-4 mb-4">
                  <span className="text-3xl">🔒</span>
                  <p className="text-slate-300 mt-2">
                    This tool requires a <span className="text-blue-400 font-medium">{tool.requiredPlan}</span> plan
                  </p>
                </div>
                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium py-3 px-6 rounded-lg transition-all">
                  Upgrade to {tool.requiredPlan}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Category Filter Button
function CategoryButton({
  category,
  isActive,
  onClick,
  count,
}: {
  category: typeof toolCategories[number] | null;
  isActive: boolean;
  onClick: () => void;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all whitespace-nowrap ${
        isActive
          ? 'bg-blue-600/20 border-blue-500/50 text-blue-400'
          : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-600 hover:bg-slate-800'
      }`}
    >
      {category ? (
        <>
          <span>{category.icon}</span>
          <span className="text-sm font-medium">{category.label}</span>
        </>
      ) : (
        <span className="text-sm font-medium">All Tools</span>
      )}
      <span className={`text-xs px-1.5 py-0.5 rounded-full ${isActive ? 'bg-blue-500/30' : 'bg-slate-700'}`}>
        {count}
      </span>
    </button>
  );
}

// Main Page Component
export default function StrategyToolsPage() {
  const { currentUser } = useAppState();
  const userPlan = currentUser?.plan || 'Free';

  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTool, setSelectedTool] = useState<StrategyToolFull | null>(null);
  const [showAccessibleOnly, setShowAccessibleOnly] = useState(false);

  // Filter tools based on search, category, and access
  const filteredTools = useMemo(() => {
    let tools = strategyToolsLibrary;

    // Apply search filter
    if (searchQuery.trim()) {
      tools = searchTools(searchQuery);
    }

    // Apply category filter
    if (selectedCategory) {
      tools = tools.filter(t => t.category === selectedCategory);
    }

    // Apply access filter
    if (showAccessibleOnly) {
      const planHierarchy: Record<Plan, number> = { 'Free': 0, 'Starter': 1, 'Pro': 2, 'Enterprise': 3 };
      tools = tools.filter(t => planHierarchy[userPlan] >= planHierarchy[t.requiredPlan]);
    }

    return tools;
  }, [searchQuery, selectedCategory, showAccessibleOnly, userPlan]);

  // Count tools by category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: strategyToolsLibrary.length };
    toolCategories.forEach(cat => {
      counts[cat.id] = getToolsByCategory(cat.id).length;
    });
    return counts;
  }, []);

  // Stats
  const stats = useMemo(() => {
    const planHierarchy: Record<Plan, number> = { 'Free': 0, 'Starter': 1, 'Pro': 2, 'Enterprise': 3 };
    const accessible = strategyToolsLibrary.filter(t => planHierarchy[userPlan] >= planHierarchy[t.requiredPlan]).length;
    return {
      total: strategyToolsLibrary.length,
      accessible,
      categories: toolCategories.length,
    };
  }, [userPlan]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-2xl font-bold text-white">
                Ambi<span className="text-blue-500">Sight</span>
              </Link>
              <span className="text-slate-500">/</span>
              <h1 className="text-lg font-medium text-slate-300">Strategy Tools Library</h1>
            </div>
            <div className="flex items-center gap-3">
              {currentUser && (
                <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-lg">
                  <span className="text-sm text-slate-300">{currentUser.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${planColors[currentUser.plan]}`}>
                    {currentUser.plan}
                  </span>
                </div>
              )}
              <Link
                href="/workspace"
                className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                Open Workspace
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-4">
              50+ Strategic Decision Tools
            </h2>
            <p className="text-lg text-slate-400 mb-8">
              World-class strategy frameworks and tools used by leading organizations.
              From diagnosis to execution, find the right tool for every strategic challenge.
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">{stats.total}</div>
                <div className="text-sm text-slate-400">Tools</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">{stats.accessible}</div>
                <div className="text-sm text-slate-400">Available to You</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">{stats.categories}</div>
                <div className="text-sm text-slate-400">Categories</div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search tools by name, category, or role..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Categories</h3>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showAccessibleOnly}
                onChange={e => setShowAccessibleOnly(e.target.checked)}
                className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
              />
              <span className="text-sm text-slate-400">Show accessible only</span>
            </label>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700">
            <CategoryButton
              category={null}
              isActive={selectedCategory === null}
              onClick={() => setSelectedCategory(null)}
              count={categoryCounts.all}
            />
            {toolCategories.map(cat => (
              <CategoryButton
                key={cat.id}
                category={cat}
                isActive={selectedCategory === cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                count={categoryCounts[cat.id]}
              />
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-slate-400">
            Showing <span className="text-white font-medium">{filteredTools.length}</span> tools
            {selectedCategory && (
              <span> in <span className="text-blue-400">{selectedCategory}</span></span>
            )}
            {searchQuery && (
              <span> matching &quot;<span className="text-blue-400">{searchQuery}</span>&quot;</span>
            )}
          </p>
        </div>

        {/* Tools Grid */}
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTools.map(tool => (
              <ToolCard
                key={tool.id}
                tool={tool}
                userPlan={userPlan}
                onSelect={setSelectedTool}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <span className="text-4xl">🔍</span>
            <h3 className="text-xl font-medium text-white mt-4">No tools found</h3>
            <p className="text-slate-400 mt-2">
              Try adjusting your search or filters
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory(null);
                setShowAccessibleOnly(false);
              }}
              className="mt-4 text-blue-400 hover:text-blue-300 text-sm"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Category Descriptions */}
        {!searchQuery && !selectedCategory && (
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-white mb-8 text-center">Tool Categories</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {toolCategories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className="text-left bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-blue-500/50 rounded-xl p-6 transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{cat.icon}</span>
                    <h4 className="text-lg font-semibold text-white">{cat.label}</h4>
                  </div>
                  <p className="text-slate-400 text-sm">{cat.description}</p>
                  <div className="mt-4 text-blue-400 text-sm font-medium">
                    {categoryCounts[cat.id]} tools →
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/20 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-3">Need Help Choosing?</h3>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            Not sure which tool is right for your strategic challenge? Our AI Advisor can recommend
            the best tools based on your specific situation and objectives.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/advisor"
              className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-3 rounded-lg transition-colors"
            >
              Ask AI Advisor
            </Link>
            <Link
              href="/workspace"
              className="bg-slate-800 hover:bg-slate-700 text-white font-medium px-6 py-3 rounded-lg border border-slate-700 transition-colors"
            >
              Start Diagnosis
            </Link>
          </div>
        </div>
      </div>

      {/* Tool Detail Modal */}
      {selectedTool && (
        <ToolDetailModal
          tool={selectedTool}
          userPlan={userPlan}
          onClose={() => setSelectedTool(null)}
          onSelectRelated={tool => setSelectedTool(tool)}
        />
      )}
    </div>
  );
}
