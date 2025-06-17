'use client';

import { useState } from 'react';
import LineChartBoroughs from './charts/LineChartBoroughs';

export default function TimeSeriesSection() {
  const [viewMode, setViewMode] = useState<'absolute' | 'perCapita'>('absolute');

  return (
    <section className="w-full bg-white py-12 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        {/* Title + Toggle */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              Evolución de Reclamos por Borough (2010–2025)
            </h2>
            <p className="text-gray-600 mt-1">
              Visualizá el volumen mensual total o ajustado por cantidad de habitantes.
            </p>
          </div>

          {/* Toggle */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setViewMode('absolute')}
              className={`px-3 py-1 rounded-full border ${
                viewMode === 'absolute'
                  ? 'bg-[#84BF69] text-white border-[#84BF69]'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
              } transition`}
            >
              Absoluto
            </button>
            <button
              onClick={() => setViewMode('perCapita')}
              className={`px-3 py-1 rounded-full border ${
                viewMode === 'perCapita'
                  ? 'bg-[#84BF69] text-white border-[#84BF69]'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
              } transition`}
            >
              Por habitante
            </button>
          </div>
        </div>

        {/* Chart Placeholder */}
        <div className="w-full h-[400px] rounded-md flex items-center justify-center text-gray-500 text-sm">
          <LineChartBoroughs viewMode={viewMode} />
        </div>
      </div>
    </section>
  );
}
