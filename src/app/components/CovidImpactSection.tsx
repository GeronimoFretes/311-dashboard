'use client';

import React from 'react';
import { SectionProps } from '@/types/SectionProps';
import TimeSeriesMini from './charts/CovidTimeSeriesMini';
import CovidMapGrid from './charts/CovidMapGrid';
import CovidWordCloudGrid from './charts/CovidWordCloudGrid';
import { periodColors} from '../../utils/colors';

const CovidImpactSection: React.FC<SectionProps> = ({ id }) => (
  <section id={id} className="section">
    <h2 className="section-title">
      Dinámica de Reclamos en la Era COVID-19: Fases 
      <span style={{ color: periodColors.pre }}> Pre</span>, 
      <span style={{ color: periodColors.covid }}> Durante</span> y 
      <span style={{ color: periodColors.post }}> Post </span>
      Pandemia
    </h2>
    <div className='section-body'>
      <p className='paragraph'>
        La pandemia de COVID-19 transformó la manera en que los neoyorquinos se vinculan con los servicios del Estado. Esta sección busca capturar justamente eso. Tomamos los datos del 311 y los separamos en tres momentos clave: antes de la pandemia (enero de 2019 a marzo de 2020), durante las restricciones más fuertes (marzo de 2020 a julio de 2021) y en el período post-pandémico inmediato (julio de 2021 a diciembre de 2022). ¿Qué cambió entre esos períodos? ¿Qué problemas se volvieron más urgentes? ¿Y qué distritos empezaron a levantar la voz con más fuerza?
      </p>
      <div className="flex flex-col w-full h-full justify-center my-[2%] gap-4">
        {/* 1. Mini time-series charts */}
        <div className='w-full h-[25vh]'>
          {/* <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Evolución mensual de quejas por 10.000 habitantes
          </h3> */}
          <TimeSeriesMini />
        </div>
        {/* 2. Choropleth map grid */}
        <div className='w-full h-[25vh]'>
          {/* <h3 className="text-xl font-semibold mb-3">Distribución geográfica de quejas</h3> */}
          <CovidMapGrid />
        </div>
        {/* 3. Borough bar comparison */}
        <div className='w-full h-[25vh]'>
          {/* <h3 className="text-xl font-semibold mb-3">Promedio de quejas por borough</h3> */}
          <CovidWordCloudGrid/>
        </div>
      </div>
      <p className='paragraph'>
        La pandemia no fue solo un pico aislado de malestar, sino un punto de inflexión duradero. Durante los meses más duros de 2020 y 2021, el volumen de llamados al 311 creció como nunca antes. El aislamiento, el cierre de oficinas, los problemas habitacionales y los servicios bajo presión dispararon las quejas ciudadanas. Pero lo más notable es lo que pasó después: los niveles no volvieron a la normalidad. Incluso en el período post-pandemia, los reclamos siguen en alta. Según el Center for New York City Affairs, esto puede estar relacionado con un deterioro persistente en ciertas condiciones urbanas, sumado a un cambio cultural: más personas usan el 311 como herramienta cotidiana de exigencia y monitoreo del espacio urbano.
        <br /><br />
        El segundo eje tiene que ver con una categoría que no se movió del podio en ningún momento: el ruido. Ya sea en forma de fiestas, parlantes, bocinas o fuegos artificiales, el ruido —especialmente el residencial y callejero— estuvo presente en las tres etapas. Antes de 2020, ya era uno de los reclamos más frecuentes; durante el confinamiento se volvió más insoportable que nunca; y en la reapertura, explotó en forma de celebraciones callejeras, autos tuneados y vida nocturna al aire libre. 
        <br /><br />
        Por último, hay un cambio territorial que no pasa desapercibido: el Bronx. Antes de la pandemia, su volumen de reclamos ajustado por población no sobresalía con respecto al resto de los distritos. Pero durante la crisis sanitaria y, sobre todo, en los meses posteriores, se convirtió en el más activo del mapa. El gráfico lo muestra con claridad: la intensidad del color en el mapa se concentra fuertemente en este distrito, justo donde se cruzan las mayores tasas de hacinamiento y pobreza estructural.
      </p>
    </div>
  </section>
);

export default CovidImpactSection;
