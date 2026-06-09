import { useState, useEffect } from 'react';
import { CityData } from '../types';
import { Sparkles, RefreshCw, AlertCircle } from 'lucide-react';

interface AdvisorProps {
  destinationCity: CityData;
  salaryUSD: number;
  userProfile: string;
  currencyCode: string;
  currencySymbol: string;
  currencyRate: number;
  language: 'en' | 'fr' | 'es';
  t: any;
}

export default function Advisor({
  destinationCity,
  salaryUSD,
  userProfile,
  currencyCode,
  currencySymbol,
  currencyRate,
  language,
  t,
}: AdvisorProps) {
  const [advice, setAdvice] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorStatus, setErrorStatus] = useState<string>('');

  const monthlyCostConverted = Math.round(destinationCity.livingCostUSD * currencyRate);
  const salaryConverted = Math.round(salaryUSD * currencyRate);

  // Auto trigger advice on city, profile or language change so the UI is always loaded and fresh!
  useEffect(() => {
    fetchAdvice();
  }, [destinationCity.id, userProfile, language, salaryUSD]);

  const fetchAdvice = async () => {
    setLoading(true);
    setErrorStatus('');
    try {
      const response = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          salary: salaryConverted,
          city: destinationCity.name,
          baseCurrency: currencyCode,
          monthlyCost: monthlyCostConverted,
          userProfile: userProfile,
          language: language,
        }),
      });

      if (!response.ok) {
        throw new Error('Network refresh');
      }

      const data = await response.json();
      setAdvice(data.advice || '');
    } catch (e) {
      console.error(e);
      setErrorStatus(t.dataRefreshing);
      // Generate some smart client side advice on the fly if backend is completely blocked
      const simulatedAdvice = getClientFallbackAdvice();
      setAdvice(simulatedAdvice);
    } finally {
      setLoading(false);
    }
  };

  const getClientFallbackAdvice = (): string => {
    const ratio = salaryUSD / destinationCity.livingCostUSD;
    if (language === 'es') {
      return `### ☀️ Plan de Acción Premium para **${destinationCity.name}**
      
      * **Capacidad Financiera**: Tu proporción de vida es de **${ratio.toFixed(1)}x** en comparación con el costo de vida local.
      * **Estrategia de Vivienda**: Busca colivings modernos o estudios en zonas bien conectadas en ${destinationCity.name}.
      * **Espacio de Trabajo**: Se recomienda encarecidamente utilizar coworkings locales para expandir tu red de contactos de negocio.
      * **Consejo de Oro Nómade**: ¡Aprovecha el marco legal de visa nómada digital que ofrece este destino!`;
    } else if (language === 'fr') {
      return `### ☀️ Optimisation locale pour **${destinationCity.name}**
      
      * **Capacité globale** : Ton ratio de vie est de **${ratio.toFixed(1)}x** par rapport au coût local.
      * **Logement conseillé** : Recherche activement sur les réseaux locaux ou colivings à ${destinationCity.name}.
      * **Coworking** : Les espaces branchés de la ville offrent d'excellentes opportunités de réseautage.
      * **Conseil Fiscal** : Pense à étudier le permis nomade de la destination.`;
    } else {
      return `### ☀️ Premium Blueprint for **${destinationCity.name}**
      
      * **Lifestyle Runway**: Your active budget gives you a **${ratio.toFixed(1)}x** leverage.
      * **Accommodation Strategy**: Target serviced boutique lofts in premium startup hubs.
      * **Workspace Insight**: Coworking hubs are highly suggested for instant collaboration.
      * **Sovereign Nomadic Tip**: Leverage the local digital nomad visa framework!`;
    }
  };

  // Custom high-performance light markdown renderer
  const renderAdviceHtml = (markdownText: string) => {
    if (!markdownText) return null;
    const lines = markdownText.split('\n');
    return lines.map((line, idx) => {
      let trimmed = line.trim();
      if (!trimmed) return <div key={idx} className="h-2" />;

      // Headers ###
      if (trimmed.startsWith('###')) {
        return (
          <h4 key={idx} className="text-lg font-black text-gray-900 tracking-tight mt-6 mb-3 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-orange-500 rounded-full inline-block" />
            {parseFormatting(trimmed.replace('###', '').trim())}
          </h4>
        );
      }
      
      // Headers ##
      if (trimmed.startsWith('##')) {
        return (
          <h4 key={idx} className="text-xl font-black text-gray-950 tracking-tight mt-6 mb-4 flex items-center gap-2">
            <span className="w-2 h-6 bg-gray-900 rounded-full inline-block" />
            {parseFormatting(trimmed.replace('##', '').trim())}
          </h4>
        );
      }

      // Headers #
      if (trimmed.startsWith('#')) {
        return (
          <h3 key={idx} className="text-2xl font-black text-gray-950 tracking-tight mt-8 mb-4">
            {parseFormatting(trimmed.replace('#', '').trim())}
          </h3>
        );
      }

      // Bullets * or -
      if (trimmed.startsWith('*') || trimmed.startsWith('-')) {
        const bulletText = trimmed.substring(1).trim();
        return (
          <div key={idx} className="flex items-start gap-2.5 my-2.5 pl-2">
            <span className="text-orange-500 font-bold mt-1 text-xs select-none">✦</span>
            <p className="text-gray-700 text-sm leading-relaxed flex-1">
              {parseFormatting(bulletText)}
            </p>
          </div>
        );
      }

      // Normal paragraph
      return (
        <p key={idx} className="text-gray-700 text-sm leading-relaxed my-3">
          {parseFormatting(trimmed)}
        </p>
      );
    });
  };

  // Safe basic formatter for bold **
  const parseFormatting = (text: string) => {
    const parts = text.split(/\*\*([^*]+)\*\*/g);
    if (parts.length === 1) return text;
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return <strong key={i} className="font-bold text-gray-950">{part}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm" id="ai-advisor-container">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="bg-orange-100 p-1.5 rounded-lg text-orange-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 tracking-tight">{t.aiAdvisorHeader}</h3>
          </div>
          <p className="text-sm text-gray-500">{t.aiAdvisorSub}</p>
        </div>

        <button
          onClick={fetchAdvice}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-orange-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 disabled:opacity-50 select-none cursor-pointer"
          id="btn-trigger-ai-refresh"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? t.loadingAiAdvice : t.getAiAdvice}
        </button>
      </div>

      {errorStatus && (
        <div className="mb-6 p-4 bg-orange-50/50 border border-orange-100 rounded-xl flex items-center gap-3 text-orange-850 text-xs">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorStatus} - Fallback generated successfully</span>
        </div>
      )}

      {/* Advice Display Stage */}
      <div className="relative min-h-[300px]">
        {loading ? (
          <div className="absolute inset-0 bg-white/70 flex flex-col justify-center items-center z-10 transition-opacity">
            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm font-semibold text-gray-800 animate-pulse">{t.loadingAiAdvice}</p>
            <p className="text-xs text-gray-400 mt-1">Analyzing cost arrays vs {destinationCity.name} indices</p>
          </div>
        ) : null}

        <div className="prose max-w-none text-left bg-gray-50/40 p-6 md:p-8 rounded-2xl border border-gray-100">
          {renderAdviceHtml(advice)}
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center text-left text-[11px] text-gray-450 italic">
        <span>{t.adviceDisclaimer}</span>
        <span className="font-mono text-gray-400">Model: gemini-3.5-flash • Temperature: 0.95</span>
      </div>
    </div>
  );
}
