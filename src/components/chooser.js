import React from 'react';
import { Row, Col} from '@nio/ui-kit';
import VisibilitySensor from 'react-visibility-sensor';
import { withPlants, withMachines, withActiveItems } from '../providers/pubkeeper';
import ChooserRow from './chooserRow';

const chooser = ({ label, items, toggle, toggleAll, activeItems, multi }) => {
  return (
    <>
      <b>{label}</b>
      <hr className="my-1" />
      <Row noGutters>
        <Col xs="6" className="text-xs">
          <b>ID</b>
        </Col>
        <Col xs="6" className="text-xs text-right">
          {toggleAll && <i onClick={toggleAll} className="mr-1 fa fa-check toggle-all" />}
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
          <VisibilitySensor key={i.itemKey}>
            {({isVisible}) => isVisible ? (
              <ChooserRow
                itemKey={i.itemKey}
                multi={multi}
                name={i.name}
                plantKey={i.plantKey}
                active={label === 'Plants' ? !!activeItems.plants[i.itemKey] : !!activeItems.machines[i.itemKey]}
                toggle={toggle}
              />
            ) : (
              <div className="nozzle-row-holder" />
            )}
          </VisibilitySensor>

        ))}
      </div>
    </>
  );
};

const Plants = withPlants(withActiveItems(chooser));

const Machines = withMachines(withActiveItems(chooser));

export { Plants, Machines };
