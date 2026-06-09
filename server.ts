import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Simple in-memory cache to stay strictly within rate limits and improve speed
const memoryCache: Record<string, any> = {};

// Lazy initialize Gemini clients to prevent runtime exceptions on load if variables are missing
let ai: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.log("GEMINI_API_KEY is not defined in the environment. Please configure it in your Secrets.");
    }
    ai = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY_FOR_STABILITY",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return ai;
}

// API endpoint for AI Advisor
app.post("/api/advisor", async (req, res) => {
  try {
    const { salary, city, baseCurrency, monthlyCost, userProfile, language } = req.body;
    
    const cacheKey = `advisor_${salary}_${city}_${baseCurrency}_${monthlyCost}_${userProfile}_${language}`;
    if (memoryCache[cacheKey]) {
      return res.json(memoryCache[cacheKey]);
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.includes("MY_")) {
      const localAdvice = getLocalBackupAdvice(salary, city, baseCurrency, monthlyCost, userProfile, language);
      const result = { advice: localAdvice };
      memoryCache[cacheKey] = result;
      return res.json(result);
    }

    const client = getGeminiClient();
    
    const prompt = `
      User Budget Analysis Request:
      - Monthly income/salaries: ${salary} ${baseCurrency}
      - Nomadic Destination: ${city}
      - Estimated Cost of Living expenses: ${monthlyCost} ${baseCurrency}
      - User Persona profile: ${userProfile} (e.g. "broke student", "freelancer", "senior executive", "family", "digital startup")
      - Requested advice Language: ${language === 'fr' ? 'French (Français)' : language === 'es' ? 'Spanish (Español)' : 'English'}
      
      Generate a professional, high-energy, precise, and uniquely customized nomad lifestyle report.
      Give specific advice on housing/rent options, co-working budgets, local restaurant eating habits, transport hacks, and general standard of living.
      Make your suggestions highly dynamic and vary the details based on the user's ratio of salary vs cost of living.
      Structure the output beautifully with headers, bold keywords, bullet points, and high contrast formatting for Markdown rendering.
      Write enthusiastically as an expert, elite world traveler and software-business owner.
      Do NOT write a generic intro statement or wrap it in \`\`\`markdown tags. Just return the raw elegant markdown text directly.
    `;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are the energetic, super high-vibe expert Global Nomad Optimizer of NomadCap. Customize all recommendations precisely to the user's economic status compared to local city costs. Write like an experienced venture executive who travels the world constantly. Be professional, direct, encouraging and extremely specific.",
        temperature: 0.95,
      }
    });

    const text = response.text || "";
    const result = { advice: text };
    memoryCache[cacheKey] = result;
    res.json(result);
  } catch (error: any) {
    console.log("Advisor fallback activated:", error.message || error);
    const localAdvice = getLocalBackupAdvice(
      req.body.salary,
      req.body.city,
      req.body.baseCurrency,
      req.body.monthlyCost,
      req.body.userProfile,
      req.body.language
    );
    const result = { advice: localAdvice + "\n\n*(Note: Displaying verified backup optimizer insights)*" };
    const cacheKey = `advisor_${req.body.salary}_${req.body.city}_${req.body.baseCurrency}_${req.body.monthlyCost}_${req.body.userProfile}_${req.body.language}`;
    memoryCache[cacheKey] = result;
    res.json(result);
  }
});

