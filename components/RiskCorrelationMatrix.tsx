'use client';

import React, { useState, useMemo } from 'react';

interface RiskFactor {
  id: string;
  name: string;
  shortName: string;
  category: 'market' | 'operational' | 'financial' | 'regulatory' | 'technology';
  currentLevel: number; // 0-100
  trend: 'increasing' | 'stable' | 'decreasing';
}

interface RiskCorrelation {
  factor1: string;
  factor2: string;
  correlation: number; // -1 to 1
  description: string;
}

const riskFactors: RiskFactor[] = [
  { id: 'market-volatility', name: 'Market Volatility', shortName: 'MKT', category: 'market', currentLevel: 65, trend: 'increasing' },
  { id: 'supply-chain', name: 'Supply Chain Disruption', shortName: 'SCH', category: 'operational', currentLevel: 45, trend: 'stable' },
  { id: 'cyber-security', name: 'Cyber Security Threats', shortName: 'CYB', category: 'technology', currentLevel: 72, trend: 'increasing' },
  { id: 'talent-shortage', name: 'Talent Shortage', shortName: 'TAL', category: 'operational', currentLevel: 58, trend: 'increasing' },
  { id: 'regulatory-change', name: 'Regulatory Changes', shortName: 'REG', category: 'regulatory', currentLevel: 40, trend: 'stable' },
  { id: 'currency-risk', name: 'Currency Fluctuation', shortName: 'FX', category: 'financial', currentLevel: 55, trend: 'decreasing' },
  { id: 'competition', name: 'Competitive Pressure', shortName: 'CMP', category: 'market', currentLevel: 68, trend: 'increasing' },
  { id: 'tech-obsolescence', name: 'Technology Obsolescence', shortName: 'TEC', category: 'technology', currentLevel: 48, trend: 'stable' },
];

const correlations: RiskCorrelation[] = [
  { factor1: 'market-volatility', factor2: 'currency-risk', correlation: 0.82, description: 'Market instability strongly drives currency fluctuations' },
  { factor1: 'market-volatility', factor2: 'competition', correlation: 0.65, description: 'Volatile markets intensify competitive dynamics' },
  { factor1: 'supply-chain', factor2: 'currency-risk', correlation: 0.45, description: 'Supply costs affected by currency changes' },
  { factor1: 'cyber-security', factor2: 'tech-obsolescence', correlation: 0.58, description: 'Older tech systems are more vulnerable' },
  { factor1: 'cyber-security', factor2: 'regulatory-change', correlation: 0.72, description: 'Cyber incidents drive regulatory responses' },
  { factor1: 'talent-shortage', factor2: 'cyber-security', correlation: 0.55, description: 'Security talent gaps increase vulnerability' },
  { factor1: 'talent-shortage', factor2: 'tech-obsolescence', correlation: 0.48, description: 'Skills gaps slow technology adoption' },
  { factor1: 'regulatory-change', factor2: 'market-volatility', correlation: 0.35, description: 'Policy uncertainty affects market sentiment' },
  { factor1: 'competition', factor2: 'talent-shortage', correlation: 0.62, description: 'Competition for talent intensifies' },
  { factor1: 'competition', factor2: 'tech-obsolescence', correlation: 0.70, description: 'Competitive pressure drives tech investment needs' },
  { factor1: 'supply-chain', factor2: 'regulatory-change', correlation: 0.38, description: 'Trade policies impact supply chains' },
  { factor1: 'market-volatility', factor2: 'supply-chain', correlation: 0.52, description: 'Market disruptions cascade to supply chains' },
];

const categoryColors: Record<RiskFactor['category'], { bg: string; text: string; border: string }> = {
  market: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
  operational: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' },
  financial: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
  regulatory: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
  technology: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
};

