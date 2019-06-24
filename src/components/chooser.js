import React from 'react';
import { Row, Col } from '@nio/ui-kit';

export default ({ label, items, toggle }) => (
  <>
    <Row noGutters>
      <Col xs="10">
        <b>{label}</b>
      </Col>
      <Col xs="2" className="text-right">
        <i className="fa fa-eye eyecon" />
      </Col>
    </Row>
    <div className="data-holder">
      {items.map(i => (
        <Row noGutters key={i.id} data-id={i.id} onClick={toggle} className="toggle-row">
          <Col xs="10">
            {i.id}
          </Col>
          <Col xs="2" className="text-right">
            <i className={`mr-1 fa ${i.visible ? 'fa-check text-success' : 'fa-times text-danger'}`} />
          </Col>
        </Row>
      ))}
    </div>
  </>
);
