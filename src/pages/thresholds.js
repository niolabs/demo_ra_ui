import React from 'react';
import { Card, CardBody } from '@nio/ui-kit';
import { withPubkeeper } from '../providers/pubkeeper';

export default class Thresholds extends React.Component {
  render = () => {
    return (
      <Card>
        <CardBody className="p-3">
          <h2 className="m-0">Thresholds</h2>
          <hr />
          Threhsold management will happen here
        </CardBody>
      </Card>
    );
  };
}
