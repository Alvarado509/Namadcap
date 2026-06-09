export interface CountryStat {
  livingCostUSD: number;
  rentUSD: number;
  coworkingUSD: number;
  mealsUSD: number;
  internetSpeed: number;
  safetyScore: number;
  overallQualityScore: number;
}

export const countryFallbacks: Record<string, CountryStat> = {
  // North America
  "US": { livingCostUSD: 2800, rentUSD: 1605, coworkingUSD: 250, mealsUSD: 450, internetSpeed: 150, safetyScore: 60, overallQualityScore: 78 },
  "CA": { livingCostUSD: 2400, rentUSD: 1300, coworkingUSD: 220, mealsUSD: 400, internetSpeed: 120, safetyScore: 75, overallQualityScore: 82 },
  "MX": { livingCostUSD: 1200, rentUSD: 600, coworkingUSD: 150, mealsUSD: 200, internetSpeed: 65, safetyScore: 48, overallQualityScore: 68 },
  
  // Western Europe & Central Europe
  "GB": { livingCostUSD: 2300, rentUSD: 1250, coworkingUSD: 230, mealsUSD: 380, internetSpeed: 100, safetyScore: 70, overallQualityScore: 80 },
  "FR": { livingCostUSD: 2100, rentUSD: 1050, coworkingUSD: 200, mealsUSD: 400, internetSpeed: 110, safetyScore: 72, overallQualityScore: 84 },
  "DE": { livingCostUSD: 2050, rentUSD: 1000, coworkingUSD: 210, mealsUSD: 350, internetSpeed: 120, safetyScore: 78, overallQualityScore: 85 },
  "CH": { livingCostUSD: 3500, rentUSD: 1900, coworkingUSD: 300, mealsUSD: 600, internetSpeed: 160, safetyScore: 90, overallQualityScore: 90 },
  "AT": { livingCostUSD: 1900, rentUSD: 950, coworkingUSD: 190, mealsUSD: 320, internetSpeed: 95, safetyScore: 86, overallQualityScore: 86 },
  "BE": { livingCostUSD: 1950, rentUSD: 900, coworkingUSD: 200, mealsUSD: 340, internetSpeed: 100, safetyScore: 74, overallQualityScore: 79 },
  "NL": { livingCostUSD: 2350, rentUSD: 1300, coworkingUSD: 220, mealsUSD: 380, internetSpeed: 130, safetyScore: 82, overallQualityScore: 87 },
  "IE": { livingCostUSD: 2500, rentUSD: 1450, coworkingUSD: 240, mealsUSD: 420, internetSpeed: 95, safetyScore: 72, overallQualityScore: 77 },

  // Southern Europe
  "ES": { livingCostUSD: 1700, rentUSD: 850, coworkingUSD: 180, mealsUSD: 280, internetSpeed: 115, safetyScore: 80, overallQualityScore: 83 },
  "IT": { livingCostUSD: 1750, rentUSD: 850, coworkingUSD: 170, mealsUSD: 300, internetSpeed: 90, safetyScore: 71, overallQualityScore: 80 },
  "PT": { livingCostUSD: 1550, rentUSD: 800, coworkingUSD: 160, mealsUSD: 230, internetSpeed: 125, safetyScore: 83, overallQualityScore: 84 },
  "GR": { livingCostUSD: 1300, rentUSD: 600, coworkingUSD: 150, mealsUSD: 220, internetSpeed: 60, safetyScore: 68, overallQualityScore: 72 },

  // Eastern & Northern Europe
  "PL": { livingCostUSD: 1350, rentUSD: 680, coworkingUSD: 165, mealsUSD: 210, internetSpeed: 90, safetyScore: 82, overallQualityScore: 76 },
  "CZ": { livingCostUSD: 1500, rentUSD: 750, coworkingUSD: 170, mealsUSD: 230, internetSpeed: 95, safetyScore: 84, overallQualityScore: 78 },
  "HU": { livingCostUSD: 1200, rentUSD: 580, coworkingUSD: 140, mealsUSD: 190, internetSpeed: 110, safetyScore: 76, overallQualityScore: 73 },
  "RO": { livingCostUSD: 1100, rentUSD: 500, coworkingUSD: 130, mealsUSD: 180, internetSpeed: 140, safetyScore: 77, overallQualityScore: 71 },
  "EE": { livingCostUSD: 1400, rentUSD: 650, coworkingUSD: 160, mealsUSD: 215, internetSpeed: 105, safetyScore: 81, overallQualityScore: 79 },
  "DK": { livingCostUSD: 2605, rentUSD: 1400, coworkingUSD: 260, mealsUSD: 450, internetSpeed: 130, safetyScore: 85, overallQualityScore: 88 },
  "FI": { livingCostUSD: 2150, rentUSD: 1050, coworkingUSD: 220, mealsUSD: 380, internetSpeed: 120, safetyScore: 86, overallQualityScore: 86 },
  "SE": { livingCostUSD: 2200, rentUSD: 1100, coworkingUSD: 240, mealsUSD: 375, internetSpeed: 135, safetyScore: 75, overallQualityScore: 85 },
  "NO": { livingCostUSD: 2700, rentUSD: 1350, coworkingUSD: 250, mealsUSD: 460, internetSpeed: 140, safetyScore: 85, overallQualityScore: 87 },

  // Asia
  "TH": { livingCostUSD: 1100, rentUSD: 500, coworkingUSD: 140, mealsUSD: 180, internetSpeed: 160, safetyScore: 70, overallQualityScore: 81 },
  "ID": { livingCostUSD: 1050, rentUSD: 480, coworkingUSD: 130, mealsUSD: 150, internetSpeed: 55, safetyScore: 62, overallQualityScore: 77 },
  "VN": { livingCostUSD: 950, rentUSD: 420, coworkingUSD: 120, mealsUSD: 140, internetSpeed: 75, safetyScore: 74, overallQualityScore: 74 },
  "MY": { livingCostUSD: 1150, rentUSD: 520, coworkingUSD: 145, mealsUSD: 170, internetSpeed: 110, safetyScore: 64, overallQualityScore: 76 },
  "PH": { livingCostUSD: 1000, rentUSD: 450, coworkingUSD: 135, mealsUSD: 160, internetSpeed: 60, safetyScore: 56, overallQualityScore: 68 },
  "SG": { livingCostUSD: 3300, rentUSD: 2100, coworkingUSD: 280, mealsUSD: 420, internetSpeed: 210, safetyScore: 92, overallQualityScore: 88 },
  "JP": { livingCostUSD: 1900, rentUSD: 950, coworkingUSD: 200, mealsUSD: 310, internetSpeed: 150, safetyScore: 89, overallQualityScore: 86 },
  "KR": { livingCostUSD: 1850, rentUSD: 900, coworkingUSD: 195, mealsUSD: 300, internetSpeed: 170, safetyScore: 82, overallQualityScore: 81 },
  "IN": { livingCostUSD: 750, rentUSD: 300, coworkingUSD: 110, mealsUSD: 110, internetSpeed: 70, safetyScore: 55, overallQualityScore: 64 },
  "LK": { livingCostUSD: 700, rentUSD: 280, coworkingUSD: 100, mealsUSD: 100, internetSpeed: 45, safetyScore: 63, overallQualityScore: 59 },
  "NP": { livingCostUSD: 650, rentUSD: 220, coworkingUSD: 90, mealsUSD: 90, internetSpeed: 40, safetyScore: 69, overallQualityScore: 56 },
  "PK": { livingCostUSD: 600, rentUSD: 200, coworkingUSD: 85, mealsUSD: 85, internetSpeed: 35, safetyScore: 45, overallQualityScore: 51 },
  "BD": { livingCostUSD: 650, rentUSD: 220, coworkingUSD: 95, mealsUSD: 90, internetSpeed: 35, safetyScore: 50, overallQualityScore: 50 },

  // South America
  "CO": { livingCostUSD: 1200, rentUSD: 550, coworkingUSD: 140, mealsUSD: 180, internetSpeed: 85, safetyScore: 52, overallQualityScore: 79 },
  "BR": { livingCostUSD: 1350, rentUSD: 620, coworkingUSD: 150, mealsUSD: 210, internetSpeed: 95, safetyScore: 50, overallQualityScore: 73 },
  "AR": { livingCostUSD: 1000, rentUSD: 480, coworkingUSD: 130, mealsUSD: 160, internetSpeed: 60, safetyScore: 58, overallQualityScore: 75 },
  "CL": { livingCostUSD: 1450, rentUSD: 690, coworkingUSD: 160, mealsUSD: 240, internetSpeed: 120, safetyScore: 65, overallQualityScore: 74 },
  "PE": { livingCostUSD: 1100, rentUSD: 500, coworkingUSD: 135, mealsUSD: 170, internetSpeed: 65, safetyScore: 54, overallQualityScore: 69 },
  "EC": { livingCostUSD: 1050, rentUSD: 450, coworkingUSD: 125, mealsUSD: 160, internetSpeed: 55, safetyScore: 51, overallQualityScore: 66 },

  // Oceania
  "AU": { livingCostUSD: 2500, rentUSD: 1400, coworkingUSD: 240, mealsUSD: 420, internetSpeed: 110, safetyScore: 78, overallQualityScore: 84 },
  "NZ": { livingCostUSD: 2350, rentUSD: 1250, coworkingUSD: 230, mealsUSD: 400, internetSpeed: 105, safetyScore: 82, overallQualityScore: 83 },

  // Middle East & Northern Africa
  "AE": { livingCostUSD: 2900, rentUSD: 1700, coworkingUSD: 270, mealsUSD: 450, internetSpeed: 140, safetyScore: 88, overallQualityScore: 81 },
  "TR": { livingCostUSD: 1050, rentUSD: 500, coworkingUSD: 120, mealsUSD: 150, internetSpeed: 50, safetyScore: 63, overallQualityScore: 74 },
  "EG": { livingCostUSD: 750, rentUSD: 300, coworkingUSD: 100, mealsUSD: 110, internetSpeed: 45, safetyScore: 58, overallQualityScore: 58 },
  "MA": { livingCostUSD: 950, rentUSD: 400, coworkingUSD: 110, mealsUSD: 140, internetSpeed: 50, safetyScore: 67, overallQualityScore: 66 },
  "ZA": { livingCostUSD: 1400, rentUSD: 650, coworkingUSD: 160, mealsUSD: 220, internetSpeed: 70, safetyScore: 42, overallQualityScore: 70 },
  "KE": { livingCostUSD: 900, rentUSD: 380, coworkingUSD: 120, mealsUSD: 130, internetSpeed: 55, safetyScore: 50, overallQualityScore: 63 }
};

export const defaultStat: CountryStat = {
  livingCostUSD: 1300,
  rentUSD: 650,
  coworkingUSD: 150,
  mealsUSD: 200,
  internetSpeed: 75,
  safetyScore: 65,
  overallQualityScore: 70
};

export function getCountryFallback(countryCode: string): CountryStat {
  const normCode = countryCode.toUpperCase();
  return countryFallbacks[normCode] || defaultStat;
}
