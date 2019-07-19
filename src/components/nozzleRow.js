import React from 'react';
import { Col, Row } from '@nio/ui-kit';

export default class extends React.PureComponent {
    render = () => {
        const { showToggle, toggle, itemKey, nozzle_id, type, picks, placements, poss_missing, comp_missing, reject_sum, reject_sum_percent, reject_factor, visible } = this.props;
        //console.log('rendering nozzle row');
        return (
          <Row
            noGutters
            data-id={itemKey}
            onClick={toggle}
            className={`toggle-row border-bottom ${visible}`}
          >
              <Col className="nozzle-cell">
                  {nozzle_id}
              </Col>
              <Col className="nozzle-cell">
                  {type}
              </Col>
              <Col className="nozzle-cell">
                  {picks}
              </Col>
              <Col className="nozzle-cell">
                  {placements}
              </Col>
              <Col className="nozzle-cell">
                  {poss_missing}
              </Col>
              <Col className="nozzle-cell">
                  {comp_missing}
              </Col>
              <Col className="nozzle-cell">
                  {reject_sum}
              </Col>
              <Col className="nozzle-cell">
                  {parseFloat(reject_sum_percent * 100).toFixed(2)}%
              </Col>
              <Col className="nozzle-cell">
                  {parseFloat(reject_factor).toFixed(2)}
              </Col>
              <Col className="nozzle-cell text-right">
                  {!!showToggle && (
                    <i className="mr-1 fa fa-check" />
                  )}
              </Col>
          </Row>
        );
    };
}
