const sortMachinesAndPlants = (a, b) => {
  try {

    const sortAAlpha = a.name.replace(/[0-9]/g, '');
    const sortBAlpha = b.name.replace(/[0-9]/g, '');

    const sortANumeric = parseInt(a.name.replace(/\D/g,''), 10);
    const sortBNumeric = parseInt(b.name.replace(/\D/g,''), 10);

    if ((!sortAAlpha && !sortBAlpha) || sortAAlpha === sortBAlpha) {
      return sortANumeric > sortBNumeric ? 1 : -1;
    }

    return sortAAlpha > sortBAlpha ? 1 : -1;

  } catch (e) {

    console.log(`Machine / Plant sort failed. Missing ID`, e);
    return 0;

  }
};

export default sortMachinesAndPlants;
