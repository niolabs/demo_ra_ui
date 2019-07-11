import React from 'react';
import { Row, Col } from '@nio/ui-kit';
import { withNozzles } from '../providers/pubkeeper';

export default withNozzles(({ items, asc, sortBy, sort, toggle }) => (
  <>
    <b>Nozzles</b>
    <hr className="my-1" />
    <Row noGutters>
      {[
        { col: 'nozzle_id', label: 'Ch-Hole'},
        { col: 'type', label: 'Tooltype'},
        { col: 'picks', label: 'Picks'},
        { col: 'placements', label: 'Placements'},
        { col: 'poss_missing', label: 'Poss Missing'},
        { col: 'comp_missing', label: 'Comp Missing'},
        { col: 'reject_sum', label: 'Rejects'},
        { col: 'reject_sum_percent', label: 'Nozz Rej %'},
        { col: 'reject_factor', label: 'Nozz Rej Factor'},
      ].map(c => (
        <Col key={c.col} className="nozzle-cell nozzle-sort text-xs" data-sort={c.col} onClick={sort}>
          <b>{c.label}</b>&nbsp;&nbsp;<i className={`fa fa-chevron-${asc && sortBy === c.col ? 'up' : 'down'} sortcon ${sortBy === c.col ? 'active' : ''}`} />
        </Col>
      ))}
      <Col />
    </Row>
    <div className="data-holder border-top">
      {items && items.map(n => (
        <Row noGutters key={n.key} data-id={n.key} onClick={toggle} className="toggle-row border-bottom">
          <Col className="nozzle-cell">
            {n.nozzle_id}
          </Col>
          <Col className="nozzle-cell">
            {n.type}
          </Col>
          <Col className="nozzle-cell">
            {n.picks}
          </Col>
          <Col className="nozzle-cell">
            {n.placements}
          </Col>
          <Col className="nozzle-cell">
            {n.poss_missing}
          </Col>
          <Col className="nozzle-cell">
            {n.comp_missing}
          </Col>
          <Col className="nozzle-cell">
            {n.reject_sum}
          </Col>
          <Col className="nozzle-cell">
            {parseFloat(n.reject_sum_percent * 100).toFixed(2)}%
          </Col>
          <Col className="nozzle-cell">
            {parseFloat(n.reject_factor).toFixed(2)}
          </Col>
          <Col className="nozzle-cell text-right">
            <i className={`mr-1 fa fa-check ${n.visible ? 'text-success' : 'text-lightgrey'}`} />
          </Col>
        </Row>
      ))}
    </div>
  </>
));
