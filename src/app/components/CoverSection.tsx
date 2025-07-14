'use client';

import { useEffect, useMemo, useState } from 'react';
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

export default function CoverSection() {
  const [rows, setRows] = useState<CsvRow[]>([]);
  const [topTypes, setTopTypes] = useState<
    { complaint_type: string; total_complaints: number }[]
  >([]);
  const TOP_N = 5;

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
    peakMonth,
    avgDaily,
    sparkData,
  } = useMemo(() => {
    if (!rows.length) {
      return {
        totalComplaints: 0,
        avgMonthly: 0,
        peakMonth: { ym: '', value: 0 },
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

    let peak = { ym: '', value: 0 };
    series.forEach((v, i) => {
      if (v > peak.value) peak = { ym: months[i], value: v };
    });

    // Aproximamos cada mes a 30 días para el promedio diario
    const totalDays = months.length * 30;
    const daily = totalDays ? total / totalDays : 0;

    return {
      totalComplaints: total,
      avgMonthly: avg,
      peakMonth: peak,
      avgDaily: daily,
      sparkData: series,
    };
  }, [rows]);

  return (
    <section className="w-screen h-screen bg-white snap-start">
      {/* Header */}
      <div className="w-screen pt-[2%] flex items-center justify-center gap-1 lg:h-1/7">
        <img
          src="/favicon.ico"
          alt="Logo"
          className="w-10 h-10 md:w-20 md:h-20"
        />
        <h1 className="text-3xl md:text-4xl font-bold text-[#49A67A]">
          311 NYC: Historia y Tendencias
        </h1>
      </div>

      <div className="w-screen flex items-center justify-center">
        <p className="w-screen text-gray-700 pt-2 text-base md:text-lg pb-[1%] text-center w-full lg:h-1/10">
          Herramienta interactiva diseñada para explorar los reclamos al servicio
          311 de la ciudad de Nueva York entre 2010 y 2024.
        </p>
      </div>

      {/* Responsive: stack on small, two columns on lg+ */}
      <div className="flex flex-col gap-6 lg:flex-row w-full lg:h-53/70 p-[1%] items-center">
        {/* Left Column: Metrics */}
        <div className="flex flex-col lg:flex-row lg:w-1/5 h-full items-center">
          <div className="flex flex-col space-y-4 lg:w-[98%] h-full items-end">
            <StatCard
              label="Reclamos totales"
              value={totalComplaints.toLocaleString('es-AR')}
            />
            <StatCard
              label="Promedio mensual"
              value={Math.round(avgMonthly).toLocaleString('es-AR')}
            />
            <StatCard
              label={`Mes pico (${peakMonth.ym})`}
              value={peakMonth.value.toLocaleString('es-AR')}
            />
            <StatCard
              label="Promedio diario"
              value={Math.round(avgDaily).toLocaleString('es-AR')}
            />
          </div>
          <div className="flex flex-col bg-[#49A67A] lg:w-[2%] lg:h-[92%]"></div>
        </div>
        <div className="flex flex-col gap-6 lg:w-4/5 pl-[2%] pr-[2%] pt-[1%] pb-[2%] h-full">
          <div className="flex flex-col lg:flex-row gap-6 w-full lg:h-1/2">
            <div className="w-full lg:w-1/2 ">
              <p className="text-gray-700 text-base font-semibold md:text-md text-start text-justify leading-loose ">
                Para empezar, se muestran algunos indicadores clave: el total
                acumulado de reclamos desde 2010, el promedio mensual, el mes de
                mayor actividad y el promedio diario estimado. A la derecha, se
                destacan los cinco tipos de reclamo con mayor volumen, y justo
                debajo, la serie temporal mensual que muestra cómo evolucionaron
                las quejas durante el período analizado.
              </p>
            </div>
            <div className="w-full lg:w-1/2">
              {topTypes.length > 0 && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topTypes} layout="vertical" margin={{ left: 65 }}>
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
                      tickFormatter={(val: string) =>
                        titleCase(translateComplaintType(val)).replace('- ', '')
                      }
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
          {/* Sparkline */}
          {rows.length > 0 && sparkData.length > 0 && (
            <div className="w-full lg:h-1/2 relative">
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
        </div>
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
    <div className="bg-white rounded-lg p-4 text-right lg:w-8/10 lg:h-1/4">
      <div className="text-4xl font-bold mb-1 text-[#49A67A]">{value}</div>
      <div className="text-gray-500 font-bold text-sm">{label}</div>
    </div>
  );
}
