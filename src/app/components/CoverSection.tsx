"use client";

import { useEffect, useMemo, useState } from 'react';
import { SectionProps } from '@/types/SectionProps';
import Papa from 'papaparse';
import { Sparklines, SparklinesLine } from 'react-sparklines';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LabelList,
} from 'recharts';
import { translateComplaintType } from '@/utils/complaintTypeTranslator';

interface CsvRow {
  borough: string;
  year_month: string; // YYYY-MM
  total_complaints: number;
  complaints_per_10000: number;
}

// Convierte cualquier texto a Title Case
function titleCase(str: string) {
  return str
    .toLowerCase()
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

const wrapLabel = (text: string): string[] => {
  const words = text.split(/\s+/);
  const lines: string[] = [];

  while (words.length) {
    let line = words.shift() as string;

    while (words.length && (line.length + 1 + words[0].length) <= 16) {
      line += ' ' + words.shift();
    }
    lines.push(line);
  }

  return lines;
}

const renderTick = (props: any) => {
  const { x, y, payload } = props;
  const lines = wrapLabel(
    titleCase(translateComplaintType(payload.value)).replace('- ', '')
  );

  const LINE_H = 12;                                   
  const firstDy = -((lines.length - 1) * LINE_H) / 2;

  return (
    <text
      x={x - 4}
      y={y}
      textAnchor="end"
      dominantBaseline="middle"
      fontFamily="Inter, sans-serif"
      fontWeight="bold"
      fontSize={10}
      fill="grey"
    >
      {lines.map((ln, i) => (
        <tspan
          key={i}
          x={x - 4}
          dy={i === 0 ? firstDy : LINE_H}
        >
          {ln}
        </tspan>
      ))}
    </text>
  );
};


export default function CoverSection({ id }: SectionProps) {
  const [rows, setRows] = useState<CsvRow[]>([]);
  const [topTypes, setTopTypes] = useState<
    { complaint_type: string; total_complaints: number }[]
  >([]);
  const TOP_N = 8;

  useEffect(() => {
    fetch('/data/complaints_time_series.csv')
      .then((r) => r.text())
      .then((csv) => {
        const parsed = Papa.parse<CsvRow>(csv, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
        }).data;
        setRows(parsed);
      })
      .catch(console.error);

    fetch('/data/top_complaint_types.csv')
      .then((r) => r.text())
      .then((csv) => {
        const data = Papa.parse<
          { complaint_type: string; total_complaints: number }
        >(csv, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
        }).data;
        const sorted = data.sort(
          (a, b) => b.total_complaints - a.total_complaints
        );
        setTopTypes(sorted.slice(0, TOP_N));
      })
      .catch(console.error);
  }, []);

  const {
    totalComplaints,
    avgMonthly,
    avgYearly,
    avgDaily,
    sparkData,
  } = useMemo(() => {
    if (!rows.length) {
      return {
        totalComplaints: 0,
        avgMonthly: 0,
        avgYearly: 0,
        avgDaily: 0,
        sparkData: [] as number[],
      };
    }

    const total = rows.reduce((s, r) => s + r.total_complaints, 0);
    const months = Array.from(
      new Map(rows.map((r) => [r.year_month, null])).keys()
    ).sort();
    const byMonth: Record<string, number> = {};
    rows.forEach((r) => {
      byMonth[r.year_month] = (byMonth[r.year_month] || 0) + r.total_complaints;
    });
    const series = months.map((m) => byMonth[m]);
    const avg = total / months.length;

    // Compute yearly average
    const years = Array.from(
      new Set(months.map((ym) => ym.slice(0, 4)))
    );
    const avgYear = years.length ? total / years.length : 0;

    // Aproximamos cada mes a 30 días para el promedio diario
    const totalDays = months.length * 30;
    const daily = totalDays ? total / totalDays : 0;

    return {
      totalComplaints: total,
      avgMonthly: avg,
      avgYearly: avgYear,
      avgDaily: daily,
      sparkData: series,
    };
  }, [rows]);

  return (
    <section id={id} className="section">
      <h2 className="section-title">
        Panorama General de los Reclamos
      </h2>

      <div className="section-body">
        <p className='paragraph'>
          Entre 2010 y 2024, el sistema 311 de Nueva York registró más de 37 millones de reclamos. Cada llamado representa un problema concreto, una molestia cotidiana, una demanda ciudadana sobre algo que no está funcionando como debería. Vistos en conjunto, estos datos permiten identificar patrones que se repiten, problemas que persisten en el tiempo, y también otros que, con el tiempo, empiezan a resolverse o pierden relevancia.
          <br /><br />
          Los datos muestran un promedio de más de 200.000 reclamos por mes, con picos notables como el de 2020, en plena pandemia. El contexto lo explica: mayor presión sobre los servicios, convivencia forzada, aislamiento, y una ciudad funcionando al límite. Desde entonces, el volumen bajó, pero nunca volvió a los niveles previos.
        </p>
        <div className="flex flex-col my-[2%] lg:flex-row items-start lg:items-center w-full">
          <div className="flex flex-col space-y-2 lg:w-1/4 items-end">
            <StatCard
              label="Reclamos totales"
              value={totalComplaints.toLocaleString('es-AR')}
            />
            <StatCard
              label="Promedio anual"
              value={Math.round(avgYearly).toLocaleString('es-AR')}
            />
            <StatCard
              label="Promedio mensual"
              value={Math.round(avgMonthly).toLocaleString('es-AR')}
            />
            <StatCard
              label="Promedio diario"
              value={Math.round(avgDaily).toLocaleString('es-AR')}
            />
          </div>
          <div className="hidden lg:block lg:w-[5px] self-stretch bg-[#49A67A]  mx-4 flex-shrink-0"/>
          <div className="w-full lg:w-2/3 h-[40vh] min-h-[400px]">
            {topTypes.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topTypes} layout="vertical" margin={{ left: 40 }}>
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="complaint_type"
                    axisLine={false}
                    tickLine={false}
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 'bold',
                      fontSize: 10,
                    }}
                    tick={renderTick}
                  />
                  <Bar dataKey="total_complaints" radius={10} fill="#49A67A">
                    <LabelList
                      dataKey="total_complaints"
                      position="insideRight"
                      formatter={(val: number) => `${(val / 1e6).toFixed(1)}M`}
                      fill="#fff"
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 'bold',
                      }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
        <a href="URL">Link Text</a>
        <p className='paragraph'>
          Al desglosar los reclamos, se nota un patrón que habla mucho sobre la vida cotidiana en Nueva York. El ruido residencial lidera ampliamente, seguido por estacionamiento ilegal, falta de calefacción o agua caliente, entradas de autos bloqueadas y ruido en la vía pública. Estos problemas aparecen una y otra vez, sobre todo en barrios densamente poblados, donde la convivencia entre lo privado y lo público deja poco margen para el descanso o el orden.
          <br /><br />
          El tema del ruido no es nuevo, pero sí creciente. Entre 2010 y 2015 se registraron más de 1,6 millones de reclamos vinculados a ruidos molestos: música fuerte, fiestas, bocinazos, maquinaria. En 2024, los reclamos por ruido superaron los 738.000 —unos 2.000 por día, según <a
            href='https://nypost.com/2025/01/07/lifestyle/the-number-one-reason-new-yorkers-called-311-last-year/' 
            target="_blank" rel="noopener noreferrer" 
            className="text-blue-600 underline hover:text-blue-800">
            NYPost</a>—, y los estudios indican que el problema se profundiza especialmente en los barrios de menores ingresos, como mostró una investigación reciente de la <a
            href='https://www.publichealth.columbia.edu/news/public-housing-service-outages-are-frequent-prolonged-endangering-residents-health' 
            target="_blank" rel="noopener noreferrer" 
            className="text-blue-600 underline hover:text-blue-800">
            Universidad de Columbia.</a>
          <br /><br />
          El estacionamiento ilegal se convirtió en una de las quejas más frecuentes en los últimos años. De acuerdo al reporte del Contralor estatal, esta es la infracción no urgente más denunciada en el sistema 311, con más de 229.000 reclamos acumulados solo desde 2023. La falta de control en calles residenciales, sumada al aumento de vehículos privados tras la pandemia, generó una ola de reclamos por autos mal estacionados, muchos de ellos bloqueando entradas o hidrantes, dificultando incluso el paso de bomberos.
          <br /><br />
          Otro tema crítico es el de la calefacción. Entre 2017 y 2021, más de 800.000 reclamos al 311 denunciaron la falta de calor en viviendas. El problema no solo persiste, sino que se intensifica: durante la temporada 2022‑2024, los reclamos por calefacción aumentaron un 17 % y superaron los 200.000 anuales. Un estudio reciente del <a
            href='https://www.publichealth.columbia.edu/news/public-housing-service-outages-are-frequent-prolonged-endangering-residents-health' 
            target="_blank" rel="noopener noreferrer" 
            className="text-blue-600 underline hover:text-blue-800">
          Departamento de Salud Pública de Columbia</a> advierte que la falta de calefacción tiene impactos directos en la salud física y mental, sobre todo en poblaciones mayores y en situación de pobreza energética.
          <br /><br />
          Cuando se mira la evolución de los reclamos, la curva cuenta su propia historia. Arranca suave en 2010, con un ritmo estable, pero a partir de 2020 se acelera con fuerza. La pandemia, el encierro, el desgaste urbano… todo se acumula. Pero también algo cambia en la ciudadanía: se reclama más y el 311 se vuelve una vía cada vez más natural para canalizar ese malestar.
        </p>
        {rows.length > 0 && sparkData.length > 0 && (
            <div className="w-full lg:h-1/2 relative my-[2%]">
              <div className="absolute inset-0">
                <span className="absolute bottom-0 left-0 text-[60px] font-bold text-gray-400 opacity-50 leading-none">
                  {rows[0].year_month.slice(0, 4)}
                </span>
                <span className="absolute bottom-0 right-0 text-[60px] font-bold text-gray-400 opacity-50 leading-none">
                  {rows[rows.length - 1].year_month.slice(0, 4)}
                </span>
              </div>
              <div className="w-full h-full">
                <Sparklines data={sparkData} style={{ width: '100%', height: '100%' }}>
                  <SparklinesLine
                    style={{ strokeWidth: 1, stroke: '#49A67A', fill: 'none' }}
                  />
                </Sparklines>
              </div>
            </div>
          )}
          <p className='paragraph'>
            Este primer recorrido muestra que los datos del 311 no solo sirven para contar cuántos reclamos se hacen, sino también para entender qué tipo de problemas afectan con más frecuencia a los neoyorquinos y cómo cambian a lo largo del tiempo. Sin embargo, los problemas no se distribuyen de manera uniforme en la ciudad: algunos barrios reclaman más, otros lo hacen menos, y ese desequilibrio dice mucho sobre las condiciones de vida, el acceso a servicios y la capacidad de respuesta estatal. Para entender esa dimensión territorial, en la siguiente sección analizamos cómo evolucionaron los reclamos por distrito a lo largo del tiempo para ver dónde se escuchan más las quejas.
          </p>
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="bg-white rounded-lg py-4 text-right lg:w-8/10 lg:h-1/4">
      <div className="text-4xl font-bold mb-1 text-[#49A67A]">{value}</div>
      <div className="text-gray-500 font-bold text-sm">{label}</div>
    </div>
  );
}
