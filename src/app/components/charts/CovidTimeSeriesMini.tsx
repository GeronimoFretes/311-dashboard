import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { periodColors, periodRanges } from '../../../utils/colors';

interface Row { yearMonth: string; total: number; rate: number; }
interface ChartRecord { yearMonth: string; pre: number | null; covid: number | null; post: number | null; }

const parseYearMonth = (ym: string): Date => {
  const [year, month] = ym.replace(/"/g, '').split('-').map(Number);
  return new Date(year, month - 1, 1);
};

const CovidTimeSeriesMini: React.FC = () => {
  const [records, setRecords] = useState<ChartRecord[]>([]);

  useEffect(() => {
    const [preStart, preEnd] = periodRanges.pre.map(parseYearMonth) as Date[];
    const [covidStart, covidEnd] = periodRanges.covid.map(parseYearMonth) as Date[];
    const [postStart, postEnd] = periodRanges.post.map(parseYearMonth) as Date[];

    fetch('/data/complaints_time_series.csv')
      .then(res => res.text())
      .then(csv => {
        const rows: Row[] = csv.trim().split('\n').slice(1).map(line => {
          const [ , ymRaw, totalRaw, rateRaw ] = line.split(',');
          return {
            yearMonth: ymRaw.replace(/"/g, ''),
            total: Number(totalRaw),
            rate: Number(rateRaw)
          };
        });
        const agg = new Map<string, { totalSum: number; popSum: number }>();
        rows.forEach(({ yearMonth, total, rate }) => {
          const pop = rate > 0 ? (total * 10000) / rate : 0;
          const cur = agg.get(yearMonth) || { totalSum: 0, popSum: 0 };
          cur.totalSum += total;
          cur.popSum += pop;
          agg.set(yearMonth, cur);
        });
        const out: ChartRecord[] = Array.from(agg.entries())
          .map(([ym, { totalSum, popSum }]) => {
            const rate = popSum > 0 ? (totalSum / popSum) * 10000 : 0;
            const date = parseYearMonth(ym);
            return {
              yearMonth: ym,
              pre: date >= preStart && date <= covidStart ? rate : null,
              covid: date >= covidStart && date <= postStart ? rate : null,
              post: date >= postStart && date <= postEnd ? rate : null
            };
          })
          .filter(r => r.pre !== null || r.covid !== null || r.post !== null)
          .sort((a, b) => a.yearMonth.localeCompare(b.yearMonth));
        setRecords(out);
      });
  }, []);

  const option = {
    grid: { top: 10, right: 10, bottom: 10, left: 10, containLabel: true },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any[]) => {
        const p = params.find(item => item.value != null);
        if (!p) return '';
        return `${p.marker} ${p.seriesName}<br/>${p.value.toFixed(0)} reclamos por cada 10 000<br/>habitantes durante ${p.axisValueLabel}`;
      }
    },
    xAxis: {
      type: 'category',
      data: records.map(r => r.yearMonth),
      axisLine:  { show: false },
      axisLabel: { show: false },
      axisTick: { show: false }
    },
    yAxis: { type: 'value'},
    series: [
      {
        name: 'Pre-COVID',
        type: 'line',
        data: records.map(r => r.pre),
        connectNulls: false,
        showSymbol: false,
        itemStyle: { color: periodColors.pre },
        lineStyle: { width: 4 }
      },
      {
        name: 'Durante COVID',
        type: 'line',
        data: records.map(r => r.covid),
        connectNulls: false,
        showSymbol: false,
        itemStyle: { color: periodColors.covid },
        lineStyle: { width: 4 }
      },
      {
        name: 'Post-COVID',
        type: 'line',
        data: records.map(r => r.post),
        connectNulls: false,
        showSymbol: false,
        itemStyle: { color: periodColors.post },
        lineStyle: { width: 4 }
      }
    ]
  };

  return (
    <div className="h-full w-full">
      {/* <h4 className="text-lg font-medium mb-4">Evolución mensual de quejas por 10 000 hab.</h4> */}
      <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
    </div>
  );
};

export default CovidTimeSeriesMini;
