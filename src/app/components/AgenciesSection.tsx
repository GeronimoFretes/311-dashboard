'use client';

import React from 'react';
import AgencyBarRace from './charts/AgenciesBarChart';
import LineChartAgency from './charts/SmallMultiplesAgencies';

const AgencyRaceSection: React.FC = () => (
  <section className="w-screen h-screen bg-white snap-start">
    {/* Section title */}
    <div className="w-screen lg:h-1/7 flex items-center justify-center">
      <h2 className="text-3xl font-bold text-gray-900">
        Evolución de Reclamos y Respuesta por Agencia
      </h2>
    </div>

    <div className="w-screen flex flex-col lg:flex-row lg:h-6/7">
      {/* Horizontal scroll container */}
      <div className="overflow-x-auto  h-full snap-x snap-mandatory scroll-smooth">
        <div className="inline-flex w-max h-full items-start">
          {/* Bar Chart Block */}
          <div className="w-screen shrink-0 snap-start flex flex-col lg:flex-row p-[1%] justify-center items-center">
            <div className="flex flex-col lg:w-5/7 pl-[2%] pr-[2%] h-full justify-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-[1%]">
                Evolución Mensual: Top 10 Agencias por Volumen de Reclamos
              </h3>
              <div className="flex-1">
                <AgencyBarRace />
              </div>
            </div>
            <div className="flex flex-col lg:w-2/7 h-full justify-center bg-[#CAE8DA] mr-[1%] rounded-lg p-6 text-gray-800">
              <p className="mb-4 text-sm leading-relaxed font-semibold">
                El gráfico animado tipo race bar chart muestra la evolución mensual del volumen de reclamos al 311 por agencia en Nueva York entre 2010 y 2024. El Departamento de Policía (NYPD) se destaca como la agencia con más quejas de forma sostenida, principalmente por temas relacionados con calidad de vida como ruido, estacionamiento o aglomeraciones. En 2024 se observa un nuevo repunte en las quejas dirigidas al NYPD, lo que sugiere un aumento reciente en preocupaciones de seguridad vecinal. Un caso particular se dio en 2020, cuando el Departamento de Saneamiento (DSNY) ocupó de forma excepcional el segundo lugar en volumen de reclamos, reflejando cómo la pandemia priorizó temas de limpieza, residuos y salud pública. Superado ese contexto, la distribución volvió a sus patrones históricos, con el NYPD, DSNY, el Departamento de Vivienda (HPD), Transporte (DOT) y Protección Ambiental (DEP) como las agencias más solicitadas a lo largo del período.
              </p>
            </div>
          </div>

          {/* Line Chart Block */}
          <div className="w-screen shrink-0 snap-start flex flex-col lg:flex-row p-[1%] justify-center items-center">
            <div className="flex flex-col lg:w-5/7 pl-[2%] pr-[2%] h-full justify-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-[1%]">
                Evolución mensual del tiempo promedio de resolución (Top 5 agencias)
              </h3>
              <div className="flex-1">
                <LineChartAgency />
              </div>
            </div>
            <div className="flex flex-col lg:w-2/7 h-full justify-center bg-[#CAE8DA] mr-[1%] rounded-lg p-6 text-gray-800">
              <p className="mb-4 text-sm leading-relaxed font-semibold">
                El dashboard incluye cinco gráficos de líneas que muestran cómo evolucionó el tiempo promedio de resolución de reclamos en las agencias más demandadas. Esta métrica indica cuán eficiente fue cada organismo a lo largo del tiempo: Vivienda (HPD): Mejora sostenida en su eficiencia, especialmente después de 2020, con tiempos de resolución más cortos en los últimos años. Policía (NYPD): Tiempos relativamente estables, con leves demoras durante 2020 pero una recuperación posterior. Saneamiento (DSNY): Fuerte aumento en los tiempos durante la pandemia, seguido de una clara mejora y normalización desde 2021. Transporte (DOT): Curva estable, con eficiencia sostenida y solo algunos picos puntuales de demora. Protección Ambiental (DEP): Respuesta constante y eficiente, con ligeras mejoras recientes. Destaca la atención continua a temas medioambientales.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default AgencyRaceSection;
