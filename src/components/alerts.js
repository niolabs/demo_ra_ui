import React from 'react';
import { Row, Col, Modal, ModalHeader, ModalBody } from '@nio/ui-kit';
import { withAlerts } from '../providers/pubkeeper';

export default withAlerts(({ alerts, alertDetail, toggleAlertDetail }) => {
  return (
    <>
      <b>Alerts</b>
      <hr className="my-1" />
      <Row>
        <Col xs="4" className="text-nowrap text-xs">
          <b>Time</b>
        </Col>
        <Col xs="1" className="text-center text-nowrap text-xs">
          <b>Plant</b>
        </Col>
        <Col xs="1" className="text-center text-nowrap text-xs">
          <b>Machine</b>
        </Col>
        <Col xs="1" className="text-center text-nowrap text-xs">
          <b>Nozzle</b>
        </Col>
        <Col xs="5" className="text-nowrap text-xs">
          <b>Description</b>
        </Col>
      </Row>
      <div id="alerts-holder" className="data-holder border-top">
        {alerts.length ? alerts.sort((a, b) => a.time < b.time ? 1 : -1).map(a => (
          <Row key={`${a.nozzle_id}-${a.time}-${a.description}`} id={`${a.nozzle_id}-${a.time}-${a.description}`} onClick={toggleAlertDetail} className="alert-row border-bottom">
            <Col xs="4" className="text-nowrap">
              {a.time.replace('.0000000Z', '').replace('T', ' ').replace('Z', ' ')}
            </Col>
            <Col xs="1" className="text-center text-nowrap">
              {a.plant}
            </Col>
            <Col xs="1" className="text-center text-nowrap">
              {a.machine}
            </Col>
            <Col xs="1" className="text-center text-nowrap">
              {a.nozzle_id}
            </Col>
            <Col xs="5" className="text-nowrap alert-description">
              {a.description}
            </Col>
          </Row>
        )) : (
          <div className="text-center text-xs pt-5">Loading alerts...</div>
        )}
      </div>
      <Modal isOpen={!!alertDetail} toggle={toggleAlertDetail}>
        <ModalHeader toggle={toggleAlertDetail}>Alert Detail</ModalHeader>
        {!!alertDetail && (
          <ModalBody>
            <Row>
              <Col xs="4">
                Time
              </Col>
              <Col xs="8">
                {alertDetail.time.replace('.0000000Z', '')}
              </Col>
            </Row>
            <Row>
              <Col xs="4">
                Plant
              </Col>
              <Col xs="8">
                {alertDetail.plant}
              </Col>
            </Row>
            <Row>
              <Col xs="4">
                Machine
              </Col>
              <Col xs="8">
                {alertDetail.machine}
              </Col>
            </Row>
            <Row>
              <Col xs="4">
                Nozzle
              </Col>
              <Col xs="8">
                {alertDetail.nozzle_id}
              </Col>
            </Row>
            <hr />
            {alertDetail.description}
          </ModalBody>
        )}
      </Modal>
    </>
  )
});
