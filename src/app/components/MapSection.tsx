'use client';

import { useRef, useEffect, useState, memo } from 'react';
import { SectionProps } from '@/types/SectionProps';
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

function MapSection({ id }: SectionProps) {
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
      zoom: 8.6,
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
        m.easeTo({ center: [-73.98, 40.71], zoom: 8.6, duration: 600 });
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
      tip.className = 'map-tooltip fixed bg-white p-2 rounded opacity-80 text-xs text-gray-800 font-bold pointer-events-none';
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
    <section id={id} className="section">
      <h2 className="section-title">
          Tendencia en los Reclamos
      </h2>
      <div className="section-body">
        <p className='paragraph'>
          ¿Qué temas se repiten todos los años en las quejas al 311? ¿Qué cosas dejan de molestar con el tiempo y cuáles parecen estar cada vez más presentes en la vida urbana? Para explorar esas preguntas, creamos dos visualizaciones. El gráfico principal —un bump chart— no muestra cantidades, sino posiciones. Cada línea representa un tipo de reclamo y su lugar dentro del top 6 de los más reportados, año por año. 
          <br /><br />
          Además, el gráfico es interactivo. Si hacés clic sobre un año, podés ver cómo cambió el ranking mes a mes dentro de ese período. Y si tocás en el mapa —que muestra la densidad de reclamos por barrio—, podés ver esa misma evolución, pero recortada para un distrito puntual. Cuanto más oscuro el color en el mapa, más quejas hubo ese año en esa zona. La idea es cruzar tiempo y territorio para entender qué le molesta a cada parte de la ciudad, y cuándo.
        </p>
        <div className="flex flex-col lg:flex-row items-start w-full  my-[2%]">
          <div className="relative flex flex-col w-full lg:w-1/3 h-[50vh] flex-none my-0">
            <div ref={mapDiv} className="w-full h-full rounded-lg" />
            <div className="absolute text-center whitespace-nowrap left-1/2 -translate-x-1/2 top-2 bg-transparent text-[14px] text-gray-700 font-bold pointer-events-none">
              Densidad de Reclamos{selectedYear? ` Durante ${selectedYear}` : ""}
            </div>
            <div className="absolute bottom-2 right-2 bg-transparent text-[12px] text-gray-700 px-2 py-1 rounded pointer-events-none">
              <i>{selected ? '* Hacé click devuelta para volver al mapa completo' : '* Hacé click en un distrito para filtrar'}</i>
            </div>
          </div>
          <div className="relative flex flex-col w-full lg:w-2/3 lg:flex-grow h-[50vh]">
            <ComplaintTypeBumpChart selected={selected} selectedYear={selectedYear} onYearSelect={setSelectedYear} />
            <div className="absolute text-center font-bold whitespace-nowrap left-1/2 -translate-x-1/2 top-2 bg-transparent text-[14px] text-gray-700 pointer-events-none">
              Evolución del Ranking: Top 6 Tipos de Quejas Más Frecuentes{selected? ` en ${selected}` : ""}{selectedYear? ` Durante ${selectedYear}` : ""}
            </div>
            <div className={ selectedYear? "hidden" : "absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm text-[12px] text-gray-700 px-2 py-1 rounded pointer-events-none"}>
              <i>* Hacé click en un punto para ver la evolución de ese año</i>
            </div>
          </div>
        </div>
    
        <p className='paragraph'>
          Si seguís la historia desde la sección anterior, vale la pena hacer el ejercicio: clic en 2022, clic en Bronx. Lo que aparece en pantalla confirma lo que ya vimos, pero con más nitidez. En julio de ese año —el primer verano sin restricciones desde el inicio de la pandemia— los tres reclamos más frecuentes en el Bronx estuvieron directamente vinculados al ruido: residencial, en la vía pública y vehicular. 
          <br /><br />
          Más allá de esto, hay patrones más profundos que vale la pena destacar. El ruido residencial se mantuvo en el ranking de reclamos durante todos los años analizados, sin excepción. Es la única categoría que no soltó nunca el top 3, reflejando que —a diferencia de otras molestias más puntuales— el ruido es una incomodidad estructural en la vida urbana neoyorquina. Le sigue el estacionamiento ilegal, que empieza a escalar posiciones con fuerza a partir de 2015 y se consolida como reclamo masivo en la pospandemia, cuando la cantidad de autos particulares creció y el espacio público empezó a tensarse más que nunca. Como señala un informe del <a
            href='https://www.osc.ny.gov/files/reports/pdf/report-3-2026.pdf' 
            target="_blank" rel="noopener noreferrer" 
            className="text-blue-600 underline hover:text-blue-800">
          Comptroller del Estado</a>, esta es hoy la infracción no urgente más denunciada del sistema. Algo similar ocurre con la calefacción y el agua caliente, que entran en escena desde 2014. Un estudio del <a
            href='https://www.publichealth.columbia.edu/news/survey-reveals-extent-energy-insecurity-new-york-city' 
            target="_blank" rel="noopener noreferrer" 
            className="text-blue-600 underline hover:text-blue-800">
          Departamento de Salud de Columbia</a> advierte que la persistencia de este reclamo en ciertas zonas revela no solo problemas de infraestructura, sino también efectos directos en la salud de la población.
          <br /><br />
          El bump chart también permite ver qué tipos de reclamos fueron perdiendo fuerza o desapareciendo del radar. Problemas como la fontanería, el estado del alumbrado público o los baches —que solían estar presentes en los primeros años de la serie— fueron desplazados por demandas que reflejan tensiones más ligadas a la convivencia urbana. No necesariamente significa que esos problemas fueron resueltos, pero sí que dejaron de estar en el centro de la conversación ciudadana.
        </p>
      </div>
      

    </section>
  );
}

export default memo(MapSection);
