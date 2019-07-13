import React, { memo } from 'react';
import { Row, Col } from '@nio/ui-kit';

export default memo(({ id, itemKey, toggle, visible }) => {
  return (
    <Row noGutters data-id={itemKey} onClick={toggle} className={`toggle-row border-bottom ${visible}`}>
      <Col xs="10">
        {id}
      </Col>
      <Col xs="2" className="text-right">
        <i className="mr-1 fa fa-check" />
      </Col>
    </Row>
  )
});
