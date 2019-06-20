import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, Row, Col } from '@nio/ui-kit';
import stringify from 'json-stringify-pretty-compact';

export default class Page extends React.Component {
  state = { topics: {} };

  componentDidMount = () => {
    const { pkClient } = this.props;
    pkClient.addPatron('*.**', patron => patron.on('message', this.writeDataToState));
  };

  componentWillUnmount = () => {
    if (this.pkClient) this.pkClient.disconnect();
  };

  writeDataToState = (data, { topic, from }) => {
    const { topics } = this.state;
    const json = new TextDecoder().decode(data);
    const newData = Array.isArray(JSON.parse(json)) ? JSON.parse(json)[0] : JSON.parse(json);
    newData.from = from;
    if (!topics[topic]) topics[topic] = [];
    topics[topic].unshift(newData);
    this.setState({ topics });
  };

  render = () => {
    const { topics } = this.state;

    return (
      <Card>
        <CardBody className="p-3">
          <h2 className="m-0">UI Scaffold / Pubkeeper Demo</h2>
          Sending signals to and receiving signals from nio services using the Pubkeeper javascript client.
          <hr />
          <Row>
            {Object.keys(topics).map(topic => (
              <Col md="4" key={topic} className="mb-3">
                <b>{topic} ({topics[topic].length})</b>
                <Card>
                  <CardBody className="data-holder">
                    {topics[topic].map((topicdata, i) => (
                      <div key={i}>
                        {stringify(topicdata)}
                      </div>
                    ))}
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>
        </CardBody>
      </Card>
    );
  };
}

Page.propTypes = {
  pkClient: PropTypes.object.isRequired,
};
