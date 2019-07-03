import React from 'react';
import { Card, CardBody } from '@nio/ui-kit';
import { withNotifications } from '../providers/pubkeeper';

class Thresholds extends React.Component {
  state = { submitted: false, errors: {} };

  render = () => {
    const { notification_numbers } = this.props;
    return (
      <Card>
        <CardBody className="p-3">
          <div className="pageheader">
            <h2 className="m-0">Manage Notifications</h2>
          </div>
          <hr />
        </CardBody>
      </Card>
    )
  }
}

export default withNotifications(Thresholds);
