import React from 'react';
import { Card, CardBody, Col, Row, Button, Input } from '@nio/ui-kit';
import InputMask from 'react-input-mask';
import { withNotificationNumbers } from '../providers/pubkeeper';

class Thresholds extends React.Component {
  state = { newValues: { name: '', phone: '' }, errors: {} };

  handleSubmit = () => {
    const { notification_numbers, brewer } = this.props;
    const { newValues } = this.state;
    const errors = {};

    if (!newValues.name) {
      errors.name = 'Name is Required';
    }
    if (!newValues.phone) {
      errors.phone = 'Valid Phone Required';
    }
    if (notification_numbers.find(n => n.phone === newValues.phone)) {
      errors.phone = 'Number Already Exists';
    }

    if(!Object.keys(errors).length) {
      notification_numbers.push({ name: newValues.name, phone: newValues.phone });
      brewer.brewJSON(notification_numbers);
      this.resetFields();
    } else {
      this.setState({ errors });
    }

  };

  updateField = (e) => {
    const { newValues } = this.state;
    newValues[e.target.getAttribute('id')] = e.target.value.trim();
    this.setState({ newValues });
  };

  resetFields = () => {
    this.setState({ newValues: { name: '', phone: '' }, errors: {} });
  };

  handleDelete = (e) => {
    const { notification_numbers, brewer } = this.props;
    const numberToDelete = e.currentTarget.getAttribute('id');
    const indexInNumberArray = notification_numbers.findIndex(n => n.phone === numberToDelete);
    notification_numbers.splice(indexInNumberArray, 1);
    brewer.brewJSON(notification_numbers);
  };

  render = () => {
    const { notification_numbers } = this.props;
    const { newValues, errors } = this.state;

    return (
      <Card>
        <CardBody className="p-3">
          <div>
            <h2 className="m-0">Manage Notifications</h2>
          </div>
          <hr />
          <Row noGutters>
            <Col xs="4">
              <b>Name</b>
            </Col>
            <Col xs="4">
              <b>Number</b>
            </Col>
          </Row>
          <div className="data-holder no-height border-top">
            {notification_numbers.map(i => (
              <Row noGutters key={i.phone} data-id={i.phone} className="toggle-row border-bottom">
                <Col xs="4" className="pt-2">
                  {i.name}
                </Col>
                <Col xs="4" className="pt-2">
                  {i.phone}
                </Col>
                <Col xs="4">
                  <Button id={i.phone} onClick={this.handleDelete} block color="danger"><i className="fa fa-ban" /></Button>
                </Col>
              </Row>
            ))}
          </div>
          {notification_numbers && notification_numbers.length < 5 && (
            <Row noGutters className="new-phone-row">
              <Col xs="4" className="pr-3">
                <Input id="name" type="text" value={newValues.name} onChange={this.updateField} invalid={!!errors.name} />
                {errors.phone && (<div className="text-danger text-nowrap text-xs mt-1">{errors.name}</div>)}
              </Col>
              <Col xs="4" className="pr-3">
                <Input id="phone" type="phone" mask="999 999 9999" maskChar=" " tag={InputMask} invalid={!!errors.phone} value={newValues.phone} onChange={this.updateField} />
                {errors.phone && (<div className="text-danger text-nowrap text-xs mt-1">{errors.phone}</div>)}
              </Col>
              <Col xs="4">
                <Button onClick={this.handleSubmit} block color="success"><i className="fa fa-plus" /></Button>
              </Col>
            </Row>
          )}
        </CardBody>
      </Card>
    )
  }
}

export default withNotificationNumbers(Thresholds);
