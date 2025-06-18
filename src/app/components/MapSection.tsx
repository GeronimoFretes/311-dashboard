'use client';

import { useRef, useEffect, useState, memo } from 'react';
import Papa from 'papaparse';
import maplibregl, { Map, MapMouseEvent, MapLayerMouseEvent } from 'maplibre-gl';
import ComplaintTypeBumpChart from './charts/ComplaintTypeBumpChart';
import 'maplibre-gl/dist/maplibre-gl.css';

/* Constants */
const GEOJSON_URL = '/data/nyc_boroughs.geojson';
const BORO_PROP = 'BoroName';
const BOUNDS: Record<string, [[number, number], [number, number]]> = {
  Manhattan: [[-74.0479, 40.6839], [-73.9067, 40.8820]],
  Brooklyn: [[-74.0419, 40.5707], [-73.8334, 40.7394]],
  Queens: [[-73.9626, 40.5417], [-73.7004, 40.8007]],
  Bronx: [[-73.9339, 40.7855], [-73.7654, 40.9153]],
  'Staten Island': [[-74.2556, 40.4960], [-74.0522, 40.6517]],
};
const LABEL_OFFSETS: Record<string, [number, number]> = {
  Queens: [0, -40],
  Bronx: [-10, -5],
  Manhattan: [-20, 0],
  Brooklyn: [-5, 0],
};

function canonical(raw: any): string | null {
  if (!raw) return null;
  const s = raw.toString().toLowerCase();
  if (s.startsWith('brooklyn')) return 'Brooklyn';
  if (s.startsWith('manhattan') || s.startsWith('new york')) return 'Manhattan';
  if (s.startsWith('bronx')) return 'Bronx';
  if (s.startsWith('queens')) return 'Queens';
  if (s.startsWith('staten')) return 'Staten Island';
  return null;
}

