'use client';

import React from 'react';
import AgencyBarRace from './charts/AgenciesBarChart';
import SmallMultiplesAgencies from './charts/SmallMultiplesAgencies';
const AgencyRaceSection: React.FC = () => (
  <section className="w-full bg-white py-12 px-6 md:px-12">
    <h2 className="text-2xl font-semibold text-gray-800 mb-6">
      Evolución Mensual: Top 10 Agencias por Volumen de Reclamos
    </h2>
    <p className="text-gray-600 mb-8">
      Este gráfico muestra cómo las 10 agencias con mayor número de reclamos se ordenan
      dinámicamente mes a mes desde enero 2010 hasta diciembre 2024.
    </p>

    {/* Horizontal scroll container */}
    <div className="overflow-x-auto">
      <div className="flex gap-8 items-start">
        <div className="flex-1 min-w-[1000px] h-[600px]">
          <AgencyBarRace />
        </div>
        <div className="flex-1 min-w-[1000px] h-[600px]">
          <SmallMultiplesAgencies />
        </div>
      </div>
    </div>
  </section>
);

export default AgencyRaceSection;
