export default [
  {
    reject_quantity: 100,
    reject_sum_percent: 10,
    slope: 5,
    left_factor: -1,
    right_factor: 1,
    left_up_factor: 0.33,
    machines: [
      {plant: '1', id: 'PM1'},
      {plant: '1', id: 'PM2'},
    ],
  },
  {
    reject_quantity: 90,
    reject_sum_percent: 5,
    slope: 3,
    left_factor: -2,
    right_factor: 2,
    left_up_factor: 0.45,
    machines: [
      {plant: '2', id: 'PM3'},
      {plant: '10', id: 'PM1'},
    ],
  },
];