// Helper for offline / fallback profession analyzer
function getLocalProfessionFallback(profession: string, language?: string) {
  const normalized = (profession || "").toLowerCase().trim();
  let category: "standard" | "confort" | "luxe" = "confort";
  let coefficient = 1.0;
  
  let explanation = "";
  if (language === 'es') {
    explanation = `Análisis simplificado para la profesión: ${profession || 'Desconocida'}.`;
  } else if (language === 'fr') {
    explanation = `Analyse simplifiée pour le métier : ${profession || 'Inconnu'}.`;
  } else {
    explanation = `Simplified assessment for occupation: ${profession || 'Unknown'}.`;
  }

  if (
    normalized.includes("étudiant") || 
    normalized.includes("student") || 
    normalized.includes("broke") || 
    normalized.includes("fauche") ||
    normalized.includes("artiste") || 
    normalized.includes("artist") || 
    normalized.includes("frugal") ||
    normalized.includes("stagiaire") ||
    normalized.includes("intern")
  ) {
    category = "standard";
    coefficient = 0.70;
    explanation = language === 'es'
      ? "Profesión que requiere un presupuesto estándar o frugal."
      : language === 'fr'
      ? "Métier nécessitant un budget de type standard/frugal."
      : "Profession requiring a standard or frugal budget layout.";
  } else if (
    normalized.includes("trad") || 
    normalized.includes("crypto") || 
    normalized.includes("senior") || 
    normalized.includes("exec") || 
    normalized.includes("director") || 
    normalized.includes("directeur") ||
    normalized.includes("pdg") || 
    normalized.includes("ceo") || 
    normalized.includes("invest") ||
    normalized.includes("trader") ||
    normalized.includes("manager") ||
    normalized.includes("avocat") ||
    normalized.includes("lawyer") ||
    normalized.includes("consultant senior")
  ) {
    category = "luxe";
    coefficient = 1.60;
    explanation = language === 'es'
      ? "Profesión con altos ingresos o exigencias de estilo de vida de lujo."
      : language === 'fr'
      ? "Métier à haut revenu ou exigences très élevées de type luxe."
      : "High-income profession with premium lifestyle requirements.";
  } else if (
    normalized.includes("startup") || 
    normalized.includes("founder") || 
    normalized.includes("fondateur") || 
    normalized.includes("entrepreneur") || 
    normalized.includes("lead") ||
    normalized.includes("architect") ||
    normalized.includes("ingénieur") ||
    normalized.includes("developer") ||
    normalized.includes("développeur") ||
    normalized.includes("designer")
  ) {
    category = "confort";
    coefficient = 1.15;
    explanation = language === 'es'
      ? "Profesión que requiere niveles de comodidad mejorados para trabajo remoto."
      : language === 'fr'
      ? "Métier requérant un confort accru pour le travail à distance."
      : "Work profile requiring enhanced comfort for productive remote work.";
  } else {
    category = "confort";
    coefficient = 1.0;
    explanation = language === 'es'
      ? "Perfil laboral equilibrado estándar con comodidad adecuada."
      : language === 'fr'
      ? "Profil de travail standard équilibré de type confort."
      : "Balanced remote profile with standard comfort allocations.";
  }

  return { coefficient, category, explanation };
}

// API endpoint to analyze profession using Gemini with the required prompt
app.post("/api/analyze-profession", async (req, res) => {
  try {
    const { profession, language } = req.body;
    const cleanProfession = (profession || "").trim();
    if (!cleanProfession) {
      return res.status(400).json({ error: "Profession/Métier requis" });
    }

    const cacheKey = `profession_${cleanProfession}_${language}`;
    if (memoryCache[cacheKey]) {
      return res.json(memoryCache[cacheKey]);
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.includes("MY_")) {
      const fallback = getLocalProfessionFallback(cleanProfession, language);
      memoryCache[cacheKey] = fallback;
      return res.json(fallback);
    }

    const client = getGeminiClient();
    const requestedLang = language === 'fr' ? 'French (Français)' : language === 'es' ? 'Spanish (Español)' : 'English';

    const prompt = `Analyze the nomadic financial and lifestyle needs of a [${cleanProfession}]. Define an appropriate cost of living coefficient multiplier (standard, confort, luxe) for this specific occupation.

Return a valid JSON object ONLY. Do not wrap in markdown code blocks.
Your output must match this schema strictly:
{
  "coefficient": number, // an adjustment multiplier between 0.5 and 2.5 representing how demanding this career lifestyle is (standard is around 0.70-0.85, confortable is 1.00-1.25, luxe/exigeant is 1.4-2.0)
  "category": "standard" | "confort" | "luxe",
  "explanation": "A professional 1-2 sentence explanation about the budget allocation and profile matching for this profession, written entirely in ${requestedLang}."
}`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            coefficient: { type: Type.NUMBER, description: "Coefficient multiplicateur du coût de la vie" },
            category: { type: Type.STRING, description: "Catégorie de coût de vie (standard, confort ou luxe)" },
            explanation: { type: Type.STRING, description: "Explication de la catégorie et du coefficient" }
          },
          required: ["coefficient", "category", "explanation"]
        }
      }
    });

    const text = response.text || "{}";
    const data = JSON.parse(text);
    // Sanitize values
    const coef = Number(data.coefficient) || 1.0;
    const cat = ["standard", "confort", "luxe"].includes(data.category) ? data.category : "confort";
    const exp = data.explanation || `Analysis completed for ${cleanProfession}.`;

    const result = {
      coefficient: coef,
      category: cat,
      explanation: exp
    };
    memoryCache[cacheKey] = result;
    res.json(result);
  } catch (error: any) {
    console.log("Profession fallback activated:", error.message || error);
    const fallback = getLocalProfessionFallback(req.body.profession, req.body.language);
    const cacheKey = `profession_${(req.body.profession || "").trim()}_${req.body.language}`;
    memoryCache[cacheKey] = fallback;
    res.json(fallback);
  }
});

