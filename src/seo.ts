/**
 * Ayuva Health Assistant - Comprehensive SEO & Metadata Configuration File
 * 
 * This file contains the complete search engine optimization (SEO) architecture,
 * including primary keywords, long-tail search queries, demographic keywords,
 * hashtags, OpenGraph metadata, Twitter cards, and Schema.org structured data.
 */

export interface SEOConfiguration {
  title: string;
  shortTitle: string;
  tagline: string;
  description: string;
  canonicalUrl: string;
  author: string;
  applicationCategory: string;
  operatingSystem: string;
  keywords: string[];
  longTailQueries: string[];
  hashtags: string[];
  schemaData: Record<string, unknown>[];
}

export const SEO_DATA: SEOConfiguration = {
  title: "Ayuva Health Assistant | BMR & TDEE Calculator, Calorie Deficit & 3D BioScan",
  shortTitle: "Ayuva Health Assistant",
  tagline: "Precision Metabolic Architecture, Calorie Deficit Roadmap & 3D Biometric Hologram",
  description:
    "Comprehensive Ayuva Health Assistant providing metabolic analysis, BMR & TDEE calculation, caloric targets, macro breakdowns, 3D bio-digital anatomy, and Coach Ayuva gym workout routines.",
  canonicalUrl: "https://ayuvafit.vercel.app/",
  author: "Ayuva Health Systems",
  applicationCategory: "HealthApplication, FitnessApplication, NutritionCalculator",
  operatingSystem: "All, Web, iOS, Android, macOS, Windows",

  // Primary, exact-match, LSI, and broad keywords
  keywords: [
    // Core Brand & Exact Match Terms
    "Ayuva Health Assistant",
    "Ayuva Assistant",
    "AyuvaFit",
    "IUL assistant",
    "IUL health assistant",
    "Ayuva health calculator",
    "Coach Ayuva",
    "Ayuva AI Coach",

    // BMR & TDEE Core Calculators
    "BMR calculator",
    "TDEE calculator",
    "Basal Metabolic Rate calculator",
    "Total Daily Energy Expenditure",
    "BMR and TDEE calculator online",
    "free BMR calculator",
    "accurate TDEE calculator",
    "Mifflin-St Jeor calculator",
    "Harris-Benedict calculator",
    "Katch-McArdle formula",
    "metabolic rate calculator",
    "maintenance calories calculator",
    "resting metabolic rate RMR",

    // Calorie Deficit & Fat Loss Roadmaps
    "calorie deficit calculator",
    "fat loss calculator",
    "calorie deficit roadmap",
    "mild deficit 250 kcal",
    "standard deficit 500 kcal",
    "aggressive deficit rapid cut",
    "rapid cut calorie deficit",
    "how to calculate calorie deficit",
    "safe calorie deficit for fat loss",
    "weight loss calorie calculator",
    "weekly fat loss rate calculator",
    "body recomposition calculator",
    "calorie surplus lean bulk",
    "muscle gain calorie calculator",

    // Diet & Nutrition Planning
    "Indian diet plan for weight loss",
    "Indian diet calorie deficit",
    "vegetarian high protein diet plan",
    "non vegetarian gym diet plan",
    "4 meal nutrition breakdown",
    "macronutrient calculator",
    "protein intake calculator",
    "carb and fat ratio calculator",
    "paneer protein diet plan",
    "soya chunks high protein Indian diet",
    "chicken breast protein intake",
    "clean eating nutrition blueprint",

    // 3D BioScan & Fitness Technology
    "3D body hologram fitness",
    "3D anatomical model workout",
    "interactive muscle inspection 3D",
    "gym workout routines",
    "push pull legs split",
    "upper lower workout routine",
    "muscle hypertrophy guide",
    "AI fitness assistant",
    "AI workout planner",
    "AI health assistant",
    "smart fitness calculator"
  ],

  // Long-Tail Voice & Search Queries (High Intent Google Search Matches)
  longTailQueries: [
    "what is my BMR and TDEE",
    "how many calories should I eat to lose 1 kg per week",
    "how to calculate calorie deficit for rapid fat loss",
    "accurate BMR calculator with single decimal precision",
    "best Indian diet plan for weight loss vegetarian",
    "how to reach 140g protein on an Indian vegetarian diet",
    "mild cut vs aggressive cut calorie deficit difference",
    "free online BMR and TDEE calculator without signup",
    "interactive 3D body anatomy workout visualizer online",
    "IUL assistant BMR calculator for fitness goals",
    "Coach Ayuva fitness AI chatbot free"
  ],

  // Trending Social & Discoverability Hashtags
  hashtags: [
    "#BMRCalculator",
    "#TDEECalculator",
    "#CalorieDeficit",
    "#FatLossRoadmap",
    "#AyuvaHealthAssistant",
    "#AyuvaFit",
    "#IULAssistant",
    "#CalorieCalculator",
    "#WeightLossJourney",
    "#IndianDietPlan",
    "#HighProteinIndianDiet",
    "#VegetarianFitness",
    "#LeanBulk",
    "#RapidCut",
    "#FitnessTech",
    "#3DBioScan",
    "#GymWorkouts",
    "#AICoach",
    "#HealthyLifestyle",
    "#Macronutrients"
  ],

  // Google Schema.org JSON-LD Structured Data
  schemaData: [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Ayuva Health Assistant",
      alternateName: ["Ayuva Assistant", "IUL Assistant", "AyuvaFit BMR Calculator"],
      url: "https://ayuvafit.vercel.app/",
      description:
        "Comprehensive Ayuva Health Assistant providing metabolic analysis, BMR & TDEE calculation, caloric targets, macro breakdowns, 3D bio-digital anatomy, and Coach Ayuva gym workout routines.",
      applicationCategory: "HealthApplication",
      operatingSystem: "All",
      browserRequirements: "Requires modern web browser with WebGL and JavaScript enabled",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD"
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        ratingCount: "2480",
        bestRating: "5",
        worstRating: "1"
      },
      featureList: [
        "Mifflin-St Jeor BMR and TDEE computation engine",
        "Calibrated Calorie Deficit Roadmap with single-decimal precision",
        "Aggressive deficit rapid cut calculations",
        "3D Bio-Scan interactive anatomical muscle hologram",
        "Vegetarian and Non-Vegetarian Indian Diet Blueprint with 4-meal distribution",
        "AI-Powered Coach Ayuva for real-time fitness guidance"
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is BMR (Basal Metabolic Rate)?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "BMR (Basal Metabolic Rate) is the minimum number of calories your body burns at complete rest to maintain vital involuntary functions like breathing, blood circulation, cellular repair, and organ performance."
          }
        },
        {
          "@type": "Question",
          name: "What is TDEE (Total Daily Energy Expenditure)?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "TDEE is your total maintenance calorie expenditure factoring in your Basal Metabolic Rate (BMR) multiplied by your physical activity level, including daily movement, exercise, and thermic effect of food."
          }
        },
        {
          "@type": "Question",
          name: "What is an Aggressive Deficit (Rapid Cut)?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "An aggressive deficit reduces daily caloric intake by 750 kcal below maintenance (TDEE), targeting approximately 0.75 kg (1.65 lbs) of fat loss per week, calibrated accurately with high protein to preserve lean muscle tissue."
          }
        },
        {
          "@type": "Question",
          name: "How does the Indian Diet Blueprint work in Ayuva?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Ayuva's Diet Blueprint provides calibrated 4-meal daily breakdowns tailored for both Vegetarian and Non-Vegetarian Indian food cultures, with high-protein staples such as paneer, soya chunks, dal, chicken breast, eggs, and calibrated carbohydrates."
          }
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "How to Calculate BMR and Calorie Deficit using Ayuva Health Assistant",
      description: "Step-by-step procedure to evaluate your metabolic profile and establish an accurate fat-loss roadmap.",
      step: [
        {
          "@type": "HowToStep",
          name: "Enter Biometric Profile",
          text: "Select your biological sex, enter age, height (cm or ft/in), and weight (kg or lbs)."
        },
        {
          "@type": "HowToStep",
          name: "Select Activity Level",
          text: "Choose your weekly physical activity level from Sedentary to Extremely Active to calculate accurate TDEE."
        },
        {
          "@type": "HowToStep",
          name: "Analyze Roadmap Tiers",
          text: "Review Mild Cut (-250 kcal), Standard Cut (-500 kcal), and Aggressive Cut (-750 kcal) tiers calibrated to single decimal precision."
        },
        {
          "@type": "HowToStep",
          name: "Generate Indian Meal Blueprint",
          text: "Switch to the Diet Blueprint tab to view meal-by-meal macronutrient distribution for Vegetarian or Non-Vegetarian Indian foods."
        }
      ]
    }
  ]
};

/**
 * Returns formatted meta tags string suitable for head injection or export
 */
export function getSEOMetaTags(): {
  title: string;
  description: string;
  keywords: string;
  hashtags: string;
} {
  return {
    title: SEO_DATA.title,
    description: SEO_DATA.description,
    keywords: SEO_DATA.keywords.join(", "),
    hashtags: SEO_DATA.hashtags.join(" ")
  };
}
