const sortNozzles = ({ a, b, asc, sortBy}) => {
  try {

    const sortA = sortBy === 'nozzle_id' ? a[sortBy].split('-') : a[sortBy].toString();
    const sortB = sortBy === 'nozzle_id' ? b[sortBy].split('-') : b[sortBy].toString();

    if (sortBy === 'nozzle_id') {
      if (!(sortA[0] - sortB[0])) {
        return asc ? sortA[1] - sortB[1] : sortB[1] - sortA[1];
      }
      return asc ? sortA[0] - sortB[0] : sortB[0] - sortA[0];
    }
    return asc ? sortA - sortB : sortB - sortA;

  } catch (e) {

    console.log(`Nozzle sort failed. Missing ${sortBy}`, e);
    return 0;

  }
};

export default sortNozzles;