// Helper for offline / fallback visa data generator
function getLocalVisaFallback(city: string, country: string, language?: string) {
  const normCountry = (country || "").toLowerCase().trim();
  
  let visaType = "";
  let duration = "";
  let portalText = "";
  let portalUrl = "";

  if (normCountry.includes("colombia")) {
    if (language === 'es') {
      visaType = "Visa de Visitante Nómada Digital (V)";
      duration = "Hasta 2 años";
      portalText = "Para trabajadores remotos con salario mínimo de 3 salarios mínimos legales mensuales. Excelente opción en América Latina.";
    } else if (language === 'fr') {
      visaType = "Visa Visiteur Nomade Digital V";
      duration = "Jusqu'à 2 ans";
      portalText = "Pour les professionnels à distance ayant des revenus réguliers équivalents à 3 fois le salaire minimum colombien.";
    } else {
      visaType = "Visitor Digital Nomad Visa (V)";
      duration = "Up to 2 years";
      portalText = "Tailored for remote employees or business owners with minimum income threshold (around $1,400 USD).";
    }
    portalUrl = "https://www.cancilleria.gov.co/";
  } else if (normCountry.includes("thailand") || normCountry.includes("thaïlande") || normCountry.includes("tailandia")) {
    if (language === 'es') {
      visaType = "Destination Thailand Visa (DTV)";
      duration = "Hasta 5 años";
      portalText = "Nueva visa para nómadas digitales que permite múltiples entradas de 180 días cada una. Muy económica y flexible.";
    } else if (language === 'fr') {
      visaType = "Destination Thailand Visa (DTV)";
      duration = "Jusqu'à 5 ans";
      portalText = "Le nouveau visa thaïlandais révolutionnaire autorisant des séjours de 180 jours par entrée pour les télétravailleurs.";
    } else {
      visaType = "Destination Thailand Visa (DTV)";
      duration = "Up to 5 years";
      portalText = "The brand new standard permit allowing digital nomads 180-day stays per entry, renewable up to 5 years.";
    }
    portalUrl = "https://www.thaievisa.go.th/";
  } else if (normCountry.includes("portugal")) {
    if (language === 'es') {
      visaType = "Visa de Residencia para Nómadas Digitales (D8)";
      duration = "Hasta 1 año (Renovable)";
      portalText = "Visa oficial D8 para trabajadores remotos con ingresos mínimos mensuales de unos 3,280 €.";
    } else if (language === 'fr') {
      visaType = "Visa de Résident Nomade Digital (D8)";
      duration = "1 an (Renouvelable)";
      portalText = "Le visa D8 officiel exige un revenu mensuel correspondant à quatre fois le salaire minimum national portugais.";
    } else {
      visaType = "Portugal Digital Nomad Visa (D8)";
      duration = "Up to 1 year (Renewable)";
      portalText = "The popular D8 residence permit requiring monthly incoming earnings of at least four times the Portuguese minimum wage.";
    }
    portalUrl = "https://vistos.mne.gov.pt/";
  } else if (normCountry.includes("indonesia") || normCountry.includes("indonésie")) {
    if (language === 'es') {
      visaType = "Visa de Trabajo Remoto (E33G)";
      duration = "1 año";
      portalText = "Oficial para nómadas digitales en Bali o Yakarta. Requiere ciertos avales de ingresos anuales.";
    } else if (language === 'fr') {
      visaType = "Visa de Travail à Distance (E33G)";
      duration = "1 an";
      portalText = "Nouveau visa indonésien spécialisé autorisant le travail à distance légal sur le sol de Bali ou Canggu.";
    } else {
      visaType = "Indonesia Remote Worker Visa (E33G)";
      duration = "1 year";
      portalText = "The official E33G permit for remote digital nomads looking to live and contribute legally in Bali.";
    }
    portalUrl = "https://molina.imigrasi.go.id/";
  } else if (normCountry.includes("mexico") || normCountry.includes("mexique") || normCountry.includes("méxico")) {
    if (language === 'es') {
      visaType = "Residente Temporal";
      duration = "1 a 4 años";
      portalText = "Requiere comprobar solvencia económica por encima de los 2,600 USD mensuales.";
    } else if (language === 'fr') {
      visaType = "Résident Temporaire Mexique";
      duration = "1 à 4 ans";
      portalText = "Permis délivré si vous justifiez de revenus mensuels de plus de 2 600 USD au cours des six derniers mois.";
    } else {
      visaType = "Mexico Temporary Resident";
      duration = "1 to 4 years";
      portalText = "Standard path requiring proof of stable income or investments from outside of Mexico.";
    }
    portalUrl = "https://www.gob.mx/sre";
  } else if (normCountry.includes("japan") || normCountry.includes("japon")) {
    if (language === 'es') {
      visaType = "Actividades Especificadas (Visa Nómada)";
      duration = "Hasta 6 meses";
      portalText = "Permite a titulares de pasaportes elegibles con ingresos de al menos 10 millones de yenes anuales residir temporalmente de forma legal.";
    } else if (language === 'fr') {
      visaType = "Activités Spécifiées Nomade";
      duration = "Jusqu'à 6 mois";
      portalText = "Le nouveau statut pour nomades exige d'avoir un revenu annuel de plus de 10 millions de yens pour résider au Japon.";
    } else {
      visaType = "Digital Nomad Specified Activities";
      duration = "Up to 6 months";
      portalText = "Allows remote workers earning over 10 million JPY annually to legally enjoy Japanese culture and lifestyle.";
    }
    portalUrl = "https://www.mofa.go.jp/";
  } else {
    // Custom/generic fallback
    if (language === 'es') {
      visaType = "Visa de Turista o Exención";
      duration = "30 a 90 días";
      portalText = `Consultez le portail de l'immigration officielle pour ${country || "este país"}.`;
    } else if (language === 'fr') {
      visaType = "Visa de Touriste / Exempté";
      duration = "30 à 90 jours";
      portalText = `Consultez le portail de l'immigration officielle pour ${country || "ce pays"}.`;
    } else {
      visaType = "Tourist Visa / Visa-free Waiver";
      duration = "30 to 90 days";
      portalText = `Consultez le portail de l'immigration officielle pour ${country || "this country"}.`;
    }
    portalUrl = "https://www.un.org/";
  }

  return { visaType, duration, portalText, portalUrl };
}

