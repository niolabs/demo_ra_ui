import React from 'react';
import { Row, Col, Loader } from '@nio/ui-kit';
import VisibilitySensor from 'react-visibility-sensor';
import { withNozzles } from '../providers/pubkeeper';
import NozzleRow from './nozzleRow';

export default withNozzles(({ items, asc, sortBy, sort, toggle, showToggle, choosingMachine }) => (
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
    <div className="data-holder border-top nozzle-chooser">
      {choosingMachine || !items ? (
        <Loader />
      ) : items.map(n => (
        <VisibilitySensor key={n.key}>
          {({isVisible}) => isVisible ? (
            <NozzleRow itemKey={n.key} toggle={toggle} showToggle={showToggle} {...n} />
          ) : (
            <div className="nozzle-row-holder" />
          )}
        </VisibilitySensor>
      ))}
    </div>
  </>
));
