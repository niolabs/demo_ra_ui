import React from 'react';
import { PubkeeperClient, WebSocketBrew } from '@pubkeeper/browser-client';

import sortNozzles from '../util/sortNozzles';
import sortMachinesAndPlants from '../util/sortMachinesAndPlants';

const PubkeeperContext = React.createContext();

export class PubkeeperProvider extends React.Component {
  state = {
    plants: {},
    machines: {},
    alerts: [],
    nozzles: { placeholder: { nozzle_id: 'placeholder', reject_sum_percent: 0, reject_sum: 0, reject_factor: 0 }},
    nozzleSort: { sortBy: 'nozzle_id', asc: true },
    thresholds: [],
    notification_numbers: [],
    current_program: {},
    atLeastOneNozzleIsSelected: false,
    atLeastOneMachineIsSelected: false,
  };

  componentDidMount = async () => {
    this.pkClient = await new PubkeeperClient({
      server: `${window.PK_SECURE ? 'wss' : 'ws'}://${window.PK_HOST}:${window.PK_PORT}/ws`,
      jwt: window.PK_JWT,
      brews: [new WebSocketBrew({ brewerConfig: { hostname: window.WS_HOST, port: window.WS_PORT, secure: window.WS_SECURE } })],
    }).connect();

    this.pkClient.addPatron('nozzle_plot', (patron) => {
      patron.on('message', this.writeNozzlesToState);
      return () => patron.off('message', this.writeNozzlesToState);
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

    this.pkClient.addPatron('notification_numbers', (patron) => {
      patron.on('message', this.writeNotificationNumbersToState);
      return () => patron.off('message', this.writeNotificationNumbersToState);
    });

    this.pkClient.addBrewer('notification_numbers', brewer => this.notificationNumberBrewer = brewer);
  };

  writeNozzlesToState = (data) => {
    const { plants, machines, nozzles } = this.state;
    const json = new TextDecoder().decode(data);
    const newData = JSON.parse(json);

    let needToSortPlants = false;
    let needToSortMachines = false;

    newData.map((m) => {
      if (!m.plant) m.plant = '1001';

      plants[m.plant] = {
        key: m.plant,
        id: m.plant,
        visible: plants[m.plant] ? plants[m.plant].visible : false
      };

      machines[`${m.plant}-${m.machine}`] = {
        key: `${m.plant}-${m.machine}`,
        id: m.machine,
        machine: m.machine,
        plant: m.plant,
        visible: machines[`${m.plant}-${m.machine}`] ? machines[`${m.plant}-${m.machine}`].visible : false,
        optel_schedule_wo: m.optel_schedule_wo,
        side: m.side,
        timestamp: m.timestamp,
      };

      nozzles[`${m.plant}-${m.machine}-${m.nozzle_id}`] = {
        ...m,
        key: `${m.plant}-${m.machine}-${m.nozzle_id}`,
        placements: m.placements.cumulative_count,
        picks: m.picks.cumulative_count,
        visible: nozzles[`${m.plant}-${m.machine}-${m.nozzle_id}`] && nozzles[`${m.plant}-${m.machine}-${m.nozzle_id}`].visible || false
      };
    });

    this.setState({ plants, machines, nozzles });
  };

  writeAlertsToState = (data) => {
    const { alerts } = this.state;
    const json = new TextDecoder().decode(data);
    const newData = JSON.parse(json)[0];
    alerts.push(newData);
    this.setState({ alerts });
  };

  writeThresholdsToState = (data) => {
    const json = new TextDecoder().decode(data);
    const thresholds = JSON.parse(json);
    this.setState({ thresholds });
  };

  writeNotificationNumbersToState = (data) => {
    const json = new TextDecoder().decode(data);
    const notification_numbers = JSON.parse(json);
    this.setState({ notification_numbers });
  };

  togglePlant = (k, toFalse = false) => {
    const { plants } = this.state;
    plants[k].visible = toFalse ? false : !plants[k].visible;
    this.setState({ plants }, () => this.handlePlantCascade(k, plants[k].visible));
  };

  handlePlantCascade = (k, selecting = false) => {
    const { plants, machines } = this.state;
    if(selecting) {
      Object.keys(plants).filter(p => p !== k).map(p => this.togglePlant(p, true));
    } else {
      Object.keys(machines).filter(m => machines[m].key === `${k}-${machines[m].id}` && machines[m].visible).map(m => this.toggleMachine(m, true));
    }
  };

  toggleMachine = (k, toFalse = false) => {
    let { machines, current_program } = this.state;
    machines[k].visible = toFalse ? false : !machines[k].visible;

    if(!toFalse) {
      current_program = machines[k].visible ? machines[k] : {};
    }

    this.setState({ machines, current_program }, () => {
      this.handleMachineCascade(k, machines[k].visible);
      this.setAtLeastOneMachineIsSelected();
    });
  };

  handleMachineCascade = (k, selecting = false) => {
    const { machines, nozzles } = this.state;
    if(selecting) {
      Object.keys(machines).filter(m => m !== k).map(m => this.toggleMachine(m, true));
    } else {
      Object.keys(nozzles).filter(n => nozzles[n].key === `${machines[k].plant}-${machines[k].id}-${nozzles[n].nozzle_id}` && nozzles[n].visible).map(n => this.toggleNozzle(n, true));
    }
  };

  toggleNozzle = (k, toFalse = false) => {
    const { nozzles, atLeastOneMachineIsSelected } = this.state;

    if (!atLeastOneMachineIsSelected) return false;

    nozzles[k].visible = toFalse ? false : !nozzles[k].visible;
    this.setState({ nozzles });
    this.setAtLeastOneNozzleIsSelected();
  };

  setAtLeastOneNozzleIsSelected = () => this.setState({ atLeastOneNozzleIsSelected: Object.values(this.state.nozzles).filter(n => n.visible).length});

  setAtLeastOneMachineIsSelected = () => this.setState({ atLeastOneMachineIsSelected: Object.values(this.state.machines).filter(n => n.visible).length});

  filterGraphData = (n) => {
    const { plants, machines, atLeastOneMachineIsSelected, atLeastOneNozzleIsSelected } = this.state;

    const thisPlant = plants[n.plant];
    const thisMachine = machines[`${n.plant}-${n.machine}`];
    const thisNozzle = n;

    if (n.nozzle_id === 'placeholder') return true;
    if (!thisPlant || !thisMachine) return false;
    return atLeastOneNozzleIsSelected ? thisPlant.visible && thisMachine.visible && thisNozzle.visible : atLeastOneMachineIsSelected ? thisPlant.visible && thisMachine.visible : thisPlant.visible;
  };

  filterTableData = (n) => {
    const { plants, machines, atLeastOneMachineIsSelected } = this.state;

    const thisPlant = plants[n.plant];
    const thisMachine = machines[`${n.plant}-${n.machine}`];

    if (!thisPlant || !thisMachine) return false;
    return atLeastOneMachineIsSelected ? thisPlant.visible && thisMachine.visible : thisPlant.visible;
  };

  filterAlertData = (n) => {
    const { plants, machines, nozzles, atLeastOneMachineIsSelected, atLeastOneNozzleIsSelected } = this.state;

    const thisPlant = plants[n.plant];
    const thisMachine = machines[`${n.plant}-${n.machine}`];
    const thisNozzle = nozzles[`${n.plant}-${n.machine}-${n.nozzle_id}`];

    if (!thisPlant || !thisMachine || !thisNozzle) return false;
    return atLeastOneNozzleIsSelected ? thisPlant.visible && thisMachine.visible && thisNozzle.visible : atLeastOneMachineIsSelected ? thisPlant.visible && thisMachine.visible : thisPlant.visible;
  };

  setNozzleSort = (e) => {
    const { nozzleSort } = this.state;
    const newKey = e.currentTarget.getAttribute('data-sort');
    nozzleSort.asc = nozzleSort.sortBy === newKey ? !nozzleSort.asc : true;
    nozzleSort.sortBy = newKey;
    this.setState({ nozzleSort });
  };

  resetSortAndFilter = () => {
    const { nozzles, machines, plants } = this.state;
    Object.values(nozzles).map(i => i.visible = false);
    Object.values(machines).map(i => i.visible = false);
    Object.values(plants).map(i => i.visible = false);
    this.setState({ nozzles, machines, plants, nozzleSort: { sortBy: 'nozzle_id', asc: true }})
  };

  render = () => {
    const { children } = this.props;

    return (
      <PubkeeperContext.Provider value={{
        ...this.state,
        togglePlant: this.togglePlant,
        toggleMachine: this.toggleMachine,
        toggleNozzle: this.toggleNozzle,
        setNozzleSort: this.setNozzleSort,
        filterGraphData: this.filterGraphData,
        filterTableData: this.filterTableData,
        filterAlertData: this.filterAlertData,
        toggleDev: this.toggleDev,
        resetSortAndFilter: this.resetSortAndFilter,
        thresholdBrewer: this.thresholdBrewer,
        notificationNumberBrewer: this.notificationNumberBrewer,
      }}
      >
        {children}
      </PubkeeperContext.Provider>
    );
  };
}

export const withGraphData = Component => props => (
  <PubkeeperContext.Consumer>
    {({ nozzles, filterGraphData }) => {

      const items = Object.values(nozzles).filter(n => filterGraphData(n));
      const maxX = Math.max(...items.map(n => n.reject_sum_percent), 0.50);
      const maxY = Math.max(...items.map(n => n.reject_sum), 100);
      const maxZ = Math.max(...items.map(n => n.reject_factor));

      return (
        <Component
          {...props}
          items={items}
          maxX={maxX * 100}
          maxY={maxY}
          maxZ={maxZ}
        />
      );
    }}
  </PubkeeperContext.Consumer>
);

export const withThresholds = Component => props => (
  <PubkeeperContext.Consumer>
    {({ thresholds, thresholdBrewer }) =>
      <Component
        {...props}
        thresholds={thresholds}
        brewer={thresholdBrewer}
      />
    }
  </PubkeeperContext.Consumer>
);

export const withNozzles = Component => props => (
  <PubkeeperContext.Consumer>
    {({ nozzles, setNozzleSort, nozzleSort: { asc, sortBy }, toggleNozzle, filterTableData, atLeastOneMachineIsSelected }) =>
      <Component
        {...props}
        items={Object.values(nozzles).filter(n => filterTableData(n)).sort((a, b) => sortNozzles({ a, b, asc, sortBy }))}
        asc={asc}
        sortBy={sortBy}
        sort={setNozzleSort}
        toggle={toggleNozzle}
        showToggle={atLeastOneMachineIsSelected}
      />
    }
  </PubkeeperContext.Consumer>
);

export const withPlants = Component => props => (
  <PubkeeperContext.Consumer>
    {({ plants, togglePlant, sortMachinesAndPlants }) =>
      <Component
        {...props}
        label="Plants"
        items={Object.values(plants).sort(sortMachinesAndPlants)}
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
        items={Object.values(machines).filter(k => plants[k.plant].visible).sort((a, b) => sortMachinesAndPlants({ a, b }))}
        toggle={toggleMachine}
      />
    }
  </PubkeeperContext.Consumer>
);

export const withVisibleMachines = Component => props => (
  <PubkeeperContext.Consumer>
    {({ machines, plants }) =>
      <Component
        {...props}
        items={Object.values(machines).filter(k => plants[k.plant].visible && k.visible).map(i => ({ id: i.id, plant: i.plant })).sort((a, b) => sortMachinesAndPlants({ a, b }))}
      />
    }
  </PubkeeperContext.Consumer>
);

export const withAlerts = Component => props => (
  <PubkeeperContext.Consumer>
    {({ alerts, filterAlertData }) =>
      <Component
        {...props}
        alerts={alerts.filter(n => filterAlertData(n))}
      />
    }
  </PubkeeperContext.Consumer>
);

export const withNotificationNumbers = Component => props => (
  <PubkeeperContext.Consumer>
    {({ notification_numbers, notificationNumberBrewer }) =>
      <Component
        {...props}
        notification_numbers={notification_numbers}
        brewer={notificationNumberBrewer}
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

export const withCurrentProgram = Component => props => (
  <PubkeeperContext.Consumer>
    {({ current_program }) =>
      <Component
        {...props}
        {...current_program}
      />
    }
  </PubkeeperContext.Consumer>
);
