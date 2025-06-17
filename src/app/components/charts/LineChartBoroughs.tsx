'use client';

import { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

type ViewMode = 'absolute' | 'perCapita';

interface Props {
  viewMode: ViewMode;
}

interface RawRow {
  borough: string;
  year_month: string;
  total_complaints: number;
  complaints_per_10000: number;
}

/* 🎨 Colours */
const BOROUGH_COLORS: Record<string, string> = {
  Brooklyn: '#84BF69',
  Manhattan: '#6AA5E8',
  Bronx: '#F2A65A',
  Queens: '#C177E4',
  'Staten Island': '#8C8C8C',
};
const BOROUGHS = Object.keys(BOROUGH_COLORS);

/* 🔤 Canonical labels */
const CANONICAL: Record<string, string> = {
  BROOKLYN: 'Brooklyn',
  MANHATTAN: 'Manhattan',
  BRONX: 'Bronx',
  QUEENS: 'Queens',
  'STATEN ISLAND': 'Staten Island',
};

export default function BoroughLineChart({ viewMode }: Props) {
  const [rows, setRows] = useState<RawRow[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  /* Load CSV */
  useEffect(() => {
    fetch('/data/complaints_time_series.csv')
      .then((res) => {
        if (!res.ok) throw new Error('CSV not found');
        return res.text();
      })
      .then((csv) => {
        const parsed = Papa.parse<RawRow>(csv, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
        }).data;
        setRows(parsed);
      })
      .catch((err) => console.error('CSV load error:', err));
  }, []);

  /* Wide format for Recharts */
  const chartData = useMemo(() => {
    const byMonth: Record<string, any> = {};
    rows.forEach((r) => {
      const canon = CANONICAL[r.borough.trim().toUpperCase()];
      if (!canon) return;
      const key = r.year_month;
      if (!byMonth[key]) byMonth[key] = { month: key };
      byMonth[key][canon] =
        viewMode === 'absolute'
          ? r.total_complaints
          : r.complaints_per_10000;
    });
    return Object.values(byMonth).sort((a: any, b: any) =>
      a.month > b.month ? 1 : -1
    );
  }, [rows, viewMode]);

  /* Highlight */
  const handleLineClick = (borough: string) =>
    setSelected((prev) => (prev === borough ? null : borough));

  return (
    <ResponsiveContainer width="100%" height={440}>
      <LineChart
        data={chartData}
        margin={{ top: 10, right: 20, left: 20, bottom: 40 }} // extra bottom space for legend
      >
        <CartesianGrid stroke="#f3f3f3" strokeDasharray="3 3" />
        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
        <YAxis
          tick={{ fontSize: 11 }}
          label={{
            value:
              viewMode === 'absolute'
                ? 'Reclamos / mes'
                : 'Reclamos por 10 000 hab.',
            angle: -90,
            position: 'insideLeft',
            style: { textAnchor: 'middle', fontSize: 12, fill: '#555' },
          }}
        />
        <Tooltip
          formatter={(v: any) =>
            viewMode === 'absolute'
              ? v.toLocaleString('es-AR')
              : v.toFixed(2)
          }
          labelFormatter={(l) => `Mes: ${l}`}
        />

        {/* 📋 Bigger, centered legend beneath chart */}
        <Legend
          verticalAlign="bottom"
          align="center"
          iconSize={18}
          wrapperStyle={{ fontSize: 14 }}
        />

        {BOROUGHS.map((borough) => (
          <Line
            key={borough}
            type="monotone"
            dataKey={borough}
            dot={false}
            stroke={BOROUGH_COLORS[borough]}
            strokeWidth={selected ? (selected === borough ? 3 : 1) : 2}
            strokeOpacity={selected ? (selected === borough ? 1 : 0.2) : 1}
            isAnimationActive={false}
            onClick={() => handleLineClick(borough)}
            style={{ cursor: 'pointer' }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
