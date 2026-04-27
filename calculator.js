/*
 * Beregningslogik for EV vs. Benzin totaløkonomi.
 */

function calculateTotalCost(car, params, type) {
  const { kmPerYear, ownerYears, elPrice, benzinPrice } = params;

  // Brugt-bil: pris og vedligeholdelse justeres efter alder ved køb
  const usedAge = type === "benzin" && params.benzinUsed ? Math.max(0, params.benzinUsedAge || 0) : 0;
  const purchasePrice = usedAge > 0
    ? Math.round(car.price * Math.pow(1 - car.depreciationRate, usedAge))
    : car.price;
  const maintenancePerYear = usedAge > 0
    ? Math.round(car.maintenance * (1 + 0.10 * usedAge))
    : car.maintenance;

  // Brændstof / el
  let fuelCostPerYear;
  if (type === "ev") {
    // kWh/100km * km/year / 100 * kr/kWh
    fuelCostPerYear = (car.consumption / 100) * kmPerYear * elPrice;
  } else {
    // l/100km * km/year / 100 * kr/l
    fuelCostPerYear = (car.consumption / 100) * kmPerYear * benzinPrice;
  }
  const fuelTotal = fuelCostPerYear * ownerYears;

  // Afgifter
  const taxTotal = car.tax * ownerYears;

  // Forsikring
  const insuranceTotal = car.insurance * ownerYears;

  // Vedligeholdelse
  const maintenanceTotal = maintenancePerYear * ownerYears;

  // Værditab (simpel: restværdi = pris * (1 - rate)^år)
  const residualValue = purchasePrice * Math.pow(1 - car.depreciationRate, ownerYears);
  const depreciationTotal = purchasePrice - residualValue;

  // Total
  const total = fuelTotal + taxTotal + insuranceTotal + maintenanceTotal + depreciationTotal;

  return {
    purchasePrice,
    fuelTotal: Math.round(fuelTotal),
    fuelPerYear: Math.round(fuelCostPerYear),
    taxTotal: Math.round(taxTotal),
    taxPerYear: car.tax,
    insuranceTotal: Math.round(insuranceTotal),
    insurancePerYear: car.insurance,
    maintenanceTotal: Math.round(maintenanceTotal),
    maintenancePerYear: maintenancePerYear,
    depreciationTotal: Math.round(depreciationTotal),
    residualValue: Math.round(residualValue),
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
      benzinPrice: params.benzinPrice,
      benzinUsed: params.benzinUsed,
      benzinUsedAge: params.benzinUsedAge
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
