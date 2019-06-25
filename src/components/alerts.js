import React from 'react';
import { Row, Col } from '@nio/ui-kit';
import { withAlerts } from '../providers/pubkeeper';

export default withAlerts(({ alerts }) => (
  <>
    <Row>
      <Col xs="2" className="text-nowrap">
        <b>Alerts</b>
      </Col>
      <Col xs="2" className="text-center text-nowrap">
        <b>Plant</b>
      </Col>
      <Col xs="2" className="text-center text-nowrap">
        <b>Machine</b>
      </Col>
      <Col xs="2" className="text-center text-nowrap">
        <b>Nozzle ID</b>
      </Col>
      <Col xs="4" className="text-nowrap">
        <b>Description</b>
      </Col>
    </Row>
    <div className="data-holder">
      {alerts.length && alerts.map(k => (
        <Row key={k} className="alert-row">
          <Col xs="2" className="text-nowrap">
            {k.time}
          </Col>
          <Col xs="2" className="text-center text-nowrap">
            {k.plant}
          </Col>
          <Col xs="2" className="text-center text-nowrap">
            {k.machine}
          </Col>
          <Col xs="2" className="text-center text-nowrap">
            {k.nozzle_id}
          </Col>
          <Col xs="4" className="text-nowrap">
            {k.description}
          </Col>
        </Row>
      ))}
    </div>
  </>
));
