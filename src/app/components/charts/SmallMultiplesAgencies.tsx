'use client';

import React, { useEffect, useRef } from 'react';
import * as Plot from '@observablehq/plot';
import * as d3 from 'd3';

export default function SmallMultiplesAgencies() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    d3.csv('/data/AvgResolutionPerAgency.csv', d3.autoType).then((raw: any[]) => {
      const agencies = [
        'New York City Police Department',
        'Department of Housing Preservation and Development',
        'Department of Sanitation',
        'Department of Transportation',
        'Department of Environmental Protection',
      ];

      const grouped = d3.group(raw, d => d.agency_name);

      if (containerRef.current) {
        containerRef.current.innerHTML = ''; // clear previous
        agencies.forEach((agency) => {
          const data = grouped.get(agency);
          const chart = Plot.plot({
            height: 120,
            width: 700,
            x: {
              label: null,
              tickFormat: "%Y-%m",
              type: 'band',
            },
            y: {
              label: 'Horas promedio',
              grid: true
            },
            marks: [
              Plot.lineY(data, {
                x: "month_year",
                y: "avg_resolution_hours",
                stroke: "#49A67A"
              })
            ]
          });

          const section = document.createElement('div');
          const title = document.createElement('h4');
          title.textContent = agency;
          title.className = 'font-semibold text-gray-700 mb-1 mt-4 text-sm';
          section.appendChild(title);
          section.appendChild(chart);
          containerRef.current!.appendChild(section);
        });
      }
    });
  }, []);

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Evolución mensual del tiempo promedio de resolución (Top 5 agencias)
      </h2>
      <div ref={containerRef} />
    </div>
  );
}
