import React from 'react';
import { PubkeeperClient, WebSocketBrew } from '@pubkeeper/browser-client';

import sortNozzles from '../util/sortNozzles';
import sortMachinesAndPlants from '../util/sortMachinesAndPlants';

const PubkeeperContext = React.createContext();

export class PubkeeperProvider extends React.Component {
  state = {
    plants: {},
    machines: {},
    nozzles: {},
    alerts: [],
    nozzleSort: { sortBy: 'nozzle_id', asc: true },
    thresholds: [],
    notification_numbers: [],
    current_program: {},
    atLeastOneNozzleIsSelected: false,
    atLeastOneMachineIsSelected: false,
    alertDetail: false,
    allMachineToggle: false,
    allPlantToggle: false,
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

    let newData = false;
    let json = false;

    try {
      json = new TextDecoder().decode(data);
    } catch(e) {
      //console.log('could not TextDecode binary PK data', data, e)
    }

    try {
      newData = JSON.parse(json);
    } catch(e) {
      //console.log('decoded PK data string was not valid json', json, e)
    }

    console.log('newData', newData);

    newData && newData.map((m) => {
      const plantKey = m.plant;
      const machineKey = `${m.plant}-${m.machine}`;
      const nozzleKey = `${m.plant}-${m.machine}-${m.nozzle_id}`;

      // if (nozzleKey === '1020-GC4-4-18')  m.reject_sum_percent = 0.70;

      plants[plantKey] = {
        key: m.plant,
        id: m.plant,
        visible: plants[plantKey] ? plants[plantKey].visible : false
      };

      machines[machineKey] = {
        key: machineKey,
        id: m.machine,
        machine: m.machine,
        plant: m.plant,
        plantKey: plantKey,
        visible: machines[machineKey] ? machines[machineKey].visible : false,
        optel_schedule_wo: m.optel_schedule_wo,
        side: m.side,
        timestamp: m.timestamp.replace('.0000000Z', ''),
      };

      nozzles[nozzleKey] = {
        ...m,
        key: nozzleKey,
        machineKey: machineKey,
        placements: m.placements.cumulative_count,
        picks: m.picks.cumulative_count,
        visible: nozzles[nozzleKey] && nozzles[nozzleKey].visible || false
      };
    });

    this.setState({ plants, machines, nozzles });
  };

  writeAlertsToState = (data) => {
    const { alerts } = this.state;
    try {
      const json = new TextDecoder().decode(data);
      const newData = JSON.parse(json);

      newData.map(na => {
        na.id = `${na.nozzle_id}-${na.time}-${na.description}`;
        if (!alerts.find(a => a.id === na.id )) {
          alerts.push(na);
        }
      });
      this.setState({ alerts });
    } catch(e) {
      console.log('bad alerts data', data, e)
    }
  };

  writeThresholdsToState = (data) => {
    try {
      const json = new TextDecoder().decode(data);
      const thresholds = JSON.parse(json);
      this.setState({ thresholds });
    } catch(e) {
      console.log('bad thresholds data', data, e)
    }
  };

  writeNotificationNumbersToState = (data) => {
    try {
      const json = new TextDecoder().decode(data);
      const notification_numbers = JSON.parse(json);
      this.setState({ notification_numbers });
    } catch(e) {
      console.log('bad notification numbers data', data, e)
    }
  };

  togglePlant = (k, newValue = false, cascade = true) => {
    const { plants, machines } = this.state;
    const id = typeof k === 'object' ? k.currentTarget.getAttribute('data-id') : k;
    plants[id].visible = typeof k === 'object' ? !plants[id].visible : newValue;

    this.setState({ plants, current_program: {} });

    if(cascade) {
      if (plants[id].visible) {
        Object.keys(plants).filter(p => p !== id).map(p => this.togglePlant(p, false));
      } else {
        Object.keys(machines).filter(m => machines[m].plantKey === id).map(m => this.toggleMachine(m, false));
      }
    }
  };

  toggleAllPlants = () => {
    const { plants, allPlantToggle } = this.state;
    Object.keys(plants).map(m => this.togglePlant(m, !allPlantToggle, false));
    if (allPlantToggle) this.toggleAllMachines({ fromPlants: true });
    this.setState({ allPlantToggle: !allPlantToggle });
  };


