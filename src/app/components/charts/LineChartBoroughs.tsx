'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import ReactECharts from 'echarts-for-react';

/* ---------- Types ---------- */
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

/* ---------- Style ---------- */
const BOROUGH_COLORS: Record<string, string> = {
  Brooklyn: '#49A67A',
  Manhattan: '#6AA5E8',
  Bronx: '#F2A65A',
  Queens: '#C177E4',
  'Staten Island': '#8C8C8C',
};
const BOROUGHS = Object.keys(BOROUGH_COLORS);

/* Canonical labels from CSV (uppercase) → display */
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
  const [hovered, setHovered] = useState<string | null>(null);

  /* ---------- Load CSV once ---------- */
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

  /* ---------- Transform rows → wide format + xAxis ---------- */
  const { chartData, months } = useMemo(() => {
    const byMonth: Record<string, any> = {};
    rows.forEach((r) => {
      const canon = CANONICAL[r.borough.trim().toUpperCase()];
      if (!canon) return;
      const key = r.year_month;
      if (!byMonth[key]) byMonth[key] = { month: key };
      byMonth[key][canon] =
        viewMode === 'absolute' ? r.total_complaints : r.complaints_per_10000;
    });
    const ordered = Object.values(byMonth).sort((a: any, b: any) =>
      a.month > b.month ? 1 : -1,
    );
    const months = ordered.map((d: any) => d.month);
    return { chartData: ordered, months };
  }, [rows, viewMode]);

  /* ---------- Build ECharts series ---------- */
  const series = useMemo(() => {
    return BOROUGHS.map((borough) => {
      const data = chartData.map((row: any) => row[borough] ?? null);
      const isSelected = selected ? selected === borough : false;
      const isHovered = hovered ? hovered === borough : false;
      const width = hovered
        ? isHovered
          ? 3
          : 1
        : selected
        ? isSelected
          ? 3
          : 1
        : 2;
      const opacity = hovered
        ? isHovered
          ? 1
          : 0.2
        : selected
        ? isSelected
          ? 1
          : 0.2
        : 1;
      return {
        name: borough,
        type: 'line',
        data,
        smooth: true,
        showSymbol: false,
        emphasis: {
          focus: 'series',
        },
        lineStyle: {
          width,
          opacity,
        },
        itemStyle: {
          color: BOROUGH_COLORS[borough],
        },
      };
    });
  }, [chartData, selected, hovered]);

  /* ---------- ECharts option ---------- */
  const option = useMemo(() => {
    return {
      color: BOROUGHS.map((b) => BOROUGH_COLORS[b]),
      tooltip: {
        trigger: 'axis',
        valueFormatter: (value: any) =>
          Number(Math.round(value)).toLocaleString('es-AR'),
      },
      grid: { top: 20, left: 20, right: 20, bottom: 60, containLabel: true },
      legend: {
        bottom: 10,
        type: 'plain',
        textStyle: {
          fontSize: 12,
        },
      },
      xAxis: {
        type: 'category',
        data: months,
        axisLabel: {
          rotate: 0,
          fontSize: 11,
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          fontSize: 11,
        },
      },
      series,
      animation: false,
    } as echarts.EChartsOption;
  }, [months, series, viewMode]);

  /* ---------- Event handlers for hover, leave & click ---------- */
  const onEvents = useMemo(() => {
    return {
      mouseover: (params: any) => {
        if (params.seriesName) {
          setHovered(params.seriesName);
        }
      },
      mouseout: (params: any) => {
        if (params.seriesName) {
          setHovered(null);
        }
      },
      globalout: () => {
        // Mouse left the entire chart area — reset hover
        setHovered(null);
      },
      click: (params: any) => {
        if (params.seriesName) {
          setSelected((prev) => (prev === params.seriesName ? null : params.seriesName));
        }
      },
    } as const;
  }, []);

  /* ---------- Render ---------- */
  return (
    <div className="w-full h-full">
      <ReactECharts
        option={option}
        onEvents={onEvents}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
