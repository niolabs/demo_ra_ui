import React from 'react';
import { Chart } from '@nio/ui-kit';
import { withNozzles } from '../providers/pubkeeper';
import tooltip from '../util/tooltip';

import BubbleChartWorker from 'worker-loader!../workers/bubbleChart';

class BubbleChart extends React.Component {
  state = {
    series: [{ data: [] }],
    currentItems: [],
    currentActiveItems: {},
  };

  componentDidMount = async () => {
    this.initializeWebWorker();
  };

  initializeWebWorker = () => {
    this.Worker = new BubbleChartWorker();
    this.Worker.onmessage = (event) => this.setState(event.data);
  };

  componentDidUpdate = () => {
    const { activeItems, items } = this.props;
    const { currentItems, currentActiveItems } = this.state;

    if (
      (currentItems.length !== items.length) ||
      (JSON.stringify(currentItems) !== JSON.stringify(items)) ||
      (JSON.stringify(currentActiveItems) !== JSON.stringify(activeItems))
    ) {
      //console.log('updating bubbleChart');
      this.Worker.postMessage({ activeItems, items });
    }
  };

  render = () => {
    const { series } = this.state;
    const maxaxis = series.find(s => s.name === 'maxaxis') || { x: 50, y: 100 };

    return (
      <>
        <b>Graph</b>
        <hr className="my-1" />
        <div className="text-xs text-nowrap">
          <b>Select/deselect machines and nozzles above to add/remove items</b>
        </div>
        <div id="chart-holder" className="border-top">
          <Chart
            type="bubble"
            height="100%"
            options={{
              chart: { zoom: { enabled: false }, toolbar: { show: false } },
              legend: { show: false },
              dataLabels: { enabled: false },
              xaxis: {
                min: 0,
                max: maxaxis.x,
                tickAmount: 5,
                labels: { formatter: val => `${val.toFixed(0)}%`, align: 'center', offsetX: -5 },
                title: { text: 'reject sum %' },
              },
              yaxis: {
                min: 0,
                max: maxaxis.y,
                tickAmount: 5,
                labels: { formatter: val => val.toFixed(0) },
                title: { text: 'reject sum' },
                forceNiceScale: true,
              },
              tooltip: {
                intersect: true,
                custom: ({ seriesIndex, w }) => tooltip({
                  name: w.config.series[seriesIndex].name,
                  data: w.config.series[seriesIndex].data
                }),
              },
            }}
            series={series}
          />
        </div>
      </>
    )
  }
}

export default withNozzles(BubbleChart);

