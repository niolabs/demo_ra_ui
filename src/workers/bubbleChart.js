const processBubbleChartData = ({ activeItems, items }) => {
  let filteredItems = items.filter(i => i.reject_sum_percent && i.reject_sum && i.reject_factor);

  if (Object.values(activeItems.nozzles).filter(n => n).length) {
    filteredItems = filteredItems.filter(i => !!activeItems.nozzles[i.itemKey]);
  }

  const maxX = Math.max(...filteredItems.map(n => n.reject_sum_percent), 0.50) * 100;
  const maxY = Math.max(...filteredItems.map(n => n.reject_sum), 100);
  const maxZ = Math.max(...filteredItems.map(n => n.reject_factor));

  const series = filteredItems.map(n => ({
    name: n.name,
    data: [{
      location: n.machineKey,
      reject_sum_percent: n.reject_sum_percent * 100,
      reject_sum: n.reject_sum,
      reject_factor: n.reject_factor,
      x: n.reject_sum_percent * 100,
      y: n.reject_sum,
      z: n.reject_factor + (maxZ / 3)
    }]
  }));

  series.push({ name: 'maxaxis', data: [{ x: maxX <= 50 ? 50 : Math.ceil(maxX / 10) * 10, y: maxY <= 100 ? 100 : Math.ceil(maxY / 10) * 10, z: 0 }] });

  series.push({ name: 'zeroaxis', data: [{ x: 0, y: 0, z: 0 }] });

  return { currentItems: items, currentActiveItems: activeItems, series };
};

self.addEventListener('message', (event) => {
  self.postMessage(processBubbleChartData(event.data));
});
