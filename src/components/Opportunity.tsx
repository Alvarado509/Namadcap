import { useState, useEffect, useRef } from 'react';
import { CityData } from '../types';
import { currencyExchangeRates, staticCities } from '../data/staticData';
import { Search, MapPin, TrendingUp, Sparkles, Coins, HelpCircle } from 'lucide-react';
import { getCountryFallback } from '../data/countryFallbacks';

const countryNameToCode: Record<string, string> = {
  "colombia": "CO", "colombie": "CO",
  "thailand": "TH", "thaïlande": "TH", "tailandia": "TH",
  "portugal": "PT",
  "indonesia": "ID", "indonésie": "ID",
  "mexico": "MX", "méxico": "MX", "mexique": "MX",
  "japan": "JP", "japon": "JP", "japón": "JP",
  "united states": "US", "usa": "US", "etats-unis": "US", "états-unis": "US", "estados unidos": "US",
  "canada": "CA",
  "united kingdom": "GB", "uk": "GB", "royaume-uni": "GB", "reino unido": "GB",
  "france": "FR",
  "germany": "DE", "allemagne": "DE", "alemania": "DE",
  "spain": "ES", "espagne": "ES", "españa": "ES",
  "italy": "IT", "italie": "IT", "italia": "IT",
  "brazil": "BR", "brésil": "BR", "brasil": "BR",
  "australia": "AU", "australie": "AU",
  "singapore": "SG", "singapour": "SG", "singapur": "SG",
  "south korea": "KR", "corée du sud": "KR", "corea del sur": "KR",
  "india": "IN", "inde": "IN",
  "vietnam": "VN", "viêt nam": "VN",
  "new zealand": "NZ", "nouvelle-zélande": "NZ", "nueva zelanda": "NZ",
  "turkey": "TR", "turquie": "TR", "turquía": "TR",
  "egypt": "EG", "égypte": "EG", "egipto": "EG",
  "morocco": "MA", "maroc": "MA", "marruecos": "MA",
  "south africa": "ZA", "afrique du sud": "ZA", "sudáfrica": "ZA",
  "poland": "PL", "pologne": "PL", "polonia": "PL",
  "sweden": "SE", "suède": "SE", "suecia": "SE",
  "switzerland": "CH", "suisse": "CH", "suiza": "CH",
  "netherlands": "NL", "pays-bas": "NL", "países bajos": "NL",
  "austria": "AT", "autriche": "AT",
  "belgium": "BE", "belgique": "BE", "bélgica": "BE",
  "greece": "GR", "grèce": "GR", "grecia": "GR",
  "denmark": "DK", "danemark": "DK", "dinamarca": "DK",
  "finland": "FI", "finlande": "FI", "finlandia": "FI",
  "norway": "NO", "norvège": "NO", "noruega": "NO",
  "argentina": "AR", "argentine": "AR",
  "romania": "RO", "roumanie": "RO", "rumania": "RO"
};

interface OpportunityProps {
  destinationCity: CityData;
  currencyCode: string;
  t: any;
  lang?: string;
}

// Sensible full-featured high-cost hub default
const DEFAULT_CURRENT_CITY: CityData = {
  id: 'sf-default',
  name: 'San Francisco',
  country: 'United States',
  livingCostUSD: 4500,
  rentUSD: 2800,
  coworkingUSD: 350,
  mealsUSD: 600,
  internetSpeed: 190,
  safetyScore: 55,
  overallQualityScore: 76,
  currencyCode: 'USD',
  image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=600',
  descriptionEn: 'The ultimate tech metropolitan cluster with premium rents and cost of living requirements.',
  descriptionFr: 'Mégapole technologique aux loyers élevés et coût de la vie exigeant.'
};

