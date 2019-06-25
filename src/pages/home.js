import React from 'react';
import { Card, CardBody, Row, Col } from '@nio/ui-kit';
import Alerts from '../components/alerts';
import Nozzles from '../components/nozzles';
import BubbleChart from '../components/bubblechart';
import { Plants, Machines } from '../components/chooser';

export default () => (
  <Card>
    <CardBody className="p-3">
      <h2 className="m-0">Dashboard</h2>
      <hr />
      <Row>
        <Col lg="2" xs="6">
          <Plants />
        </Col>
        <Col lg="2" xs="6">
          <Machines />
        </Col>
        <Col lg="8" xs="12">
          <Nozzles />
        </Col>
      </Row>
      <Row>
        <Col xs="12" id="chart-holder">
          <BubbleChart />
        </Col>
      </Row>
      <hr />
      <Alerts />
    </CardBody>
  </Card>
);