function shadeValue(value: number, min: number, max: number): string {
  const tLinear = max === min ? 0.5 : (value - min) / (max - min);
  const t = 0.2 + 0.8 * Math.sqrt(tLinear);
  const L = 90 - t * 50;
  const l = L / 100;
  const a = 40 * Math.min(l, 1 - l) / 100;
  const h = 105;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const col = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * col).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function MapSection() {
  const mapDiv = useRef<HTMLDivElement>(null);
  const map = useRef<Map | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const selectedYearRef = useRef<string | null>(selectedYear);
  const selectedRef = useRef<string | null>(null);
  const labelMarkersRef = useRef<Record<string, maplibregl.Marker>>({});
  const historyRef = useRef<Record<string, number[]>>({});
  const medianRef = useRef<Record<string, number>>({});

  useEffect(() => {
    if (!mapDiv.current) return;

    map.current = new maplibregl.Map({
      container: mapDiv.current,
      style: {
        version: 8,
        sources: { boroughs: { type: 'geojson', data: GEOJSON_URL } },
        layers: [
          { id: 'bg', type: 'background', paint: { 'background-color': '#fff' } },
          { id: 'fill', type: 'fill', source: 'boroughs', paint: { 'fill-opacity': 0.85 } },
          { id: 'line', type: 'line', source: 'boroughs', paint: { 'line-color': '#fff', 'line-width': 1 } },
        ],
      },
      center: [-73.98, 40.71],
      zoom: 8.8,
      minZoom: 0,
      attributionControl: false,
    });

    const m = map.current;
    // Add HTML labels
    m.on('load', () => {
      Object.entries(BOUNDS).forEach(([boro, [[minLon, minLat], [maxLon, maxLat]]]) => {
        const center: [number, number] = [(minLon + maxLon) / 2, (minLat + maxLat) / 2];
        const el = document.createElement('div');
        el.className = 'absolute text-gray-600 text-sm font-semibold pointer-events-none';
        el.style.transform = 'translate(-50%, -50%)';
        el.innerText = boro;
        const offset = LABEL_OFFSETS[boro] || [0, 0];
        const marker = new maplibregl.Marker({ element: el, anchor: 'center', offset })
          .setLngLat(center)
          .addTo(m);
        labelMarkersRef.current[boro] = marker;
      });
    });

    // Disable interactions
    (['scrollZoom', 'boxZoom', 'doubleClickZoom', 'touchZoomRotate', 'dragPan', 'dragRotate'] as (keyof Map)[])
      .forEach(g => { const ctrl = m![g] as any; if (ctrl.disable) ctrl.disable(); });

    // Click to zoom/fade labels
    m.on('click', (e: MapMouseEvent) => {
      const feats = m.queryRenderedFeatures(e.point, { layers: ['fill'] });
      if (!selectedRef.current && feats.length) {
        const raw = feats[0].properties?.[BORO_PROP];
        const boro = canonical(raw);
        if (!boro) return;
        setSelected(boro);
        selectedRef.current = boro;
        m.fitBounds(BOUNDS[boro], { padding: 40, duration: 600 });
        m.once('moveend', () => {
          // Hide other labels
          Object.entries(labelMarkersRef.current).forEach(([key, marker]) => {
            if (key !== boro) marker.getElement().style.display = 'none';
          });
          // Fade fill
          let t = 0;
          const dur = 500, step = 50;
          const fade = () => {
            t += step;
            const p = Math.min(t / dur, 1);
            const o = 0.85 * (1 - p);
            m.setPaintProperty('fill', 'fill-opacity', ['case', ['==', ['get', BORO_PROP], boro], 0.85, o]);
            if (p < 1) setTimeout(fade, step);
          };
          fade();
        });
      } else if (selectedRef.current) {
        setSelected(null);
        selectedRef.current = null;
        // Reset view
        m.easeTo({ center: [-73.98, 40.71], zoom: 8.8, duration: 600 });
        m.once('moveend', () => {
          // Fade fill back
          m.setPaintProperty('fill', 'fill-opacity', 0.85);
          // Gradually show labels
          Object.values(labelMarkersRef.current).forEach(marker => {
            const el = marker.getElement();
            el.style.opacity = '0';
            el.style.display = '';
            el.style.transition = 'opacity 500ms';
            requestAnimationFrame(() => { el.style.opacity = '1'; });
          });
        });
      }
    });

    // Hover tooltips...
    let hoverId: number | null = null;
    m.on('mousemove', 'fill', (e: MapLayerMouseEvent) => {
      document.querySelectorAll('.map-tooltip').forEach(el => el.remove());
      const feat = e.features?.[0]; if (!feat) return;
      const boroName = canonical(feat.properties?.[BORO_PROP]); if (!boroName) return;
      if (selectedRef.current && boroName !== selectedRef.current) return;
      const tip = document.createElement('div');
      tip.className = 'map-tooltip fixed bg-white p-2 rounded  text-xs text-gray-800 font-bold pointer-events-none';
      const med = medianRef.current[boroName] ?? 0;
      const sentence = selectedYearRef.current
        ? `Durante ${selectedYearRef.current}, el mes típico en <strong>${boroName}</strong> tuvo<br/>${Math.round(med)} reclamos por cada 10 000 habitantes`
        : `En un mes típico de <strong>${boroName}</strong>, se registran ${Math.round(med)}<br/>reclamos por cada 10 000 habitantes`;
      tip.innerHTML = sentence;
      document.body.appendChild(tip);
      const rect = mapDiv.current!.getBoundingClientRect();
      tip.style.left = `${rect.left + e.point.x + 8}px`;
      tip.style.top = `${rect.top + e.point.y + 8}px`;
      if (hoverId !== null) m.setFeatureState({ source: 'boroughs', id: hoverId }, { hover: false });
      hoverId = feat.id as number;
      m.setFeatureState({ source: 'boroughs', id: hoverId }, { hover: true });
    });
    m.on('mouseleave', 'fill', () => {
      document.querySelectorAll('.map-tooltip').forEach(el => el.remove());
      if (hoverId !== null) m.setFeatureState({ source: 'boroughs', id: hoverId }, { hover: false });
      hoverId = null;
    });

    const resize = () => m.resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mapDiv.current!);
    window.addEventListener('resize', resize);
    return () => { ro.disconnect(); window.removeEventListener('resize', resize); m.remove(); };
  
  }, []);

  // Load data & color scale...
  useEffect(() => {
    fetch('/data/complaints_time_series.csv')
      .then(r => r.text())
      .then(csv => {
        const rows = Papa.parse<any>(csv, { header: true, dynamicTyping: true, skipEmptyLines: true }).data;
        const totalByBoro: Record<string, number> = {};
        const popByBoro: Record<string, number> = {};
        const hist: Record<string, number[]> = {};
        rows.forEach(r => {
          // filter by selected year if provided
          const ym = r.year_month as string;
          const yr = ym.slice(0, 4);
          if (selectedYear && yr !== selectedYear) return;
          if (selected && canonical(r.borough) !== selected) return;
          const b = canonical(r.borough); if (!b) return;
          const tc = Number(r.total_complaints) || 0;
          const rate = Number(r.complaints_per_10000) || 0;
          totalByBoro[b] = (totalByBoro[b] || 0) + tc;
          if (!popByBoro[b] && rate > 0) popByBoro[b] = (tc * 10000) / rate;
          hist[b] = hist[b] || [];
          hist[b].push(rate);
        });
        const met: Record<string, number> = {};
        Object.entries(totalByBoro).forEach(([b, tot]) => { const pop = popByBoro[b] || 1; met[b] = (tot * 10000) / pop; });
        const med: Record<string, number> = {};
        Object.entries(hist).forEach(([b, arr]) => {
          const s = arr.slice().sort((a, z) => a - z);
          const mid = Math.floor(s.length / 2);
          med[b] = s.length % 2 === 1 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
        });
        historyRef.current = hist;
        medianRef.current = med;
        const vals = Object.values(met);
        const min = Math.min(...vals), max = Math.max(...vals);
        const expr: any = ['match', ['get', BORO_PROP]];
        Object.entries(met).forEach(([b, v]) => expr.push(b, shadeValue(v, min, max)));
        expr.push('#CCCCCC');
        const m = map.current!;
        const apply = () => m.setPaintProperty('fill', 'fill-color', expr);
        m.isStyleLoaded() ? apply() : m.once('load', apply);
      })
      .catch(console.error);
  }, [selectedYear, selected]);

  useEffect(() => {
    selectedYearRef.current = selectedYear;
  }, [selectedYear]);

  return (
    <section className="w-screen h-screen bg-white snap-start">
      {/* Section title */}
      <div className="w-screen lg:h-1/7 flex items-center justify-center ">
        <h2 className="text-3xl font-bold text-gray-900">
          Tendencia en los Reclamos {selectedYear? selectedYear : '2010-2024'}
        </h2>
      </div>
      <div className="w-screen flex flex-col lg:flex-row lg:h-6/7 p-[1%] ">
        <div className="flex flex-col lg:w-1/3 h-full items-center  ">
          <div ref={mapDiv} className="w-full h-full max-w-[390px] h-[380px] rounded-lg" />
          <div className='p-[2%] '>
            <p className="text-gray-700 text-base font-bold md:text-md text-end text-justify">
              <i>"Los neoyorquinos se comunican cada vez más con el 311 para reportar la falta de calefacción y agua caliente, el ruido excesivo en las calles y los autos estacionados ilegalmente"</i>, dijo el Contralor Estatal Thomas P. DiNapoli.
            </p>
          </div>
        </div>
        <div className="flex flex-col lg:w-2/3 pl-[2%] pr-[2%] h-full justify-center ">
          <div className='p-[2%] '>
            <p className="text-gray-700 text-base font-bold md:text-md text-start text-justify">
              El distrito del Bronx concentra la mayor cantidad de quejas registradas por residentes, evidenciado por la intensidad del color en el mapa. En cuanto a los tipos de reclamos, el gráfico de evolución (bump chart) muestra que en el año 2024 las tres categorías más reportadas fueron: estacionamiento ilegal, ruido residencial y problemas de calefacción o agua caliente. Esta clasificación refleja tanto problemáticas estructurales persistentes en los barrios como tensiones derivadas de la vida urbana post-pandemia, en especial en zonas de alta densidad poblacional como el Bronx. La evolución temporal de las quejas también permite observar cómo ciertas molestias, como el estacionamiento, han ganado relevancia en los últimos años.
            </p>
          </div>
          <ComplaintTypeBumpChart selected={selected} selectedYear={selectedYear} onYearSelect={setSelectedYear} />
        </div>
      </div>
    </section>
  );
}

export default memo(MapSection);
