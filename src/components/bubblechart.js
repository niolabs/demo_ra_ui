import React from 'react';
import { Chart } from '@nio/ui-kit';
import { withGraphData } from '../providers/pubkeeper';
import tooltip from '../util/tooltip';

class BubbleChart extends React.Component {
  shouldComponentUpdate = (prevProps) => JSON.stringify(prevProps) !== JSON.stringify(this.props);

  state = {
    series: [{ data: [] }],
  };

  componentDidUpdate = (prevProps) => {
    const { items, maxX, maxY, maxZ } = this.props;
    if (
      (prevProps.maxX !== maxX) ||
      (prevProps.maxY !== maxY) ||
      (prevProps.maxZ !== maxZ) ||
      (JSON.stringify(prevProps.items) !== JSON.stringify(items))
    ) {
      console.log('updating');
      this.generateGraphSeries(items, maxX, maxY, maxZ);
    }
  };



  generateGraphSeries = (items, maxX, maxY, maxZ) => {
    const series = items.map(n => ({
      name: n.nozzle_id,
      data: [{
        plant: n.plant,
        machine: n.machine,
        reject_sum_percent: n.reject_sum_percent * 100,
        reject_sum: n.reject_sum,
        reject_factor: n.nozzle_id === 'placeholder' ? 0 : n.reject_factor,
        x: n.nozzle_id === 'placeholder' ? maxX <= 50 ? 50 : Math.ceil(maxX / 10) * 10 : n.reject_sum_percent * 100,
        y: n.nozzle_id === 'placeholder' ? maxY <= 100 ? 100 : Math.ceil(maxY / 10) * 10 : n.reject_sum,
        z: n.nozzle_id === 'placeholder' ? 0 : n.reject_factor + (maxZ / 3)
      }]
    }));

    this.setState({ series });
  };

  render = () => {
    const { series } = this.state;
    const placeholder = series.find(s => s.name === 'placeholder') || { x: 50, y: 100 };

    //console.log('rendering bubble chart');

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
                max: placeholder.x,
                tickAmount: 5,
                labels: { formatter: val => `${val.toFixed(0)}%`, align: 'center', offsetX: -5 },
                title: { text: 'reject sum %' },
              },
              yaxis: {
                min: 0,
                max: placeholder.y,
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

export default withGraphData(BubbleChart);

