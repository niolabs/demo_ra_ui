import React from 'react';
import { PubkeeperClient, WebSocketBrew } from '@pubkeeper/browser-client';

import devData from '../util/devData';
import devAlerts from '../util/devAlerts';
import devThresholds from '../util/devThresholds';

const PubkeeperContext = React.createContext();

export class PubkeeperProvider extends React.Component {
  state = {
    plants: {},
    machines: {},
    alerts: [],
    nozzles: { placeholder: { nozzle_id: 'placeholder', reject_sum_percent: 0, reject_sum: 0, reject_factor: 0 }},
    chartLimits: { maxX: 0, maxZ: 0 },
    nozzleSort: { sortBy: 'id', asc: true },
    thresholds: [],
  };

  isDev = window.ISDEV;

  componentDidMount = async () => {
    this.pkClient = await new PubkeeperClient({
      server: `${window.PK_SECURE ? 'wss' : 'ws'}://${window.PK_HOST}:${window.PK_PORT}/ws`,
      jwt: window.PK_JWT,
      brews: [new WebSocketBrew({ brewerConfig: { hostname: window.WS_HOST, port: window.WS_PORT, secure: window.WS_SECURE } })],
    }).connect();

    this.pkClient.addPatron('nozzle_plot', (patron) => {
      patron.on('message', this.writeDataToState);
      return () => patron.off('message', this.writeDataToState);
    });

    this.pkClient.addPatron('alerts', (patron) => {
      patron.on('message', this.writeAlertsToState);
      return () => patron.off('message', this.writeAlertsToState);
    });

    this.pkClient.addPatron('thresholds', (patron) => {
      patron.on('message', this.writeThresholdsToState);
      return () => patron.off('message', this.writeThresholdsToState);
    });

    this.pkClient.addBrewer('thresholds', brewer => this.thresholdBrewer = brewer);

    if (this.isDev) {
      this.processNewData(devData);
      this.setState({ alerts: devAlerts, thresholds: devThresholds });
    }
  };

  writeDataToState = (data) => {
    const json = new TextDecoder().decode(data);
    const newData = JSON.parse(json);
    this.processNewData(newData);
  };

  processNewData = (newData) => {
    const { plants, machines, nozzles, chartLimits } = this.state;

    newData.map((m) => {
      plants[m.plant] = { id: m.plant, visible: plants[m.plant] ? plants[m.plant].visible : false };
      machines[m.machine] = { id: m.machine, plant: m.plant, visible: machines[m.machine] ? machines[m.machine].visible : true };
      nozzles[m.nozzle_id] = { ...m, placements: m.placements.cumulative_count, picks: m.picks.cumulative_count, visible: nozzles[m.nozzle_id] && nozzles[m.nozzle_id].visible || true};
      if (m.reject_sum_percent > chartLimits.maxX) chartLimits.maxX = m.reject_sum_percent;
      if (m.reject_factor > chartLimits.maxZ) chartLimits.maxZ = m.reject_factor;
    });

    this.setState({ plants, machines, nozzles, chartLimits });
  };

  writeAlertsToState = (data) => {
    const { alerts } = this.state;
    const json = new TextDecoder().decode(data);
    const newData = JSON.parse(json);
    const alertKey = `${newData.time}-${newData.plant}-${newData.machine}-${newData.nozzle_id}`;
    alerts[alertKey] = newData;
    this.setState({ alerts });
  };

  writeThresholdsToState = (data) => {
    const json = new TextDecoder().decode(data);
    const thresholds = JSON.parse(json);
    this.setState({ thresholds });
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
    nozzles[k].visible = !nozzles[k].visible;
    this.setState({ nozzles });
  };

  sortNozzles = (e) => {
    const { nozzleSort } = this.state;
    const newKey = e.currentTarget.getAttribute('data-sort');
    nozzleSort.asc = nozzleSort.sortBy === newKey ? !nozzleSort.asc : true;
    nozzleSort.sortBy = newKey;
    this.setState({ nozzleSort });
  };

  updateThresholds = (newValues) => {
    const { thresholds } = this.state;

    thresholds.map(t => {
      newValues.nozzle_ids.forEach(n => {
        const existingNozzleIdIndex = t.nozzle_ids.findIndex(tn => tn === n);
        if (existingNozzleIdIndex !== -1) t.nozzle_ids.splice(existingNozzleIdIndex, 1);
      });
      if (!t.nozzle_ids.length) delete t.nozzle_ids;
    });

    const newThresholds = thresholds.filter(t => !!t.nozzle_ids);
    newThresholds.push(newValues);
    this.thresholdBrewer.brewJSON(newThresholds);
  };