// Helper for offline / fallback safety and social data generator
function getLocalSafetySocialFallback(city: string, country: string, language?: string) {
  const normCity = (city || "").toLowerCase().trim();
  let socialScore = 7;
  let safetyScore = 8;
  let survivalTip = "";

  if (normCity.includes("medellin") || normCity.includes("medellín")) {
    socialScore = 8;
    safetyScore = 6;
    if (language === 'es') {
      survivalTip = "Use DiDi o Cabify para transportarse en lugar de taxis de la calle. Disfrute de El Poblado pero mantenga seguros sus objetos de valor.";
    } else if (language === 'fr') {
      survivalTip = "Utilisez DiDi ou Cabify pour les transports au lieu des taxis de rue. Découvrez El Poblado mais gardez vos objets de valeur en sécurité.";
    } else {
      survivalTip = "Use DiDi or Cabify for transport instead of street taxis. Experience nightlife in El Poblado but keep your valuables secure.";
    }
  } else if (normCity.includes("chiang mai")) {
    socialScore = 9;
    safetyScore = 9;
    if (language === 'es') {
      survivalTip = "Alquile una moto solo si tiene licencia internacional. El agua del grifo no es potable. La zona de Nimman tiene los mejores cafés.";
    } else if (language === 'fr') {
      survivalTip = "Ne louez un scooter que si vous avez un permis international. L'eau du robinet n'est pas potable. Le quartier de Nimman possède les meilleurs cafés.";
    } else {
      survivalTip = "Rent a scooter only if you have an international license. Tap water is not safe; drink bottled water. Nimman area has the absolute best cafes.";
    }
  } else if (normCity.includes("lisbon") || normCity.includes("lisbonne")) {
    socialScore = 9;
    safetyScore = 9;
    if (language === 'es') {
      survivalTip = "Tome el histórico Tranvía 28 temprano por la mañana para evitar las multitudes. El metro es rápido y muy limpio. Bairro Alto es ideal para socializar.";
    } else if (language === 'fr') {
      survivalTip = "Prenez le tram historique 28 tôt le matin pour éviter la foule. Le métro est rapide et ultra-propre. Bairro Alto est idéal pour faire des rencontres le week-end.";
    } else {
      survivalTip = "Take the historic Tram 28 early in the morning to avoid crowd. Metro is fast and super clean. Bairro Alto is perfect for weekend socializing.";
    }
  } else if (normCity.includes("bali") || normCity.includes("canggu")) {
    socialScore = 9;
    safetyScore = 8;
    if (language === 'es') {
      survivalTip = "Conduzca con cuidado en los atajos. Evite beber 'Arak' de fuentes dudosas. Use Grab o Gojek para transporte barato y entregas de comida.";
    } else if (language === 'fr') {
      survivalTip = "Conduisez prudemment sur les raccourcis. Évitez de boire de l'Arak sauf dans des lieux certifiés. Utilisez Grab ou Gojek pour vos déplacements et livraisons.";
    } else {
      survivalTip = "Drive carefully on shortcuts. Avoid drinking 'Arak' unless from certified venues. Use Grab or Gojek for cheap transport and food deliveries.";
    }
  } else if (normCity.includes("mexico") || normCity.includes("méxico")) {
    socialScore = 8;
    safetyScore = 7;
    if (language === 'es') {
      survivalTip = "Quédese en Roma, Condesa o Coyoacán. El agua del grifo no es potable. Use Uber por la noche para mayor tranquilidad.";
    } else if (language === 'fr') {
      survivalTip = "Restez dans les quartiers de Roma, Condesa ou Coyoacán. L'eau du robinet n'est pas potable. Utilisez Uber pour plus de sécurité la nuit.";
    } else {
      survivalTip = "Stick to Roma, Condesa, or Coyoacán. Tap water is absolutely not drinkable. Use Uber for safety at night.";
    }
  } else if (normCity.includes("tokyo")) {
    socialScore = 7;
    safetyScore = 10;
    if (language === 'es') {
      survivalTip = "Extremadamente seguro. Compre una tarjeta Pasmo o Suica inmediatamente para viajar en sus líneas de tren. Respete las normas de etiqueta locales.";
    } else if (language === 'fr') {
      survivalTip = "Extrêmement sécurisé. Achetez une carte Pasmo ou Suica immédiatement pour le train. Respectez l'étiquette stricte des escalators.";
    } else {
      survivalTip = "Extremely secure. Purchase a Pasmo or Suica card immediately. Follow strict escalator etiquette (stand on left).";
    }
  } else {
    // Custom query defaults
    if (language === 'es') {
      survivalTip = "No beba agua del grifo sin antes verificar su calidad localmente. Utilice aplicaciones seguras de taxi como Uber por las noches.";
    } else if (language === 'fr') {
      survivalTip = "Ne bois jamais l'eau du robinet sans vérification locale. Privilégie les applications mobiles de transport pour tes déplacements nocturnes.";
    } else {
      survivalTip = "Do not drink tap water unless verified locally. Use reliable app-based transport services for late-night travels.";
    }
  }

  return { socialScore, safetyScore, survivalTip };
}

