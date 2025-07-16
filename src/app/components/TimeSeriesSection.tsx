'use client';

import { useState } from 'react';
import { SectionProps } from '@/types/SectionProps';
import LineChartBoroughs from './charts/LineChartBoroughs';

export default function TimeSeriesSection({ id }: SectionProps) {
  const [viewMode, setViewMode] = useState<'absolute' | 'perCapita'>('absolute');

  return (
    <section id={id} className="section">
      <h2 className="section-title">
        Evolución de Reclamos por Distrito
      </h2>
      <div className='section-body'>
        <p className='paragraph'>
          No todos los barrios de Nueva York reclaman con la misma intensidad. Esta visualización permite seguir, mes a mes, cómo fue cambiando la cantidad de reclamos al 311 en cada distrito —Brooklyn, Manhattan, Bronx, Queens y Staten Island— a lo largo de los últimos 14 años. Se puede ver tanto el volumen total como el número de reclamos ajustado por población (cada 10.000 habitantes), lo que revela no sólo cuánto se reclama, sino desde dónde se reclama más proporcionalmente.
        </p>

        <div className="flex flex-col my-[2%] w-full h-[65vh] items-center justify-center">
          {/* Subtitle centred, buttons to the right */}
          <div className="flex flex-col md:flex-row items-center w-full gap-4 mb-6">
            <p className="text-gray-700 text-base font-bold md:text-md flex-1 mt-[1%] text-[18px] text-center">
              Volumen mensual{viewMode === 'absolute' ? ' total' : ' por cada 10 000 habitantes'}
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
          <div className="w-full h-full rounded-md flex items-center justify-center text-gray-500 text-sm ">
            <LineChartBoroughs viewMode={viewMode} />
          </div>
        </div>


        <p className='paragraph'>
          Durante el primer mes de la pandemia, los niveles de reclamos en toda la ciudad cayeron. Pero esa caída no duró mucho. Apenas unas semanas después del inicio del confinamiento, los llamados al 311 empezaron a crecer rápidamente y alcanzaron un pico histórico entre mediados de 2020 y principios de 2021. La explicación está en el contexto: el cierre de oficinas públicas, la presión sobre los servicios básicos, la convivencia forzada en espacios reducidos y la desigualdad territorial en el acceso a infraestructura acentuaron los problemas estructurales ya presentes. Según un informe del <a
            href='https://comptroller.nyc.gov/reports/turn-up-the-heat/?' 
            target="_blank" rel="noopener noreferrer" 
            className="text-blue-600 underline hover:text-blue-800">
          NYC Office of the Comptroller</a>, los barrios con más hacinamiento —principalmente en el Bronx y Queens— registraron mayores volúmenes de reclamos durante ese período, especialmente relacionados con calefacción, ruidos y limpieza.
          <br /><br />
          Lo interesante es que después del pico pandémico, los niveles no volvieron al punto de partida. Al contrario: en la mayoría de los barrios, los reclamos siguieron creciendo de forma sostenida. Especialmente desde 2022, vemos un aumento constante en Manhattan, Brooklyn y, con fuerza particular, en el Bronx. Este crecimiento sugiere una transformación en el uso del sistema: más personas eligen el 311 como vía directa para expresar sus problemas cotidianos, pero también podría estar reflejando un deterioro persistente de ciertas condiciones urbanas. Como indicó el <a
            href='https://www.osc.ny.gov/reports/osdc/recent-trends-and-impact-covid-19-bronx?' 
            target="_blank" rel="noopener noreferrer" 
            className="text-blue-600 underline hover:text-blue-800">
          Center for New York City Affairs</a>, la falta de mantenimiento en vivienda pública y la sobrecarga de servicios sociales pospandemia impactaron con más fuerza en zonas históricamente vulnerables. Los datos acompañan esa lectura: el Bronx, por ejemplo, supera los 600 reclamos por cada 10.000 habitantes en varios meses recientes, duplicando su media prepandémica.
          <br /><br />
          Uno de los picos más llamativos de toda la serie ocurre en julio de 2022, cuando el Bronx alcanza su valor más alto en todo el período analizado. Ese salto está íntimamente ligado a la explosión de reclamos por ruido residencial y ruido en la vía pública, que ese mes concentraron casi 30.000 llamados en el distrito. La explicación se encuentra en algo cotidiano y sostenido: fiestas callejeras, fuegos artificiales ilegales y reuniones nocturnas al aire libre. Además, es importante aclarar que fue el primer verano sin restricciones tras la pandemia, lo que desató una explosión de actividades sociales informales. Según un informe de <a
            href='https://gothamist.com/news/see-where-new-yorkers-complain-the-most-about-july-4-fireworks?' 
            target="_blank" rel="noopener noreferrer" 
            className="text-blue-600 underline hover:text-blue-800">
          Gothamist</a>, barrios como Highbridge y Fordham registraron concentraciones repetidas de “autos con música a todo volumen, explosiones a la madrugada y calles tomadas por altavoces”, lo que disparó la saturación del 311 durante las noches del fin de semana.
          <br /><br />
          Este tipo de ruido no fue un fenómeno aislado. En el norte del Bronx, por ejemplo, vecinos de Jerome Avenue denunciaron los llamados chipeos: encuentros improvisados de autos tuneados que funcionan como discotecas móviles a cielo abierto. Durante varios fines de semana de ese mes, el sonido de parlantes de alta potencia, fuegos artificiales y música sin freno transformó la vida nocturna en una especie de festival no autorizado. La policía intervino en algunos casos —confiscaron autos y equipos de sonido— pero el problema persistió. Medios como <a
            href='https://www.cbsnews.com/newyork/news/noisy-car-meetups-bronx-jerome-ave/' 
            target="_blank" rel="noopener noreferrer" 
            className="text-blue-600 underline hover:text-blue-800">
          CBS New York</a> han documentado cómo los "car meetups" con música a volumen extremo se convirtieron en una constante en zonas del Bronx como Jerome Avenue y Van Cortlandt Park. Aunque el reporte es de 2025, describe un patrón que se repite cada verano y que vecinos vienen denunciando desde hace años, incluyendo picos como el de julio de 2022.
        </p>
      </div>
    </section>
  );
}
