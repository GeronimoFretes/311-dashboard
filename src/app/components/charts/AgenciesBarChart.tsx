'use client';

import 'd3-transition';
import React, { useEffect, useRef, useState } from 'react';
import { csv } from 'd3-fetch';
import { select } from 'd3-selection';
import { scaleLinear, scaleBand, scaleOrdinal } from 'd3-scale';
import { max } from 'd3-array';
import { easeCubicInOut } from 'd3-ease';
import type { ScaleOrdinal } from 'd3-scale';
import { translateAgencyName } from '@/utils/agencyTranslator'

interface DataRow {
  month_year: string;
  agency: string;
  agency_name_es: string;
  complaint_count: number;
}

// Convierte cualquier texto a Title Case
function titleCase(str: string) {
  return str
    .toLowerCase()
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

const CHART_WIDTH = 1100;
const CHART_HEIGHT = 500;
const MARGIN = { top: 40, right: 150, bottom: 20, left: 200 };
const TRANSITION_DURATION = 400;
const TICK_INTERVAL = 400;

const LIGHT_PALETTE = [
  '#a6cee3', '#b2df8a', '#fb9a99', '#fdbf6f',
  '#cab2d6', '#ffff99', '#1f78b4', '#33a02c',
  '#e31a1c', '#ff7f00', '#6a3d9a', '#b15928'
];

const AgencyBarRace: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const dataMap = useRef<Map<string, DataRow[]>>(new Map());
  const months = useRef<string[]>([]);
  const colorScaleRef = useRef<ScaleOrdinal<string, string>>(null!);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(true);

  useEffect(() => {
    csv<DataRow>('/data/TopAgencies.csv', d => ({
      month_year: d.month_year,
      agency: d.agency,
      // Aplico titleCase aquí
      agency_name_es: titleCase(translateAgencyName(d.agency_name_es)),
      complaint_count: +d.complaint_count,
    }))
      .then(data => {
        // Agrupo por mes
        data.forEach(d => {
          if (!dataMap.current.has(d.month_year)) dataMap.current.set(d.month_year, []);
          dataMap.current.get(d.month_year)!.push(d);
        });
        months.current = Array.from(dataMap.current.keys()).sort();

        // Configuro el color scale sobre agency code
        const allAgencies = Array.from(new Set(data.map(d => d.agency)));
        colorScaleRef.current = scaleOrdinal<string, string>()
          .domain(allAgencies)
          .range(LIGHT_PALETTE);

        initChart();
        setPaused(false);
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setCurrentIndex(i => (i + 1) % months.current.length);
    }, TICK_INTERVAL);
    return () => window.clearInterval(id);
  }, [paused]);

  useEffect(() => {
    if (months.current.length) updateChart(currentIndex);
  }, [currentIndex]);

  const initChart = () => {
    select(svgRef.current!)
      .attr('viewBox', `-${MARGIN.left} 0 ${CHART_WIDTH + MARGIN.left} ${CHART_HEIGHT}`)
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .append('g')
      .attr('class', 'chart-group');
  };

  const updateChart = (idx: number) => {
    const svg = select(svgRef.current!);
    const group = svg.select<SVGGElement>('.chart-group');
    const month = months.current[idx];
    const data = (dataMap.current.get(month) || [])
      .sort((a, b) => b.complaint_count - a.complaint_count)
      .slice(0, 15);

    const x = scaleLinear()
      .domain([0, max(data, d => d.complaint_count)!])
      .range([MARGIN.left, CHART_WIDTH - MARGIN.right]);

    const y = scaleBand<string>()
      .domain(data.map(d => d.agency_name_es))
      .range([MARGIN.top, CHART_HEIGHT - MARGIN.bottom])
      .padding(0.1);

    // Barras
    const bars = group.selectAll<SVGRectElement, DataRow>('rect.bar').data(data, d => d.agency_name_es);
    bars.exit()
      .transition().duration(TRANSITION_DURATION).ease(easeCubicInOut)
      .attr('width', 0).remove();
    bars.enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', MARGIN.left)
      .attr('y', d => y(d.agency_name_es)!)
      .attr('height', y.bandwidth())
      .attr('fill', d => colorScaleRef.current(d.agency))
      .attr('rx', 6)
      .attr('width', 0)
      .transition().duration(TRANSITION_DURATION).ease(easeCubicInOut)
      .attr('width', d => x(d.complaint_count) - MARGIN.left);
    bars.transition().duration(TRANSITION_DURATION).ease(easeCubicInOut)
      .attr('y', d => y(d.agency_name_es)!)
      .attr('width', d => x(d.complaint_count) - MARGIN.left);

    // Valores
    const counts = group.selectAll<SVGTextElement, DataRow>('text.count').data(data, d => d.agency_name_es);
    counts.exit().remove();
    counts.enter()
      .append('text')
      .attr('class', 'count')
      .attr('fill', '#000')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .attr('x', d => x(d.complaint_count) + 5)
      .attr('y', d => y(d.agency_name_es)! + y.bandwidth() / 2)
      .attr('dy', '0.35em')
      .merge(counts)
      .transition().duration(TRANSITION_DURATION).ease(easeCubicInOut)
      .attr('x', d => x(d.complaint_count) + 5)
      .attr('y', d => y(d.agency_name_es)! + y.bandwidth() / 2)
      .text(d => d.complaint_count.toLocaleString());

    // Nombres
    const names = group.selectAll<SVGTextElement, DataRow>('text.name').data(data, d => d.agency_name_es);
    names.exit().remove();
    names.enter()
      .append('text')
      .attr('class', 'name')
      .attr('fill', '#000')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .attr('x', MARGIN.left - 10)
      .attr('text-anchor', 'end')
      .attr('y', d => y(d.agency_name_es)! + y.bandwidth() / 2)
      .attr('dy', '0.35em')
      .text(d => d.agency_name_es)
      .merge(names)
      .transition().duration(TRANSITION_DURATION).ease(easeCubicInOut)
      .attr('y', d => y(d.agency_name_es)! + y.bandwidth() / 2);
  };

  const handlePauseToggle = () => setPaused(p => !p);
  const handleRestart = () => { setCurrentIndex(0); setPaused(false); };
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaused(true);
    setCurrentIndex(+e.target.value);
  };

  return (
    <div className="flex flex-col items-start gap-4 ">
      <div className="flex flex-row items-center gap-2 mt-0">
        <button
          onClick={handlePauseToggle}
          className={`px-4 py-1 rounded-full border text-sm ${
            paused ? 'bg-[#49A67A] text-white' : 'bg-white text-gray-800'
          }`}
        >
          {paused ? 'Reanudar' : 'Pausar'}
        </button>
        <button
          onClick={handleRestart}
          className="px-4 py-1 rounded-full border bg-white text-gray-800 text-sm"
        >
          Reiniciar
        </button>
        <input
          type="range"
          min={0}
          max={months.current.length - 1}
          value={currentIndex}
          onChange={handleSliderChange}
          className="w-48 accent-[#49A67A]"
        />
        <div className="mt-2">
          <span className="px-4 py-1 bg-white border rounded-full font-bold text-gray-800">
            {months.current[currentIndex]}
          </span>
        </div>
      </div>

      <svg ref={svgRef} className="flex-1 w-full h-auto min-h-[500px]" />
    </div>
  );
};

export default AgencyBarRace;