  toggleMachine = (k, newValue = false, cascade = true) => {
    let { machines, nozzles } = this.state;
    const id = typeof k === 'object' ? k.currentTarget.getAttribute('data-id') : k;
    machines[id].visible = typeof k === 'object' ? !machines[id].visible : newValue;

    this.setState({ machines });

    if (cascade) {
      if(machines[id].visible) {
        Object.keys(machines).filter(m => m !== id).map(m => this.toggleMachine(m, false));
        this.setState({ current_program: machines[id], atLeastOneMachineIsSelected: true });
      } else {
        Object.keys(nozzles).filter(n => nozzles[n].machineKey === id).map(n => this.toggleNozzle(n, false));
        this.setState({ current_program: {}, atLeastOneMachineIsSelected: Object.values(machines).filter(m => m.visible).length });
      }
    }
  };

  toggleAllMachines = ({ fromPlants }) => {
    const { machines, allMachineToggle } = this.state;
    Object.keys(machines).map(m => this.toggleMachine(m, fromPlants ? false : !allMachineToggle, false));
    this.setState({ allMachineToggle: !allMachineToggle });
  };

  toggleNozzle = (k, newValue = false) => {
    const { nozzles, atLeastOneMachineIsSelected } = this.state;
    const id = typeof k === 'object' ? k.currentTarget.getAttribute('data-id') : k;
    nozzles[id].visible = typeof k === 'object' ? !nozzles[id].visible : newValue;

    if (!atLeastOneMachineIsSelected) return false;

    this.setState({
      nozzles,
      atLeastOneNozzleIsSelected: Object.values(nozzles).filter(n => n.visible).length
    });
  };


  filterGraphData = (n) => {
    const { plants, machines, atLeastOneMachineIsSelected, atLeastOneNozzleIsSelected } = this.state;

    const thisPlant = plants[n.plant];
    const thisMachine = machines[`${n.plant}-${n.machine}`];
    const thisNozzle = n;

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

  toggleAlertDetail = (e) => {
    const { alertDetail, alerts } = this.state;
    const newAlertDetail = alertDetail ? false : alerts.find(a => a.id === e.currentTarget.getAttribute('id'));
    this.setState({ alertDetail: newAlertDetail });
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
        toggleAlertDetail: this.toggleAlertDetail,
        toggleAllMachines: this.toggleAllMachines,
        toggleAllPlants: this.toggleAllPlants,
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

export const withGraphData = Component => () => (
  <PubkeeperContext.Consumer>
    {({ nozzles, filterGraphData }) => {

      const items = Object.values(nozzles).filter(n => filterGraphData(n));
      const maxX = Math.max(...items.map(n => n.reject_sum_percent), 0.50);
      const maxY = Math.max(...items.map(n => n.reject_sum), 100);
      const maxZ = Math.max(...items.map(n => n.reject_factor));

      return (
        <Component
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

export const withNozzles = Component => () => (
  <PubkeeperContext.Consumer>
    {({ nozzles, setNozzleSort, nozzleSort: { asc, sortBy }, toggleNozzle, filterTableData, atLeastOneMachineIsSelected }) =>
      <Component
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

export const withToggleAll = Component => props => (
  <PubkeeperContext.Consumer>
    {({ toggleAllMachines, toggleAllPlants }) =>
      <Component
        {...props}
        toggleAllPlants={toggleAllPlants}
        toggleAllMachines={toggleAllMachines}
      />
    }
  </PubkeeperContext.Consumer>
);

export const withVisibleMachines = Component => () => (
  <PubkeeperContext.Consumer>
    {({ machines, plants }) =>
      <Component
        items={Object.values(machines).filter(k => plants[k.plant].visible && k.visible).map(i => ({ id: i.id, plant: i.plant })).sort((a, b) => sortMachinesAndPlants({ a, b }))}
      />
    }
  </PubkeeperContext.Consumer>
);

export const withAlerts = Component => () => (
  <PubkeeperContext.Consumer>
    {({ alerts, filterAlertData, alertDetail, toggleAlertDetail }) =>
      <Component
        alerts={alerts.filter(n => filterAlertData(n))}
        alertDetail={alertDetail}
        toggleAlertDetail={toggleAlertDetail}
      />
    }
  </PubkeeperContext.Consumer>
);

export const withNotificationNumbers = Component => () => (
  <PubkeeperContext.Consumer>
    {({ notification_numbers, notificationNumberBrewer }) =>
      <Component
        notification_numbers={notification_numbers}
        brewer={notificationNumberBrewer}
      />
    }
  </PubkeeperContext.Consumer>
);

export const withSortAndFilterReset = Component => () => (
  <PubkeeperContext.Consumer>
    {({ resetSortAndFilter }) =>
      <Component
        resetSortAndFilter={resetSortAndFilter}
      />
    }
  </PubkeeperContext.Consumer>
);

export const withCurrentProgram = Component => () => (
  <PubkeeperContext.Consumer>
    {({ current_program }) =>
      <Component
        {...current_program}
      />
    }
  </PubkeeperContext.Consumer>
);
