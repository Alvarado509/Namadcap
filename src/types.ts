export interface CityData {
  id: string;
  name: string;
  country: string;
  livingCostUSD: number;
  rentUSD: number;
  coworkingUSD: number;
  mealsUSD: number;
  internetSpeed: number; // Mbps
  safetyScore: number; // 0-100
  overallQualityScore: number; // 0-100
  currencyCode: string;
  image: string;
  descriptionEn: string;
  descriptionFr: string;
}

export interface BudgetResults {
  salarySelected: number;
  livingCostLocal: number;
  rentLocal: number;
  coworkingLocal: number;
  mealsLocal: number;
  otherLocal: number;
  totalCostLocal: number;
  savingsLocal: number;
  runwayMonths: number;
  status: 'broke' | 'comfort' | 'luxury';
}

export interface Article {
  id: string;
  titleEn: string;
  titleFr: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  contentEn: string;
  contentFr: string;
}

export type AppLanguage = 'en' | 'fr' | 'es';

export type ActiveTab = 'home' | 'app' | 'insights' | 'about';
