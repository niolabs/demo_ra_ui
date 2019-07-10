import React from 'react';
import { PubkeeperClient, WebSocketBrew } from '@pubkeeper/browser-client';

import devData from '../util/devData';
import devAlerts from '../util/devAlerts';
import devThresholds from '../util/devThresholds';
import devNotificationNumbers from '../util/devNotificationNumbers';

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
    current_program: { machine: false, optel_schedule_wo: false, side: false, latest: false },
    isDev: false,
  };

  componentDidMount = async () => {
    const { isDev } = this.state;

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

    this.pkClient.addPatron('notification_numbers', (patron) => {
      patron.on('message', this.writeNotificationNumbersToState);
      return () => patron.off('message', this.writeNotificationNumbersToState);
    });

    this.pkClient.addBrewer('notification_numbers', brewer => this.notificationNumberBrewer = brewer);

    if (isDev) {
      this.processNewData(devData);
      this.setState({ alerts: devAlerts, thresholds: devThresholds });
    }
  };

  toggleDev = () => {
    const { isDev } = this.state;
    const newDevState = !isDev;
    this.setState({ isDev: newDevState });
    if (newDevState) {
      this.processNewData(devData);
      this.setState({ alerts: devAlerts, thresholds: devThresholds, notification_numbers: devNotificationNumbers });
    } else {
      this.setState({
        plants: {},
        machines: {},
        alerts: [],
        nozzles: { placeholder: { nozzle_id: 'placeholder', reject_sum_percent: 0, reject_sum: 0, reject_factor: 0 }},
        nozzleSort: { sortBy: 'nozzle_id', asc: true },
        thresholds: [],
        notification_numbers: [],
        current_program: { machine: false, optel_schedule_wo: false, side: false, latest: false },
      })
    }
  };

  writeDataToState = (data) => {
    const json = new TextDecoder().decode(data);
    const newData = JSON.parse(json);
    this.processNewData(newData);
  };

  processNewData = (newData) => {
    const { plants, machines, nozzles } = this.state;

    newData.map((m) => {
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
        latest: new Date(m.timestamp).toUTCString(),
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

  writeNotificationNumbersToState = (data) => {
    const json = new TextDecoder().decode(data);
    const notification_numbers = JSON.parse(json);
    this.setState({ notification_numbers });
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

    const visibleMachines = Object.values(machines).filter(m => m.visible);
    const current_program = (visibleMachines.length === 1) ? visibleMachines[0] :
      { machine: false, optel_schedule_wo: false, side: false, latest: false };
    this.setState({ machines, current_program });
  };

  toggleNozzle = (e) => {
    const k = e.currentTarget.getAttribute('data-id');
    const { nozzles } = this.state;
    nozzles[k].visible = !nozzles[k].visible;
    this.setState({ nozzles });
  };

  filterItems = (n, component) => {
    const { plants, machines, nozzles } = this.state;

    const atLeastOneMachineIsSelected = Object.values(machines).filter(m => m.visible).length;
    const atLeastOneNozzleIsSelected = Object.values(nozzles).filter(m => m.visible).length;

    if (component === 'graph') {
      return n.nozzle_id === 'placeholder' ||
        (
          atLeastOneNozzleIsSelected ? n.visible && machines[`${n.plant}-${n.machine}`].visible && plants[n.plant].visible :
            atLeastOneMachineIsSelected ? machines[`${n.plant}-${n.machine}`].visible && plants[n.plant].visible :
              plants[n.plant].visible
        );
    } else if (component === 'table') {
      return n.nozzle_id !== 'placeholder' &&
        (
          atLeastOneMachineIsSelected ? plants[n.plant].visible && machines[`${n.plant}-${n.machine}`].visible :
            plants[n.plant].visible
        );
    } else if (component === 'alerts') {
      return atLeastOneNozzleIsSelected ? plants[n.plant].visible && machines[`${n.plant}-${n.machine}`].visible && nozzles[`${n.plant}-${n.machine}-${n.nozzle_id}`].visible :
        atLeastOneMachineIsSelected ? plants[n.plant].visible && machines[`${n.plant}-${n.machine}`].visible :
          plants[n.plant].visible;
    }
    return true;
  };

  setNozzleSort = (e) => {
    const { nozzleSort } = this.state;
    const newKey = e.currentTarget.getAttribute('data-sort');
    nozzleSort.asc = nozzleSort.sortBy === newKey ? !nozzleSort.asc : true;
    nozzleSort.sortBy = newKey;
    this.setState({ nozzleSort });
  };

  sortNozzles = (a, b) => {
    const { nozzleSort: { asc, sortBy } } = this.state;

    const sortA = sortBy === 'nozzle_id' ? a[sortBy].split('-') : a[sortBy] && !Number.isNaN(a[sortBy]) ? a[sortBy].toString() : 0;
    const sortB = sortBy === 'nozzle_id' ? b[sortBy].split('-') : b[sortBy] && !Number.isNaN(b[sortBy]) ? b[sortBy].toString() : 0;

    if (sortBy === 'nozzle_id') {
      if (!(sortA[0] - sortB[0])) {
        return asc ? sortA[1] - sortB[1] : sortB[1] - sortA[1];
      }
      return asc ? sortA[0] - sortB[0] : sortB[0] - sortA[0];
    }
    return asc ? sortA - sortB : sortB - sortA;
  };

  sortMachinesAndPlants = (a, b) => {
    const sortAAlpha = a.id.replace(/[0-9]/g, '');
    const sortBAlpha = b.id.replace(/[0-9]/g, '');

    const sortANumeric = a.id.replace(/\D/g,'');
    const sortBNumeric = b.id.replace(/\D/g,'');

    if (!sortAAlpha && !sortBAlpha) {
      return sortANumeric - sortBNumeric;
    }
    if (sortAAlpha === sortBAlpha) {
      return sortANumeric > sortBNumeric ? 1 : -1;
    }
    return sortAAlpha > sortBAlpha ? 1 : -1;
  };

  resetSortAndFilter = () => {
    const { nozzles, machines, plants } = this.state;
    Object.values(nozzles).map(i => i.visible = false);
    Object.values(machines).map(i => i.visible = false);
    Object.values(plants).map(i => i.visible = false);
    this.setState({ nozzles, machines, plants, nozzleSort: { sortBy: 'id', asc: true }})
  };

  render = () => {
    const { children } = this.props;
    const { plants, machines, nozzles, alerts, thresholds, nozzleSort, isDev, notification_numbers, current_program } = this.state;

    const maxX = Math.max(...Object.values(nozzles).map(n => n.reject_sum_percent), 0.50);
    const maxY = Math.max(...Object.values(nozzles).map(n => n.reject_sum), 100);
    const maxZ = Math.max(...Object.values(nozzles).map(n => n.reject_factor));

    console.log(current_program);

    return (
      <PubkeeperContext.Provider value={{
        plants,
        machines,
        nozzles,
        thresholds,
        maxX,
        maxY,
        maxZ,
        alerts,
        nozzleSort,
        isDev,
        notification_numbers,
        current_program,
        togglePlant: this.togglePlant,
        toggleMachine: this.toggleMachine,
        toggleNozzle: this.toggleNozzle,
        setNozzleSort: this.setNozzleSort,
        sortNozzles: this.sortNozzles,
        filterItems: this.filterItems,
        toggleDev: this.toggleDev,
        resetSortAndFilter: this.resetSortAndFilter,
        sortMachinesAndPlants: this.sortMachinesAndPlants,
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
    {({ nozzles, maxX, maxY, maxZ, filterItems }) =>
      <Component
        {...props}
        items={Object.values(nozzles)
        .filter(n => filterItems(n, 'graph'))
        .map(n => ({ name: n.nozzle_id, data: [{ plant: n.plant, machine: n.machine, x: n.reject_sum_percent * 100, y: n.reject_sum, z: n.nozzle_id === 'placeholder' ? 0 : n.reject_factor + (maxZ / 3) }] }))}
        maxX={maxX * 100}
        maxY={maxY}
        maxZ={maxZ}
        nozzles={nozzles}
      />
    }
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
    {({ nozzles, setNozzleSort, sortNozzles, nozzleSort: { asc, sortBy }, toggleNozzle, filterItems }) =>
      <Component
        {...props}
        items={Object.values(nozzles)
        .filter(n => filterItems(n, 'table'))
        .sort(sortNozzles)}
        asc={asc}
        sortBy={sortBy}
        sort={setNozzleSort}
        toggle={toggleNozzle}
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
    {({ machines, plants, toggleMachine, sortMachinesAndPlants }) =>
      <Component
        {...props}
        label="Machines"
        items={Object.values(machines).filter(k => plants[k.plant].visible).sort(sortMachinesAndPlants)}
        toggle={toggleMachine}
      />
    }
  </PubkeeperContext.Consumer>
);

export const withVisibleMachines = Component => props => (
  <PubkeeperContext.Consumer>
    {({ machines, plants, sortMachinesAndPlants }) =>
      <Component
        {...props}
        items={Object.values(machines).filter(k => plants[k.plant].visible && k.visible).map(i => ({ id: i.id, plant: i.plant })).sort(sortMachinesAndPlants)}
      />
    }
  </PubkeeperContext.Consumer>
);

export const withAlerts = Component => props => (
  <PubkeeperContext.Consumer>
    {({ alerts, filterItems }) =>
      <Component
        {...props}
        alerts={alerts.filter(n => filterItems(n, 'alerts'))}
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

export const withToggleDev = Component => props => (
  <PubkeeperContext.Consumer>
    {({ toggleDev, isDev }) =>
      <Component
        {...props}
        toggleDev={toggleDev}
        isDev={isDev}
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
