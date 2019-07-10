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
      <div>
        <h2 className="m-0">Analytics</h2>
      </div>
      <CurrentProgram />
      <Row>
        <Col lg="2" xs="6">
          <Plants />
          <hr className="mt-0 mb-4 d-block d-lg-none" />
        </Col>
        <Col lg="2" xs="6">
          <Machines />
          <hr className="mt-0 mb-4 d-block d-lg-none" />
        </Col>
        <Col lg="8" xs="12">
          <Nozzles />
        </Col>
      </Row>
      <hr className="mt-0" />
      <Row>
        <Col lg="6">
          <BubbleChart />
          <hr className="d-block d-lg-none" />
        </Col>
        <Col lg="6">
          <Alerts />
        </Col>
      </Row>
    </CardBody>
  </Card>
);
