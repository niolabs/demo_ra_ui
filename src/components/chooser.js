import React from 'react';
import { Row, Col } from '@nio/ui-kit';
import { withPlants, withMachines } from '../providers/pubkeeper';

const chooser = ({ label, items, toggle }) => (
  <>
    <b>{label}</b>
    <hr className="my-1" />
    <Row noGutters>
      <Col xs="12" className="text-xs">
        <b>ID</b>
      </Col>
    </Row>
    <div className="data-holder border-top">
      {items.map(i => (
        <Row noGutters key={i.key} data-id={i.key} onClick={toggle} className="toggle-row border-bottom">
          <Col xs="10">
            {i.id}
          </Col>
          <Col xs="2" className="text-right">
            <i className={`mr-1 fa fa-check ${i.visible ? 'text-success' : 'text-lightgrey'}`} />
          </Col>
        </Row>
      ))}
    </div>
  </>
);

const Plants = withPlants(chooser);

const Machines = withMachines(chooser);

export { Plants, Machines };
