'use client';

import React from 'react';
import { SectionProps } from '@/types/SectionProps';

const ConclusionSection: React.FC<SectionProps> = ({ id }) => {
  return (
    <section id="conclusion" className="section bg-gradient-to-t from-[#e6f2ff] to-white flex flex-col justify-center items-center text-center px-8 py-20">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Reflexiones finales y contacto
      </h2>
      <p className="text-lg text-gray-700 max-w-3xl leading-relaxed mb-8">
        Este proyecto es parte de una iniciativa académica del Instituto Tecnológico de Buenos Aires (ITBA), desarrollada por estudiantes como una forma de aplicar herramientas de análisis de datos, visualización y diseño centrado en lo público.
        <br /><br />
        No pretendemos cerrar una conversación, sino abrirla: los datos del 311 cuentan una historia compleja y viva sobre cómo funciona una ciudad y cómo responde a sus ciudadanos.
        <br /><br />
        Si este dashboard resulta útil, interesante o si tenés comentarios o sugerencias, nos encantaría saber de vos.
      </p>

      <div className="bg-white shadow-md rounded-md px-6 py-4 text-gray-800 max-w-md">
        <p className="font-semibold mb-2">Contacto:</p>
        <p>📧 reppens@itba.edu.ar</p>
        <p>📧 gfretes@itba.edu.ar</p>
      </div>

      <p className="text-sm text-gray-500 mt-10">© 2025 - Proyecto ITBA - Datos abiertos del 311 NYC</p>
    </section>
  );
};

export default ConclusionSection;