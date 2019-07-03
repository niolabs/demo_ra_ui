import React from 'react';
import { Card, CardBody, Row, Col } from '@nio/ui-kit';
import { withCurrentProgram } from '../providers/pubkeeper';

export default withCurrentProgram(({ machine, optel_schedule_wo, side, latest }) => (
  <Card>
    <CardBody className="px-2 py-1">
      <Row style={{ lineHeight: 1 }}>
        <Col sm="3" className="text-nowrap text-center">
          <b>{machine || 'tmp-01'}</b><br />
          <span className="text-xs">machine</span>
          <hr className="my-2 d-block d-sm-none" />
        </Col>
        <Col sm="3" className="text-nowrap text-center">
          <b>{optel_schedule_wo || '4010405712T'}</b><br />
          <span className="text-xs">optel schedule wo</span>
          <hr className="my-2 d-block d-sm-none" />
        </Col>
        <Col sm="3" className="text-nowrap text-center">
          <b>{side || 'Top'}</b><br />
          <span className="text-xs">side</span>
          <hr className="my-2 d-block d-sm-none" />
        </Col>
        <Col sm="3" className="text-nowrap text-center">
          <b>{latest || new Date().toLocaleString()}</b><br />
          <span className="text-xs">latest date/time</span>
          <hr className="my-2 d-block d-sm-none" />
        </Col>
      </Row>
    </CardBody>
  </Card>
));
