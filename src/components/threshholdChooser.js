import React from 'react';
import { Row, Col } from '@nio/ui-kit';
import { withMachines, withThresholds } from '../providers/pubkeeper';

export default withMachines(withThresholds(({ items, toggle, thresholds }) => {

  const fields = [
    { name: 'reject_quantity', label: 'Reject Qty', value: '' },
    { name: 'reject_sum_percent', label: 'Reject Sum %', value: ''},
    { name: 'slope', label: 'Slope', value: ''},
    { name: 'left_factor', label: 'Left Factor', value: ''},
    { name: 'right_factor', label: 'Right Factor', value: ''},
    { name: 'left_up_factor', label: 'Left Up Factor', value: ''},
  ];

  const emptyFieldValues = {
    reject_quantity: '-',
    reject_sum_percent: '-',
    slope: '-',
    left_factor: '-',
    right_factor: '-',
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
          <b>Update</b>
        </Col>
        <Col className="text-xs threshold-cell" />
        {fields.map(f => (
          <Col className="text-xs threshold-cell" key={f.name}>
            <b>{f.label}</b>
          </Col>
        ))}
      </Row>
      <div className="data-holder border-top">
        {itemsWithThreshholds.map(i => (
          <Row noGutters key={i.key} data-id={i.key} onClick={toggle} className="toggle-row border-bottom">
            <Col className="threshold-cell">
              {i.id}
            </Col>
            <Col className="threshold-cell text-center">
              <i className={`mr-1 fa fa-check ${i.visible ? 'text-success' : 'text-lightgrey'}`} />
            </Col>
            <Col className="threshold-cell" />
            {fields.map(f => (
              <Col className="threshold-cell" key={f.name}>
                {i[f.name]}
              </Col>
            ))}
          </Row>
        ))}
      </div>
    </>
  )
}));
