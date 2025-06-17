'use client';

import React, { useEffect, useRef } from 'react';
import embed, { VisualizationSpec } from 'vega-embed';

const SmallMultiplesAgencies: React.FC = () => {
  const chartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const spec: VisualizationSpec = {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      width: 200,
      height: 120,
      data: { url: '/data/AvgResolutionPerAgency.csv' },
      transform: [
        {
          filter: "datum.agency_name === 'New York City Police Department' || " +
                  "datum.agency_name === 'Department of Housing Preservation and Development' || " +
                  "datum.agency_name === 'Department of Sanitation' || " +
                  "datum.agency_name === 'Department of Transportation' || " +
                  "datum.agency_name === 'Department of Environmental Protection'"
        }
      ],
      facet: {
        column: {
          field: 'agency_name',
          type: 'nominal',
          title: null
        }
      },
      spec: {
        mark: { type: 'line', color: '#49A67A', point: false },
        encoding: {
          x: {
            field: 'month_year',
            type: 'temporal',
            axis: { title: null, format: '%Y-%m', labelAngle: -40 }
          },
          y: {
            field: 'avg_resolution_hours',
            type: 'quantitative',
            axis: { title: 'Horas' }
          }
        }
      },
      config: {
        view: { stroke: 'transparent' },
        axis: {
          labelFontSize: 10,
          titleFontSize: 11,
          grid: false
        }
      }
    };

    embed(chartRef.current, spec, { actions: false });
  }, []);

  return <div ref={chartRef} />;
};

export default SmallMultiplesAgencies;
