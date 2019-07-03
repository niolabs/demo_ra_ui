import React from 'react';
import { Row, Col } from '@nio/ui-kit';
import { withNozzles } from '../providers/pubkeeper';

export default withNozzles(({ items, asc, sortBy, sort, toggle }) => (
  <>
    <b>Nozzles</b>
    <hr className="my-1" />
    <Row noGutters>
      <Col xs="1" className="text-nowrap nozzle-sort" data-sort="nozzle_id" onClick={sort}>
        <b>Ch-Hole</b>
        <i className={`fa fa-chevron-${asc && sortBy === 'nozzle_id' ? 'up' : 'down'} pull-right sortcon ${sortBy === 'nozzle_id' ? 'active' : ''}`} />
      </Col>
      <Col xs="1" className="text-center text-nowrap nozzle-sort" data-sort="picks" onClick={sort}>
        <b>Type</b>
        <i className={`fa fa-chevron-${asc && sortBy === 'type' ? 'up' : 'down'} pull-right sortcon ${sortBy === 'type' ? 'active' : ''}`} />
      </Col>
      <Col xs="1" className="text-center text-nowrap nozzle-sort" data-sort="picks" onClick={sort}>
        <b>Picks</b>
        <i className={`fa fa-chevron-${asc && sortBy === 'picks' ? 'up' : 'down'} pull-right sortcon ${sortBy === 'picks' ? 'active' : ''}`} />
      </Col>
      <Col xs="1" className="text-center text-nowrap nozzle-sort" data-sort="placements" onClick={sort}>
        <b>Placements</b>
        <i className={`fa fa-chevron-${asc && sortBy === 'placements' ? 'up' : 'down'} pull-right sortcon ${sortBy === 'placements' ? 'active' : ''}`} />
      </Col>
      <Col xs="2" className="text-center text-nowrap nozzle-sort" data-sort="placements" onClick={sort}>
        <b>Poss Missing</b>
        <i className={`fa fa-chevron-${asc && sortBy === 'possible-missing' ? 'up' : 'down'} pull-right sortcon ${sortBy === 'possible-missing' ? 'active' : ''}`} />
      </Col>
      <Col xs="2" className="text-center text-nowrap nozzle-sort" data-sort="placements" onClick={sort}>
        <b>Comp Missing</b>
        <i className={`fa fa-chevron-${asc && sortBy === 'comp-missing' ? 'up' : 'down'} pull-right sortcon ${sortBy === 'comp-missing' ? 'active' : ''}`} />
      </Col>
      <Col xs="1" className="text-center text-nowrap nozzle-sort" data-sort="reject_sum" onClick={sort}>
        <b>Rej Sum</b>
        <i className={`fa fa-chevron-${asc && sortBy === 'reject_sum' ? 'up' : 'down'} pull-right sortcon ${sortBy === 'reject_sum' ? 'active' : ''}`} />
      </Col>
      <Col xs="1" className="text-center text-nowrap nozzle-sort" data-sort="reject_sum_percent" onClick={sort}>
        <b>Rej Sum %</b>
        <i className={`fa fa-chevron-${asc && sortBy === 'reject_sum_percent' ? 'up' : 'down'} pull-right sortcon ${sortBy === 'reject_sum_percent' ? 'active' : ''}`} />
      </Col>
      <Col xs="1" className="text-center text-nowrap nozzle-sort" data-sort="reject_factor" onClick={sort}>
        <b>Rej Factor</b>
        <i className={`fa fa-chevron-${asc && sortBy === 'reject_factor' ? 'up' : 'down'} pull-right sortcon ${sortBy === 'reject_factor' ? 'active' : ''}`} />
      </Col>
      <Col xs="1" className="text-nowrap text-right">
        <i className="fa fa-eye eyecon mr-1 " />
      </Col>
    </Row>
    <div className="data-holder">
      {items && items.map(n => (
        <Row noGutters key={n.nozzle_id} data-id={n.nozzle_id} onClick={toggle} className="toggle-row">
          <Col xs="1" className="text-nowrap">
            {n.nozzle_id}
          </Col>
          <Col xs="1" className="text-center text-nowrap">
            {n.type}
          </Col>
          <Col xs="1" className="text-center text-nowrap">
            {n.picks}
          </Col>
          <Col xs="1" className="text-center text-nowrap">
            {n.placements}
          </Col>
          <Col xs="2" className="text-center text-nowrap">
            {n.possibleMissing}
          </Col>
          <Col xs="2" className="text-center text-nowrap">
            {n.compMissing}
          </Col>
          <Col xs="1" className="text-center text-nowrap">
            {n.reject_sum}
          </Col>
          <Col xs="1" className="text-center text-nowrap">
            {parseFloat(n.reject_sum_percent * 100).toFixed(6)}%
          </Col>
          <Col xs="1" className="text-center text-nowrap">
            {parseFloat(n.reject_factor).toFixed(6)}
          </Col>
          <Col xs="1" className="text-right">
            <i className={`mr-1 fa ${n.visible ? 'fa-check text-success' : 'fa-times text-danger'}`} />
          </Col>
        </Row>
      ))}
    </div>
  </>
));