  resetSortAndFilter = () => {
    const { nozzles, machines, plants, nozzleSort } = this.state;
    Object.values(nozzles).map(i => i.visible = true);
    Object.values(machines).map(i => i.visible = true);
    Object.values(plants).map(i => i.visible = true);
    this.setState({ nozzles, machines, plants, nozzleSort: { sortBy: 'id', asc: true }})
  };

  render = () => {
    const { children } = this.props;
    const { plants, machines, nozzles, chartLimits: { maxX, maxZ }, alerts, thresholds, nozzleSort } = this.state;

    return (
      <PubkeeperContext.Provider value={{
        plants,
        machines,
        nozzles,
        thresholds,
        maxX,
        maxZ,
        alerts,
        nozzleSort,
        togglePlant: this.togglePlant,
        toggleMachine: this.toggleMachine,
        toggleNozzle: this.toggleNozzle,
        sortNozzles: this.sortNozzles,
        updateThresholds: this.updateThresholds,
        resetSortAndFilter: this.resetSortAndFilter,
      }}
      >
        {children}
      </PubkeeperContext.Provider>
    );
  };
}

export const withGraphData = Component => props => (
  <PubkeeperContext.Consumer>
    {({ nozzles, machines, plants, maxX, maxZ }) =>
      <Component
        {...props}
        items={Object.values(nozzles)
        .filter(n => n.nozzle_id === 'placeholder' || (n.visible && machines[n.machine].visible && plants[n.plant].visible))
        .map(n => ({ name: n.nozzle_id, data: [{ x: n.reject_sum_percent * 100, y: n.reject_sum, z: n.nozzle_id === 'placeholder' ? 0 : n.reject_factor + (maxZ / 3) }] }))}
        maxX={maxX * 100}
        maxZ={maxZ}
        nozzles={nozzles}
      />
    }
  </PubkeeperContext.Consumer>
);

export const withThresholds = Component => props => (
  <PubkeeperContext.Consumer>
    {({ thresholds, updateThresholds }) =>
      <Component
        {...props}
        thresholds={thresholds}
        updateThresholds={updateThresholds}
      />
    }
  </PubkeeperContext.Consumer>
);

export const withSortedAndFilteredNozzles = Component => props => (
  <PubkeeperContext.Consumer>
    {({ plants, machines, nozzles, nozzleSort: { asc, sortBy }, sortNozzles, toggleNozzle }) =>
      <Component
        {...props}
        items={Object.values(nozzles)
        .filter(n => n.nozzle_id !== 'placeholder' && plants[n.plant].visible && machines[n.machine].visible)
        .sort((a, b) => ((asc) ? b[sortBy] > a[sortBy] ? -1 : 1 : b[sortBy] < a[sortBy] ? -1 : 1))}
        asc={asc}
        sortBy={sortBy}
        sort={sortNozzles}
        toggle={toggleNozzle}
      />
    }
  </PubkeeperContext.Consumer>
);

export const withPlants = Component => props => (
  <PubkeeperContext.Consumer>
    {({ plants, togglePlant }) =>
      <Component
        {...props}
        label="Plants"
        items={Object.values(plants)}
        toggle={togglePlant}
      />
    }
  </PubkeeperContext.Consumer>
);

export const withMachines = Component => props => (
  <PubkeeperContext.Consumer>
    {({ machines, plants, toggleMachine }) =>
      <Component
        {...props}
        label="Machines"
        items={Object.values(machines).filter(k => plants[k.plant].visible)} toggle={toggleMachine}
      />
    }
  </PubkeeperContext.Consumer>
);

export const withAlerts = Component => props => (
  <PubkeeperContext.Consumer>
    {({ alerts, plants, machines, nozzles }) =>
      <Component
        {...props}
        alerts={alerts.filter(a => plants[a.plant].visible && machines[a.machine].visible && nozzles[a.nozzle_id].visible)}
      />
    }
  </PubkeeperContext.Consumer>
);

export const withSortAndFilterReset = Component => props => (
  <PubkeeperContext.Consumer>
    {({ resetSortAndFilter }) =>
      <Component
        {...props}
        resetSortAndFilter={resetSortAndFilter}
      />
    }
  </PubkeeperContext.Consumer>
);
