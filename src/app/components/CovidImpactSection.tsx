'use client';

import React from 'react';
import TimeSeriesMini from './charts/CovidTimeSeriesMini';
import CovidMapGrid from './charts/CovidMapGrid';
// import PeriodBarComparison from './charts/CovidBarComparison';

const CovidImpactSection: React.FC = () => (
  <section id="covid-impact" className="p-6 bg-white rounded-xl shadow-lg space-y-10">
    <h2 className="text-3xl font-bold mb-6">Impacto del COVID-19 en las Quejas 311</h2>

    {/* 1. Mini time-series charts */}
    <div>
      <h3 className="text-xl font-semibold mb-3">Evolución mensual de quejas por 10 000 hab.</h3>
      <TimeSeriesMini />
    </div>

    {/* 2. Choropleth map grid */}
    <div>
      <h3 className="text-xl font-semibold mb-3">Distribución geográfica de quejas</h3>
      <CovidMapGrid />
    </div>

    {/* 3. Borough bar comparison */}
    <div>
      <h3 className="text-xl font-semibold mb-3">Promedio de quejas por borough</h3>
      {/* <PeriodBarComparison /> */}
    </div>
  </section>
);

export default CovidImpactSection;
