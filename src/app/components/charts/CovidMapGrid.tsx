import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import Papa from 'papaparse';
import { periodRanges, periodColors, periodLabels } from '../../../utils/colors';

interface RawRow {
  borough: string;
  year_month: string;
  total_complaints: number;
  complaints_per_10000: number;
}

type PeriodKey = 'pre' | 'covid' | 'post';

const BOUNDS: Record<string, [[number, number], [number, number]]> = {
  Manhattan: [[-74.0479, 40.6839], [-73.9067, 40.8820]],
  Brooklyn: [[-74.0419, 40.5707], [-73.8334, 40.7394]],
  Queens: [[-73.9626, 40.5417], [-73.7004, 40.8007]],
  Bronx: [[-73.9339, 40.7855], [-73.7654, 40.9153]],
  'Staten Island': [[-74.2556, 40.4960], [-74.0522, 40.6517]],
};

function canonical(raw: any): string | null {
  if (!raw) return null;
  const s = raw.toString().toLowerCase();
  if (s.includes('brooklyn')) return 'Brooklyn';
  if (s.includes('manhattan') || s.includes('new york')) return 'Manhattan';
  if (s.includes('bronx')) return 'Bronx';
  if (s.includes('queens')) return 'Queens';
  if (s.includes('staten')) return 'Staten Island';
  return null;
}

// Linear interpolate between white and a target color
function shadeValue(value: number, min: number, max: number, hex: string) {
  const tLinear = max === min ? 0.5 : (value - min) / (max - min);
  // const t = 0.2 + 0.8 * Math.sqrt(tLinear);
  const t = Math.sqrt(tLinear);
  const [r2, g2, b2] = hex.replace('#', '').match(/.{2}/g)!.map(h => parseInt(h, 16));
  const lerp = (a: number, b: number) => Math.round(a + (b - a) * t);
  const r = lerp(255, r2);
  const g = lerp(255, g2);
  const b = lerp(255, b2);
  return `#${[r, g, b].map(c => c.toString(16).padStart(2, '0')).join('')}`;
}

