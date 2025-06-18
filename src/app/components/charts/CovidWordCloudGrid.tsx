import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import Papa from 'papaparse';
import { periodRanges, periodColors, periodLabels } from '../../../utils/colors';
import { translateComplaintType } from '@/utils/complaintTypeTranslator';

interface RawRow {
  month_year: string;
  complaint_type: string;
  complaint_count: number;
}

type PeriodKey = 'pre' | 'covid' | 'post';

const parseYearMonth = (ym: string): Date => {
  const [y, m] = ym.split('-').map(Number);
  return new Date(y, m - 1, 1);
};

function titleCase(str: string) {
  return str
    .toLowerCase()
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

const CovidWordCloudGrid: React.FC = () => {
  const [data, setData] = useState<Record<PeriodKey, { name: string; value: number }[]>>({
    pre: [],
    covid: [],
    post: [],
  });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Carga dinámica de la extensión word-cloud
    import('echarts-wordcloud').then(() => {
      fetch('/data/monthly_complaint_type_counts.csv')          // ← nuevo CSV
        .then((r) => r.text())
        .then((csv) => {
          const rows = Papa.parse<RawRow>(csv, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
          }).data;

          // Límites absolutos de cada período
          const boundaries: Record<PeriodKey, [Date, Date]> = {
            pre: periodRanges.pre.map((d) => new Date(d + '-01')) as [Date, Date],
            covid: periodRanges.covid.map((d) => new Date(d + '-01')) as [Date, Date],
            post: periodRanges.post.map((d) => new Date(d + '-01')) as [Date, Date],
          };

          // Conteo acumulado por período y tipo de reclamo
          const freq: Record<PeriodKey, Record<string, number>> = {
            pre: {},
            covid: {},
            post: {},
          };

          rows.forEach((r) => {
            const date = parseYearMonth(r.month_year);
            (['pre', 'covid', 'post'] as PeriodKey[]).forEach((key) => {
              const [start, end] = boundaries[key];
              if (date >= start && date <= end) {
                freq[key][r.complaint_type] =
                  (freq[key][r.complaint_type] || 0) + r.complaint_count;
              }
            });
          });

          // Transformamos a la estructura que requiere ECharts
          const result: Record<PeriodKey, { name: string; value: number }[]> = {
            pre: [],
            covid: [],
            post: [],
          };

          (['pre', 'covid', 'post'] as PeriodKey[]).forEach((key) => {
            result[key] = Object.entries(freq[key])
              .sort((a, b) => b[1] - a[1])                  // orden descendente
              .slice(0, 10)                              
              .map(([name, value]) => ({
                name: titleCase(translateComplaintType(name)),
                value,
              }));
          });

          setData(result);
          setReady(true);
        });
    });
  }, []);

  const renderCloud = (key: PeriodKey) => {
    const option = {
      grid: { top: 0, bottom: 0, left: 0, right: 0, containLabel: true },
      tooltip: { formatter: (p: any) => `${p.name}: ${p.value} reclamos` },
      series: [
        {
          type: 'wordCloud',
          shape: 'circle',
          left: 'center',
          top: 'center',
          width: '100%',
          height: '100%',
          sizeRange: [8, 30],
          rotationRange: [0, 0],
          textStyle: { color: periodColors[key] },
          data: data[key],
        },
      ],
    };

    return (
      <ReactECharts key={key} option={option} style={{ width: '33.33%', height: "100%" }} />
    );
  };

  if (!ready) return null;

  return (
    <div className="flex w-full h-full space-x-3">
      {(['pre', 'covid', 'post'] as PeriodKey[]).map((p) =>
        data[p].length ? renderCloud(p) : <div key={p} className="w-1/3 h-full" />
      )}
    </div>
  );
};

export default CovidWordCloudGrid;
