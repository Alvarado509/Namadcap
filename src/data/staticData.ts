import { CityData, Article } from '../types';

export const currencyExchangeRates: Record<string, { rate: number; symbol: string; label: string }> = {
  USD: { rate: 1.0, symbol: '$', label: 'US Dollar (USD)' },
  EUR: { rate: 0.92, symbol: '€', label: 'Euro (EUR)' },
  GBP: { rate: 0.79, symbol: '£', label: 'British Pound (GBP)' },
  AUD: { rate: 1.51, symbol: 'A$', label: 'Australian Dollar (AUD)' },
  CAD: { rate: 1.37, symbol: 'C$', label: 'Canadian Dollar (CAD)' },
  THB: { rate: 36.60, symbol: '฿', label: 'Thai Baht (THB)' },
  COP: { rate: 3950.00, symbol: 'Col$', label: 'Colombian Peso (COP)' },
  MXN: { rate: 17.80, symbol: 'Mex$', label: 'Mexican Peso (MXN)' },
  IDR: { rate: 16250.00, symbol: 'Rp', label: 'Indonesian Rupiah (IDR)' },
  JPY: { rate: 156.00, symbol: '¥', label: 'Japanese Yen (JPY)' },
};

export const staticCities: CityData[] = [
  {
    id: 'medellin',
    name: 'Medellin',
    country: 'Colombia',
    livingCostUSD: 1400,
    rentUSD: 750,
    coworkingUSD: 180,
    mealsUSD: 270,
    internetSpeed: 120, // Mbps
    safetyScore: 68,
    overallQualityScore: 82,
    currencyCode: 'COP',
    image: 'https://images.unsplash.com/photo-1595856037042-30cb3f10ef9f?q=80&w=600&auto=format&fit=crop',
    descriptionEn: 'The City of Eternal Spring. High-growth nomad ecosystem, premium cafes, mountain views, and excellent coliving spaces in El Poblado.',
    descriptionFr: 'La ville du printemps éternel. Un écosystème de nomades en pleine croissance, des cafés premium, des vues sur la montagne et de superbes colivings.'
  },
  {
    id: 'chiang-mai',
    name: 'Chiang Mai',
    country: 'Thailand',
    livingCostUSD: 950,
    rentUSD: 450,
    coworkingUSD: 120,
    mealsUSD: 180,
    internetSpeed: 250,
    safetyScore: 88,
    overallQualityScore: 91,
    currencyCode: 'THB',
    image: 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?q=80&w=600&auto=format&fit=crop',
    descriptionEn: 'The undisputed digital nomad capital of Southeast Asia. Incredible night markets, temples, hyper-fast internet, and unbeatable cost-to-comfort ratio.',
    descriptionFr: 'La capitale incontestée des nomades en Asie du Sud-Est. Des marchés nocturnes incroyables, de superbes temples, un internet ultrarapide et des prix imbattables.'
  },
  {
    id: 'lisbon',
    name: 'Lisbon',
    country: 'Portugal',
    livingCostUSD: 2300,
    rentUSD: 1400,
    coworkingUSD: 250,
    mealsUSD: 400,
    internetSpeed: 180,
    safetyScore: 92,
    overallQualityScore: 89,
    currencyCode: 'EUR',
    image: 'https://images.unsplash.com/photo-1509840191024-aa409b2ee0af?q=80&w=600&auto=format&fit=crop',
    descriptionEn: 'Europe’s leading nomad hotspot. Melds historic cobblestone streets, vibrant seaside living, beautiful coworking options, and access to surfing in Ericeira.',
    descriptionFr: 'Le point chaud européen pour les nomades. Allie rues pavées chargées d’histoire, douceur de vivre en bord de mer, espaces de coworking inspirés et surf à Ericeira.'
  },
  {
    id: 'bali',
    name: 'Canggu, Bali',
    country: 'Indonesia',
    livingCostUSD: 1550,
    rentUSD: 950,
    coworkingUSD: 190,
    mealsUSD: 210,
    internetSpeed: 95,
    safetyScore: 85,
    overallQualityScore: 88,
    currencyCode: 'IDR',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=600&auto=format&fit=crop',
    descriptionEn: 'The spiritual lifestyle paradise for content creators and wellness entrepreneurs. Famous for beachside cafes, sunsets, surf clubs, and villa living.',
    descriptionFr: 'Paradis spirituel pour les créateurs et entrepreneurs du bien-être. Célèbre pour ses cafés côtiers, couchers de soleil dorés, sessions de surf et villas de rêve.'
  },
  {
    id: 'mexico-city',
    name: 'Mexico City',
    country: 'Mexico',
    livingCostUSD: 1850,
    rentUSD: 1100,
    coworkingUSD: 220,
    mealsUSD: 300,
    internetSpeed: 150,
    safetyScore: 72,
    overallQualityScore: 86,
    currencyCode: 'MXN',
    image: 'https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?q=80&w=600&auto=format&fit=crop',
    descriptionEn: 'A colossal cultural capital. Outstanding gourmet scenes in Condesa and Roma, vibrant art design galleries, friendly locals, and seamless Americas timezone sync.',
    descriptionFr: 'Une capitale culturelle colossale. Scène gastronomique de premier plan à Condesa et Roma Norte, galeries d’art vivantes et décalage horaire idéal pour les Amériques.'
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    livingCostUSD: 2800,
    rentUSD: 1600,
    coworkingUSD: 300,
    mealsUSD: 500,
    internetSpeed: 300,
    safetyScore: 97,
    overallQualityScore: 95,
    currencyCode: 'JPY',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?q=80&w=600&auto=format&fit=crop',
    descriptionEn: 'The ultimate futuristic playground. Ultra-safe streetscapes, high-speed rail, mindblowing cuisine index, and incredibly polite hospitality culture.',
    descriptionFr: 'Le terrain de jeu moderne par excellence. Sécurité urbaine absolue, trains intercités ultrarapides, cuisine stupéfiante et culture d’accueil d’un infini respect.'
  },
  {
    id: 'bangkok',
    name: 'Bangkok',
    country: 'Thailand',
    livingCostUSD: 1300,
    rentUSD: 700,
    coworkingUSD: 160,
    mealsUSD: 240,
    internetSpeed: 280,
    safetyScore: 84,
    overallQualityScore: 87,
    currencyCode: 'THB',
    image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=600&auto=format&fit=crop',
    descriptionEn: 'High-contrast energetic metropolis. Massive skyscrapers hovering over street-side food stalls, world-class luxury shopping, and high-fidelity rooftop bars.',
    descriptionFr: 'Une métropole animée aux contrastes saisissants. Des gratte-ciels rutilants dominant des stands traditionnels, centres de luxe et des bars à toit panoramique.'
  },
  {
    id: 'cape-town',
    name: 'Cape Town',
    country: 'South Africa',
    livingCostUSD: 1650,
    rentUSD: 950,
    coworkingUSD: 180,
    mealsUSD: 270,
    internetSpeed: 100,
    safetyScore: 60,
    overallQualityScore: 80,
    currencyCode: 'USD', // Teleport and local expats transacts mostly USD equivalent
    image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?q=80&w=600&auto=format&fit=crop',
    descriptionEn: 'Spectacular natural drama. Where steep mountain cliffs meet dual oceans. Rich vineyard trails, scenic coastal roads, and a lively tech entrepreneurial drive.',
    descriptionFr: 'Un chef-d’œuvre naturel spectaculaire. Là où les falaises abruptes croisent deux océans. Vignobles d’exception, routes de corniche et écosystème tech dynamique.'
  },
  {
    id: 'berlin',
    name: 'Berlin',
    country: 'Germany',
    livingCostUSD: 2600,
    rentUSD: 1550,
    coworkingUSD: 280,
    mealsUSD: 450,
    internetSpeed: 190,
    safetyScore: 85,
    overallQualityScore: 85,
    currencyCode: 'EUR',
    image: 'https://images.unsplash.com/photo-1560969184-12fe02d157bf?q=80&w=600&auto=format&fit=crop',
    descriptionEn: 'Europe’s creative subcultural hub. A paradise for club enthusiasts, techno rhythms, industrial cafes, and a highly progressive intellectual community.',
    descriptionFr: 'Le carrefour de la création alternative en Europe. Paradis des passionnés de techno, cafés industriels décontractés et communauté intellectuelle dynamique.'
  },
  {
    id: 'buenos-aires',
    name: 'Buenos Aires',
    country: 'Argentina',
    livingCostUSD: 1200,
    rentUSD: 650,
    coworkingUSD: 140,
    mealsUSD: 230,
    internetSpeed: 110,
    safetyScore: 74,
    overallQualityScore: 83,
    currencyCode: 'USD',
    image: 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?q=80&w=600&auto=format&fit=crop',
    descriptionEn: 'The Paris of South America. Elegant architectural avenues, legendary steak dining, deep tanguero wine roots, and highly favorable financial leverage for USD cash.',
    descriptionFr: 'Le Paris de l’Amérique du Sud. Rues majestueuses, culture théâtrale vivante, bars à vins intimes et effet de levier financier exceptionnel pour les devises fortes.'
  }
];

