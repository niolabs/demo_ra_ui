import sortMachinesAndPlants from '../util/sortMachinesAndPlants';

const processNewData = ({ newData, plants, machines, nozzles, owo }) => {
  let shouldSortPlants = false;
  let shouldSortMachines = false;

  newData.map((m) => {
    const plantKey = m.plant;
    const machineKey = `${m.plant}-${m.machine}`;
    const nozzleKey = m.name;

    if (!plants[plantKey]) shouldSortPlants = true;
    if (!machines[machineKey]) shouldSortMachines = true;

    plants[plantKey] = {
      name: m.plant,
      itemKey: m.plant,
    };

    machines[machineKey] = {
      name: m.machine,
      itemKey: machineKey,
      plantKey: plantKey,
      optel_schedule_wo: m.optel_schedule_wo,
      side: m.side,
    };

    nozzles[nozzleKey] = {
      name: m.nozzle_id,
      itemKey: nozzleKey,
      machineKey: machineKey,
      plantKey: plantKey,
      type: m.type,
      placements: m.placements.cumulative_count,
      picks: m.picks.cumulative_count,
      poss_missing: m.poss_missing,
      comp_missing: m.comp_missing,
      reject_sum: m.reject_sum,
      reject_sum_percent: m.reject_sum_percent,
      reject_factor: m.reject_factor,
      optel_schedule_wo: m.optel_schedule_wo,
    };

    owo[m.optel_schedule_wo] = m.timestamp.replace('.0000000Z','').replace('T',' ').replace('Z', ' ');
  });

  const returnObject = { plants, machines, nozzles, owo };

  if (shouldSortMachines || shouldSortPlants) {
    returnObject.sortedData = {};

    if (shouldSortPlants) {
      returnObject.sortedData.plants =  Object.values(plants).sort(sortMachinesAndPlants);
    }

    if (shouldSortMachines) {
      returnObject.sortedData.machines =  Object.values(machines).sort(sortMachinesAndPlants);
    }
  }

  return returnObject;
};

self.addEventListener('message', (event) => {
  self.postMessage(processNewData(event.data));
});
