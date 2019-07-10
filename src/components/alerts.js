import React from 'react';
import { Row, Col } from '@nio/ui-kit';
import { withAlerts } from '../providers/pubkeeper';

export default withAlerts(({ alerts }) => (
  <>
    <b>Alerts</b>
    <hr className="my-1" />
    <Row>
      <Col xs="4" className="text-nowrap text-xs">
        <b>Time</b>
      </Col>
      <Col xs="1" className="text-center text-nowrap text-xs">
        <b>Plant</b>
      </Col>
      <Col xs="1" className="text-center text-nowrap text-xs">
        <b>Machine</b>
      </Col>
      <Col xs="1" className="text-center text-nowrap text-xs">
        <b>Nozzle</b>
      </Col>
      <Col xs="5" className="text-nowrap text-xs">
        <b>Description</b>
      </Col>
    </Row>
    <div className="data-holder border-top">
      {alerts.length ? alerts.map(a => (
        <Row key={`${a.nozzle_id}-${a.time}-${a.description}`} className="alert-row border-bottom">
          <Col xs="4" className="text-nowrap">
            {a.time}
          </Col>
          <Col xs="1" className="text-center text-nowrap">
            {a.plant}
          </Col>
          <Col xs="1" className="text-center text-nowrap">
            {a.machine}
          </Col>
          <Col xs="1" className="text-center text-nowrap">
            {a.nozzle_id}
          </Col>
          <Col xs="5" className="text-nowrap">
            {a.description}
          </Col>
        </Row>
      )) : (
        <div className="text-center pt-5">no alerts</div>
      )}
    </div>
  </>
));
