import React from 'react';
import { Card, CardBody, Col, Row, Form, Input, Button } from '@nio/ui-kit';
import { withThresholds, withNozzles } from '../providers/pubkeeper';
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
    const { updateThresholds } = this.props;
    const errors = {};
    const newThresholdObject = { nozzle_ids: document.getElementById('nozzle_ids').value.split(',') };

    this.formFields.map(f => {
      const fieldValue = parseInt(document.getElementById(f.name).value, 10);
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

    const visibleItems = items.map(i => i.nozzle_id);

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
                <Input id="nozzle_ids" type="hidden" value={visibleItems} />
                <b>{visibleItems.length ? `Update Threshold for ${visibleItems.length} Nozzle${visibleItems.length !== 1 ? 's' : ''}` : 'Choose At Least 1 Plant/Machine'}</b>
                <hr className="my-1" />
                <Row>
                  {this.formFields.map(f => (
                    <Col xs="12" lg="2" key={f.name} className="text-nowrap">
                      <div className={`${errors[f.name] ? 'text-danger' : ''}`}>{errors[f.name] ? `${f.label} ${errors[f.name]}` : f.label}&nbsp;</div>
                    </Col>
                  ))}
                </Row>
                <div className="data-holder thresholds">
                  <Row>
                    {this.formFields.map(f => (
                      <Col xs="12" lg="2" key={f.name} className="text-nowrap input-row">
                        <Input size="sm" invalid={!!errors[f.name]} id={f.name} disabled={!visibleItems.length} type="number" />
                      </Col>
                    ))}
                  </Row>
                </div>
                <hr className="mt-0 mb-2" />
                <Row>
                  <Col xs="12" className="text-center text-nowrap">
                    <Button onClick={this.handleSubmit} disabled={!visibleItems.length} block color="success">Save</Button>
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

export default withNozzles(withThresholds(Thresholds));
