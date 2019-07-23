import React from 'react';
import { Card, CardBody, Col, Row, Form, Input, Button } from '@nio/ui-kit';
import { withThresholds, withMachines, withToggleAll, withActiveItems } from '../providers/pubkeeper';
import Machines from '../components/threshholdChooser';
import { Plants } from '../components/chooser';
import Alerts from '../components/alerts';

class Thresholds extends React.Component {
  state = { errors: {} };

  componentDidMount = () => {
    this.resetFields();
  };

  handleSubmit = () => {
    const { thresholds, brewer, items, activeItems } = this.props;
    const { formFields } = this.state;
    const activeMachines = items.filter(i => !!activeItems.machines[i.itemKey]).map(m => ({ id: m.name, plant: m.plantKey }));
    const errors = {};
    const newThresholdObject = {};
    this.setState({ errors });

    formFields.map(f => {
      if (!f.value) errors[f.name] = 'is required';
      if (!errors[f.name]) newThresholdObject[f.name] = parseFloat(f.value);
    });

    if (!Object.keys(errors).length) {
      // loop through existing thresholds and delete any that have it as a top level machine
      activeMachines.map(m => {
        const existingMachineIndex = thresholds.findIndex(tn => tn.machine.plant === m.plant && tn.machine.id === m.id);
        if (existingMachineIndex !== -1) {
          //console.log('found machine in existing threshold for machine: ', m.plant, m.id);
          thresholds.splice(existingMachineIndex, 1);
        } else {
          //console.log('did not find a top-level item with the same plant and id in any threhsold.machine field');
        }
      });

      // loop through existing thresholds.machines and remove any of the selected machines from existing threshold sets
      thresholds.map(t => {
        activeMachines.map(m => {
          const existingMachineIndex = t.machines.findIndex(tn => tn.plant === m.plant && tn.id === m.id);
          if (existingMachineIndex !== -1) {
            //console.log('found machine in existing threshold in machines: ', m.plant, m.id);
            t.machines.splice(existingMachineIndex, 1);
          }
        });
      });

      // find an existing threshold set that matches the one we're submitting
      const existingMatchingThresholdIndex = this.findExistingMatchingThresholdIndex(newThresholdObject);

      if (existingMatchingThresholdIndex !== -1) {
        // add the machine to the existing threshold set
        activeMachines.map(m => {
          thresholds[existingMatchingThresholdIndex].machines.push(m);
        });
      } else {
        // add the new threshold set and the selected items thereto
        thresholds.push({ ...newThresholdObject, machines: activeMachines });
      }

      // send up the new threhsold array, filtering out any that have no machines associated therewith
      const cleanThresholds = thresholds.filter(t => !!t.machines.length);
      //console.log(cleanThresholds);
      this.resetFields();
      brewer.brewJSON(thresholds.filter(t => !!t.machines.length));
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
      t.right_up_factor === n.right_up_factor  &&
      t.left_up_factor === n.left_up_factor
    );
  };

  updateField = (e) => {
    const { formFields } = this.state;
    formFields.find(f => f.name === e.target.getAttribute('id')).value = e.target.value;
    this.setState({ formFields });
  };

  resetFields = () => {
    this.setState({
      errors: {},
      formFields: [
        { name: 'reject_quantity', label: 'Reject Qty', placeholder: 'Enter Qty', value: '', step: '.1' },
        { name: 'reject_sum_percent', label: 'Reject Sum %', placeholder: 'Enter %', value: '', step: '.1'},
        { name: 'slope', label: 'Slope', placeholder: 'Enter Slope', value: '', step: '.1'},
        { name: 'left_factor', label: 'Left Factor', placeholder: 'Enter Left Factor', value: '', step: '.1'},
        { name: 'right_up_factor', label: 'Right Up Factor', placeholder: 'Enter Right Up Factor', value: '', step: '.1'},
        { name: 'left_up_factor', label: 'Left Up Factor', placeholder: 'Enter Left Up Factor', value: '', step: '.1'},
      ]
    });
  };

  render = () => {
    const { items, toggle, toggleAllMachines, toggleAllPlants, activeItems, thresholds } = this.props;
    const { errors, formFields } = this.state;

    const activeMachines = items.filter(i => !!activeItems.machines[i.itemKey]);

    //console.log(thresholds);

    return (
      <Card>
        <CardBody className="p-3">
          <div>
            <h2 className="m-0">Adjust Thresholds</h2>
          </div>
          <hr />
          <Row>
            <Col xs="12" lg="2">
              <Plants multi toggleAll={toggleAllPlants} />
              <hr className="mt-0 mb-4 d-block d-lg-none" />
            </Col>
            <Col xs="12" lg="10">
              <Machines items={items} toggle={toggle} thresholds={thresholds} toggleAll={toggleAllMachines} activeItems={activeItems} />
            </Col>
          </Row>
          <hr className="mt-0 mb-4" />
          <Row>
            <Col lg="6">
              <Form>
                <b>New Thresholds</b>
                <hr className="my-1" />
                <div className="text-xs text-nowrap">
                  <b>{activeMachines.length ? `${activeMachines.length} Machine${activeMachines.length !== 1 ? 's' : ''} will be updated with these thresholds` : 'You must select at least 1 machine to update'}</b>
                </div>
                <div className="data-holder no-height border-top border-bottom mb-2 pb-4">
                  <Row>
                    {formFields && formFields.map(f => (
                      <Col xs="12" lg="4" key={f.name} className="text-nowrap mt-2">
                        <div className={`text-nowrap text-xs mb-1 ${errors[f.name] ? 'text-danger' : ''}`}><b>{errors[f.name] ? `${f.label} ${errors[f.name]}` : f.label}&nbsp;</b></div>
                        <Input step={f.step} placeholder={f.placeholder} invalid={!!errors[f.name]} id={f.name} disabled={!activeMachines.length} value={f.value} type="number" onChange={this.updateField} />
                      </Col>
                    ))}
                  </Row>
                </div>
                <Button onClick={this.handleSubmit} disabled={!activeMachines.length} block color="success">Save</Button>
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

export default withMachines(withThresholds(withToggleAll(withActiveItems(Thresholds))));
