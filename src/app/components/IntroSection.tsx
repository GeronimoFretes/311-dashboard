'use client';

import React from 'react';
import { SectionProps } from '@/types/SectionProps';

const IntroSection: React.FC<SectionProps> = ({ id }) => {
  return (
    <section id={id} className="section bg-gradient-to-b from-[#e6f2ff] to-white ">
      <div className="title">
        <div className="flex items-center justify-center gap-1">
          <img
            src="/favicon.ico"
            alt="Logo"
            className="w-20 h-20 md:w-20 md:h-20"
          />
          <h1>
            311 NYC: Historia y Tendencias
          </h1>
        </div>
      </div>
      <div className="section-body">
        <p className="paragraph">
        El sistema 311 de la ciudad de Nueva York es una plataforma de atención ciudadana que permite a los residentes reportar problemas no urgentes relacionados con el funcionamiento urbano: desde falta de calefacción, ruidos molestos o autos mal estacionados, hasta problemas con el alumbrado público o la recolección de basura. Fue creado en 2003 con el objetivo de centralizar los reclamos y mejorar la comunicación entre la ciudadanía y las distintas agencias gubernamentales. 
        <br /><br />
        Este trabajo surge como parte de un análisis exploratorio de datos del sistema 311, donde a través de visualizaciones interactivas, buscamos entender qué revelan estos reclamos sobre el pulso urbano: ¿Dónde se concentran las tensiones cotidianas? ¿Qué problemáticas persisten con el paso del tiempo? ¿Cómo respondió la ciudad frente a momentos críticos como la pandemia? ¿Y qué papel juegan las agencias públicas ante el reclamo constante de sus habitantes?
        <br /><br />
        Más allá del volumen de llamadas, el 311 funciona como un termómetro social, que nos permite identificar desigualdades entre distritos, detectar patrones estructurales persistentes —como problemas de vivienda, ruido o estacionamiento—, y observar cómo se transforman las preocupaciones ciudadanas en contextos de crisis o cambio. 
        <br /><br />
        Pero no se trata solo de números ni de quejas aisladas: estos datos son una radiografía de cómo funciona la ciudad. Revelan qué servicios fallan, en qué barrios se acumulan tensiones, y qué problemas se vuelven sintomáticos sin una respuesta estructural. Entenderlos no es una posición técnica: es una herramienta de poder ciudadano y una exigencia para diseñar políticas públicas más justas, más sensibles y más inteligentes.
      </p>
      </div>
    </section>
  );
};

export default IntroSection;