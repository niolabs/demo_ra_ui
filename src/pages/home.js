import React from 'react';
import { Card, CardBody, Row, Col } from '@nio/ui-kit';
import Alerts from '../components/alerts';
import Nozzles from '../components/nozzles';
import BubbleChart from '../components/bubblechart';
import CurrentProgram from '../components/currentProgram';
import { Plants, Machines } from '../components/chooser';

export default () => (
  <Card>
    <CardBody className="p-3">
      <Row className="pageheader">
        <Col lg="3" className="mb-1">
          <h2 className="m-0 text-nowrap">Current Program</h2>
        </Col>
        <Col lg="9" className="mb-1">
          <CurrentProgram />
        </Col>
      </Row>
      <hr />
      <Row>
        <Col lg="2" xs="6" className="mb-1">
          <Plants />
        </Col>
        <Col lg="2" xs="6" className="mb-1">
          <Machines />
        </Col>
        <Col lg="8" xs="12" className="mb-1">
          <Nozzles />
        </Col>
      </Row>
      <hr />
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
