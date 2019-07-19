import React from 'react';
import { Row, Col } from '@nio/ui-kit';
import VisibilitySensor from 'react-visibility-sensor';
import { withMachines, withThresholds } from '../providers/pubkeeper';

export default withMachines(withThresholds(({ items, toggle, thresholds, toggleAll }) => {

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
    const thresholdThatContainsThisItem = thresholds.find(t => t.machines.findIndex(m => m.plant === i.plant && m.id === i.id) !== -1);
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
          <VisibilitySensor key={i.key}>
            {({isVisible}) => isVisible ? (
              <Row noGutters onClick={() => toggle(i.key, !i.visible, false)} className={`toggle-row border-bottom ${i.visible}`}>
                <Col className="threshold-cell">
                  {i.id}
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
}));
