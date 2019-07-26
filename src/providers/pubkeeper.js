import React from 'react';
import { PubkeeperClient, WebSocketBrew } from '@pubkeeper/browser-client';

const PubkeeperContext = React.createContext();

import NewDataWorker from 'worker-loader!../workers/newData';

export class PubkeeperProvider extends React.Component {
  state = {
    plants: {},
    machines: {},
    nozzles: {},
    active: {
      plants: {},
      machines: {},
      nozzles: {},
    },
    sortedData: {
      plants: [],
      machines: [],
      nozzles: [],
    },
    alerts: [],
    nozzleSort: { sortBy: 'name', asc: true },
    thresholds: [],
    notification_numbers: [],
    currentProgram: {},
    alertDetail: false,
    allMachineToggle: false,
    allPlantToggle: false,
  };

  componentDidMount = async () => {
    this.initializeWebWorker();

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

    this.pkClient.addPatron('alerts_buffer', (patron) => {
      patron.on('message', this.writeAlertsToState);
      return () => patron.off('message', this.writeAlertsToState);
    });

    this.pkClient.addPatron('threshold_values', (patron) => {
      patron.on('message', this.writeThresholdsToState);
      return () => patron.off('message', this.writeThresholdsToState);
    });

    this.pkClient.addBrewer('thresholds', brewer => this.thresholdBrewer = brewer);

    this.pkClient.addPatron('notification_numbers_values', (patron) => {
      patron.on('message', this.writeNotificationNumbersToState);
      return () => patron.off('message', this.writeNotificationNumbersToState);
    });

    this.pkClient.addBrewer('notification_numbers', brewer => this.notificationNumberBrewer = brewer);
  };

  initializeWebWorker = () => {
    this.Worker = new NewDataWorker();
    this.Worker.onmessage = (event) => this.setState(event.data);
  };

  writeNozzlesToState = (data) => {
    const { plants, machines, nozzles, active } = this.state;
    let newData = false;
    let json = false;

    try {
      json = new TextDecoder().decode(data);
      newData = JSON.parse(json);
    } catch(e) {
      console.log('malformed PK data', e)
    }

    if (Object.keys(plants).length) return false;

    this.Worker.postMessage({ newData, plants, machines, nozzles });
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

  togglePlant = (e) => {
    const { active } = this.state;
    const id = e.currentTarget.getAttribute('data-id');
    const multi = e.currentTarget.getAttribute('data-multi');
    const newValue = !active.plants[id];

    if (!multi) {
      active.plants = {};
      active.machines = {};
      active.nozzles = {};
    }

    active.plants[id] = newValue;

    this.setState({ active, currentProgram: {} });
  };

  toggleAllPlants = () => {
    const { active, plants, allPlantToggle } = this.state;
    Object.keys(plants).map(k => active.plants[k] = !allPlantToggle);

    if (allPlantToggle) {
      active.machines = {};
      active.nozzles = {};
    }

    this.setState({ active, allPlantToggle: !allPlantToggle });
  };

  toggleMachine = (e) => {
    let { active, machines } = this.state;
    const id = e.currentTarget.getAttribute('data-id');
    const multi = e.currentTarget.getAttribute('data-multi');
    const newValue = !active.machines[id];

    const currentProgram = newValue ? machines[id] : {};

    if (!multi) {
      active.machines = {};
      active.nozzles = {};
    }

    active.machines[id] = newValue;

    this.setState({ active, currentProgram });
  };

  toggleAllMachines = () => {
    const { active, machines, allMachineToggle } = this.state;
    Object.keys(machines).map(k => active.machines[k] = !allMachineToggle);

    if (allMachineToggle) {
      active.nozzles = {};
    }

    this.setState({ active, allMachineToggle: !allMachineToggle });
  };

  toggleNozzle = (e) => {
    const { active } = this.state;
    const id = e.currentTarget.getAttribute('data-id');
    active.nozzles[id] = !active.nozzles[id];

    if (!Object.values(active.machines).filter(n => n).length) return false;

    this.setState({ active });
  };

  filterNozzles = (n) => {
    const { active, currentProgram } = this.state;

    const thisPlant = !!active.plants[n.plantKey];
    const thisMachine = !!active.machines[n.machineKey];
    const thisProgram = n.optel_schedule_wo == currentProgram.optel_schedule_wo;

    const oneMachine = Object.values(active.machines).filter(n => n).length;

    if (!thisPlant) return false;
    return oneMachine ? thisPlant && thisMachine && thisProgram : thisPlant;
  };

  filterAlerts = (n) => {
    const { active } = this.state;

    const thisPlant = !!active.plants[n.plant];
    const thisMachine = !!active.machines[`${n.plant}-${n.machine}`];
    const thisNozzle = !!active.nozzles[n.name];

    const oneNozzle = Object.values(active.nozzles).filter(n => n).length;
    const oneMachine = Object.values(active.machines).filter(n => n).length;
    const onePlant = Object.values(active.plants).filter(n => n).length;

    return oneNozzle ? thisPlant && thisMachine && thisNozzle : oneMachine ? thisPlant && thisMachine : onePlant ? thisPlant : true;
  };

  setNozzleSort = (e) => {
    const { nozzleSort } = this.state;
    const newKey = e.currentTarget.getAttribute('data-sort');
    nozzleSort.asc = nozzleSort.sortBy === newKey ? !nozzleSort.asc : true;
    nozzleSort.sortBy = newKey;
    this.setState({ nozzleSort });
  };

  resetSortAndFilter = () => {
    this.setState({ active: { plants: {}, machines: {}, nozzles: {} }, nozzleSort: { sortBy: 'nozzle_id', asc: true }});
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
        filterNozzles: this.filterNozzles,
        filterAlerts: this.filterAlerts,
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
    {({ nozzles, toggleNozzle, filterNozzles, active }) =>
      <Component
        {...props}
        items={Object.values(nozzles).filter(filterNozzles)}
        toggle={toggleNozzle}
        activeItems={active}
      />
    }
  </PubkeeperContext.Consumer>
);

export const withPlants = Component => props => (
  <PubkeeperContext.Consumer>
    {({ sortedData: { plants }, togglePlant }) =>
      <Component
        {...props}
        label="Plants"
        items={plants}
        toggle={togglePlant}
      />
    }
  </PubkeeperContext.Consumer>
);

export const withMachines = Component => props => (
  <PubkeeperContext.Consumer>
    {({ sortedData: { machines }, active, toggleMachine }) =>
      <Component
        {...props}
        label="Machines"
        items={machines.filter(k => active.plants[k.plantKey])}
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

export const withAlerts = Component => () => (
  <PubkeeperContext.Consumer>
    {({ alerts, filterAlerts, alertDetail, toggleAlertDetail }) =>
      <Component
        alerts={alerts.filter(filterAlerts)}
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

export const withSort = Component => props => (
  <PubkeeperContext.Consumer>
    {({ setNozzleSort, nozzleSort: { asc, sortBy } }) =>
      <Component
        {...props}
        asc={asc}
        sortBy={sortBy}
        sort={setNozzleSort}
      />
    }
  </PubkeeperContext.Consumer>
);

export const withActiveItems = Component => props => (
  <PubkeeperContext.Consumer>
    {({ active }) =>
      <Component
        {...props}
        activeItems={active}
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
    {({ currentProgram }) =>
      <Component
        {...currentProgram}
      />
    }
  </PubkeeperContext.Consumer>
);
