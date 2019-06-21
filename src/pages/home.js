import React from 'react';
import { Card, CardBody, Row, Col, Chart, Loader } from '@nio/ui-kit';
import { withPubkeeper } from '../providers/pubkeeper';

class Page extends React.Component {
  state = { plants: {}, machines: {}, graphdata:{}, chartLimits: { minX: 0, maxX: 0, minY: 0, maxY: 0 }, lastupdate: false };

  componentDidMount = () => {
    const { pkClient } = this.props;
    if (pkClient) {
      pkClient.addPatron('nozzle_plot', patron => patron.on('message', this.writeDataToState));
    }
  };

  writeDataToState = (data) => {
    const { plants, machines, graphdata, chartLimits } = this.state;
    let { lastupdate } = this.state;
    const json = new TextDecoder().decode(data);
    const newData = JSON.parse(json);

    newData.map(m => {
      plants[m.plant] = { last: new Date(m.timestamp).toLocaleString(), visible: plants[m.plant] ? plants[m.plant].visible : true };
      machines[m.machine] = { last: new Date(m.timestamp).toLocaleString(), plant: m.plant, visible: machines[m.machine] ? machines[m.machine].visible : true };
      graphdata[m.machine] = { plant: m.plant, x: m.reject_sum_percent * 100, y: m.reject_sum, z: m.reject_factor };
      lastupdate = new Date(m.timestamp).toLocaleString();

    });
    Object.keys(graphdata).map(m => {
      if (graphdata[m].x < chartLimits.minX) chartLimits.minX = graphdata[m].x;
      if (graphdata[m].x > chartLimits.maxX) chartLimits.maxX = graphdata[m].x;
      if (graphdata[m].y < chartLimits.minY) chartLimits.minY = graphdata[m].y;
      if (graphdata[m].y > chartLimits.maxY) chartLimits.maxY = graphdata[m].y;
    });
    this.setState({ plants, machines, graphdata, chartLimits, lastupdate });
  };

  togglePlant = (k) => {
    const { plants } = this.state;
    plants[k].visible = !plants[k].visible;
    this.setState({ plants });
  };

  toggleMachine = (k) => {
    const { machines } = this.state;
    machines[k].visible = !machines[k].visible;
    this.setState({ machines });
  };

  render = () => {
    const { plants, machines, graphdata, chartLimits, lastupdate } = this.state;

    const graphData = Object.keys(graphdata).filter(k => machines[k].visible && plants[graphdata[k].plant].visible).map(d => ({ name: d,  data: [[graphdata[d].x, graphdata[d].y, graphdata[d].z]] }));

    console.log(chartLimits);

    return (
      <Card>
        <CardBody className="p-3">
          <h2 className="m-0">RA PoC</h2>
          <hr />
          <Row>
            <Col md="6">
              <b>Plants</b>
              <hr />
              <div className="data-holder">
                {Object.keys(plants).length ? Object.keys(plants).map(k => (
                  <Row noGutters key={k} onClick={() => this.togglePlant(k)}>
                    <Col xs="4">
                      {k}
                    </Col>
                    <Col xs="4">
                      {plants[k].last}
                    </Col>
                    <Col xs="4" className="text-right">
                      <i className={`fa fa-${plants[k].visible ? 'check' : 'times'}`} />
                    </Col>
                  </Row>
                )) : (
                  <Loader />
                )}
              </div>
            </Col>
            <Col md="6">
              <b>Machines</b>
              <hr />
              <div className="data-holder">
                {Object.keys(machines).length ? Object.keys(machines).filter(k => plants[machines[k].plant].visible).map(k => (
                  <Row noGutters key={k} onClick={() => this.toggleMachine(k)}>
                    <Col xs="4">
                      {k} ({machines[k].plant})
                    </Col>
                    <Col xs="4">
                      {machines[k].last}
                    </Col>
                    <Col xs="4" className="text-right">
                      <i className={`fa fa-${machines[k].visible ? 'check' : 'times'}`} />
                    </Col>
                  </Row>
                )) : (
                  <Loader />
                )}
              </div>
            </Col>
            <Col xs="12" id="chart-holder">
              {chartLimits.maxX && chartLimits.maxY ? (
                <Chart
                  type="bubble"
                  height="250px"
                  options={{
                    title: { text: `Last Update: ${lastupdate}` },
                    chart: {
                      zoom: {
                        enabled: true,
                        type: 'xy'
                      }
                    },
                    dataLabels: {
                      enabled: false,
                    },
                    xaxis: {
                      min: -.0001,
                      max: chartLimits.maxX * 1.2,
                      tickAmount: 5,
                      labels: {
                        formatter: val => `${parseFloat(val).toFixed(5)}%`
                      }
                    },
                    yaxis: {
                      min: -.0001,
                      max: chartLimits.maxY * 1.2,
                      tickAmount: 5,
                      labels: {
                        formatter: val => parseFloat(val).toFixed(5)
                      }
                    }
                  }}
                  series={graphData}
                />
              ) : <Loader />}
            </Col>
            <Col xs="12">
              <Row>
                <Col xs="12">
                  <hr className="my-1" />
                </Col>
                <Col xs="6">
                  <b>machine</b>
                </Col>
                <Col xs="2">
                  <b>x</b>
                </Col>
                <Col xs="2">
                  <b>y</b>
                </Col>
                <Col xs="2">
                  <b>z</b>
                </Col>
                <Col xs="12">
                  <hr className="my-1" />
                </Col>
              </Row>
              {Object.keys(graphdata).length ? Object.keys(graphdata).map(d => (
                <Row key={d}>
                  <Col xs="6">
                    {d}
                  </Col>
                  <Col xs="2">
                    {graphdata[d].x}%
                  </Col>
                  <Col xs="2">
                    {graphdata[d].y}
                  </Col>
                  <Col xs="2">
                    {graphdata[d].z}
                  </Col>
                  <Col xs="12">
                    <hr className="my-1" />
                  </Col>
                </Row>
              )) : (
                <div className="data-holder">
                  <Loader />
                </div>
              )}
            </Col>
          </Row>
        </CardBody>
      </Card>
    );
  };
}

export default withPubkeeper(Page);
