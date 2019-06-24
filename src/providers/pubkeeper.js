import React from 'react';
import { PubkeeperClient, WebSocketBrew } from '@pubkeeper/browser-client';

import config from '../../config';
import devData from '../util/devData';

const PubkeeperContext = React.createContext();

export class PubkeeperProvider extends React.Component {
  state = {
    connected: false,
    plants: {},
    machines: {},
    alerts: {},
    nozzles: [{ id: 'placeholder', x: 0, y: 0, z: 0 }],
    chartLimits: { maxX: 0, maxZ: 0 },
  };

  isDev = false;

  componentDidMount = async () => {
    if (this.isDev) {

      this.processNewData(devData);
      this.setState({ connected: true });

    } else {

      this.pkClient = await new PubkeeperClient({
        server: `${config.PK_SECURE ? 'wss' : 'ws'}://${config.PK_HOST}:${config.PK_PORT}/ws`,
        jwt: config.PK_JWT,
        brews: [new WebSocketBrew({ brewerConfig: { hostname: config.WS_HOST, port: config.WS_PORT, secure: config.WS_SECURE } })],
      }).connect();
      this.pkClient.addPatron('nozzle_plot', (patron) => {
        patron.on('message', this.writeDataToState);
        return () => patron.off('message', this.writeDataToState);
      });
      this.pkClient.addPatron('alerts', (patron) => {
        patron.on('message', this.writeAlertsToState);
        return () => patron.off('message', this.writeAlertToState);
      });
      this.setState({ connected: true });
    }
  };

  writeDataToState = (data) => {
    const json = new TextDecoder().decode(data);
    const newData = JSON.parse(json);
    this.processNewData(newData);
  };

  processNewData = (newData) => {
    const { plants, machines, nozzles, chartLimits } = this.state;

    newData.map(m => {
      plants[m.plant] = { id: m.plant, visible: plants[m.plant] ? plants[m.plant].visible : true };
      machines[m.machine] = { id: m.machine, plant: m.plant, visible: machines[m.machine] ? machines[m.machine].visible : true };

      const nozzleIndex = nozzles.findIndex(n => n.id === m.nozzle_id);

      const nozzleData = {
        id: m.nozzle_id,
        last: new Date(m.timestamp).toUTCString(),
        plant: m.plant,
        machine: m.machine,
        visible: nozzleIndex !== -1 ? nozzles[nozzleIndex].visible : true,
        x: m.reject_sum_percent * 100,
        y: m.reject_sum,
        z: m.reject_factor,
        picks: m.picks.cumulative_count,
        placements: m.placements.cumulative_count,
      };

      if (nozzleIndex !== -1) {
        nozzles[nozzleIndex] = nozzleData;
      } else {
        nozzles.push(nozzleData);
      }

      if (nozzleData.x > chartLimits.maxX) chartLimits.maxX = nozzleData.x;
      if (nozzleData.z > chartLimits.maxZ) chartLimits.maxZ = nozzleData.z;
    });

    this.setState({ plants, machines, nozzles, chartLimits });
  };

  writeAlertToState = (data) => {
    const { alerts } = this.state;
    const json = new TextDecoder().decode(data);
    const newData = JSON.parse(json);
    const alertKey = `${newData.time}-${newData.plant}-${newData.machine}-${newData.nozzle_id}`;
    alerts[alertKey] = newData;
    this.setState({ alerts });
  };

  togglePlant = (e) => {
    const k = e.currentTarget.getAttribute('data-id');
    const { plants } = this.state;
    plants[k].visible = !plants[k].visible;
    this.setState({ plants });
  };

  toggleMachine = (e) => {
    const k = e.currentTarget.getAttribute('data-id');
    const { machines } = this.state;
    machines[k].visible = !machines[k].visible;
    this.setState({ machines });
  };

  toggleNozzle = (e) => {
    const k = e.currentTarget.getAttribute('data-id');
    const { nozzles } = this.state;
    const nozzleIndex = nozzles.findIndex(n => n.id === k);
    nozzles[nozzleIndex].visible = !nozzles[nozzleIndex].visible;
    this.setState({ nozzles });
  };

  render = () => {
    const { children } = this.props;
    const { plants, machines, nozzles, chartLimits: { maxX, maxZ }, alerts } = this.state;

    const graphData = nozzles
    .filter(n => n.id === 'placeholder' || (n.visible && machines[n.machine].visible && plants[n.plant].visible))
    .map(n => ({ name: n.id, data: [{ x: n.x, y: n.y, z: n.id === 'placeholder' ? 0 : n.z + (maxZ / 3) }] }));

    return (
      <PubkeeperContext.Provider value={{
        plants,
        machines,
        nozzles,
        maxX,
        maxZ,
        alerts,
        graphData,
        togglePlant: this.togglePlant,
        toggleMachine: this.toggleMachine,
        toggleNozzle: this.toggleNozzle,
      }}>
        {children}
      </PubkeeperContext.Provider>
    );
  };
}

export const withPubkeeper = Component => props => {
  return (
    <PubkeeperContext.Consumer>
      {data => <Component {...props} {...data} />}
    </PubkeeperContext.Consumer>
  );
};