function getCorrelationColor(correlation: number): string {
  const absCorr = Math.abs(correlation);
  if (absCorr >= 0.7) return correlation > 0 ? 'bg-red-500' : 'bg-blue-500';
  if (absCorr >= 0.5) return correlation > 0 ? 'bg-orange-500' : 'bg-cyan-500';
  if (absCorr >= 0.3) return correlation > 0 ? 'bg-yellow-500' : 'bg-teal-500';
  return 'bg-gray-600';
}

function getCorrelation(factor1: string, factor2: string): RiskCorrelation | undefined {
  return correlations.find(
    c =>
      (c.factor1 === factor1 && c.factor2 === factor2) ||
      (c.factor1 === factor2 && c.factor2 === factor1)
  );
}

export default function RiskCorrelationMatrix() {
  const [selectedCell, setSelectedCell] = useState<{ row: string; col: string } | null>(null);
  const [hoveredFactor, setHoveredFactor] = useState<string | null>(null);
  const [showLabels, setShowLabels] = useState(true);

  const selectedCorrelation = useMemo(() => {
    if (!selectedCell) return null;
    return getCorrelation(selectedCell.row, selectedCell.col);
  }, [selectedCell]);

  const connectedFactors = useMemo(() => {
    if (!hoveredFactor) return new Set<string>();
    const connected = new Set<string>();
    correlations.forEach(c => {
      if (c.factor1 === hoveredFactor) connected.add(c.factor2);
      if (c.factor2 === hoveredFactor) connected.add(c.factor1);
    });
    return connected;
  }, [hoveredFactor]);

  // Calculate risk clusters
  const riskClusters = useMemo(() => {
    const clusters: { factors: string[]; avgCorrelation: number; riskLevel: string }[] = [];

    // Simple clustering by high correlations
    const highCorr = correlations.filter(c => Math.abs(c.correlation) >= 0.6);
    const factorGroups = new Map<string, Set<string>>();

    highCorr.forEach(c => {
      const group1 = factorGroups.get(c.factor1) || new Set([c.factor1]);
      const group2 = factorGroups.get(c.factor2) || new Set([c.factor2]);
      const merged = new Set([...group1, ...group2]);
      merged.forEach(f => factorGroups.set(f, merged));
    });

    const uniqueGroups = new Set<Set<string>>();
    factorGroups.forEach(group => uniqueGroups.add(group));

    uniqueGroups.forEach(group => {
      const factors = Array.from(group);
      if (factors.length >= 2) {
        let totalCorr = 0;
        let count = 0;
        factors.forEach((f1, i) => {
          factors.slice(i + 1).forEach(f2 => {
            const corr = getCorrelation(f1, f2);
            if (corr) {
              totalCorr += Math.abs(corr.correlation);
              count++;
            }
          });
        });
        const avgCorr = count > 0 ? totalCorr / count : 0;
        const riskLevel = avgCorr >= 0.7 ? 'Critical' : avgCorr >= 0.5 ? 'High' : 'Moderate';
        clusters.push({ factors, avgCorrelation: avgCorr, riskLevel });
      }
    });

    return clusters.sort((a, b) => b.avgCorrelation - a.avgCorrelation);
  }, []);

  return (
    <div className="bg-navy-800/50 border border-navy-600 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-navy-600">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-2xl">🔗</span>
              Risk Correlation Matrix
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Visualize interconnected risks and identify cascade patterns
            </p>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-gray-400">
              <input
                type="checkbox"
                checked={showLabels}
                onChange={(e) => setShowLabels(e.target.checked)}
                className="w-4 h-4 rounded bg-navy-700 border-navy-500"
              />
              Show values
            </label>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Correlation:</span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded bg-red-500" title="Strong Positive (≥0.7)" />
              <div className="w-4 h-4 rounded bg-orange-500" title="Moderate Positive (0.5-0.7)" />
              <div className="w-4 h-4 rounded bg-yellow-500" title="Weak Positive (0.3-0.5)" />
              <div className="w-4 h-4 rounded bg-gray-600" title="Negligible (<0.3)" />
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs">
            {Object.entries(categoryColors).map(([cat, colors]) => (
              <div key={cat} className="flex items-center gap-1">
                <div className={`w-3 h-3 rounded ${colors.bg}`} />
                <span className={colors.text}>{cat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-0">
        {/* Matrix */}
        <div className="lg:col-span-2 p-6 overflow-x-auto">
          <div className="inline-block min-w-full">
            {/* Column Headers */}
            <div className="flex">
              <div className="w-20 shrink-0" /> {/* Empty corner */}
              {riskFactors.map(factor => (
                <div
                  key={factor.id}
                  className={`w-14 h-20 flex items-end justify-center pb-2 ${
                    hoveredFactor === factor.id || connectedFactors.has(factor.id) ? 'opacity-100' : hoveredFactor ? 'opacity-40' : 'opacity-100'
                  } transition-opacity`}
                  onMouseEnter={() => setHoveredFactor(factor.id)}
                  onMouseLeave={() => setHoveredFactor(null)}
                >
                  <span
                    className={`text-xs font-medium ${categoryColors[factor.category].text} transform -rotate-45 whitespace-nowrap`}
                  >
                    {factor.shortName}
                  </span>
                </div>
              ))}
            </div>

            {/* Matrix Rows */}
            {riskFactors.map((rowFactor, rowIndex) => (
              <div key={rowFactor.id} className="flex">
                {/* Row Header */}
                <div
                  className={`w-20 shrink-0 h-14 flex items-center justify-end pr-2 ${
                    hoveredFactor === rowFactor.id || connectedFactors.has(rowFactor.id) ? 'opacity-100' : hoveredFactor ? 'opacity-40' : 'opacity-100'
                  } transition-opacity`}
                  onMouseEnter={() => setHoveredFactor(rowFactor.id)}
                  onMouseLeave={() => setHoveredFactor(null)}
                >
                  <span className={`text-xs font-medium ${categoryColors[rowFactor.category].text}`}>
                    {rowFactor.shortName}
                  </span>
                </div>

                {/* Cells */}
                {riskFactors.map((colFactor, colIndex) => {
                  const isSame = rowIndex === colIndex;
                  const correlation = isSame ? null : getCorrelation(rowFactor.id, colFactor.id);
                  const isSelected = selectedCell?.row === rowFactor.id && selectedCell?.col === colFactor.id;
                  const isHighlighted = hoveredFactor &&
                    ((rowFactor.id === hoveredFactor && connectedFactors.has(colFactor.id)) ||
                     (colFactor.id === hoveredFactor && connectedFactors.has(rowFactor.id)));

                  return (
                    <div
                      key={colFactor.id}
                      className={`w-14 h-14 p-1 ${rowIndex > colIndex ? 'cursor-pointer' : ''}`}
                      onClick={() => {
                        if (rowIndex > colIndex && correlation) {
                          setSelectedCell(
                            isSelected ? null : { row: rowFactor.id, col: colFactor.id }
                          );
                        }
                      }}
                    >
                      {isSame ? (
                        <div className={`w-full h-full rounded ${categoryColors[rowFactor.category].bg} flex items-center justify-center`}>
                          <span className="text-xs text-gray-500">—</span>
                        </div>
                      ) : rowIndex > colIndex ? (
                        <div
                          className={`w-full h-full rounded ${
                            correlation ? getCorrelationColor(correlation.correlation) : 'bg-gray-700'
                          } ${
                            isSelected ? 'ring-2 ring-white' : ''
                          } ${
                            isHighlighted ? 'ring-2 ring-teal-400' : ''
                          } flex items-center justify-center transition-all hover:scale-110`}
                          style={{ opacity: correlation ? 0.3 + Math.abs(correlation.correlation) * 0.7 : 0.2 }}
                        >
                          {showLabels && correlation && (
                            <span className="text-xs font-medium text-white">
                              {correlation.correlation.toFixed(2)}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="w-full h-full" />
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Details Panel */}
        <div className="p-6 bg-navy-900/30 border-l border-navy-600">
          {/* Current Risk Levels */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
              <span>📊</span> Current Risk Levels
            </h3>
            <div className="space-y-2">
              {riskFactors.slice(0, 5).map(factor => (
                <div key={factor.id} className="flex items-center gap-3">
                  <span className={`text-xs ${categoryColors[factor.category].text} w-8`}>
                    {factor.shortName}
                  </span>
                  <div className="flex-1 h-2 bg-navy-600 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        factor.currentLevel >= 70 ? 'bg-red-500' :
                        factor.currentLevel >= 50 ? 'bg-amber-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${factor.currentLevel}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 w-8">{factor.currentLevel}</span>
                  <span className={`text-xs ${
                    factor.trend === 'increasing' ? 'text-red-400' :
                    factor.trend === 'decreasing' ? 'text-green-400' : 'text-gray-500'
                  }`}>
                    {factor.trend === 'increasing' ? '↑' : factor.trend === 'decreasing' ? '↓' : '→'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Correlation */}
          {selectedCorrelation && (
            <div className="mb-6 p-4 rounded-xl bg-navy-700/50 border border-navy-600">
              <h3 className="text-sm font-semibold text-white mb-2">Selected Correlation</h3>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-1 text-xs rounded ${
                  categoryColors[riskFactors.find(f => f.id === selectedCorrelation.factor1)?.category || 'market'].bg
                } ${
                  categoryColors[riskFactors.find(f => f.id === selectedCorrelation.factor1)?.category || 'market'].text
                }`}>
                  {riskFactors.find(f => f.id === selectedCorrelation.factor1)?.shortName}
                </span>
                <span className="text-gray-500">↔</span>
                <span className={`px-2 py-1 text-xs rounded ${
                  categoryColors[riskFactors.find(f => f.id === selectedCorrelation.factor2)?.category || 'market'].bg
                } ${
                  categoryColors[riskFactors.find(f => f.id === selectedCorrelation.factor2)?.category || 'market'].text
                }`}>
                  {riskFactors.find(f => f.id === selectedCorrelation.factor2)?.shortName}
                </span>
              </div>
              <div className="text-2xl font-bold text-white mb-2">
                {(selectedCorrelation.correlation * 100).toFixed(0)}%
                <span className="text-sm text-gray-400 ml-2">correlation</span>
              </div>
              <p className="text-xs text-gray-400">{selectedCorrelation.description}</p>
            </div>
          )}

          {/* Risk Clusters */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
              <span>⚠️</span> Risk Clusters
            </h3>
            <div className="space-y-3">
              {riskClusters.slice(0, 3).map((cluster, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-lg ${
                    cluster.riskLevel === 'Critical' ? 'bg-red-500/10 border-red-500/30' :
                    cluster.riskLevel === 'High' ? 'bg-amber-500/10 border-amber-500/30' :
                    'bg-yellow-500/10 border-yellow-500/30'
                  } border`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-medium ${
                      cluster.riskLevel === 'Critical' ? 'text-red-400' :
                      cluster.riskLevel === 'High' ? 'text-amber-400' : 'text-yellow-400'
                    }`}>
                      {cluster.riskLevel} Cluster
                    </span>
                    <span className="text-xs text-gray-500">
                      {(cluster.avgCorrelation * 100).toFixed(0)}% avg
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {cluster.factors.map(factorId => {
                      const factor = riskFactors.find(f => f.id === factorId);
                      if (!factor) return null;
                      return (
                        <span
                          key={factorId}
                          className={`px-2 py-0.5 text-xs rounded ${categoryColors[factor.category].bg} ${categoryColors[factor.category].text}`}
                        >
                          {factor.shortName}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