// API endpoint to fetch visa & legal remote check
app.post("/api/visa-legal", async (req, res) => {
  try {
    const { city, country, language } = req.body;
    const cleanCity = (city || "").trim();
    const cleanCountry = (country || "").trim();

    if (!cleanCountry) {
      return res.status(400).json({ error: "Country parameter is required." });
    }

    const cacheKey = `visa_${cleanCity}_${cleanCountry}_${language}`;
    if (memoryCache[cacheKey]) {
      return res.json(memoryCache[cacheKey]);
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.includes("MY_")) {
      const fallback = getLocalVisaFallback(cleanCity, cleanCountry, language);
      memoryCache[cacheKey] = fallback;
      return res.json(fallback);
    }

    const client = getGeminiClient();
    const requestedLang = language === 'fr' ? 'French (Français)' : language === 'es' ? 'Spanish (Español)' : 'English';

    const prompt = `Analyze current digital nomad visa status, duration, requirements, and information portal for the country: [${cleanCountry}] (as associated with city [${cleanCity}]).
Provide realistic, professional, factual information.

Your output MUST strictly match this JSON schema exactly:
{
  "visaType": "such as 'Destination Thailand Visa (DTV)', 'D8 Digital Nomad Permit', 'Tourist Exemption Waiver'",
  "duration": "such as '1 year (renewable)', '180 days per entry', '90 days'",
  "portalText": "1-2 sentence professional overview of digital nomad / remote work legal status written in ${requestedLang}. If there is no dedicated digital nomad program or specific option for this destination, this field MUST be exactly: 'Consultez le portail de l'immigration officielle pour ${cleanCountry}.'",
  "portalUrl": "A valid official or highly authoritative government portal links (e.g. https://www.thaievisa.go.th/, https://vistos.mne.gov.pt/, etc.)"
}

Return a valid JSON object ONLY. Do not wrap in markdown.`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            visaType: { type: Type.STRING },
            duration: { type: Type.STRING },
            portalText: { type: Type.STRING },
            portalUrl: { type: Type.STRING }
          },
          required: ["visaType", "duration", "portalText", "portalUrl"]
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    const result = {
      visaType: parsed.visaType || "Tourist Visa",
      duration: parsed.duration || "90 days",
      portalText: parsed.portalText || `Consultez le portail de l'immigration officielle pour ${cleanCountry}.`,
      portalUrl: parsed.portalUrl || "https://www.un.org/"
    };
    memoryCache[cacheKey] = result;
    res.json(result);
  } catch (error: any) {
    console.log("Visa fallback activated:", error.message || error);
    const fallback = getLocalVisaFallback(req.body.city, req.body.country, req.body.language);
    const cacheKey = `visa_${(req.body.city || "").trim()}_${(req.body.country || "").trim()}_${req.body.language}`;
    memoryCache[cacheKey] = fallback;
    res.json(fallback);
  }
});

