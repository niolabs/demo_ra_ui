import React from 'react';
import { Row, Col } from '@nio/ui-kit';
import { withNozzles } from '../providers/pubkeeper';

export default withNozzles(({ items, asc, sortBy, sort, toggle }) => (
  <>
    <Row noGutters>
      <Col xs="2" className="text-nowrap nozzle-sort" data-sort="id" onClick={sort}>
        <b>Nozzles</b>
        <i className={`fa fa-chevron-${asc && sortBy === 'id' ? 'up' : 'down'} pull-right sortcon ${sortBy === 'id' ? 'active' : ''}`} />
      </Col>
      <Col xs="1" className="text-center text-nowrap nozzle-sort" data-sort="picks" onClick={sort}>
        <b>Picks</b>
        <i className={`fa fa-chevron-${asc && sortBy === 'picks' ? 'up' : 'down'} pull-right sortcon ${sortBy === 'picks' ? 'active' : ''}`} />
      </Col>
      <Col xs="2" className="text-center text-nowrap nozzle-sort" data-sort="placements" onClick={sort}>
        <b>Placements</b>
        <i className={`fa fa-chevron-${asc && sortBy === 'placements' ? 'up' : 'down'} pull-right sortcon ${sortBy === 'placements' ? 'active' : ''}`} />
      </Col>
      <Col xs="2" className="text-center text-nowrap nozzle-sort" data-sort="x" onClick={sort}>
        <b>Reject Sum %</b>
        <i className={`fa fa-chevron-${asc && sortBy === 'x' ? 'up' : 'down'} pull-right sortcon ${sortBy === 'x' ? 'active' : ''}`} />
      </Col>
      <Col xs="2" className="text-center text-nowrap nozzle-sort" data-sort="y" onClick={sort}>
        <b>Rejects</b>
        <i className={`fa fa-chevron-${asc && sortBy === 'y' ? 'up' : 'down'} pull-right sortcon ${sortBy === 'y' ? 'active' : ''}`} />
      </Col>
      <Col xs="2" className="text-center text-nowrap nozzle-sort" data-sort="z" onClick={sort}>
        <b>Reject Factor</b>
        <i className={`fa fa-chevron-${asc && sortBy === 'z' ? 'up' : 'down'} pull-right sortcon ${sortBy === 'z' ? 'active' : ''}`} />
      </Col>
      <Col xs="1" className="text-nowrap text-right">
        <i className="fa fa-eye eyecon mr-1 " />
      </Col>
    </Row>
    <div className="data-holder">
      {items && items.map(n => (
        <Row noGutters key={n.id} data-id={n.id} onClick={toggle} className="toggle-row">
          <Col xs="2" className="text-nowrap">
            {n.id}
          </Col>
          <Col xs="1" className="text-center text-nowrap">
            {n.picks}
          </Col>
          <Col xs="2" className="text-center text-nowrap">
            {n.placements}
          </Col>
          <Col xs="2" className="text-center text-nowrap">
            {parseFloat(n.x).toFixed(6)}%
          </Col>
          <Col xs="2" className="text-center text-nowrap">
            {n.y}
          </Col>
          <Col xs="2" className="text-center text-nowrap">
            {parseFloat(n.z).toFixed(6)}
          </Col>
          <Col xs="1" className="text-right">
            <i className={`mr-1 fa ${n.visible ? 'fa-check text-success' : 'fa-times text-danger'}`} />
          </Col>
        </Row>
      ))}
    </div>
  </>
));
