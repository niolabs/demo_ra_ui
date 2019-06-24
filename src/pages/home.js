import React from 'react';
import { Card, CardBody, Row, Col, Chart } from '@nio/ui-kit';
import { withPubkeeper } from '../providers/pubkeeper';
import Alerts from '../components/alerts';
import Chooser from '../components/chooser';
import Nozzles from '../components/nozzles';

class Home extends React.Component {
  state = {
    nozzleSort: { sortBy: 'id', asc: true }
  };

  sortNozzles = (e) => {
    const { nozzleSort } = this.state;
    const newKey = e.currentTarget.getAttribute('data-sort');
    nozzleSort.asc = nozzleSort.sortBy === newKey ? !nozzleSort.asc : true;
    nozzleSort.sortBy = newKey;
    this.setState({ nozzleSort });
  };

  generateTooltip = ({ name, data }) => {
    const { nozzles, maxZ } = this.props;
    const nozzleIndex = nozzles.findIndex(n => n.id === name);
    let tooltip = '<div class="card"><div class="tooltip"><b>';
    tooltip += `nozzle ${name}`;
    tooltip += '</b><hr class="my-1" />';
    tooltip += `plant: ${nozzles[nozzleIndex].plant}`;
    tooltip += '<br />';
    tooltip += `machine: ${nozzles[nozzleIndex].machine}`;
    tooltip += '<hr class="my-1" />';
    tooltip += `reject sum %: ${parseFloat(data[0].x).toFixed(6)}`;
    tooltip += '<br />';
    tooltip += `reject sum: ${data[0].y}`;
    tooltip += '<br />';
    tooltip += `reject factor: ${parseFloat(data[0].z - (maxZ / 3)).toFixed(6)}`;
    tooltip += '</div></div>';
    return tooltip;
  };

  render = () => {
    const { plants, machines, nozzles, maxX, togglePlant, toggleMachine, toggleNozzle, alerts, graphData } = this.props;
    const { nozzleSort: { sortBy, asc } } = this.state;

    return (
      <Card>
        <CardBody className="p-3">
          <h2 className="m-0">Dashboard</h2>
          <hr />
          <Row>
            <Col lg="2" xs="6">
              <Chooser
                label="Plants"
                items={Object.values(plants)}
                toggle={togglePlant}
              />
            </Col>
            <Col lg="2" xs="6">
              <Chooser
                label="Machines"
                items={Object.values(machines).filter(k => plants[k.plant].visible)}
                toggle={toggleMachine}
              />
            </Col>
            <Col lg="8" xs="12">
              <Nozzles
                items={nozzles.filter(n => n.id !== 'placeholder' && plants[n.plant].visible && machines[n.machine].visible).sort((a, b) => (asc) ? b[sortBy] > a[sortBy] ? -1 : 1 : b[sortBy] < a[sortBy] ? -1 : 1)}
                asc={asc}
                sortBy={sortBy}
                sort={this.sortNozzles}
                toggle={toggleNozzle}
              />
            </Col>
          </Row>
          <Row>
            <Col xs="12" id="chart-holder">
              {graphData.length > 1 ? (
                <Chart
                  type="bubble"
                  height="100%"
                  options={{
                    chart: { zoom: { enabled: false }, toolbar: { show: false } },
                    legend: { show: false },
                    noData: { text: 'loading'},
                    dataLabels: { enabled: false },
                    xaxis: { min: 0, max: maxX * 1.2, tickAmount: 8, labels: { formatter: val => `${val.toFixed(2)}%`, align: 'center', offsetX: -5 }, title: { text: 'reject sum %' }},
                    yaxis: { min: 0, max: (max) => max * 1.2, tickAmount:  8, labels: { formatter: val => val.toFixed(2) }, title: { text: 'reject sum' }},
                    tooltip: { custom: ({series, seriesIndex, dataPointIndex, w}) => this.generateTooltip(w.config.series[seriesIndex])},
                  }}
                  series={graphData}
                />
              ) : (
                <div className="text-center pt-5">no data...</div>
              )}
            </Col>
          </Row>
          <Alerts alerts={alerts} />
        </CardBody>
      </Card>
    );
  };
}

export default withPubkeeper(Home);