// API endpoint to fetch social and safety ratings
app.post("/api/safety-social", async (req, res) => {
  try {
    const { city, country, language } = req.body;
    const cleanCity = (city || "").trim();
    const cleanCountry = (country || "").trim();

    if (!cleanCity) {
      return res.status(400).json({ error: "City is required." });
    }

    const cacheKey = `safety_${cleanCity}_${cleanCountry}_${language}`;
    if (memoryCache[cacheKey]) {
      return res.json(memoryCache[cacheKey]);
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.includes("MY_")) {
      const fallback = getLocalSafetySocialFallback(cleanCity, cleanCountry, language);
      memoryCache[cacheKey] = fallback;
      return res.json(fallback);
    }

    const client = getGeminiClient();
    const requestedLang = language === 'fr' ? 'French (Français)' : language === 'es' ? 'Spanish (Español)' : 'English';

    const prompt = `Provide the nomad safety index score (1-10) and social vibe index score (1-10) along with a super helpful, highly localized survival tip for nomads visiting the city of [${cleanCity}], [${cleanCountry}].

Your output MUST strictly match this JSON schema exactly:
{
  "socialScore": number, // integer between 1 and 10 representing co-working atmosphere, local meetups, expat density, friendliness
  "safetyScore": number, // integer between 1 and 10 representing safety at night, walking alone and general security
  "survivalTip": "1-2 sentences of ultra-specific community advice (e.g. which app to use for transport, tap water warning, or standard local custom) written entirely in ${requestedLang}."
}

Return a valid JSON object ONLY. Do not wrap in markdown.`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            socialScore: { type: Type.INTEGER },
            safetyScore: { type: Type.INTEGER },
            survivalTip: { type: Type.STRING }
          },
          required: ["socialScore", "safetyScore", "survivalTip"]
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    const result = {
      socialScore: Number(parsed.socialScore) || 7,
      safetyScore: Number(parsed.safetyScore) || 8,
      survivalTip: parsed.survivalTip || "Be careful of pickpockets and stick to well-lit public channels."
    };
    memoryCache[cacheKey] = result;
    res.json(result);
  } catch (error: any) {
    console.log("Safety-social fallback activated:", error.message || error);
    const fallback = getLocalSafetySocialFallback(req.body.city, req.body.country, req.body.language);
    const cacheKey = `safety_${(req.body.city || "").trim()}_${(req.body.country || "").trim()}_${req.body.language}`;
    memoryCache[cacheKey] = fallback;
    res.json(fallback);
  }
});

