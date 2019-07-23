import React, { memo } from 'react';
import { Row, Col } from '@nio/ui-kit';

export default memo(({ name, itemKey, toggle, active, multi }) => {
  //console.log('rendering chooser row');
  return (
    <Row noGutters data-multi={multi} data-id={itemKey} onClick={toggle} className={`toggle-row border-bottom ${active}`}>
      <Col xs="10">
        {name}
      </Col>
      <Col xs="2" className="text-right">
        <i className="mr-1 fa fa-check" />
      </Col>
    </Row>
  )
});
