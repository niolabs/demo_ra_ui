import React from 'react';
import { Row, Col, Loader } from '@nio/ui-kit';
import VisibilitySensor from 'react-visibility-sensor';
import { withNozzles, withSort, withActiveItems } from '../providers/pubkeeper';
import sortNozzles from '../util/sortNozzles';
import NozzleRow from './nozzleRow';

class Nozzles extends React.PureComponent {
  render = () => {
    const { items, asc, sortBy, sort, toggle, activeItems } = this.props;
    return (
      <>
        <b>Nozzles</b>
        <hr className="my-1" />
        <Row noGutters>
          {[
            { col: 'name', label: 'Ch-Hole'},
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
          {!items ? (
            <Loader />
          ) : items.sort((a, b) => sortNozzles({ a, b, asc, sortBy })).map(n => (
            <VisibilitySensor key={n.itemKey}>
              {({isVisible}) => isVisible ? (
                <NozzleRow
                  toggle={toggle}
                  showToggle={Object.values(activeItems.machines).filter(n => n).length}
                  active={!!activeItems.nozzles[n.itemKey]}
                  {...n}
                />
              ) : (
                <div className="nozzle-row-holder" />
              )}
            </VisibilitySensor>
          ))}
        </div>
      </>
    )
  }
}

export default withSort(withNozzles(withActiveItems(Nozzles)));
