export default ({ name, data, maxZ }) => {
  let tooltip = '<div class="card"><div class="tooltip"><b>';
  tooltip += `nozzle ${name}`;
  tooltip += '</b><hr class="my-1" />';
  tooltip += `plant: ${data[0].plant}`;
  tooltip += '<br />';
  tooltip += `machine: ${data[0].machine}`;
  tooltip += '<hr class="my-1" />';
  tooltip += `reject sum %: ${parseFloat(data[0].x).toFixed(6)}`;
  tooltip += '<br />';
  tooltip += `reject sum: ${data[0].y}`;
  tooltip += '<br />';
  tooltip += `reject factor: ${parseFloat(data[0].z - (maxZ / 3)).toFixed(6)}`;
  tooltip += '</div></div>';
  return tooltip;
};
