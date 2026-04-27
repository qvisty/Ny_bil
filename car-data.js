/*
 * Statisk bildata — danske modeller med priser, forbrug, afgifter.
 * Alle priser i DKK. Forbrug: kWh/100km (EV) eller l/100km (benzin).
 * Afgifter: årlig grøn ejerafgift / vægtafgift.
 * Forsikring: estimeret årlig pris.
 * Vedligeholdelse: estimeret årlig pris.
 * Værditab: estimeret procent af indkøbspris pr. år (simpel lineær).
 */

const CAR_DATA = {
  ev: [
    {
      id: "tesla-model-3",
      name: "Tesla Model 3",
      price: 349900,
      consumption: 14.9,   // kWh/100km
      tax: 1070,            // grøn ejerafgift pr. år
      insurance: 8500,
      maintenance: 3000,
      depreciationRate: 0.12
    },
    {
      id: "tesla-model-y",
      name: "Tesla Model Y",
      price: 399900,
      consumption: 16.2,
      tax: 1070,
      insurance: 9200,
      maintenance: 3200,
      depreciationRate: 0.11
    },
    {
      id: "vw-id4",
      name: "VW ID.4",
      price: 389900,
      consumption: 17.5,
      tax: 1070,
      insurance: 8800,
      maintenance: 3500,
      depreciationRate: 0.13
    },
    {
      id: "hyundai-ioniq-5",
      name: "Hyundai Ioniq 5",
      price: 379900,
      consumption: 16.8,
      tax: 1070,
      insurance: 8600,
      maintenance: 3200,
      depreciationRate: 0.12
    },
    {
      id: "kia-ev6",
      name: "Kia EV6",
      price: 399900,
      consumption: 16.5,
      tax: 1070,
      insurance: 8900,
      maintenance: 3100,
      depreciationRate: 0.12
    },
    {
      id: "skoda-enyaq",
      name: "Skoda Enyaq iV",
      price: 359900,
      consumption: 17.0,
      tax: 1070,
      insurance: 8200,
      maintenance: 3400,
      depreciationRate: 0.14
    },
    {
      id: "volvo-ex30",
      name: "Volvo EX30",
      price: 299900,
      consumption: 15.7,
      tax: 1070,
      insurance: 7800,
      maintenance: 3000,
      depreciationRate: 0.13
    }
  ],
  benzin: [
    {
      id: "vw-golf",
      name: "VW Golf 1.5 TSI",
      price: 299900,
      consumption: 5.8,    // l/100km
      tax: 4080,            // vægtafgift pr. år
      insurance: 7500,
      maintenance: 6000,
      depreciationRate: 0.14
    },
    {
      id: "toyota-corolla",
      name: "Toyota Corolla 1.8",
      price: 279900,
      consumption: 5.5,
      tax: 3660,
      insurance: 7200,
      maintenance: 5500,
      depreciationRate: 0.13
    },
    {
      id: "skoda-octavia",
      name: "Skoda Octavia 1.5 TSI",
      price: 309900,
      consumption: 5.6,
      tax: 3780,
      insurance: 7400,
      maintenance: 5800,
      depreciationRate: 0.14
    },
    {
      id: "peugeot-308",
      name: "Peugeot 308 1.2",
      price: 289900,
      consumption: 5.4,
      tax: 3540,
      insurance: 7100,
      maintenance: 5600,
      depreciationRate: 0.15
    },
    {
      id: "hyundai-i30",
      name: "Hyundai i30 1.5",
      price: 259900,
      consumption: 5.9,
      tax: 3900,
      insurance: 6800,
      maintenance: 5200,
      depreciationRate: 0.14
    },
    {
      id: "ford-focus",
      name: "Ford Focus 1.0 EcoBoost",
      price: 269900,
      consumption: 5.7,
      tax: 3780,
      insurance: 7000,
      maintenance: 5500,
      depreciationRate: 0.15
    }
  ]
};
