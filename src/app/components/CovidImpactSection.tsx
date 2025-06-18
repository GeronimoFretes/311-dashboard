'use client';

import React from 'react';
import TimeSeriesMini from './charts/CovidTimeSeriesMini';
import CovidMapGrid from './charts/CovidMapGrid';
import CovidWordCloudGrid from './charts/CovidWordCloudGrid';
import { periodColors} from '../../utils/colors';

const CovidImpactSection: React.FC = () => (
  <section id="covid-impact" className="w-screen h-screen bg-white snap-start">
    {/* Section title */}
    <div className="w-screen lg:h-1/7 flex items-center justify-center ">
      <h2 className="text-3xl font-bold text-gray-900">
        Dinámica de Reclamos en la Era COVID-19: Fases 
        <span style={{ color: periodColors.pre }}> Pre</span>, 
        <span style={{ color: periodColors.covid }}> Durante</span> y 
        <span style={{ color: periodColors.post }}> Post </span>
        Pandemia
      </h2>
    </div>
    
{/* 
    <p className="text-base text-gray-600 mt-2 mb-8">
      Análisis comparativo de la evolución temporal de las quejas y su distribución geográfica 
      mediante series de tiempo y mapas de intensidad antes, durante y después de la pandemia.
    </p> */}


    <div className="w-screen flex flex-col lg:flex-row lg:h-6/7 p-[1%] ">
      <div className="flex flex-col lg:w-5/10 pl-[2%] pr-[2%] h-full justify-center">
        <div className='rounded-lg bg-[#CAE8DA] p-[2%]'>
          <p className="text-gray-700 text-base font-bold md:text-md text-end text-justify">
            Esta sección ofrece una mirada específica sobre el impacto de la pandemia de COVID-19 en los reclamos al 311. Dividimos el análisis en tres etapas: pre-pandemia (01/2019 – 03/2020), durante la pandemia (03/2020 – 07/2021) y post-pandemia (07/2021 – 12/2022). El gráfico de línea muestra de forma clara cómo, ajustando por población, el volumen de reclamos alcanzó su pico histórico durante el COVID, con niveles que, si bien bajaron después, se mantuvieron por encima del período previo.
          </p>
          <p className="text-gray-700 text-base font-bold md:text-md text-end text-justify">
            Los mapas por distrito refuerzan esta lectura: antes de la pandemia, el Bronx era uno de los distritos con menos reclamos por cada 10.000 habitantes, mientras que en los años posteriores pasó a ser el más activo en términos relativos, destacándose especialmente en las zonas del centro-norte del distrito. Esta evolución sugiere una transformación sostenida en el nivel de uso del 311 en ese borough, posiblemente ligada a mayores necesidades o mayor hábito de reportar.
          </p>
          <p className="text-gray-700 text-base font-bold md:text-md text-end text-justify">
            Por último, los word charts de cada etapa muestran cómo fueron cambiando las prioridades de los neoyorquinos. Antes de 2020 predominaban las quejas por ruido, estacionamiento y servicios generales. Durante la pandemia, cobraron fuerza los reclamos vinculados a limpieza, salud pública y vivienda. En la etapa post-pandemia, si bien algunas categorías previas reaparecen, se mantiene alta la presencia de temas estructurales como calefacción, saneamiento y condiciones habitacionales. Esto refuerza la idea de que la pandemia no solo fue un pico aislado, sino también un punto de inflexión en las preocupaciones cotidianas que canalizan los vecinos a través del 311.
          </p>
          
        </div>
      </div>
      <div className="flex flex-col lg:w-5/10 h-full gap-1 items-center justify-center ">
        {/* 1. Mini time-series charts */}
        <div className='w-full lg:h-1/3 '>
          {/* <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Evolución mensual de quejas por 10.000 habitantes
          </h3> */}
          <TimeSeriesMini />
        </div>

        {/* 2. Choropleth map grid */}
        <div className='w-full lg:h-1/3 '>
          {/* <h3 className="text-xl font-semibold mb-3">Distribución geográfica de quejas</h3> */}
          <CovidMapGrid />
        </div>

        {/* 3. Borough bar comparison */}
        <div className='w-full lg:h-1/3'>
          {/* <h3 className="text-xl font-semibold mb-3">Promedio de quejas por borough</h3> */}
          <CovidWordCloudGrid/>
        </div>
      </div>
    </div>
    
  </section>
);

export default CovidImpactSection;
