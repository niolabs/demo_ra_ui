import React from 'react';
import { Chart } from '@nio/ui-kit';
import { withGraphData } from '../providers/pubkeeper';
import tooltip from '../util/tooltip';

export default withGraphData(({ items, maxX, nozzles, maxZ }) => items.length > 1 ? (
  <Chart
    type="bubble"
    height="100%"
    options={{
      chart: { zoom: { enabled: false }, toolbar: { show: false } },
      legend: { show: false },
      noData: { text: 'loading' },
      dataLabels: { enabled: false },
      xaxis: { min: 0, max: maxX * 1.2, tickAmount: 8, labels: { formatter: val => `${val.toFixed(2)}%`, align: 'center', offsetX: -5 }, title: { text: 'reject sum %' } },
      yaxis: { min: 0, max: max => max * 1.2, tickAmount: 8, labels: { formatter: val => val.toFixed(2) }, title: { text: 'reject sum' } },
      tooltip: { custom: ({ seriesIndex, w }) => tooltip({ name: w.config.series[seriesIndex].name, data: w.config.series[seriesIndex].data, nozzles, maxZ }) },
    }}
    series={items}
  />
) : (
  <div className="text-center pt-5">no data...</div>
));

