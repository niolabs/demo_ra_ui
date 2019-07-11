import React from 'react';
import { Card, CardBody, Col, Row, Form, Input, Button } from '@nio/ui-kit';
import { withThresholds, withVisibleMachines } from '../providers/pubkeeper';
import Machines from '../components/threshholdChooser';
import { Plants } from '../components/chooser';
import Alerts from '../components/alerts';

class Thresholds extends React.Component {
  state = {
    errors: {},
    formFields: [
      { name: 'reject_quantity', label: 'Reject Qty', value: '' },
      { name: 'reject_sum_percent', label: 'Reject Sum %', value: ''},
      { name: 'slope', label: 'Slope', value: ''},
      { name: 'left_factor', label: 'Left Factor', value: ''},
      { name: 'right_factor', label: 'Right Up Factor', value: ''},
      { name: 'left_up_factor', label: 'Left Up Factor', value: ''},
    ]
  };

  handleSubmit = () => {
    const { thresholds, brewer, items } = this.props;
    const { formFields } = this.state;
    const errors = {};
    const newThresholdObject = {};
    this.setState({ errors });

    formFields.map(f => {
      if (!f.value) errors[f.name] = 'is required';
      if (f.name === 'left_factor' && f.value > -1) errors[f.name] = 'must be negative';
      if (!errors[f.name]) newThresholdObject[f.name] = f.value;
    });

    if (!Object.keys(errors).length) {
      // loop through existing thresholds and remove any of the selected machines from existing threshold sets
      thresholds.map(t => {
        items.forEach(m => {
          const existingMachineIndex = t.machines.findIndex(tn => tn.plant === m.plant && tn.id === m.id);
          if (existingMachineIndex !== -1) t.machines.splice(existingMachineIndex, 1);
        });
      });

      // find an existing threshold set that matches the one we're submitting
      const existingMatchingThresholdIndex = this.findExistingMatchingThresholdIndex(newThresholdObject);

      if (existingMatchingThresholdIndex !== -1) {
        // add the machine to the existing threshold set
        items.forEach(m => {
          thresholds[existingMatchingThresholdIndex].machines.push(m);
        });
      } else {
        // add the new threhsold set and the selected items thereto
        thresholds.push({ ...newThresholdObject, machines: items });
      }

      // send up the new threhsold array, filtering out any that have no machines associated therewith
      brewer.brewJSON(thresholds.filter(t => !!t.machines.length));
      this.resetFields();
    } else {
      this.setState({ errors });
    }
  };

  findExistingMatchingThresholdIndex = (n) => {
    const { thresholds } = this.props;
    return thresholds.findIndex(t =>
      t.reject_quantity === n.reject_quantity &&
      t.reject_sum_percent === n.reject_sum_percent  &&
      t.slope === n.slope  &&
      t.left_factor === n.left_factor  &&
      t.right_factor === n.right_factor  &&
      t.left_up_factor === n.left_up_factor
    );
  };

  updateField = (e) => {
    const { formFields } = this.state;
    formFields.find(f => f.name === e.target.getAttribute('id')).value = parseFloat(e.target.value);
    this.setState({ formFields });
  };

  resetFields = () => {
    this.setState({
      formFields: [
        { name: 'reject_quantity', label: 'Reject Qty', value: '' },
        { name: 'reject_sum_percent', label: 'Reject Sum %', value: ''},
        { name: 'slope', label: 'Slope', value: ''},
        { name: 'left_factor', label: 'Left Factor', value: ''},
        { name: 'right_factor', label: 'Right Up Factor', value: ''},
        { name: 'left_up_factor', label: 'Left Up Factor', value: ''},
      ]
    });
  };

  render = () => {
    const { items } = this.props;
    const { errors, formFields } = this.state;

    return (
      <Card>
        <CardBody className="p-3">
          <div>
            <h2 className="m-0">Adjust Thresholds</h2>
          </div>
          <hr />
          <Row>
            <Col xs="12" lg="2">
              <Plants />
              <hr className="mt-0 mb-4 d-block d-lg-none" />
            </Col>
            <Col xs="12" lg="10">
              <Machines />
            </Col>
          </Row>
          <hr className="mt-0 mb-4" />
          <Row>
            <Col lg="6">
              <Form>
                <b>New Thresholds</b>
                <hr className="my-1" />
                <div className="text-xs text-nowrap">
                  <b>{items.length ? `${items.length} Machine${items.length !== 1 ? 's' : ''} will be updated with these thresholds` : 'You must select at least 1 machine to update'}</b>
                </div>
                <div className="data-holder no-height border-top border-bottom mb-2 pb-4">
                  <Row>
                    {formFields.map(f => (
                      <Col xs="12" lg="4" key={f.name} className="text-nowrap mt-2">
                        <div className={`text-nowrap text-xs mb-1 ${errors[f.name] ? 'text-danger' : ''}`}><b>{errors[f.name] && `${f.label} ${errors[f.name]}`}&nbsp;</b></div>
                        <Input step="0.1" placeholder={f.label} invalid={!!errors[f.name]} id={f.name} disabled={!items.length} value={f.value} type="number" onChange={this.updateField} />
                      </Col>
                    ))}
                  </Row>
                </div>
                <Button onClick={this.handleSubmit} disabled={!items.length} block color="success">Save</Button>
              </Form>
              <hr className="d-block d-lg-none" />
            </Col>
            <Col lg="6">
              <Alerts />
            </Col>
          </Row>
        </CardBody>
      </Card>
    )
  }
}

export default withVisibleMachines(withThresholds(Thresholds));
