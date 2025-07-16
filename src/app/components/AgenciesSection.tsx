'use client';

import React from 'react';
import { SectionProps } from '@/types/SectionProps';
import AgencyBarRace from './charts/AgenciesBarChart';
import LineChartAgency from './charts/SmallMultiplesAgencies';

const AgencyRaceSection: React.FC<SectionProps> = ({ id }) => (
  <section id={id} className="section">
    <h2 className="section-title">
      Evolución de Reclamos y Respuesta por Agencia
    </h2>
    <div className='section-body'>
      <p className='paragraph'>
        Además de analizar qué se reclama, es clave entender a quién se dirigen esas quejas. ¿Qué instituciones cargan con más reclamos? ¿Cómo cambia esa distribución con el tiempo? Para responder a estas preguntas, armamos un gráfico “race bar chart” que muestra mes a mes, entre 2010 y 2024, el top 10 de agencias responsables de gestionar los reclamos. Cada barra representa una agencia de la ciudad y se mueve con el tiempo en función del volumen de llamados que recibió. La animación permite ver con claridad cómo algunas suben, bajan, desaparecen o se consolidan como protagonistas del sistema. 
      </p>
      <div className="flex flex-col w-full h-full justify-center my-[2%]">
        <h3 className="text-xl text-[16px] font-semibold text-gray-900">
          Evolución Mensual: Top 10 Agencias por Volumen de Reclamos
        </h3>
        <div className="flex-1">
          <AgencyBarRace />
        </div>
      </div>
      <p className='paragraph'>
        Desde 2010 en adelante, el Departamento de Policía de Nueva York (NYPD) y el Departamento de Preservación y Desarrollo de Vivienda (HPD) han intercambiado el primer y segundo puesto mes a mes. Esta situación refleja una tensión constante entre cuestiones de seguridad, ruido y convivencia (NYPD) y problemas habitacionales, como filtraciones, falta de calefacción y agua caliente (HPD). Datos del NYC Council Data Team muestran que el NYPD maneja cerca del 29 % de todos los reclamos no emergentes, con HPD cerca del 23 % <a
          href='https://council.nyc.gov/data/311-agency/?utm_source=chatgpt.com' 
          target="_blank" rel="noopener noreferrer" 
          className="text-blue-600 underline hover:text-blue-800">
        New York City Council</a>, lo que explica por qué estos dos organismos dominan la demanda ciudadana.
        <br /><br />
        En 2020, justo cuando aparece el pico de reclamos por basura y limpieza tras los recortes presupuestarios durante la pandemia, el Departamento de Saneamiento (DSNY) comienza a escalar y se mantiene casi ininterrumpidamente en el top 3. Un análisis de The New Yorker cuenta cómo ese verano de 2020, calles llenas de basura y quejas al 311 motivaron la designación de Jessica Tisch como comisionada, con la promesa de modernizar el sistema de recolección. Desde entonces, DSNY ha continuado recibiendo una presión sostenida a través de reclamos por desperdicios, ratas y limpieza urbana, manteniéndose firme entre los primeros tres puestos.
        <br /><br />
        Saber quién recibe más quejas dice mucho. Pero saber cuánto se tarda en responder, dice más todavía. No es lo mismo gestionar miles de reclamos en pocos días que dejarlos acumular por semanas. Por eso, antes de cerrar esta sección, sumamos una última mirada: la del tiempo. ¿Qué agencias son más eficientes? ¿Cuáles mejoraron? ¿Y en cuáles las demoras siguen siendo parte del problema?
        <br /><br />
        En esta visualización vemos cómo evolucionó, mes a mes, el tiempo promedio de resolución en las cinco agencias más demandadas. Cada línea es una historia distinta: hay mejoras sostenidas, retrocesos en pandemia, curvas estables y picos de crisis. 
      </p>
      <div className="flex flex-col w-full h-full justify-center my-[2%]">
        <h3 className="text-xl text-[16px] font-semibold text-gray-900 mb-[1%]">
          Evolución mensual del tiempo promedio de resolución (Top 5 agencias)
        </h3>
        <div className="flex-1">
          <LineChartAgency />
        </div>
      </div>
      <p className='paragraph'>
        Con el paso del tiempo, los tiempos de respuesta de las principales agencias del 311 dejan ver sus propias dinámicas. El departamento de policía se muestra bastante parejo, aunque con dos subidas claras: una en julio de 2019 y otra en enero de 2022. En vivienda, el departamento de Preservación y Desarrollo de Vivienda tiene sus altibajos, pero sin desbordes: los tiempos varían, pero dentro de un margen razonable. Saneamiento, en cambio, arranca con demoras muy altas —no es fácil lidiar con ratas y basura acumulada— pero mejora mucho con los años. Transporte se mantiene tranquilo, con una línea bastante estable salvo algún que otro pico, como en julio de 2018. Y Protección Ambiental, que empezó lento, fue afinando su ritmo hasta mostrar hoy una respuesta mucho más ágil. En conjunto, estas curvas muestran algo que no siempre se ve a simple vista: reclamar es solo la mitad del camino, la otra mitad es cuánto tarda el Estado en responder.
      </p>
    </div>
  </section>
);

export default AgencyRaceSection;
