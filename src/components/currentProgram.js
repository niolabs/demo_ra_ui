import React from 'react';
import { Row, Col } from '@nio/ui-kit';
import { withCurrentProgram } from '../providers/pubkeeper';

export default withCurrentProgram(({ name, optel_schedule_wo, side, timestamp }) => (
  <div className="my-3 py-2 border-top border-bottom">
    <Row style={{ lineHeight: 1 }}>
      <Col lg="3" className="text-nowrap text-center text-lg-left">
        <h5 className="mb-0 mt-1">Current Program</h5>
        <hr className="my-2 d-block d-lg-none" />
      </Col>
      <Col lg="2" className="text-nowrap text-center">
        <b>{name || '-'}</b><br />
        <span className="text-xs">machine</span>
        <hr className="my-2 d-block d-lg-none" />
      </Col>
      <Col lg="2" className="text-nowrap text-center">
        <b>{optel_schedule_wo || '-'}</b><br />
        <span className="text-xs">optel schedule wo</span>
        <hr className="my-2 d-block d-lg-none" />
      </Col>
      <Col lg="2" className="text-nowrap text-center">
        <b>{side || '-'}</b><br />
        <span className="text-xs">side</span>
        <hr className="my-2 d-block d-lg-none" />
      </Col>
      <Col lg="3" className="text-nowrap text-center">
        <b>{timestamp || '-'}</b><br />
        <span className="text-xs">latest date/time</span>
      </Col>
    </Row>
  </div>
));