const CovidMapGrid: React.FC = () => {
  const containerRefs = {
    pre: useRef<HTMLDivElement>(null),
    covid: useRef<HTMLDivElement>(null),
    post: useRef<HTMLDivElement>(null),
  };

  useEffect(() => {
    const initialize = async () => {
      const geoJson = await fetch('/data/nyc_boroughs.geojson').then(r => r.json());
      const csvText = await fetch('/data/complaints_time_series.csv').then(r => r.text());
      const parsed = Papa.parse<RawRow>(csvText, { header: true, dynamicTyping: true }).data;

      // Prepare date boundaries
      const boundaries: Record<PeriodKey, [Date, Date]> = {
        pre: periodRanges.pre.map(d => new Date(d + '-01')) as [Date, Date],
        covid: periodRanges.covid.map(d => new Date(d + '-01')) as [Date, Date],
        post: periodRanges.post.map(d => new Date(d + '-01')) as [Date, Date],
      };

            // Compute static population per borough
      const popMap: Record<string, number> = {};
      parsed.forEach(r => {
        const boro = canonical(r.borough);
        if (!boro) return;
        if (!popMap[boro] && r.complaints_per_10000 > 0) {
          popMap[boro] = (r.total_complaints * 10000) / r.complaints_per_10000;
        }
      });
      console.log(popMap);

      // Aggregate per borough and period using fixed population
      const agg: Record<PeriodKey, Record<string, { sum: number; pop: number }>> = {
        pre: {}, covid: {}, post: {}
      };
      parsed.forEach(r => {
        const boro = canonical(r.borough);
        if (!boro) return;
        const [year, month] = r.year_month.split('-').map(Number);
        const date = new Date(year, month - 1, 1);
        (Object.keys(boundaries) as PeriodKey[]).forEach(key => {
          const [start, end] = boundaries[key];
          if (date >= start && date <= end) {
            const rec = agg[key][boro] || { sum: 0, pop: popMap[boro] || 0 };
            rec.sum += r.total_complaints;
            // assign fixed population
            rec.pop = popMap[boro] || rec.pop;
            agg[key][boro] = rec;
          }
        });
      });
      console.log(agg);
      // Compute global min/max across all periods
      const allRates = ([] as number[]).concat(...(Object.keys(agg) as PeriodKey[]).map(k =>
        Object.values(agg[k]).map(({ sum, pop }) => (pop>0 ? (sum/pop)*10000 : 0))
      ));
      const globalMin = Math.min(...allRates);
      const globalMax = Math.max(...allRates);

      // Create maps using fixed global scale
      (['pre', 'covid', 'post'] as PeriodKey[]).forEach(key => {
        const container = containerRefs[key].current;
        if (!container) return;
        const m = new maplibregl.Map({
          attributionControl: false,
          container,
          style: {
            version: 8,
            sources: { boroughs: { type: 'geojson', data: geoJson } },
            layers: [
              { id: 'bg', type: 'background', paint: { 'background-color': '#fff' } },
              { id: 'fill', type: 'fill', source: 'boroughs', paint: { 'fill-color': '#ccc', 'fill-opacity': 0.8 } },
              { id: 'outline', type: 'line', source: 'boroughs', paint: { 'line-color': '#fff', 'line-width': 1 } },
            ]
          },
          center: [-73.98, 40.71],
          zoom: 8,
          interactive: false,
        });

        // Compute shading
        const rates = Object.entries(agg[key]).map(([name, { sum, pop }]) => ({
          name,
          value: pop > 0 ? (sum / pop) * 10000 : 0
        }));
        // Global scale across all periods
        const min = globalMin;
        const max = globalMax;
        const matchExpr: any[] = ['match', ['get', 'BoroName']];
        rates.forEach(r => matchExpr.push(
          r.name,
          shadeValue(r.value, min, max, periodColors[key])
        ));
        matchExpr.push('#ccc');

        m.on('load', () => {
          m.setPaintProperty('fill', 'fill-color', matchExpr as any);
        });

        // Hover tooltip behavior (closely emulating MapSection)
        const mapContainer = container;
        mapContainer.addEventListener('mousemove', (e: MouseEvent) => {
          // Convert screen point to map coordinates
          const rect = mapContainer.getBoundingClientRect();
          const px = e.clientX - rect.left;
            const py = e.clientY - rect.top;
            const features = m.queryRenderedFeatures([px, py], { layers: ['fill'] });
          document.querySelectorAll('.map-tooltip').forEach(el => el.remove());
          if (features.length) {
            const feat = features[0];
            const raw = feat.properties?.BoroName;
            const boro = canonical(raw);
            if (!boro) return;
            const rec = agg[key][boro];
            const rate = rec.pop > 0 ? (rec.sum / rec.pop) * 10000 : 0;
            const tip = document.createElement('div');
            tip.className = 'map-tooltip fixed bg-white p-2 rounded shadow text-xs text-gray-800 font-bold pointer-events-none';
            tip.innerHTML = `Durante ${key == 'covid' ? "el COVID" : key =='pre' ? "el período pre-COVID" : "el período post-COVID"}, <strong>${boro}</strong> tuvo<br/>${Math.round(rate)} reclamos por cada 10 000 habitantes`;
            document.body.appendChild(tip);
            tip.style.left = `${e.clientX + 8}px`;
            tip.style.top = `${e.clientY + 8}px`;
          }
        });
        mapContainer.addEventListener('mouseleave', () => {
          document.querySelectorAll('.map-tooltip').forEach(el => el.remove());
        });

        const title = document.createElement('div');
        title.innerText = periodLabels[key];
        title.style.textAlign = 'center';
        title.style.marginBottom = '4px';
        container.prepend(title);
      });
    };
    initialize();
  }, []);

  return (
    <div className="flex space-x-3  items-center justify-center gap-[12%]">
      <div ref={containerRefs.pre} className="w-full max-w-[205px] h-[200px] mx-auto lg:mx-0 flex-shrink-0 rounded-lg" />
      <div ref={containerRefs.covid} className="w-full max-w-[205px] h-[200px] mx-auto lg:mx-0 flex-shrink-0 rounded-lg" />
      <div ref={containerRefs.post} className="w-full max-w-[205px] h-[200px] mx-auto lg:mx-0 flex-shrink-0 rounded-lg" />
    </div>
  );
};

export default CovidMapGrid;
