'use client';

import { useState } from 'react';
import { initiatives, portfolios, type Initiative } from '@/lib/demoData';

interface HeatmapGridProps {
  filteredInitiatives?: Initiative[];
}

const dimensions = [
  { key: 'growthScore', name: 'Growth' },
  { key: 'riskScore', name: 'Risk' },
  { key: 'strategicFit', name: 'Strategic Fit' },
  { key: 'capabilityStrain', name: 'Capability Strain' },
];

export default function HeatmapGrid({ filteredInitiatives }: HeatmapGridProps) {
  const [selectedCell, setSelectedCell] = useState<{ init: string; dim: string } | null>(null);

  const data = filteredInitiatives || initiatives;

  const getHeatmapColor = (value: number, dimension: string): string => {
    // For risk and capability strain, higher is worse
    const isInverseMetric = dimension === 'riskScore' || dimension === 'capabilityStrain';

    if (isInverseMetric) {
      if (value >= 80) return 'bg-red-500/70 hover:bg-red-500/90';
      if (value >= 60) return 'bg-amber-500/70 hover:bg-amber-500/90';
      if (value >= 40) return 'bg-yellow-500/70 hover:bg-yellow-500/90';
      if (value >= 20) return 'bg-teal-500/70 hover:bg-teal-500/90';
      return 'bg-green-500/70 hover:bg-green-500/90';
    } else {
      if (value >= 80) return 'bg-green-500/70 hover:bg-green-500/90';
      if (value >= 60) return 'bg-teal-500/70 hover:bg-teal-500/90';
      if (value >= 40) return 'bg-yellow-500/70 hover:bg-yellow-500/90';
      if (value >= 20) return 'bg-amber-500/70 hover:bg-amber-500/90';
      return 'bg-red-500/70 hover:bg-red-500/90';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left p-3 text-sm font-medium text-gray-400 bg-navy-800 sticky left-0">
              Initiative
            </th>
            {dimensions.map((dim) => (
              <th
                key={dim.key}
                className="p-3 text-sm font-medium text-gray-400 bg-navy-800 text-center min-w-[100px]"
              >
                {dim.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((initiative) => (
            <tr key={initiative.id} className="border-t border-navy-600">
              <td className="p-3 text-sm text-white bg-navy-800 sticky left-0">
                <div>
                  <span className="font-medium">{initiative.name}</span>
                  <span className="block text-xs text-gray-400">{initiative.portfolio}</span>
                </div>
              </td>
              {dimensions.map((dim) => {
                const value = initiative[dim.key as keyof Initiative] as number;
                const isSelected =
                  selectedCell?.init === initiative.id && selectedCell?.dim === dim.key;

                return (
                  <td key={dim.key} className="p-2">
                    <button
                      onClick={() =>
                        setSelectedCell(
                          isSelected ? null : { init: initiative.id, dim: dim.key }
                        )
                      }
                      className={`w-full h-12 rounded-lg transition-all ${getHeatmapColor(
                        value,
                        dim.key
                      )} ${
                        isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-navy-800' : ''
                      }`}
                    >
                      <span className="text-sm font-medium text-white">{value}</span>
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-gray-400">
        <span className="font-medium">Legend:</span>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-500/70"></div>
          <span>Excellent</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-teal-500/70"></div>
          <span>Good</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-yellow-500/70"></div>
          <span>Moderate</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-amber-500/70"></div>
          <span>Concerning</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-500/70"></div>
          <span>Critical</span>
        </div>
      </div>
    </div>
  );
}
