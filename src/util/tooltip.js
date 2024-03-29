export default ({ name, data }) => {
  let tooltip = '<div class="card"><div class="tooltip"><b>';
  tooltip += `nozzle ${name}`;
  tooltip += '</b><hr class="my-1" />';
  tooltip += `location: ${data[0].location}`;
  tooltip += '<hr class="my-1" />';
  tooltip += `reject sum %: ${data[0].reject_sum_percent.toFixed(5)}`;
  tooltip += '<br />';
  tooltip += `reject sum: ${data[0].reject_sum}`;
  tooltip += '<br />';
  tooltip += `reject factor: ${data[0].reject_factor.toFixed(5)}`;
  tooltip += '</div></div>';
  return tooltip;
};
