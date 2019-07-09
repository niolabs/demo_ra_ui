import React from 'react';
import { Card, CardBody, Col, Row, Button, Input } from '@nio/ui-kit';
import { withNotifications } from '../providers/pubkeeper';

class Thresholds extends React.Component {
  state = { errors: { name: false, phone: false } };

  isValid = (p) => {
    var phoneRe = /^[2-9]\d{2}[2-9]\d{2}\d{4}$/;
    var digits = p.replace(/\D/g, "");
    return phoneRe.test(digits);
  };

  handleSubmit = () => {
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const errors = { name: false, phone: false };
    this.setState({ errors });

    if (!name) {
      errors.name = true;
    }
    if (!this.isValid(phone)) {
      errors.phone = true;
    }

    this.setState({ errors });

    if(!errors.name && !errors.phone) {
      console.log('submitting');
    } else {
      console.log('not submitting');
    }

  };

  handleDelete = () => {

  };

  render = () => {
    const { notification_numbers } = this.props;
    const { errors: { name, phone } } = this.state;

    return (
      <Card>
        <CardBody className="p-3">
          <div className="pageheader">
            <h2 className="m-0">Manage Notifications</h2>
          </div>
          <hr className="my-1" />
          <Row noGutters>
            <Col xs="4" className="text-xs">
              <b>name</b>
            </Col>
            <Col xs="4" className="text-xs">
              <b>number</b>
            </Col>
          </Row>
          <div className="data-holder no-height">
            {notification_numbers.map(i => (
              <Row noGutters key={i.phone} data-id={i.phone} className="toggle-row">
                <Col xs="4" className="pt-2">
                  {i.name}
                </Col>
                <Col xs="4" className="pt-2">
                  {i.phone}
                </Col>
                <Col xs="4">
                  <Button block color="danger"><i className="fa fa-ban" /></Button>
                </Col>
              </Row>
            ))}
          </div>
          <Row noGutters className="toggle-row">
            <Col xs="4" className="pr-3">
              <Input type="text" id="name" invalid={name} />
            </Col>
            <Col xs="4" className="pr-3">
              <Input type="phone" id="phone" invalid={phone} />
            </Col>
            <Col xs="4">
              <Button onClick={this.handleSubmit} block color="success"><i className="fa fa-plus" /></Button>
            </Col>
          </Row>
        </CardBody>
      </Card>
    )
  }
}

export default withNotifications(Thresholds);
