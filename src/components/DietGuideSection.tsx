import React, { useState } from 'react';
import { CalculationResults, UserProfile, FitnessGoal, DietPreference } from '../types';
import { INDIAN_MEAL_PLANS, MACRO_FOOD_GUIDE } from '../data/nutrition';
import { 
  Utensils, 
  Apple, 
  Clock, 
  Flame, 
  ShieldCheck, 
  Check, 
  Sparkles, 
  Leaf, 
  Drumstick,
  Scale,
  TrendingDown,
  TrendingUp,
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';

interface DietGuideSectionProps {
  results: CalculationResults;
  profile: UserProfile;
  currentGoal?: 'deficit' | 'maintenance' | 'surplus';
  onGoalChange?: (goal: FitnessGoal) => void;
  onNavigateToCalculator?: () => void;
}

// Helper to round numerical values accurately to 1-2 decimal places, preventing floating-point representation artifacts
const roundDecimals = (val: number, decimals: number = 1): number => {
  if (isNaN(val) || !isFinite(val)) return 0;
  const factor = Math.pow(10, decimals);
  return Math.round((val + Number.EPSILON) * factor) / factor;
};

export const DietGuideSection: React.FC<DietGuideSectionProps> = ({
  results,
  profile,
  currentGoal,
  onGoalChange,
  onNavigateToCalculator,
}) => {
  // Determine initial goal tab based on profile or prop
  const initialGoal: 'deficit' | 'maintenance' | 'surplus' = 
    currentGoal || (
      profile.goal.startsWith('deficit') 
        ? 'deficit' 
        : profile.goal.startsWith('surplus') 
        ? 'surplus' 
        : 'maintenance'
    );

  const [selectedPlanTab, setSelectedPlanTab] = useState<'deficit' | 'maintenance' | 'surplus'>(initialGoal);
  const [dietPreference, setDietPreference] = useState<DietPreference>('veg');
  const [foodCategory, setFoodCategory] = useState<'proteins' | 'carbohydrates' | 'fats'>('proteins');

  // Exact calculated target calories & macros dynamically derived from user's bio-scan results
  let rawTargetCalories: number;
  let rawTargetProtein: number;
  let rawTargetCarbs: number;
  let rawTargetFat: number;
  let goalTitle: string;
  let goalBadgeDesc: string;

  if (selectedPlanTab === 'deficit') {
    rawTargetCalories = profile.goal.startsWith('deficit')
      ? results.targetCalories
      : results.deficitTiers.moderate.calories;
    rawTargetProtein = results.macros.deficit.proteinGrams;
    rawTargetCarbs = results.macros.deficit.carbsGrams;
    rawTargetFat = results.macros.deficit.fatsGrams;
    goalTitle = 'Fat Loss Calorie Deficit Plan';
    goalBadgeDesc = `Target: ${roundDecimals(rawTargetCalories, 1)} kcal (Calibrated ~500 kcal below your ${roundDecimals(results.tdee, 1)} kcal TDEE for -0.5 kg/wk fat loss)`;
  } else if (selectedPlanTab === 'surplus') {
    rawTargetCalories = profile.goal.startsWith('surplus')
      ? results.targetCalories
      : results.surplusTiers.lean.calories;
    rawTargetProtein = results.macros.surplus.proteinGrams;
    rawTargetCarbs = results.macros.surplus.carbsGrams;
    rawTargetFat = results.macros.surplus.fatsGrams;
    goalTitle = 'Lean Bulking Calorie Surplus Plan';
    goalBadgeDesc = `Target: ${roundDecimals(rawTargetCalories, 1)} kcal (Calibrated ~250 kcal above your ${roundDecimals(results.tdee, 1)} kcal TDEE for +0.25 kg/wk lean mass)`;
  } else {
    rawTargetCalories = results.tdee;
    rawTargetProtein = results.macros.maintenance.proteinGrams;
    rawTargetCarbs = results.macros.maintenance.carbsGrams;
    rawTargetFat = results.macros.maintenance.fatsGrams;
    goalTitle = 'Equilibrium Maintenance Plan';
    goalBadgeDesc = `Target: ${roundDecimals(rawTargetCalories, 1)} kcal (Matches your Total Daily Energy Expenditure for weight stability)`;
  }

  const targetCalories = roundDecimals(rawTargetCalories, 1);
  const targetProtein = roundDecimals(rawTargetProtein, 1);
  const targetCarbs = roundDecimals(rawTargetCarbs, 1);
  const targetFat = roundDecimals(rawTargetFat, 1);

  // Get raw meal templates from data
  const rawPlan = INDIAN_MEAL_PLANS[dietPreference][selectedPlanTab] || INDIAN_MEAL_PLANS.veg.maintenance;

  // Mathematically compute exact meal breakdown that sums to 100% of the calculated values with 1-2 decimal precision
  const meal1Cal = roundDecimals(targetCalories * 0.25, 1);
  const meal1Pro = roundDecimals(targetProtein * 0.25, 1);
  const meal1Carb = roundDecimals(targetCarbs * 0.25, 1);
  const meal1Fat = roundDecimals(targetFat * 0.25, 1);

  const meal2Cal = roundDecimals(targetCalories * 0.35, 1);
  const meal2Pro = roundDecimals(targetProtein * 0.35, 1);
  const meal2Carb = roundDecimals(targetCarbs * 0.35, 1);
  const meal2Fat = roundDecimals(targetFat * 0.35, 1);

  const meal3Cal = roundDecimals(targetCalories * 0.15, 1);
  const meal3Pro = roundDecimals(targetProtein * 0.18, 1);
  const meal3Carb = roundDecimals(targetCarbs * 0.15, 1);
  const meal3Fat = roundDecimals(targetFat * 0.12, 1);

  // Fourth meal calculates exact remaining balance, strictly rounded to eliminate JS floating point binary noise
  const meal4Cal = roundDecimals(targetCalories - (meal1Cal + meal2Cal + meal3Cal), 1);
  const meal4Pro = roundDecimals(targetProtein - (meal1Pro + meal2Pro + meal3Pro), 1);
  const meal4Carb = roundDecimals(targetCarbs - (meal1Carb + meal2Carb + meal3Carb), 1);
  const meal4Fat = roundDecimals(targetFat - (meal1Fat + meal2Fat + meal3Fat), 1);

  const calculatedMealBreakdowns = [
    { cal: meal1Cal, pro: meal1Pro, carb: meal1Carb, fat: meal1Fat },
    { cal: meal2Cal, pro: meal2Pro, carb: meal2Carb, fat: meal2Fat },
    { cal: meal3Cal, pro: meal3Pro, carb: meal3Carb, fat: meal3Fat },
    { cal: meal4Cal, pro: meal4Pro, carb: meal4Carb, fat: meal4Fat },
  ];

  return (
    <div id="diet-guide-section" className="space-y-6">
      {/* 1. METABOLIC CALORIE EDUCATION & VALUE CALIBRATION HUB */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#07152b] via-[#051124] to-[#071933] border border-cyan-500/40 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-cyan-900/50">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" /> BIO-SCAN CALORIE &amp; NUTRITION FOUNDATION
            </div>
            <h2 className="text-2xl font-bold text-white font-display flex items-center gap-2.5">
              Learn Your Calorie Numbers &amp; Dietary Strategy
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl mt-1">
              Every diet blueprint in Ayuva is strictly calibrated to your exact physiological scan ({profile.weightKg} kg, {profile.heightCm} cm, {profile.age} yrs). Understand how maintenance, deficit, and surplus shape your body composition:
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <span className="px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-xs font-mono text-cyan-300 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-cyan-400" /> BMR: {results.bmr} kcal
            </span>
            <span className="px-3 py-1 rounded-full bg-blue-950/80 border border-blue-500/40 text-xs font-mono text-blue-300 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-blue-400" /> TDEE: {results.tdee} kcal
            </span>
          </div>
        </div>

        {/* 3 Interactive Learning Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          {/* Card 1: Maintenance Calories */}
          <div
            onClick={() => setSelectedPlanTab('maintenance')}
            className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
              selectedPlanTab === 'maintenance'
                ? 'bg-blue-950/70 border-blue-400 shadow-lg shadow-blue-500/10 ring-1 ring-blue-400'
                : 'bg-slate-950/60 border-slate-800 hover:border-blue-500/40 hover:bg-slate-900/60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-blue-400 uppercase flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5" /> 1. Maintenance Calories
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                  selectedPlanTab === 'maintenance' ? 'bg-blue-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}>
                  {selectedPlanTab === 'maintenance' ? 'ACTIVE PLAN' : 'VIEW PLAN'}
                </span>
              </div>
              <div className="text-2xl font-bold text-white font-display mb-1">
                {results.tdee} <span className="text-xs font-mono text-slate-400 font-normal">kcal/day</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                <strong>What it is:</strong> Your biological energy equilibrium (TDEE). Calories eaten match calories burned through BMR, TEF, and daily movement. Weight remains stable.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-300">
              <span className="text-cyan-400 font-bold">{results.macros.maintenance.proteinGrams}g Pro</span>
              <span className="text-blue-400 font-bold">{results.macros.maintenance.carbsGrams}g Carb</span>
              <span className="text-amber-400 font-bold">{results.macros.maintenance.fatsGrams}g Fat</span>
            </div>
          </div>

          {/* Card 2: Calorie Deficit */}
          <div
            onClick={() => setSelectedPlanTab('deficit')}
            className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
              selectedPlanTab === 'deficit'
                ? 'bg-cyan-950/70 border-cyan-400 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-400'
                : 'bg-slate-950/60 border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900/60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase flex items-center gap-1.5">
                  <TrendingDown className="w-3.5 h-3.5" /> 2. Calorie Deficit (Cut)
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                  selectedPlanTab === 'deficit' ? 'bg-cyan-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}>
                  {selectedPlanTab === 'deficit' ? 'ACTIVE PLAN' : 'VIEW PLAN'}
                </span>
              </div>
              <div className="text-2xl font-bold text-cyan-300 font-display mb-1">
                {results.deficitTiers.moderate.calories} <span className="text-xs font-mono text-slate-400 font-normal">kcal/day (-500)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                <strong>What it is:</strong> Controlled negative energy balance forcing your body to oxidize stored body fat (~0.5 kg / 1.1 lbs per week) while keeping protein high to protect lean muscle.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-300">
              <span className="text-cyan-400 font-bold">{results.macros.deficit.proteinGrams}g Pro</span>
              <span className="text-blue-400 font-bold">{results.macros.deficit.carbsGrams}g Carb</span>
              <span className="text-amber-400 font-bold">{results.macros.deficit.fatsGrams}g Fat</span>
            </div>
          </div>

          {/* Card 3: Calorie Surplus */}
          <div
            onClick={() => setSelectedPlanTab('surplus')}
            className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
              selectedPlanTab === 'surplus'
                ? 'bg-amber-950/70 border-amber-400 shadow-lg shadow-amber-500/10 ring-1 ring-amber-400'
                : 'bg-slate-950/60 border-slate-800 hover:border-amber-500/40 hover:bg-slate-900/60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" /> 3. Calorie Surplus (Bulk)
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                  selectedPlanTab === 'surplus' ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}>
                  {selectedPlanTab === 'surplus' ? 'ACTIVE PLAN' : 'VIEW PLAN'}
                </span>
              </div>
              <div className="text-2xl font-bold text-amber-300 font-display mb-1">
                {results.surplusTiers.lean.calories} <span className="text-xs font-mono text-slate-400 font-normal">kcal/day (+250)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                <strong>What it is:</strong> Strategic anabolic surplus supersaturating muscle glycogen and muscle protein synthesis for strength and size gains with minimal fat gain (~0.25 kg/wk).
              </p>
            </div>
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-300">
              <span className="text-cyan-400 font-bold">{results.macros.surplus.proteinGrams}g Pro</span>
              <span className="text-blue-400 font-bold">{results.macros.surplus.carbsGrams}g Carb</span>
              <span className="text-amber-400 font-bold">{results.macros.surplus.fatsGrams}g Fat</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. DUAL SELECTOR BAR (VEG / NON-VEG & GOAL TABS) */}
      <div className="p-5 rounded-2xl bg-[#091829] border border-cyan-500/40 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Utensils className="w-4 h-4" /> AUTHENTIC INDIAN FOOD MEAL ARCHITECTURE
          </div>
          <h3 className="text-xl font-bold text-white font-display">
            {goalTitle} ({dietPreference === 'veg' ? 'Indian Vegetarian' : 'Indian Non-Vegetarian'})
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">
            {goalBadgeDesc}
          </p>
        </div>

        {/* Dual Switchers */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Veg / Non-Veg Switcher */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 shadow-inner">
            <button
              type="button"
              id="diet-veg-selector"
              onClick={() => setDietPreference('veg')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                dietPreference === 'veg' 
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-black' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-sm border border-emerald-300 flex items-center justify-center p-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
              </span>
              <Leaf className="w-3.5 h-3.5" />
              <span>VEG PLAN</span>
            </button>

            <button
              type="button"
              id="diet-non-veg-selector"
              onClick={() => setDietPreference('non_veg')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                dietPreference === 'non_veg' 
                  ? 'bg-red-500 text-white shadow-md shadow-red-500/20 font-black' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-sm border border-red-300 flex items-center justify-center p-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              </span>
              <Drumstick className="w-3.5 h-3.5" />
              <span>NON-VEG</span>
            </button>
          </div>

          {/* Goal Selector */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 shadow-inner">
            <button
              type="button"
              id="goal-deficit-tab"
              onClick={() => setSelectedPlanTab('deficit')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                selectedPlanTab === 'deficit' ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20 font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              Fat Loss
            </button>
            <button
              type="button"
              id="goal-maintenance-tab"
              onClick={() => setSelectedPlanTab('maintenance')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                selectedPlanTab === 'maintenance' ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20 font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              Maintenance
            </button>
            <button
              type="button"
              id="goal-surplus-tab"
              onClick={() => setSelectedPlanTab('surplus')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                selectedPlanTab === 'surplus' ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20 font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              Bulking
            </button>
          </div>
        </div>
      </div>

      {/* 3. EXACT METRIC SUMMARY BAR */}
      <div className="p-4 rounded-xl bg-[#060f1e] border border-cyan-900/60 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold uppercase flex items-center gap-1.5 ${
            dietPreference === 'veg' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-red-950 text-red-300 border border-red-500/40'
          }`}>
            <span className={`w-2 h-2 rounded-full ${dietPreference === 'veg' ? 'bg-emerald-400' : 'bg-red-400'}`} />
            {dietPreference === 'veg' ? 'Indian Pure Vegetarian' : 'Indian Non-Vegetarian'} • {selectedPlanTab.toUpperCase()}
          </span>
          <span className="text-xs text-slate-300 font-mono">
            Accurate Scan Target: <strong className="text-cyan-300">{targetCalories} kcal/day</strong>
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1">
            <span className="text-slate-400">Total:</span>
            <span className="font-bold text-white bg-slate-900 px-2.5 py-0.5 rounded border border-slate-800">
              {targetCalories} kcal
            </span>
          </div>
          <div className="flex items-center gap-1 text-cyan-400 font-bold">
            <span>{targetProtein}g</span>
            <span className="text-slate-500 text-[10px]">PROTEIN</span>
          </div>
          <div className="flex items-center gap-1 text-blue-400 font-bold">
            <span>{targetCarbs}g</span>
            <span className="text-slate-500 text-[10px]">CARBS</span>
          </div>
          <div className="flex items-center gap-1 text-amber-400 font-bold">
            <span>{targetFat}g</span>
            <span className="text-slate-500 text-[10px]">FATS</span>
          </div>
        </div>
      </div>

      {/* 4. DAILY 4-MEAL BREAKDOWN SCHEDULE (CALCULATED & ACCURATE) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rawPlan.meals.map((meal, index) => {
          const breakdown = calculatedMealBreakdowns[index] || {
            cal: roundDecimals(targetCalories / 4, 1),
            pro: roundDecimals(targetProtein / 4, 1),
            carb: roundDecimals(targetCarbs / 4, 1),
            fat: roundDecimals(targetFat / 4, 1),
          };

          return (
            <div 
              key={meal.id}
              className="p-5 rounded-2xl bg-[#081226]/90 border border-slate-800 hover:border-cyan-500/40 transition-all shadow-lg flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-xs font-mono font-bold text-cyan-300">
                      0{index + 1}
                    </span>
                    <h4 className="text-base font-bold text-white font-display">{meal.name}</h4>
                  </div>
                  <span className="text-xs font-mono text-cyan-400 bg-slate-900 px-2.5 py-1 rounded-full border border-slate-800 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    {meal.time}
                  </span>
                </div>

                {/* Accurate Dynamic Macro pills */}
                <div className="flex items-center gap-2 mb-3 text-xs font-mono">
                  <span className="px-2 py-0.5 rounded bg-slate-950 border border-cyan-500/30 text-white font-bold">
                    {roundDecimals(breakdown.cal, 1)} kcal
                  </span>
                  <span className="text-cyan-400 font-bold">{roundDecimals(breakdown.pro, 1)}g P</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-blue-400 font-bold">{roundDecimals(breakdown.carb, 1)}g C</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-amber-400 font-bold">{roundDecimals(breakdown.fat, 1)}g F</span>
                </div>

                <p className="text-xs text-slate-300 mb-3">{meal.description}</p>

                {/* Food Items List */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1.5">
                  <div className="text-[10px] font-mono uppercase text-slate-400 font-bold mb-1 flex items-center justify-between">
                    <span>Authentic Indian Food Items:</span>
                    <span className="text-cyan-400 font-normal">Homestyle Preparation</span>
                  </div>
                  {meal.foods.map((food, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-200">
                      <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{food}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. INDIAN WHOLE-FOOD MACRONUTRIENT GUIDE CHEAT SHEET */}
      <div className="p-6 rounded-2xl bg-[#081224] border border-cyan-500/30 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Apple className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">INDIAN WHOLE-FOOD MACRO CHEAT SHEET</h3>
              <p className="text-xs text-slate-400">Nutritious high-yield Indian staples and clean sources for body recomposition</p>
            </div>
          </div>

          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setFoodCategory('proteins')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                foodCategory === 'proteins' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Proteins
            </button>
            <button
              type="button"
              onClick={() => setFoodCategory('carbohydrates')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                foodCategory === 'carbohydrates' ? 'bg-blue-500 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Carbohydrates
            </button>
            <button
              type="button"
              onClick={() => setFoodCategory('fats')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                foodCategory === 'fats' ? 'bg-amber-500 text-black font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Healthy Fats
            </button>
          </div>
        </div>

        {/* Food Table Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {MACRO_FOOD_GUIDE[foodCategory].map((food, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between hover:border-cyan-500/30 transition-all">
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  {food.name}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[11px] text-slate-400 font-mono">{food.amount}</span>
                  {food.badge && (
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/50">
                      {food.badge}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right font-mono shrink-0 ml-2">
                <div className="text-xs font-bold text-cyan-300">
                  {'protein' in food ? `${food.protein} Protein` : 'carbs' in food ? `${food.carbs} Carbs` : `${food.fat} Fat`}
                </div>
                <div className="text-[10px] text-slate-400">{food.kcal} kcal</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
