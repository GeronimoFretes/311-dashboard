'use client';

import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import * as d3 from 'd3';
import { translateAgencyName } from '@/utils/agencyTranslator';

// 🔢 Convierte horas en un formato legible
const formatResolution = (hours: number): string => {
  if (hours < 1) {
    return `${Math.round(hours * 60)} min`;
  }
  if (hours < 24) {
    return `${hours.toFixed(1)} h`;
  }
  const days = hours / 24;
  if (days < 30) {
    return `${days.toFixed(1)} días`;
  }
  const months = days / 30;
  if (months < 12) {
    return `${months.toFixed(1)} meses`;
  }
  const years = months / 12;
  return `${years.toFixed(1)} años`;
};

export default function SmallMultiplesAgencies() {
  const [groupedData, setGroupedData] = useState<Record<string, any[]>>({});
  const agencies = [
    'New York City Police Department',
    'Department of Housing Preservation and Development',
    'Department of Sanitation',
    'Department of Transportation',
    'Department of Environmental Protection',
  ];

  useEffect(() => {
    d3.csv('/data/AvgResolutionPerAgency.csv', d3.autoType).then((raw: any[]) => {
      const grouped = d3.group(raw, d => d.agency_name);
      setGroupedData(Object.fromEntries(grouped));
    });
  }, []);

  return (
    <div className="w-full">
      {agencies.map((agency, index) => (
        <div key={agency} className="mt-0 mb-0 relative">
          {/* Etiqueta de la agencia */}
          <h4 className="font-semibold text-gray-700 text-ml absolute top-0 left-18 z-10 opacity-40 pointer-events-none">
            {translateAgencyName(agency)}
          </h4>

          <ResponsiveContainer width="100%" height={100}>
            <LineChart data={groupedData[agency] || []}>
              {/* Eje X oculto para todos los gráficos */}
              <XAxis dataKey="month_year" hide tickFormatter={(v) => d3.timeFormat('%Y-%m')(v as Date)} />
              {/* Eje Y sin ticks */}
              <YAxis dataKey="avg_resolution_hours" tick={false} />

              {/* Tooltip mejorado */}
              <Tooltip
                content={({ label, payload }) => {
                  if (!payload?.length) return null;
                  const dateStr = d3.timeFormat('%Y-%m')(label as Date);
                  const hours = payload[0].value as number;
                  const readable = formatResolution(hours);

                  return (
                    <div className="bg-[#CAE8DA] opacity-80 font-semibold p-2 border border-gray-300 rounded text-xs text-black whitespace-pre-line shadow-md">
                      {`Mes: ${dateStr}\nTiempo promedio de respuesta: ${readable}`}
                    </div>
                  );
                }}
              />

              <Line type="monotone" dataKey="avg_resolution_hours" stroke="#49A67A" dot={false} strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  );
}
