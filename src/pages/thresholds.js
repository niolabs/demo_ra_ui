import React from 'react';
import { Card, CardBody, Col, Row, Form, Input, Button } from '@nio/ui-kit';
import { withThresholds, withSortedAndFilteredNozzles } from '../providers/pubkeeper';
import { Machines, Plants } from '../components/chooser';

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
      this.setState({ errors });
    }
  };

  render = () => {
    const { items, thresholds, toggle} = this.props;
    const { errors } = this.state;

    const visibleItems = items.filter(i => i.visible).map(i => i.nozzle_id);

    return (
      <Card>
        <CardBody className="p-3">
          <h2 className="m-0">Thresholds</h2>
          <hr />
          <Row>
            <Col lg="4" xs="12">
              <Row>
                <Col xs="6">
                  <Plants />
                </Col>
                <Col xs="6">
                  <Machines />
                </Col>
              </Row>
              <Row>
                <Col xs="12" className="text-nowrap">
                  <hr />
                  <b>{visibleItems.length ? `Update ${visibleItems.length} Nozzle Threshold${visibleItems.length !== 1 ? 's' : ''}` : 'Choose At Least 1 Plant/Machine/Nozzle'}</b>
                  <hr />
                </Col>
              </Row>
              <Form>
                <Row>
                  <Input id="nozzle_ids" type="hidden" value={visibleItems} />
                  {this.formFields.map(f => (
                    <Col md="6" key={f.name} className="text-center text-nowrap mb-1">
                      <Input invalid={!!errors[f.name]} id={f.name} disabled={!visibleItems.length} type="number" placeholder={f.label} />
                      <div className="text-danger small my-1">{errors[f.name] ? `${f.label} ${errors[f.name]}` : ''}&nbsp;</div>
                    </Col>
                  ))}
                </Row>
                <hr className="mt-1" />
                <Row>
                  <Col xs="12" className="text-center text-nowrap">
                    <Button onClick={this.handleSubmit} disabled={!visibleItems.length} block color="success">Save</Button>
                  </Col>
                </Row>
              </Form>
            </Col>
            <Col lg="8" xs="12">
              <Row noGutters>
                <Col xs="1" className="text-nowrap">
                  <b>Nozzle</b>
                </Col>
                <Col xs="1" className="text-center text-nowrap">
                  <b>Reject Qty</b>
                </Col>
                <Col xs="1" className="text-center text-nowrap">
                  <b>Reject %</b>
                </Col>
                <Col xs="2" className="text-center text-nowrap">
                  <b>Slope</b>
                </Col>
                <Col xs="2" className="text-center text-nowrap">
                  <b>Left Factor</b>
                </Col>
                <Col xs="2" className="text-center text-nowrap">
                  <b>Right Factor</b>
                </Col>
                <Col xs="2" className="text-center text-nowrap">
                  <b>Left Up Factor</b>
                </Col>
                <Col xs="1" className="text-nowrap text-right">
                  <i className="fa fa-eye eyecon mr-1 " />
                </Col>
              </Row>
              <div className="data-holder thresholds">
                {items && items.map(n => {
                  const thisThreshold = thresholds.find(t => t.nozzle_ids && t.nozzle_ids.includes(n.nozzle_id));
                  return (
                    <Row noGutters key={n.nozzle_id} data-id={n.nozzle_id} onClick={toggle} className="toggle-row">
                      <Col xs="1" className="text-nowrap">
                        {n.nozzle_id}
                      </Col>
                      <Col xs="1" className="text-center text-nowrap">
                        {thisThreshold ? thisThreshold.reject_quantity : '-'}
                      </Col>
                      <Col xs="1" className="text-center text-nowrap">
                        {thisThreshold ? thisThreshold.reject_sum_percent : '-'}
                      </Col>
                      <Col xs="2" className="text-center text-nowrap">
                        {thisThreshold ? thisThreshold.slope : '-'}
                      </Col>
                      <Col xs="2" className="text-center text-nowrap">
                        {thisThreshold ? thisThreshold.left_factor : '-'}
                      </Col>
                      <Col xs="2" className="text-center text-nowrap">
                        {thisThreshold ? thisThreshold.right_factor : '-'}
                      </Col>
                      <Col xs="2" className="text-center text-nowrap">
                        {thisThreshold ? thisThreshold.left_up_factor : '-'}
                      </Col>
                      <Col xs="1" className="text-right">
                        <i className={`mr-1 fa ${n.visible ? 'fa-check text-success' : 'fa-times text-danger'}`} />
                      </Col>
                    </Row>
                  )
                })}
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    )
  }
}

export default withSortedAndFilteredNozzles(withThresholds(Thresholds));
