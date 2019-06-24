import React from 'react';
import { Row, Col } from '@nio/ui-kit';

export default ({ alerts }) => (
  <Row>
    <Col xs="12">
    <b>Alerts</b>
    <hr className="mb-0" />
    <Row>
      <Col xs="2" className="text-nowrap">
        Time
      </Col>
      <Col xs="1" className="text-center text-nowrap">
        Plant
      </Col>
      <Col xs="1" className="text-center text-nowrap">
        Mach
      </Col>
      <Col xs="1" className="text-center text-nowrap">
        NzzID
      </Col>
      <Col xs="7" className="text-nowrap">
        Description
      </Col>
    </Row>
    <div className="data-holder">
      {alerts.length && alerts.map(k => (
        <Row noGutters key={k}>
          <Col xs="2" className="text-nowrap">
            {k.time}
          </Col>
          <Col xs="1" className="text-center text-nowrap">
            {k.plant}
          </Col>
          <Col xs="1" className="text-center text-nowrap">
            {k.machine}
          </Col>
          <Col xs="1" className="text-center text-nowrap">
            {k.nozzle_id}
          </Col>
          <Col xs="7" className="text-nowrap">
            {k.description}
          </Col>
        </Row>
      ))}
    </div>
    </Col>
  </Row>
);