export default function Opportunity({ destinationCity, currencyCode, t, lang = 'en' }: OpportunityProps) {
  const currencyInfo = currencyExchangeRates[currencyCode] || { rate: 1, symbol: '$' };

  // Separate states for BOTH current and destination city to keep calculation math-perfect
  const [currentCity, setCurrentCity] = useState<CityData>(DEFAULT_CURRENT_CITY);
  const [targetCity, setTargetCity] = useState<CityData>(destinationCity);

  // Sync destinationCity when prop changes
  useEffect(() => {
    setTargetCity(destinationCity);
  }, [destinationCity]);

  // Dynamic independent income state for Current City
  const [currentIncome, setCurrentIncome] = useState<number>(5000);
  // Dynamic independent income state for Destination City
  const [destinationIncome, setDestinationIncome] = useState<number>(3000);

  // Local helper search states for CURRENT CITY input
  const [currentSearch, setCurrentSearch] = useState('');
  const [loadingCurrent, setLoadingCurrent] = useState(false);

  // Local helper search states for DESTINATION CITY input
  const [destinationSearch, setDestinationSearch] = useState('');
  const [loadingDestination, setLoadingDestination] = useState(false);

  const selectFullCityDetails = async (cityName: string, targetType: 'current' | 'destination') => {
    const isCurrent = targetType === 'current';
    if (!cityName.trim()) return;
    const cleanName = cityName.trim();

    if (isCurrent) {
      setLoadingCurrent(true);
    } else {
      setLoadingDestination(true);
    }

    // Default template fallback hashed values so that it never fails even if completely offline or rate-limited
    const hash = cleanName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const calculatedBase = 800 + (hash % 18) * 120; // $800 to $2960

    let loaded: CityData = {
      id: `opp-${targetType}-${cleanName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      name: cleanName,
      country: isCurrent ? 'Source Basin' : 'Destination Target',
      livingCostUSD: calculatedBase,
      rentUSD: Math.round(calculatedBase * 0.52),
      coworkingUSD: Math.round(calculatedBase * 0.11),
      mealsUSD: Math.round(calculatedBase * 0.16),
      internetSpeed: Math.min(300, Math.max(30, 45 + (hash % 11) * 20)),
      safetyScore: Math.min(100, Math.max(40, 55 + (hash % 10) * 4)),
      overallQualityScore: Math.min(100, Math.max(40, 60 + (hash % 9) * 4)),
      currencyCode: 'USD',
      image: 'gradient-orange-to-black',
      descriptionEn: '',
      descriptionFr: ''
    };

    // Try teleports in background
    try {
      const res = await fetch(`https://api.teleport.org/api/cities/?search=${encodeURIComponent(cleanName)}`);
      if (res.ok) {
        const sData = await res.json();
        const results = sData._embedded?.['city:search-results'] || [];
        let urbanAreaHref = '';
        for (const item of results.slice(0, 3)) {
          const itemHref = item._links?.['city:item']?.href;
          if (itemHref) {
            const det = await fetch(itemHref);
            if (det.ok) {
              const detData = await det.json();
              if (detData._links?.['city:urban_area']?.href) {
                urbanAreaHref = detData._links['city:urban_area'].href;
                // Grab actual country
                if (detData.full_name && detData.full_name.includes(',')) {
                  const p = detData.full_name.split(',');
                  loaded.country = p[p.length - 1].trim();
                }
                break;
              }
            }
          }
        }
        if (urbanAreaHref) {
          const sRes = await fetch(`${urbanAreaHref}scores/`);
          if (sRes.ok) {
            const scoresData = await sRes.json();
            const costOfLivingScore = scoresData.categories?.find((c: any) => c.name === 'Cost of Living')?.score_out_of_10 || 5;
            const housingScore = scoresData.categories?.find((c: any) => c.name === 'Housing')?.score_out_of_10 || 5;
            const internetScore = scoresData.categories?.find((c: any) => c.name === 'Internet')?.score_out_of_10 || 6;
            const safetyScoreObj = scoresData.categories?.find((c: any) => c.name === 'Safety');
            const safetyValue = safetyScoreObj ? (safetyScoreObj.score_out_of_10 || 7) : 7;
            const overallScore = Math.round(scoresData.teleport_score || 70);

            loaded.livingCostUSD = Math.max(500, Math.round(2900 - (costOfLivingScore * 210)));
            loaded.rentUSD = Math.max(250, Math.round(2000 - (housingScore * 160)));
            loaded.coworkingUSD = Math.max(80, Math.round(loaded.livingCostUSD * 0.12));
            loaded.mealsUSD = Math.max(100, Math.round(loaded.livingCostUSD * 0.18));
            loaded.internetSpeed = Math.round(15 + (internetScore * 18));
            loaded.safetyScore = Math.round(safetyValue * 10);
            loaded.overallQualityScore = overallScore;
          }
        }
      }
    } catch (err) {
      console.warn("Cascade lookup error inside opportunity comparator", err);
    } finally {
      if (isCurrent) {
        setLoadingCurrent(false);
      } else {
        setLoadingDestination(false);
      }
    }

    if (isCurrent) {
      setCurrentCity(loaded);
      setCurrentSearch('');
    } else {
      setTargetCity(loaded);
      setDestinationSearch('');
    }
  };

  // Convert USD costs into local selected display currency
  const conversionRate = currencyInfo.rate;
  const currencySymbol = currencyInfo.symbol;

  const currentCostConverted = currentCity.livingCostUSD * conversionRate;
  const currentIncomeConverted = currentIncome * conversionRate;
  const currentNetSavingsConverted = Math.max(0, currentIncomeConverted - currentCostConverted);

  const targetCostConverted = targetCity.livingCostUSD * conversionRate;
  const targetIncomeConverted = destinationIncome * conversionRate;
  const targetNetSavingsConverted = Math.max(0, targetIncomeConverted - targetCostConverted);

  // Exact mathematical delta of opportunity savings (savings at destination minus savings at current city)
  const savingsDelta = targetNetSavingsConverted - currentNetSavingsConverted;
  const yearlySavingsDelta = savingsDelta * 12;

  // Comparison visual chart calculation heights
  const maxIncome = Math.max(100, currentIncomeConverted, targetIncomeConverted);
  const currentSavingsPercent = maxIncome > 0 ? Math.round((currentNetSavingsConverted / maxIncome) * 100) : 0;
  const targetSavingsPercent = maxIncome > 0 ? Math.round((targetNetSavingsConverted / maxIncome) * 100) : 0;

  const currentCostPercent = maxIncome > 0 ? Math.round((currentCostConverted / maxIncome) * 100) : 0;
  const targetCostPercent = maxIncome > 0 ? Math.round((targetCostConverted / maxIncome) * 100) : 0;

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm" id="opportunity-mapping">
      <div className="mb-6 flex items-center justify-between">
        <div className="text-left">
          <h3 className="text-xl font-bold text-gray-900 tracking-tight">{t.opportunityTitle}</h3>
          <p className="text-sm text-gray-500 mt-1">{t.opportunitySubtitle}</p>
        </div>
        <div className="p-3 bg-orange-50 text-orange-500 rounded-2xl hidden sm:block">
          <Coins className="w-6 h-6" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 text-left">
        
        {/* CURRENT RESIDENCE CARD */}
        <div className="bg-gray-50/70 border border-gray-200 p-6 rounded-2xl space-y-5 relative">
          <div className="flex items-center gap-2 text-gray-500">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-black uppercase tracking-wider block">
              {lang === 'fr' ? '1. VILLE D’ORIGINE' : lang === 'es' ? '1. CIUDAD DE ORIGEN' : '1. CURRENT RESIDENCE'}
            </span>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-bold text-gray-600 block">
              {lang === 'fr' ? 'Rechercher ma ville actuelle :' : lang === 'es' ? 'Buscar mi ciudad actual :' : 'Search your current city:'}
            </span>
            
            {/* Free input field for Current City */}
            <div className="space-y-2">
              <div className="relative">
                <input
                  type="text"
                  value={currentSearch}
                  onChange={(e) => setCurrentSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      selectFullCityDetails(currentSearch, 'current');
                    }
                  }}
                  placeholder={lang === 'fr' ? 'Ex: Paris, New York, London...' : lang === 'es' ? 'Ej: Madrid, London...' : 'e.g. Paris, New York, London...'}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-gray-850"
                  id="current-city-unlimited-input"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              </div>
              <button
                type="button"
                onClick={() => selectFullCityDetails(currentSearch, 'current')}
                disabled={!currentSearch.trim() || loadingCurrent}
                className="w-full py-1.5 bg-gray-800 hover:bg-gray-900 text-white font-bold text-xs rounded-xl uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
              >
                {loadingCurrent ? (lang === 'fr' ? 'Validation...' : 'Validating...') : (lang === 'fr' ? 'Définir la ville de départ' : 'Set Start City')}
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-200/50 grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block mb-0.5">
                {lang === 'fr' ? 'Ville Active' : lang === 'es' ? 'Ciudad Activa' : 'Active City'}
              </span>
              <span className="text-sm font-black text-gray-800 block">
                {currentCity.name}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block mb-0.5">
                {lang === 'fr' ? 'Coût Mensuel Mégapole' : lang === 'es' ? 'Costo Mensual' : 'Monthly Cost'}
              </span>
              <span className="text-sm font-bold text-gray-805 font-mono">
                {currencySymbol}{Math.round(currentCostConverted).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Independent Income field for Current City */}
          <div className="pt-3 border-t border-gray-200/50 space-y-2">
            <span className="text-xs font-bold text-gray-600 block">
              {lang === 'fr' ? 'Revenu Mensuel de Départ' : lang === 'es' ? 'Ingreso Mensual Inicial' : 'Current Monthly Income'} ({currencySymbol}) :
            </span>
            <input
              type="number"
              value={currentIncome === 0 ? '' : currentIncome}
              onChange={(e) => {
                const parsed = parseFloat(e.target.value);
                setCurrentIncome(isNaN(parsed) ? 0 : Math.min(1000000, Math.max(0, Math.round(parsed))));
              }}
              min="0"
              className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-gray-850 font-mono"
            />
            <span className="text-[10px] text-gray-400 block">
              {lang === 'fr' ? 'Épargne Réelle de Départ : ' : lang === 'es' ? 'Ahorro Inicial Estimado : ' : 'Active Current Savings: '}
              <strong className="text-emerald-700 font-mono">{currencySymbol}{currentNetSavingsConverted.toLocaleString()}</strong>
            </span>
          </div>
        </div>

        {/* TARGET DESTINATION CARD */}
        <div className="bg-orange-50/15 border border-orange-200 p-6 rounded-2xl space-y-5 relative">
          <div className="flex items-center gap-2 text-orange-600">
            <MapPin className="w-4 h-4" />
            <span className="text-xs font-black uppercase tracking-wider block">
              {lang === 'fr' ? '2. DESTINATION CIBLE' : lang === 'es' ? '2. DESTINO EVALUADO' : '2. TARGET DESTINATION'}
            </span>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-bold text-gray-600 block">
              {lang === 'fr' ? 'Sélectionner ou chercher la cible :' : lang === 'es' ? 'Buscar destino de traslado :' : 'Search or modify target option:'}
            </span>

            {/* Free input field for Destination City */}
            <div className="space-y-2">
              <div className="relative">
                <input
                  type="text"
                  value={destinationSearch}
                  onChange={(e) => setDestinationSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      selectFullCityDetails(destinationSearch, 'destination');
                    }
                  }}
                  placeholder={lang === 'fr' ? 'Ex: Medellin, Chiang Mai, Lisbon...' : lang === 'es' ? 'Ej: Medellin, Bali...' : 'e.g. Medellin, Chiang Mai, Lisbon...'}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-gray-850"
                  id="destination-city-unlimited-input"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              </div>
              <button
                type="button"
                onClick={() => selectFullCityDetails(destinationSearch, 'destination')}
                disabled={!destinationSearch.trim() || loadingDestination}
                className="w-full py-1.5 bg-[#F97316] hover:bg-orange-600 text-white font-bold text-xs rounded-xl uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
              >
                {loadingDestination ? (lang === 'fr' ? 'Validation...' : 'Validating...') : (lang === 'fr' ? 'Définir la destination' : 'Set Destination')}
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-orange-200/50 grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block mb-0.5">
                {lang === 'fr' ? 'Ville Cible' : lang === 'es' ? 'Ciudad Destino' : 'Active Destination'}
              </span>
              <span className="text-sm font-black text-gray-800 block">
                {targetCity.name}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block mb-0.5">
                {lang === 'fr' ? 'Coût Mensuel Estimé' : lang === 'es' ? 'Costo Estimado' : 'Monthly Cost'}
              </span>
              <span className="text-sm font-bold text-orange-600 font-mono">
                {currencySymbol}{Math.round(targetCostConverted).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Independent Income field for Destination City */}
          <div className="pt-3 border-t border-orange-200/50 space-y-2">
            <span className="text-xs font-bold text-gray-600 block">
              {lang === 'fr' ? 'Revenu Mensuel Cible' : lang === 'es' ? 'Ingreso Mensual Destino' : 'Destination Monthly Income'} ({currencySymbol}) :
            </span>
            <input
              type="number"
              value={destinationIncome === 0 ? '' : destinationIncome}
              onChange={(e) => {
                const parsed = parseFloat(e.target.value);
                setDestinationIncome(isNaN(parsed) ? 0 : Math.min(1000000, Math.max(0, Math.round(parsed))));
              }}
              min="0"
              className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-gray-850 font-mono"
            />
            <span className="text-[10px] text-gray-400 block">
              {lang === 'fr' ? 'Épargne Réelle Cible : ' : lang === 'es' ? 'Ahorro Destino Estimado : ' : 'Active Destination Savings: '}
              <strong className="text-emerald-700 font-mono">{currencySymbol}{targetNetSavingsConverted.toLocaleString()}</strong>
            </span>
          </div>
        </div>

      </div>

      {/* COMPARATOR GRAPHICAL BREAKDOWN */}
      <div className="space-y-6 pt-6 border-t border-gray-150 text-left">
        <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
          {lang === 'fr' ? 'Arbitrage Financier Comparé' : lang === 'es' ? 'Gráfico de Presupuesto Comparado' : 'Comparative Capital Split'}
        </h4>

        {/* 1. Current City metrics split */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold text-gray-600">
            <span>{currentCity.name} ({lang === 'fr' ? 'Épargne vs Coût' : 'Savings vs Budget'})</span>
            <span className="font-mono">
              {lang === 'fr' ? 'Coût : ' : 'Cost: '}{currencySymbol}{Math.round(currentCostConverted).toLocaleString()} / {lang === 'fr' ? 'Épargne : ' : 'Savings: '}{currencySymbol}{Math.round(currentNetSavingsConverted).toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-gray-100 h-4 rounded-full flex overflow-hidden">
            <div 
              style={{ width: `${currentCostPercent}%` }} 
              className="bg-red-200 h-full transition-all duration-500 border-r border-white/45" 
              title="Spent on Cost of Living"
            />
            <div 
              style={{ width: `${currentSavingsPercent}%` }} 
              className="bg-gray-400 h-full transition-all duration-500" 
              title="Net Retained Savings"
            />
          </div>
        </div>

        {/* 2. Destination City metrics split */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold text-gray-600">
            <span>{targetCity.name} ({lang === 'fr' ? 'Épargne vs Coût' : 'Savings vs Budget'})</span>
            <span className="font-mono">
              {lang === 'fr' ? 'Coût : ' : 'Cost: '}{currencySymbol}{Math.round(targetCostConverted).toLocaleString()} / {lang === 'fr' ? 'Épargne : ' : 'Savings: '}{currencySymbol}{Math.round(targetNetSavingsConverted).toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-gray-100 h-4 rounded-full flex overflow-hidden">
            <div 
              style={{ width: `${targetCostPercent}%` }} 
              className="bg-orange-500/20 h-full transition-all duration-500 border-r border-white/45"
              title="Spent on Cost of Living"
            />
            <div 
              style={{ width: `${targetSavingsPercent}%` }} 
              className="bg-emerald-500 h-full transition-all duration-500"
              title="Net Retained Savings"
            />
          </div>
        </div>
      </div>

      {/* FINAL VERDICT BOX WITH ACCURATE SAVINGS OVER TIME */}
      <div className="mt-8 p-5 md:p-6 bg-gradient-to-r from-gray-900 to-slate-900 text-white rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 text-left shadow-lg">
        <div className="space-y-2">
          <span className="text-[10px] uppercase font-bold text-orange-500 tracking-widest block">
            {t.opportunityVerdictLabel}
          </span>
          <p className="text-sm text-gray-200 font-medium leading-relaxed max-w-xl">
            {savingsDelta > 0 ? (
              lang === 'fr'
                ? `Félicitations ! Votre stratégie d'arbitrage génère une plus-value d'épargne nette de ${currencySymbol}${Math.round(savingsDelta).toLocaleString()} de plus par mois comparé à ${currentCity.name}.`
                : lang === 'es'
                ? `¡Enhorabuena! Tu estrategia de arbitraje genera un ahorro neto adicional de ${currencySymbol}${Math.round(savingsDelta).toLocaleString()} al mes en comparación con ${currentCity.name}.`
                : `Congratulations! Your geo-arbitrage strategy yields an extra ${currencySymbol}${Math.round(savingsDelta).toLocaleString()} in positive net savings per month compared to ${currentCity.name}.`
            ) : (
              lang === 'fr'
                ? `La relocalisation à ${targetCity.name} avec ces paramètres réduira votre épargne mensuelle nette de ${currencySymbol}${Math.round(Math.abs(savingsDelta)).toLocaleString()} par rapport à ${currentCity.name}.`
                : lang === 'es'
                ? `Mudarte a ${targetCity.name} con estos parámetros reduce tu ahorro neto mensual en ${currencySymbol}${Math.round(Math.abs(savingsDelta)).toLocaleString()} en comparación con ${currentCity.name}.`
                : `Relocating to ${targetCity.name} under these parameters will decrease your monthly net savings by ${currencySymbol}${Math.round(Math.abs(savingsDelta)).toLocaleString()} compared to ${currentCity.name}.`
            )}
          </p>
        </div>

        {savingsDelta > 0 && (
          <div className="shrink-0 bg-white/10 backdrop-blur-sm border border-white/10 px-5 py-4 rounded-2xl flex flex-col items-start md:items-end">
            <span className="text-[10px] uppercase text-gray-300 font-bold tracking-wider">
              {lang === 'fr' ? 'LIBERTÉ ANNUELLE RETENUE' : lang === 'es' ? 'AHORRO ANUAL ESTIMADO' : 'ANNUAL FREEDOM CAPITAL'}
            </span>
            <span className="text-2xl font-black text-emerald-400 font-mono block mt-0.5">
              +{currencySymbol}{Math.round(yearlySavingsDelta).toLocaleString()}
              <span className="text-xs text-gray-300 font-normal"> /yr</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
