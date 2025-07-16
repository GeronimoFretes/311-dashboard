'use client';

import { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import ReactECharts from 'echarts-for-react';
import { translateComplaintType } from '@/utils/complaintTypeTranslator';
import { title } from 'process';

interface Props {
  selected: string | null;
  selectedYear?: string | null;
  onYearSelect: (year: string | null) => void;
}
interface RawRowGeneral {
  month_year: string; // "YYYY-MM"
  complaint_type: string;
  rank: number;
  cantidad_reclamos: number;
}
interface RawRowBorough extends RawRowGeneral {
  borough: string;
  complaint_count: number;
}
type RawRow = RawRowGeneral & Partial<RawRowBorough>;

// Convierte cualquier texto a Title Case
function titleCase(str: string) {
  return str
    .toLowerCase()
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export default function ComplaintTypeBumpChart({ selected, selectedYear = null, onYearSelect }: Props) {
  const [rawRows, setRawRows] = useState<RawRow[]>([]);
  const [drilledYear, setDrilledYear] = useState<string | null>(null);

  // Load CSV and reset drill state
  useEffect(() => {
    const path = selected
      ? '/data/top_10_complaint_types.csv'
      : '/data/top_10_complaint_types_general.csv';
    fetch(path)
      .then(res => res.text())
      .then(csv => {
        const parsed = Papa.parse<RawRow>(csv, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
        }).data;
        // filter by selected borough
        const rowsToUse = selected
          ? parsed.filter(r => (r.borough || '').toLowerCase() === selected.toLowerCase())
          : parsed;
        setRawRows(rowsToUse);
        setDrilledYear(selectedYear);
        // if(onYearSelect) onYearSelect(null);
      })
      .catch(console.error);
  }, [selected]);

  // Compute chart option
  const option = useMemo(() => {
    if (rawRows.length === 0) return null;

    // Determine periods (years or months)
    const periods = drilledYear
      ? Array.from(
          new Set(
            rawRows.filter(r => r.month_year.startsWith(drilledYear)).map(r => r.month_year)
          )
        ).sort()
      : Array.from(
          new Set(rawRows.map(r => r.month_year.slice(0, 4)))
        ).sort();

    // Build ranking and count maps per period
    const top10ByPeriod: Record<string, Record<string, number>> = {};
    const countMap: Record<string, Record<string, number>> = {};
    periods.forEach(period => {
      const subset = drilledYear
        ? rawRows.filter(r => r.month_year === period)
        : rawRows.filter(r => r.month_year.slice(0, 4) === period);
      const counts: Record<string, number> = {};
      subset.forEach(r => {
        const cnt = (r as RawRowBorough).complaint_count ?? r.cantidad_reclamos;
        counts[r.complaint_type] = (counts[r.complaint_type] || 0) + cnt;
      });
      const ranked = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6);
      top10ByPeriod[period] = {};
      countMap[period] = {};
      ranked.forEach(([type, value], idx) => {
        top10ByPeriod[period][type] = idx + 1;
        countMap[period][type] = value;
      });
    });

    // Compute start/end label maps
    const firstPeriod = periods[0];
    const lastPeriod = periods[periods.length - 1];
    const startNames: Record<number, string> = {};
    const endNames: Record<number, string> = {};
    Object.entries(top10ByPeriod[firstPeriod]).forEach(([type, rank]) => {
      startNames[rank] = type;
    });
    Object.entries(top10ByPeriod[lastPeriod]).forEach(([type, rank]) => {
      endNames[rank] = type;
    });

    // Series data
    const types = Array.from(
      new Set(Object.values(top10ByPeriod).flatMap(m => Object.keys(m)))
    );
    const series = types.map(type => {
      const data = periods.map(period => {
        const rank = top10ByPeriod[period][type];
        return rank !== undefined ? rank : null;
      });
      return {
        name: type,
        type: 'line',
        data,
        connectNulls: false,
        smooth: true,
        symbol: 'circle',
        symbolSize: 12,
        lineStyle: { width: 5 },
        emphasis: { focus: 'series' },
        markPoint: {
          symbol: 'none',
          data: [
            { coord: [firstPeriod, top10ByPeriod[firstPeriod][type]], label: { show: true, position: 'insideLeft', formatter: type } },
            { coord: [lastPeriod, top10ByPeriod[lastPeriod][type]], label: { show: true, position: 'insideRight', formatter: type } }
          ]
        }
      };
    });

    return {
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          const period = params.name;
          const type = params.seriesName;
          const cnt = countMap[period]?.[type] || 0;
          return `<strong>${titleCase(translateComplaintType(type))}</strong><br/>${period}: ${cnt} reclamos`;
        },
      },
      legend: { show: false },
      xAxis: { type: 'category', data: periods, boundaryGap: false, axisLabel: { rotate: 0, fontSize: 10 } },
      yAxis: [
        {
          type: 'value',
          min: 1,
          max: 6,
          inverse: true,
          position: 'left',
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: {
            interval: 0,
            formatter: (v: number) => {
              // 1. Texto base
              let label = startNames[v] || '';
              label = translateComplaintType(label).replace(/-\s*/g, '');                      // quita “- ” o “-”
              const words = titleCase(label).split(' ');

              // 2. Casos cortos: 1-2 palabras
              if (words.length <= 2) {
                return words.join('\n');                               // 1 o 2 líneas como estén
              }

              // 3. Balancear en 2 líneas basadas en longitud total de caracteres
              const totalChars = words.reduce((sum, w) => sum + w.length, 0);
              const target = totalChars / 2;

              let acc = 0;
              let split = 0;                                           // índice de corte
              for (let i = 0; i < words.length; i++) {
                acc += words[i].length;
                if (acc >= target) {
                  split = i + 1;                                       // primera palabra de la 2ª línea
                  break;
                }
              }

              const line1 = words.slice(0, split).join(' ');
              const line2 = words.slice(split).join(' ');

              return `${line1}\n${line2}`.trim();                      // siempre ≤ 2 líneas
            }
          }
        },
        {
          type: 'value',
          min: 1,
          max: 6,
          inverse: true,
          position: 'right',
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: {
            interval: 0,
            formatter: (v: number) => {
              // 1. Texto base
              let label = endNames[v] || '';
              label = translateComplaintType(label).replace(/-\s*/g, '');                      // quita “- ” o “-”
              const words = titleCase(label).split(' ');

              // 2. Casos cortos: 1-2 palabras
              if (words.length <= 2) {
                return words.join('\n');                               // 1 o 2 líneas como estén
              }

              // 3. Balancear en 2 líneas basadas en longitud total de caracteres
              const totalChars = words.reduce((sum, w) => sum + w.length, 0);
              const target = totalChars / 2;

              let acc = 0;
              let split = 0;                                           // índice de corte
              for (let i = 0; i < words.length; i++) {
                acc += words[i].length;
                if (acc >= target) {
                  split = i + 1;                                       // primera palabra de la 2ª línea
                  break;
                }
              }

              const line1 = words.slice(0, split).join(' ');
              const line2 = words.slice(split).join(' ');

              return `${line1}\n${line2}`.trim();                      // siempre ≤ 2 líneas
            }
          }
        }
      ],
      grid: { left: '12%', right: '12%', top: 50, bottom: '15%' },
      series
    };
  }, [rawRows, drilledYear]);

  if (!option) return <div>Loading chart...</div>;

  const onEvents = { click: (params: any) => { if (!drilledYear) { setDrilledYear(params.name); if(onYearSelect) onYearSelect(params.name); } } };

  return (
    <div className='relative h-full w-full' >
      <ReactECharts option={option} onEvents={onEvents} style={{ height: '100%', width: '100%' }} />
      {drilledYear && (
        <button
          onClick={() => { setDrilledYear(null); if(onYearSelect) onYearSelect(null); }}
          className={`absolute bottom-1 left-1/2 -translate-x-1/2 px-3 py-7/10 rounded-full border bg-[#49A67A] text-white border-[#49A67A] transition shadow`}
        >
          Vista anual
        </button>
      )}
    </div>
  );
}
