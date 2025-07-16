'use client';

import React from 'react';
import { SectionProps } from '@/types/SectionProps';

const FinalThoughtsSection: React.FC<SectionProps> = ({ id }) => {
  return (
    <section id={id} className="section">
      <h2 className="section-title">
        Reflexiones finales
      </h2>
      <div className="section-body">
        <p className="paragraph">
            En una ciudad de más de ocho millones de personas, los problemas cotidianos no siempre se ven, pero se registran. Lo que nació como un canal para reportar inconvenientes menores —un semáforo roto, un ruido molesto, un camión de basura que no pasó— se convirtió, con el paso del tiempo, en una de las bases de datos más potentes sobre el funcionamiento cotidiano de Nueva York.
            <br /><br />
            Este trabajo parte de esa idea: que los reclamos no son solo números, sino relatos comprimidos. A lo largo de más de 35 millones de llamados, lo que emerge no es una lista de molestias, sino un espejo social. Un ruido no es solo un ruido: puede ser un síntoma de tensiones barriales, de desigualdad en la distribución del espacio público o de la falta de regulación efectiva. Un reclamo por calefacción no es solo por confort, es por salud, por dignidad, por derechos básicos que no deberían estar sujetos al azar del código postal.
            <br /><br />
            En este recorrido, vimos cómo el 311 permite identificar patrones persistentes —el ruido, el estacionamiento ilegal, la vivienda precaria—, pero también picos vinculados a momentos críticos como la pandemia. Vimos cómo algunas agencias colapsaron ante la presión, y cómo otras lograron mejorar sus tiempos de respuesta. Cómo ciertos barrios, como el Bronx, pasaron de ser periferia estadística a epicentro del reclamo urbano. 
            <br /><br />
            El valor de este análisis no está solo en los gráficos. Está en entender que reclamar también es un acto político. Que detrás de cada llamada hay una expectativa, una exigencia, una forma de ciudadanía activa. Y que mirar estos datos con atención no es solo un ejercicio técnico, sino una forma de escuchar mejor a la ciudad.
        </p>
      </div>
    </section>
  );
};

export default FinalThoughtsSection;