const sortMachinesAndPlants = ({ a, b }) => {
  try {

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

  } catch (e) {

    console.log(`Machine / Plant sort failed. Missing ID`, e);
    return 0;

  }
};

export default sortMachinesAndPlants;
