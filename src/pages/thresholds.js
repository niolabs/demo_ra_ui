import React from 'react';
import { Card, CardBody, Col, Row, Form, Input, Button } from '@nio/ui-kit';
import { withThresholds, withVisibleMachines } from '../providers/pubkeeper';
import { Machines, Plants } from '../components/chooser';
import Alerts from '../components/alerts';

class Thresholds extends React.Component {
  state = { submitted: false, errors: {} };

  formFields = [
    { name: 'reject_quantity', label: 'Reject Qty'},
    { name: 'reject_sum_percent', label: 'Reject Sum %'},
    { name: 'slope', label: 'Slope'},
    { name: 'left_factor', label: 'Left Factor'},
    { name: 'right_factor', label: 'Right Factor'},
    { name: 'left_up_factor', label: 'Left Up Factor'},
  ];

  handleSubmit = () => {
    const { updateThresholds, items } = this.props;
    const errors = {};
    const newThresholdObject = { machines: items };

    this.formFields.map(f => {
      const fieldValue = parseFloat(document.getElementById(f.name).value);
      if (!fieldValue) errors[f.name] = 'is required';
      if (f.name === 'left_factor' && fieldValue > -1) errors[f.name] = 'must be negative';
      if (!errors[f.name]) newThresholdObject[f.name] = fieldValue;
    });

    if (!Object.keys(errors).length) {
      this.setState({ errors: {} });
      this.formFields.map(f => document.getElementById(f.name).value = null);
      updateThresholds(newThresholdObject);
    } else {
      this.setState({ errors }, () => setTimeout(() => this.setState({ errors: {} }), 3000));
    }
  };

  render = () => {
    const { items } = this.props;
    const { errors } = this.state;

    return (
      <Card>
        <CardBody className="p-3">
          <div className="pageheader">
            <h2 className="m-0">Adjust Thresholds</h2>
          </div>
          <hr />
          <Row>
            <Col sm="6" lg="2">
              <Plants />
            </Col>
            <Col sm="6" lg="2">
              <Machines />
            </Col>
            <Col sm="12" lg="8">
              <Form>
                <b>{items.length ? `Update Threshold for ${items.length} Machine${items.length !== 1 ? 's' : ''}` : 'Choose At Least 1 Plant/Machine'}</b>
                <hr className="my-1" />
                <Row>
                  {this.formFields.map(f => (
                    <Col xs="12" lg="2" key={f.name} className="text-nowrap text-xs">
                      <div className={`${errors[f.name] ? 'text-danger' : ''}`}><b>{errors[f.name] ? `${f.label} ${errors[f.name]}` : f.label}&nbsp;</b></div>
                    </Col>
                  ))}
                </Row>
                <div className="data-holder no-height">
                  <Row>
                    {this.formFields.map(f => (
                      <Col xs="12" lg="2" key={f.name} className="text-nowrap input-row">
                        <Input step="0.1" invalid={!!errors[f.name]} id={f.name} disabled={!items.length} type="number" />
                      </Col>
                    ))}
                  </Row>
                </div>
                <hr className="mt-0 mb-2" />
                <Row>
                  <Col xs="12" className="text-center text-nowrap">
                    <Button onClick={this.handleSubmit} disabled={!items.length} block color="success">Save</Button>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
          <hr />
          <Alerts />
        </CardBody>
      </Card>
    )
  }
}

export default withVisibleMachines(withThresholds(Thresholds));
