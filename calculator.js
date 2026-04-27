/*
 * Beregningslogik for EV vs. Benzin totaløkonomi.
 */

function calculateTotalCost(car, params, type) {
  const { kmPerYear, ownerYears, elPrice, benzinPrice } = params;

  // Bilens alder påvirker startværdien (allerede afskrevet)
  const carAge = car.age || 0;
  const purchasePrice = car.price;

  // Nuværende værdi baseret på alder (bilen er allerede faldet i værdi)
  const currentValue = purchasePrice * Math.pow(1 - car.depreciationRate, carAge);

  // Brændstof / el
  let fuelCostPerYear;
  if (type === "ev") {
    fuelCostPerYear = (car.consumption / 100) * kmPerYear * elPrice;
  } else {
    fuelCostPerYear = (car.consumption / 100) * kmPerYear * benzinPrice;
  }
  const fuelTotal = fuelCostPerYear * ownerYears;

  // Afgifter
  const taxTotal = car.tax * ownerYears;

  // Forsikring
  const insuranceTotal = car.insurance * ownerYears;

  // Vedligeholdelse
  const maintenanceTotal = car.maintenance * ownerYears;

  // Værditab beregnet fra nuværende værdi (ikke nypris)
  const futureValue = currentValue * Math.pow(1 - car.depreciationRate, ownerYears);
  const depreciationTotal = currentValue - futureValue;

  // Brugtbilsalg: salgspris minus restgæld (kun benzin)
  const saleProceeds = (car.salePrice || 0) - (car.debt || 0);

  // Total (saleProceeds trækkes fra da det er penge du får ind)
  const total = fuelTotal + taxTotal + insuranceTotal + maintenanceTotal + depreciationTotal - saleProceeds;

  return {
    purchasePrice,
    currentValue: Math.round(currentValue),
    carAge,
    carKm: car.km || 0,
    fuelTotal: Math.round(fuelTotal),
    fuelPerYear: Math.round(fuelCostPerYear),
    taxTotal: Math.round(taxTotal),
    taxPerYear: car.tax,
    insuranceTotal: Math.round(insuranceTotal),
    insurancePerYear: car.insurance,
    maintenanceTotal: Math.round(maintenanceTotal),
    maintenancePerYear: car.maintenance,
    depreciationTotal: Math.round(depreciationTotal),
    residualValue: Math.round(futureValue),
    saleProceeds: Math.round(saleProceeds),
    total: Math.round(total),
    monthlyAvg: Math.round(total / (ownerYears * 12))
  };
}

function calculateBreakeven(evCar, benzinCar, params) {
  const maxMonths = params.ownerYears * 12;

  const evPoints = [];
  const benzinPoints = [];
  let breakevenMonth = null;

  for (let m = 0; m <= maxMonths; m++) {
    const years = m / 12;
    const paramsAtM = {
      kmPerYear: params.kmPerYear,
      ownerYears: years || 1/12,
      elPrice: params.elPrice,
      benzinPrice: params.benzinPrice
    };

    if (m === 0) {
      evPoints.push(0);
      benzinPoints.push(0);
      continue;
    }

    const evCost = calculateTotalCost(evCar, { ...paramsAtM, ownerYears: years }, "ev").total;
    const benzinCost = calculateTotalCost(benzinCar, { ...paramsAtM, ownerYears: years }, "benzin").total;

    evPoints.push(Math.round(evCost));
    benzinPoints.push(Math.round(benzinCost));

    if (breakevenMonth === null && evCost < benzinCost) {
      breakevenMonth = m;
    }
  }

  return {
    evPoints,
    benzinPoints,
    breakevenMonth,
    maxMonths
  };
}
