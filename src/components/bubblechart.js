import React from 'react';
import { Chart } from '@nio/ui-kit';
import { withGraphData } from '../providers/pubkeeper';
import tooltip from '../util/tooltip';

export default withGraphData(({ items, maxX, maxY, maxZ }) => (
  <>
    <b>Graph</b>
    <hr className="my-1" />
    <div className="text-xs text-nowrap">
      <b>Select/deselect machines and nozzles above to add/remove items</b>
    </div>
    <div id="chart-holder" className="border-top">
      {items.length > 1 ? (
        <Chart
          type="bubble"
          height="100%"
          options={{
            chart: { zoom: { enabled: false }, toolbar: { show: false } },
            legend: { show: false },
            noData: { text: 'loading' },
            dataLabels: { enabled: false },
            xaxis: {
              min: 0,
              max: maxX === 50 ? 50 : maxX * 1.2,
              tickAmount: 5,
              labels: { formatter: val => `${val.toFixed(0)}%`, align: 'center', offsetX: -5 },
              title: { text: 'reject sum %' },
            },
            yaxis: {
              min: 0,
              max: () => maxY === 100 ? 100 : maxY * 1.2,
              tickAmount: 5,
              labels: { formatter: val => val.toFixed(0) },
              title: { text: 'reject sum' },
              forceNiceScale: true,
            },
            tooltip: {
              intersect: true,
              custom: ({ seriesIndex, w }) => tooltip({
                name: w.config.series[seriesIndex].name,
                data: w.config.series[seriesIndex].data,
                maxZ
              }),
            },
          }}
          series={items}
        />
      ) : (
        <div className="text-center pt-5">no data</div>
      )}
    </div>
  </>
));

