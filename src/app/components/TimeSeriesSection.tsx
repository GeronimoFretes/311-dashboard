'use client';

import { useState } from 'react';
import LineChartBoroughs from './charts/LineChartBoroughs';

export default function TimeSeriesSection() {
  const [viewMode, setViewMode] = useState<'absolute' | 'perCapita'>('absolute');

  return (
    <section className="w-screen h-screen bg-white snap-start">
      {/* Section title */}
      <div className="w-screen lg:h-1/7 flex items-center justify-center ">
        <h2 className="text-3xl font-bold text-gray-900">
          Evolución de Reclamos por Distrito
        </h2>
      </div>

      {/* Body */}
      <div className="w-screen flex flex-col lg:flex-row lg:h-6/7 p-[1%] ">
        {/* Chart + controls */}
        <div className="flex flex-col lg:w-4/6 h-full items-center justify-center">
          {/* Subtitle centred, buttons to the right */}
          <div className="flex flex-col md:flex-row items-center w-full gap-4 mb-6">
            <p className="text-gray-700 text-base font-bold md:text-md flex-1 mt-[1%] text-center">
              Volumen mensual {viewMode === 'absolute' ? 'total' : 'ajustado por cantidad de habidantes'}
            </p>
            <div className="flex items-center space-x-4 mt-[1%] ml-auto">
              <button
                onClick={() => setViewMode('absolute')}
                className={`px-3 py-1 rounded-full border ${
                  viewMode === 'absolute'
                    ? 'bg-[#49A67A] text-white border-[#49A67A]'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                } transition`}
              >
                Absoluto
              </button>
              <button
                onClick={() => setViewMode('perCapita')}
                className={`px-3 py-1 rounded-full border ${
                  viewMode === 'perCapita'
                    ? 'bg-[#49A67A] text-white border-[#49A67A]'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                } transition`}
              >
                Ajustado
              </button>
            </div>
          </div>

          {/* Line chart */}
          <div className="w-full rounded-md flex items-center justify-center text-gray-500 text-sm ">
            <LineChartBoroughs viewMode={viewMode} />
          </div>
        </div>

        {/* Explanatory paragraph */}
        <div className="flex flex-col lg:w-2/6 pl-[2%] pr-[2%] h-full justify-center">
          <div className='rounded-lg bg-[#CAE8DA] p-[5%]'>
            <p className="text-gray-700 text-base font-bold md:text-md text-start text-justify">
              Este gráfico muestra la evolución mensual de los reclamos al 311 desagregada por distrito entre 2010 y 2024, con dos formas de visualización: el volumen absoluto de quejas y el número ajustado por habitante. En términos absolutos, Brooklyn es consistentemente el distrito con mayor cantidad de reclamos, reflejando tanto su tamaño poblacional como la densidad de actividad urbana. Sin embargo, al ajustar por cantidad de habitantes, el panorama cambia: el Bronx lidera con la mayor cantidad de reclamos por cada 10.000 personas, especialmente a partir de 2020, lo que sugiere una mayor presión sobre los servicios públicos o una mayor propensión a reportar problemas en relación con su población. Esta comparación evidencia cómo los volúmenes absolutos pueden ocultar desigualdades territoriales en el uso del sistema 311, y pone en foco al Bronx como un barrio donde la demanda ciudadana por atención es proporcionalmente más alta.
            </p>
            
          </div>
        </div>
      </div>
    </section>
  );
}
