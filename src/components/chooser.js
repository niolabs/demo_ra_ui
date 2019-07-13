import React from 'react';
import { Row, Col, Loader } from '@nio/ui-kit';
import { withPlants, withMachines } from '../providers/pubkeeper';
import ChooserRow from './chooserRow';

const chooser = ({ label, items, toggle }) => (
  <>
    <b>{label}</b>
    <hr className="my-1" />
    <Row noGutters>
      <Col xs="12" className="text-xs">
        <b>ID</b>
      </Col>
    </Row>
    <div className="data-holder border-top chooser">
      {!items.length && label === 'Plants' ? (
        <div className="text-xs text-center pt-5">
          Loading plants...
        </div>
      ) : !items.length ? (
        <div className="text-xs text-center pt-5">
          Please select a plant.
        </div>
      ) : items.map(i => (
        <ChooserRow
          key={i.key}
          itemKey={i.key}
          id={i.id}
          visible={i.visible}
          toggle={toggle}
        />
      ))}
    </div>
  </>
);

const Plants = withPlants(chooser);

const Machines = withMachines(chooser);

export { Plants, Machines };
