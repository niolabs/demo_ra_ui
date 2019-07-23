import React from 'react';
import { Row, Col } from '@nio/ui-kit';
import VisibilitySensor from 'react-visibility-sensor';

export default ({ items, toggle, thresholds, toggleAll, activeItems }) => {

  const fields = [
    { name: 'reject_quantity', label: 'Reject Qty', value: '' },
    { name: 'reject_sum_percent', label: 'Reject Sum %', value: ''},
    { name: 'slope', label: 'Slope', value: ''},
    { name: 'left_factor', label: 'Left Factor', value: ''},
    { name: 'right_up_factor', label: 'Right Up Factor', value: ''},
    { name: 'left_up_factor', label: 'Left Up Factor', value: ''},
  ];

  const emptyFieldValues = {
    reject_quantity: '-',
    reject_sum_percent: '-',
    slope: '-',
    left_factor: '-',
    right_up_factor: '-',
    left_up_factor: '-',
  };

  const itemsWithThreshholds = items.map(i => {
    const thresholdThatContainsThisItem = thresholds.find(t => t.machines.findIndex(m => m.plant === i.plantKey && m.id === i.name) !== -1);
    return thresholdThatContainsThisItem ? { ...thresholdThatContainsThisItem, ...i } : { ...emptyFieldValues, ...i };
  });

  return (
    <>
      <b>Machines</b>
      <hr className="my-1" />
      <Row noGutters>
        <Col className="text-xs threshold-cell">
          <b>ID</b>
        </Col>
        <Col className="text-xs text-center threshold-cell">
          <i onClick={toggleAll} className="mr-1 fa fa-check toggle-all" />
        </Col>
        <Col className="text-xs threshold-cell" />
        {fields.map(f => (
          <Col className="text-xs threshold-cell" key={f.name}>
            <b>{f.label}</b>
          </Col>
        ))}
      </Row>
      <div className="data-holder border-top chooser">
        {itemsWithThreshholds.map(i => (
          <VisibilitySensor key={i.itemKey}>
            {({isVisible}) => isVisible ? (
              <Row noGutters data-multi={true} data-id={i.itemKey} onClick={toggle} className={`toggle-row border-bottom ${!!activeItems.machines[i.itemKey]}`}>
                <Col className="threshold-cell">
                  {i.name}
                </Col>
                <Col className="threshold-cell text-center">
                  <i className="mr-1 fa fa-check" />
                </Col>
                <Col className="threshold-cell" />
                {fields.map(f => (
                  <Col className="threshold-cell" key={f.name}>
                    {i[f.name]}
                  </Col>
                ))}
              </Row>
            ) : (
              <div className="nozzle-row-holder" />
            )}
          </VisibilitySensor>
        ))}
      </div>
    </>
  )
};