export const blogArticles: Article[] = [
  {
    id: 'mastering-geo-arbitrage',
    titleEn: 'Geo-Arbitrage Secrets: How to Live Like a King while Saving 60% of Your Revenue',
    titleFr: 'Les Secrets de l’arbitrage géographique : Vivre à 100% en épargnant 60% de ses revenus',
    category: 'Finance',
    date: 'June 8, 2026',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=600&auto=format&fit=crop',
    contentEn: `### Introduction to Geo-Arbitrage
Geo-arbitrage is the practice of earning a high-value currency (such as USD, EUR, or GBP) while residing in a geographic location with a substantially lower cost of living (such as Colombia, Thailand, or Mexico). This structural advantage allows remote professionals to dramatically increase their purchasing power and compress decades of traditional savings into short, high-freedom years.

### The Math: Why Your Salary Multiplies Outside Home
Consider a remote engineer earning a net monthly salary of $5,000 USD in San Francisco:
- **San Francisco Base**: $3,000 rent + $1500 other costs + $500 savings (10% saving rate).
- **Chiang Mai Relocation**: $700 modern luxury condo + $800 dining out & leisure + $3,500 savings (70% saving rate).

By simply stepping across borders, the same software talent multiplies their personal savings rate by **7x** while moving from a crowded studio apartment to a high-rise condominium with gym, sauna, and premium services.

### Strategic Implementation blueprint
1. **Choose Your Base Sensibly**: Filter by internet speed, safety, and flight connectivity.
2. **Setup Dual Bank Reserves**: Secure your earnings in safe institutions, and send cash as needed locally with digital exchange engines.
3. **Respect Tax Runways**: Ensure you monitor your residence days to optimize tax liabilities lawfully under digital nomad visas.`,
    contentFr: `### Qu’est-ce que l’arbitrage géographique ?
L’arbitrage géographique consiste à gagner sa vie dans une devise forte (comme l’EUR ou le USD) tout en résidant physiquement dans un pays où le coût de la vie est largement inférieur. Ce décalage structurel décuple instantanément votre pouvoir d’achat et permet d’accumuler un patrimoine considérable en seulement quelques années.

### L’effet de levier : L’exemple des chiffres
Imaginons un freelance gagnant 4 500 € net par mois en habitant à Paris :
- **À Paris** : 1 600 € de loyer + 1 800 € de dépenses diverses etc = Il lui reste environ 1 100 € d’épargne.
- **À Medellín** : 750 € pour un loft avec piscine + 800 € d’excellents restaurants = Il lui reste près de 2 950 € d’épargne nette !

En modifiant sa géographie, ce créateur de contenu multiplie par **2.7x** sa vitesse de capitalisation financière tout en s’offrant un niveau de vie très supérieur.

### Guide pour démarrer en toute sécurité
1. **Évaluez vos besoins fondamentaux** : Ne transigez pas sur l’internet rapide et la sécurité.
2. **Utilisez des néobanques adaptées** : Ouvrez des comptes multidevises pour limiter les frais de conversion.
3. **Réglez vos aspects légaux** : Bénéficiez des nouveaux visas de nomades numériques pour résider en toute légalité.`
  },
  {
    id: 'top-nomad-visas-2026',
    titleEn: 'Ultimate Guide to Digital Nomad Visas: Tax Havens & Fast Paths',
    titleFr: 'Le Guide Ultime des Visas Nomades : Paradis fiscaux terrestres & Accès rapides',
    category: 'Guides',
    date: 'May 20, 2026',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=600&auto=format&fit=crop',
    contentEn: `### The Visa Revolution
Countries around the world have woken up to the immense economic benefit of remote-working expats. Digital Nomad Visas (DNVs) have evolved from niche programs into sophisticated, highly professional long-term residency pathways.

### The Top 3 Visas to Target Now:
1. **Spain Digital Nomad Visa**: Ideal for European access, offers a special low tax bracket (Beckham Law variant) for income from foreign entities. Requires showing $2,500+ USD monthly income.
2. **Thailand LTR & DTV (Destination Thailand Visa)**: Highly affordable, with low local taxation of global assets. Perfect for long-term hubs with premium internet connectivity.
3. **Colombia Digital Nomad Visa (V-Type)**: Instantly accessible, permits up to two years of residency with a monthly income evidence of only $1,400 USD.

### Key Compliance Checklist
- **Bank statements**: Always keep official 3-month certified PDFs showing salary.
- **Health Coverage**: Maintain a dedicated global expat insurance that includes repatriation.
- **Contract Evidence**: Ensure you have written agreements proving remote business activity.`,
    contentFr: `### La révolution mondiale des Visas Nomades
Les gouvernements du monde entier rivalisent d’attractivité pour attirer les travailleurs à distance à haut potentiel. Les dispositifs de visas spécialisés sont devenus de formidables outils stratégiques de mobilité.

### Les 3 pays à cibler prioritairement en ce moment :
1. **Le Visa Nomade en Espagne** : Offre un statut fiscal privilégié pour l’impôt sur le revenu étranger (Loi Beckham). Idéal pour voyager dans l’espace Schengen.
2. **Le DTV en Thaïlande** : Autorise des séjours prolongés avec des démarches simplifiées pour investir la capitale mondiale du nomadisme économique.
3. **Le Visa Nomade en Colombie** : Simple à obtenir, il dure jusqu’à deux ans avec un seuil d'accès d'environ 1 400 $ d'écritures bancaires mensuelles seulement.

### Comment préparer vos documents
- **Extraits bancaires** : Conservez les fichiers officiels traduits et certifiés des 3 derniers mois.
- **Assurance internationale** : Voyagez couvert avec un contrat d'assistance santé mondial de niveau pro.`
  }
];