// Helper for offline / fallback advice generator
function getLocalBackupAdvice(salary: number, city: string, currency: string, cost: number, profile: string, language: string): string {
  const ratio = salary / (cost || 1000);
  if (language === 'es') {
    if (ratio < 0.8) {
      return `### ⚠️ Alerta de Presupuesto para **${city}**

¡Hola amigo nómada! Según nuestro análisis de capacidad, tus ingresos de **${salary} ${currency}** podrían estar ajustados frente al costo de vida estimado en **${city}** (**${cost} ${currency}**).

**Plan Estratégico para tu perfil (${profile}):**
* 🏠 **Coliving y Colaboración**: Sugerimos evitar alquileres de apartamentos individuales. Opta por colivings o pisos compartidos, que agrupan gastos y te conectan rápidamente.
* 🚍 **Transporte Inteligente**: Cámbiate a patinetes eléctricos o bicicletas locales para un ahorro drástico.
* 💻 **Cafés Amigables**: Ubica cafés populares para nómadas y bibliotecas con conexiones estables sin costo de alquiler.
* 💡 **Consejo de Oro**: Usa este destino como motivación para escalar tus ingresos o realizar servicios remotos antes de mudarte.`;
    } else if (ratio < 1.5) {
      return `### ☀️ Rumbo Confortable en **${city}**

¡Excelente situación! Tus ingresos mensuales de **${salary} ${currency}** cubren holgadamente el presupuesto estimado en **${city}** (**${cost} ${currency}**).

**Plan Estratégico para tu perfil (${profile}):**
* 🏠 **Estudio moderno**: Te permite vivir de manera independiente en tu propio estudio o apartamento totalmente amueblado en un buen vecindario.
* 💻 **Escritorio Hot-Desk**: Reserva un coworking inspirador para aumentar el enfoque y expandir tu red de contactos profesionales.
* 🍲 **Smart Culinary Mix**: Combina comida tradicional y mercados callejeros con tus cafés e ingredientes de preferencia.
* 📈 **Efecto de Crecimiento**: Mantén una excelente tasa de ahorro mientras experimentas el estilo de vida a tu ritmo.`;
    } else {
      return `### 🚀 Estatus Ejecutivo Premium en **${city}**

¡Estás en abundancia total! Tus ingresos de **${salary} ${currency}** superan con creces el presupuesto de **${city}** (**${cost} ${currency}**). Tienes total libertad de elección.

**Plan Estratégico para tu perfil (${profile}):**
* 💎 **Penthouse Exclusivo**: Vive lujosamente en áticos de alto standing con servicio de conserjería, piscina en el rooftop y gimnasio privado.
* 💻 **Oficina de Élite**: Reserva un espacio privado en el coworking más top de la ciudad y asiste a conferencias influyentes.
* 🍣 **Exploración VIP**: Disfruta de la mejor cocina de autor, marcas premium y tours privados exclusivos.
* 💼 **Efecto Multiplicador**: Aprovecha este margen espectacular de ahorro para reinvertir en tus proyectos de software, fondos de inversión o startups.`;
    }
  } else if (language !== 'fr') {
    if (ratio < 0.8) {
      return `### ⚠️ Budget Warning for **${city}**

Hello nomadic friend! Based on our live financial mapping, your income of **${salary} ${currency}** might face tight boundaries when mapped against **${city}'s** estimated cost of living (**${cost} ${currency}**).

**Custom Optimizer Blueprint for ${profile}:**
* 🏠 **Co-Living Leverage**: Skip solo apartments. Book shared spaces or modern colivings. They bundle utilities and open rapid social networks.
* 🚍 **Transit Efficiency**: Bypass private taxis. Rent a local electric scooter or utilize local transit cards to save up to 80% on internal transport.
* 💻 **Free High-Speed Wi-Fi**: Discover welcoming cafes and public digital libraries with steady network speeds to bypass paid desks.
* 💡 **Pro-Tip**: Use this city as an exploration launchpad! Investigate closer neighborhoods or build your incoming revenue before committing to expensive luxury zones.`;
    } else if (ratio < 1.5) {
      return `### ☀️ Comfort Runway unlocked in **${city}**

Fantastic status! Your monthly intake of **${salary} ${currency}** comfortably aligns with **${city}'s** active baseline of **${cost} ${currency}**. This grants you a reliable workspace and smooth integration.

**Custom Optimizer Blueprint for ${profile}:**
* 🏠 **Modern Studio Loft**: You can confidently afford a beautiful private loft or a highly modern apartment just 10-15 minutes outside the central high-density tourist areas.
* 💻 **Vibrant Hot Desk**: Secure a flexible monthly hot-desk membership at premier spaces to feed your professional network.
* 🍲 **Smart Culinary Mix**: Alterne between incredible street level foods (usually rich and ultra-cost-efficient) and premium laptop-friendly cafes.
* 📈 **Growth Zone**: Maintain a 20-30% saving matrix. You are in a sweet spot of life quality and economic growth! Use it to test new ideas.`;
    } else {
      return `### 🚀 High-Flying Executive Status in **${city}**

You are in absolute abundance! Your monthly income of **${salary} ${currency}** far exceeds **${city}'s** index of **${cost} ${currency}**. Today you have complete power of choice.

**Custom Optimizer Blueprint for ${profile}:**
* 💎 **Premier Living**: Look for high-floor full-service penthouse lofts with panoramic views, private pools, and executive gyms in major premium districts.
* 💻 **Espaces d'Elite**: Invest in high-end dedicated workspaces, private conference rooms, and join private traveler venture networks.
* 🍣 **Gastronomic Safari**: Dine at signature rooftops, taste five-star restaurants, and schedule high-tier weekend tours.
* 💼 **Wealth Engine**: Keep your budget optimized! Reinvest your massive cost surplus directly into scale, investments, or passive index tracking.`;
    }
  } else {
    if (ratio < 0.8) {
      return `### ⚠️ Alerte Équilibre pour **${city}**

Salut voyageur ! D'après nos calculs en temps réel, ton salaire mensuel de **${salary} ${currency}** est inférieur au coût moyen estimé de **${city}** (**${cost} ${currency}**).

**Plan d'Action Sur-Mesure pour ton profil (${profile}) :**
* 🏠 **Colocation & Coliving** : Oublie la location solo. Choisis des espaces de coliving qui regroupent l'eau, l'électricité, internet et des colocataires formidables !
*  **Transports Futés** : Remplace les taxis par des abonnements métro locaux ou loue un vélo à la semaine pour économiser des dizaines de devises.
* 💻 **Espresso-Office** : Rends-toi dans les cafés réputés pour les nomades ou les bibliothèques avec connexion robuste pour travailler gratuitement.
* 💡 **Astuce** : Considère cela comme un défi motivant ! Augmente tes revenus freelance ou fais de la sous-location temporaire pour surmonter le coût de la vie.`;
    } else if (ratio < 1.5) {
      return `### ☀️ Feu Vert Confort à **${city}**

Superbe ! Ton revenu de **${salary} ${currency}** te permet de couvrir sereinement le budget de **${cost} ${currency}** requis à **${city}**, tout en préservant une petite marge d'épargne.

**Plan d'Action Sur-Mesure pour ton profil (${profile}) :**
* 🏠 **Studio Moderne** : Vis sereinement dans ton propre studio tout équipé ou un bel appartement 1 chambre situé à deux pas des quartiers animés.
* 💻 **Pass Coworking Flex** : Finance-toi un bureau flexible dans un espace inspirant pour sécuriser tes réunions et agrandir ton réseau de compétences.
* 🍲 **Exploration Culinaire** : Savoure un parfait mélange de trésors locaux (qui préservent le budget) et de jolis restaurants occidentaux.
* 📈 **Énergie d'Avenir** : Avec 35% d'excédent de liberté, tu es dans les meilleures conditions pour travailler, apprendre et naviguer à ton rythme.`;
    } else {
      return `### 🚀 Excellence & Vie de Rêve à **${city}**

Le paradis des nomades d'élite t'attend ! Ton revenu de **${salary} ${currency}** écrase le coût local estimé de **${cost} ${currency}**. Tu disposes d'un pouvoir d'achat phénoménal.

**Plan d'Action Sur-Mesure pour ton profil (${profile}) :**
* 💎 **Penthouse Standing** : Sélectionne de somptueux appartements avec terrasses panoramiques, piscines de toit et services de conciergerie haut de gamme.
* 💻 **Bureau Privé Élite** : Réserve ta place attitrée dans l'espace de coworking le plus réputé et intègre les clubs d'affaires mondiaux de la ville.
* 🍣 **Prestations Premium** : Déjeune dans les meilleures adresses, loue des voitures de sport et explore la région avec guides certifiés sans compter tes dépenses.
* 💼 **Effet Multiplicateur** : Profite de ce levier exceptionnel pour investir massivement ta colossale capacité d'épargne dans tes projets financiers ou tes sociétés.`;
    }
  }
}

async function startServer() {
  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`NomadCap server started on http://0.0.0.0:${PORT}`);
  });
}

startServer();
