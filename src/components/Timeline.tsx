import { CityData } from '../types';
import { currencyExchangeRates } from '../data/staticData';
import { Sparkles, Compass, ShieldCheck } from 'lucide-react';
import { formatDisplayDuration } from '../utils/duration';

interface TimelineProps {
  destinationCity: CityData;
  salaryUSD: number;
  currencyCode: string;
  t: any;
  lang?: string;
}

export default function Timeline({ destinationCity, salaryUSD, currencyCode, t, lang = 'en' }: TimelineProps) {
  const currencyInfo = currencyExchangeRates[currencyCode] || { rate: 1, symbol: '$' };
  
  // calculations in USD then convert to display currency
  const monthlyCostUSD = destinationCity.livingCostUSD;
  const monthlySavingsUSD = Math.max(0, salaryUSD - monthlyCostUSD);
  
  const years = [1, 3, 5];
  
  const timelineData = years.map((year, index) => {
    const totalSavingsUSD = monthlySavingsUSD * 12 * year;
    const totalSavingsConverted = totalSavingsUSD * currencyInfo.rate;
    const monthsOfFreedom = monthlyCostUSD > 0 ? (totalSavingsUSD / monthlyCostUSD) : 0;
    
    // Choose icon
    let icon = <Compass className="w-6 h-6 text-orange-500" />;
    if (index === 1) icon = <Sparkles className="w-6 h-6 text-orange-500" />;
    if (index === 2) icon = <ShieldCheck className="w-6 h-6 text-orange-500" />;

    return {
      year,
      savings: totalSavingsConverted,
      monthsOfFreedom,
      icon,
    };
  });

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm" id="freedom-timeline">
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-900 tracking-tight">{t.timelineTitle}</h3>
        <p className="text-sm text-gray-500 mt-1">{t.timelineSubtitle}</p>
      </div>

      {monthlySavingsUSD <= 0 ? (
        <div className="p-6 bg-orange-50/50 rounded-2xl border border-orange-100/50 text-center">
          <p className="text-sm text-gray-600 font-medium leading-relaxed">
            Your current selected income is lower or equal to the estimated cost of living in **{destinationCity.name}**. 
            Increase your income slider or select a frugaler profile to unlock the high-compound Freedom Timeline!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {timelineData.map((data, i) => (
            <div 
              key={data.year}
              className="bg-gray-50/50 hover:bg-white transition-all duration-300 p-6 rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-md relative overflow-hidden flex flex-col justify-between"
            >
              {/* Highlight badge */}
              <div className="absolute top-0 right-0 bg-orange-100 text-orange-850 px-3 py-1 rounded-bl-xl text-xs font-bold leading-none font-mono">
                {t.yearValue} {data.year}
              </div>

              <div className="space-y-4">
                <div className="p-3 bg-white w-12 h-12 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center">
                  {data.icon}
                </div>

                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                    {t.estimatedSavings}
                  </span>
                  <span className="text-3xl font-black text-gray-900 tracking-tight font-mono">
                    {currencyInfo.symbol}{Math.round(data.savings).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-100 flex items-center gap-2">
                <div className="flex-1 text-left">
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block mb-0.5">{t.canBuyOfflineTitle}</span>
                  <span className="text-sm sm:text-base font-bold text-orange-600 font-sans tracking-tight">
                    {formatDisplayDuration(data.monthsOfFreedom, lang)}
                  </span>
                  <span className="text-[10px] text-gray-500 block mt-0.5">{t.canBuyOfflineSub}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
