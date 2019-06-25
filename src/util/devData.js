export default [
  {
    nozzle_id: '1-EE',
    timestamp: new Date().toUTCString(),
    plant: 1,
    machine: 2,
    reject_sum_percent: 0.034,
    reject_sum: 4,
    reject_factor: 0.003,
    picks: { cumulative_count: 5 },
    placements: { cumulative_count: 8 },
  },
  {
    nozzle_id: '1-FF',
    timestamp: new Date().toUTCString(),
    plant: 1,
    machine: 1,
    reject_sum_percent: 0.024,
    reject_sum: 2,
    reject_factor: 0.04,
    picks: { cumulative_count: 10 },
    placements: { cumulative_count: 10 },
  },
];
