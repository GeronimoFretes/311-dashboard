'use client';

import React from 'react';
import { SectionProps } from '@/types/SectionProps';
import EmailCard from './EmailCard';

const AboutUsSection: React.FC<SectionProps> = ({ id }) => {
  return (
    <section id={id} className="section bg-gradient-to-t from-[#e6f2ff]">
      <h2 className="section-title">
        Sobre Nosotros
      </h2>
      <div className="section-body">
        <p className="paragraph">
            Somos Ramón Eppens y Gerónimo Fretes, estudiantes de tercer año de la carrera de Analítica (Ciencia de Datos) en el Instituto Tecnológico de Buenos Aires (ITBA), Argentina.
            <br /><br />
            Este trabajo nació como una exploración académica, pero rápidamente se transformó en algo más: una forma de usar los datos para contar historias relevantes, entender mejor la vida urbana y mostrar cómo las herramientas del análisis pueden iluminar los rincones menos visibles de una ciudad.
            <br /><br />
            Si querés contactarnos, intercambiar ideas o dejarnos tu opinión:
            <br /><br />
        </p>
        <EmailCard/>
      </div>
     

      <p className="text-sm text-gray-500 mt-10">© 2025 - Proyecto ITBA - Datos abiertos del 311 NYC</p>
    </section>
  );
};

export default AboutUsSection;