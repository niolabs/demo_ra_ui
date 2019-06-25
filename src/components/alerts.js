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
      {alerts.length ? alerts.map(a => (
        <Row key={`${a.nozzle_id}-${a.time}`} className="alert-row">
          <Col xs="2" className="text-nowrap">
            {a.time}
          </Col>
          <Col xs="2" className="text-center text-nowrap">
            {a.plant}
          </Col>
          <Col xs="2" className="text-center text-nowrap">
            {a.machine}
          </Col>
          <Col xs="2" className="text-center text-nowrap">
            {a.nozzle_id}
          </Col>
          <Col xs="4" className="text-nowrap">
            {a.description}
          </Col>
        </Row>
      )) : (
        <div className="text-center pt-5">no alerts</div>
      )}
    </div>
  </>
));
