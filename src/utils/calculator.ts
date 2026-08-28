import { UserProfile, CalculationResults, MacroSplit, DeficitTier, SurplusTier } from '../types';

// Activity Multipliers based on clinical metabolic research
export const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,       // Desk job, little to no formal exercise
  light: 1.375,         // Light exercise/sports 1-3 days/week
  moderate: 1.55,       // Moderate exercise/sports 3-5 days/week
  very_active: 1.725,   // Heavy exercise/sports 6-7 days/week
  extra_active: 1.9,    // Physical labor job or intense 2x daily training
};

export const ACTIVITY_LABELS = {
  sedentary: {
    label: 'Sedentary',
    multiplier: '1.20',
    desc: 'Desk job, little to no intentional exercise',
  },
  light: {
    label: 'Lightly Active',
    multiplier: '1.375',
    desc: 'Light workout or sports 1–3 days/week',
  },
  moderate: {
    label: 'Moderately Active',
    multiplier: '1.55',
    desc: 'Moderate gym sessions 3–5 days/week',
  },
  very_active: {
    label: 'Very Active',
    multiplier: '1.725',
    desc: 'Hard exercise/lifting 6–7 days/week',
  },
  extra_active: {
    label: 'Extremely Active',
    multiplier: '1.90',
    desc: 'Heavy physical labor or 2x daily competitive training',
  },
};

/**
 * Calculate Basal Metabolic Rate (BMR) with minute decimal precision
 */
export function calculateBMR(
  gender: 'male' | 'female',
  weightKg: number,
  heightCm: number,
  age: number,
  formula: 'mifflin' | 'harris_benedict' | 'katch_mcardle' = 'mifflin',
  bodyFatPercent?: number
): number {
  let bmrVal = 0;
  if (formula === 'katch_mcardle' && bodyFatPercent && bodyFatPercent > 0) {
    const leanMassKg = weightKg * (1 - bodyFatPercent / 100);
    bmrVal = 370 + 21.6 * leanMassKg;
  } else if (formula === 'harris_benedict') {
    // Revised Harris-Benedict (Roza and Shizgal, 1984)
    if (gender === 'male') {
      bmrVal = 88.362 + (13.397 * weightKg) + (4.799 * heightCm) - (5.677 * age);
    } else {
      bmrVal = 447.593 + (9.247 * weightKg) + (3.098 * heightCm) - (4.330 * age);
    }
  } else {
    // Default: Mifflin-St Jeor (Highest clinical standard)
    if (gender === 'male') {
      bmrVal = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
    } else {
      bmrVal = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
    }
  }

  return parseFloat(bmrVal.toFixed(1));
}

/**
 * Calculate TDEE (Total Daily Energy Expenditure / Maintenance Calories)
 */
export function calculateTDEE(bmr: number, activityLevel: keyof typeof ACTIVITY_MULTIPLIERS): number {
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] || 1.2;
  return parseFloat((bmr * multiplier).toFixed(1));
}

/**
 * Calculate BMI (Body Mass Index) with fine decimal resolution
 */
export function calculateBMI(weightKg: number, heightCm: number): {
  bmi: number;
  category: string;
  color: string;
} {
  const heightM = heightCm / 100;
  const bmi = heightM > 0 ? parseFloat((weightKg / (heightM * heightM)).toFixed(2)) : 0;

  let category = 'Normal Weight';
  let color = 'text-emerald-400';

  if (bmi < 18.5) {
    category = 'Underweight';
    color = 'text-amber-400';
  } else if (bmi >= 18.5 && bmi < 24.9) {
    category = 'Normal Weight (Optimal)';
    color = 'text-emerald-400';
  } else if (bmi >= 25 && bmi < 29.9) {
    category = 'Overweight';
    color = 'text-cyan-300';
  } else if (bmi >= 30 && bmi < 34.9) {
    category = 'Obesity Class I';
    color = 'text-amber-500';
  } else {
    category = 'Obesity Class II+';
    color = 'text-rose-500';
  }

  return { bmi, category, color };
}

/**
 * Calculate Ideal Body Weight Range (Devine / Robinson composite) with fine decimal support
 */
export function calculateIdealWeight(gender: 'male' | 'female', heightCm: number): {
  minKg: number;
  maxKg: number;
  minLbs: number;
  maxLbs: number;
} {
  const heightInches = heightCm / 2.54;
  const inchesOver5Ft = Math.max(0, heightInches - 60);

  let baseDevineKg = gender === 'male' 
    ? 50 + 2.3 * inchesOver5Ft 
    : 45.5 + 2.3 * inchesOver5Ft;

  const minKg = parseFloat((baseDevineKg * 0.92).toFixed(1));
  const maxKg = parseFloat((baseDevineKg * 1.08).toFixed(1));

  return {
    minKg,
    maxKg,
    minLbs: parseFloat((minKg * 2.20462262).toFixed(1)),
    maxLbs: parseFloat((maxKg * 2.20462262).toFixed(1)),
  };
}

/**
 * Calculate Macronutrient splits
 */
export function calculateMacros(calories: number, weightKg: number, mode: 'deficit' | 'maintenance' | 'surplus'): MacroSplit {
  let proteinRatio: number; // g per kg
  let fatPercent: number;    // % of total calories

  if (mode === 'deficit') {
    // High protein during deficit to preserve lean muscle tissue
    proteinRatio = 2.2;
    fatPercent = 0.25;
  } else if (mode === 'surplus') {
    // Lean mass building
    proteinRatio = 2.0;
    fatPercent = 0.25;
  } else {
    // Maintenance
    proteinRatio = 1.8;
    fatPercent = 0.28;
  }

  let proteinGrams = Math.round(weightKg * proteinRatio);
  let proteinCalories = proteinGrams * 4;

  // Cap protein calories if exceeds 45% of total budget
  if (proteinCalories > calories * 0.45) {
    proteinCalories = Math.round(calories * 0.40);
    proteinGrams = Math.round(proteinCalories / 4);
  }

  const fatsCalories = Math.round(calories * fatPercent);
  const fatsGrams = Math.round(fatsCalories / 9);

  let carbsCalories = calories - (proteinCalories + fatsCalories);
  if (carbsCalories < 0) carbsCalories = 0;
  const carbsGrams = Math.round(carbsCalories / 4);

  const proteinPercent = Math.round((proteinCalories / calories) * 100);
  const fatsPercent = Math.round((fatsCalories / calories) * 100);
  const carbsPercent = Math.max(0, 100 - (proteinPercent + fatsPercent));

  return {
    proteinGrams,
    carbsGrams,
    fatsGrams,
    proteinCalories,
    carbsCalories,
    fatsCalories,
    proteinPercent,
    carbsPercent,
    fatsPercent,
  };
}

/**
 * Full Comprehensive Evaluation Engine
 */
export function evaluateUserProfile(profile: UserProfile): CalculationResults {
  const { gender, weightKg, heightCm, age, activityLevel, formula, bodyFatPercent, goal } = profile;

  const bmr = calculateBMR(gender, weightKg, heightCm, age, formula, bodyFatPercent);
  const tdee = calculateTDEE(bmr, activityLevel);
  const { bmi, category: bmiCategory, color: bmiColor } = calculateBMI(weightKg, heightCm);
  const idealWeight = calculateIdealWeight(gender, heightCm);

  // Daily Water Intake (33ml per kg + 500ml per activity level above sedentary)
  const activityWaterOffset = activityLevel === 'sedentary' ? 0 : activityLevel === 'light' ? 0.3 : activityLevel === 'moderate' ? 0.6 : 1.0;
  const waterIntakeLiters = parseFloat(((weightKg * 0.033) + activityWaterOffset).toFixed(2));
  const waterIntakeOz = parseFloat((waterIntakeLiters * 33.814).toFixed(1));

  // Daily Protein recommendation range (1.6g to 2.2g per kg)
  const proteinRecommendationGrams = {
    min: parseFloat((weightKg * 1.6).toFixed(1)),
    max: parseFloat((weightKg * 2.2).toFixed(1)),
  };

  // Deficit Tiers (-250, -500, -750 kcal)
  const deficitTiers: { mild: DeficitTier; moderate: DeficitTier; aggressive: DeficitTier } = {
    mild: {
      type: 'mild',
      label: 'Mild Deficit (Gentle Cut)',
      calories: parseFloat((Math.max(bmr, tdee - 250)).toFixed(1)),
      diff: 250,
      weeklyLossKg: 0.25,
      weeklyLossLbs: 0.55,
      description: 'Slow & sustainable fat reduction while retaining 100% of strength and muscle mass.',
      recommendedFor: 'Athletes, bodybuilders in contest prep, or individuals within 5kg of goal.',
    },
    moderate: {
      type: 'moderate',
      label: 'Standard Deficit (Recommended)',
      calories: parseFloat((Math.max(bmr, tdee - 500)).toFixed(1)),
      diff: 500,
      weeklyLossKg: 0.5,
      weeklyLossLbs: 1.1,
      description: 'The golden standard for steady, healthy fat burning without excessive hunger.',
      recommendedFor: 'Most gym-goers seeking clear muscle definition and waistline reduction.',
    },
    aggressive: {
      type: 'aggressive',
      label: 'Aggressive Deficit (Rapid Cut)',
      calories: parseFloat((Math.max(1200, tdee - 750)).toFixed(1)),
      diff: 750,
      weeklyLossKg: 0.75,
      weeklyLossLbs: 1.65,
      description: 'Fast weight reduction protocol. Keep protein exceptionally high to guard muscle.',
      recommendedFor: 'Short-term cuts (4-6 weeks) or individuals with higher body fat % (>25%).',
    },
  };

  // Surplus Tiers (+250, +500, +750 kcal)
  const surplusTiers: { lean: SurplusTier; moderate: SurplusTier; aggressive: SurplusTier } = {
    lean: {
      type: 'lean',
      label: 'Lean Bulk (Clean Hypertrophy)',
      calories: parseFloat((tdee + 250).toFixed(1)),
      diff: 250,
      weeklyGainKg: 0.25,
      weeklyGainLbs: 0.55,
      description: 'Maximizes muscular hypertrophy while minimizing unwanted adipose tissue gain.',
      recommendedFor: 'Intermediate to advanced lifters and anyone who dislikes excess body fat.',
    },
    moderate: {
      type: 'moderate',
      label: 'Standard Bulk (Muscle Building)',
      calories: parseFloat((tdee + 500).toFixed(1)),
      diff: 500,
      weeklyGainKg: 0.5,
      weeklyGainLbs: 1.1,
      description: 'Solid caloric surplus delivering explosive gym strength and rapid size gains.',
      recommendedFor: 'Beginners in their first 1–2 years of training or natural hardgainers.',
    },
    aggressive: {
      type: 'aggressive',
      label: 'Aggressive Bulk (Power & Mass)',
      calories: parseFloat((tdee + 750).toFixed(1)),
      diff: 750,
      weeklyGainKg: 0.75,
      weeklyGainLbs: 1.65,
      description: 'High energy intake for massive strength progression and hardgainer growth.',
      recommendedFor: 'Powerlifters, strongman competitors, or very fast metabolism trainees.',
    },
  };

  // Macros
  const macros = {
    maintenance: calculateMacros(tdee, weightKg, 'maintenance'),
    deficit: calculateMacros(deficitTiers.moderate.calories, weightKg, 'deficit'),
    surplus: calculateMacros(surplusTiers.lean.calories, weightKg, 'surplus'),
  };

  // Target calories based on current selected goal
  let targetCalories = tdee;
  let targetGoalLabel = 'Maintenance (TDEE)';

  if (goal === 'deficit_mild') {
    targetCalories = deficitTiers.mild.calories;
    targetGoalLabel = 'Mild Cut (-250 kcal)';
  } else if (goal === 'deficit_moderate') {
    targetCalories = deficitTiers.moderate.calories;
    targetGoalLabel = 'Standard Cut (-500 kcal)';
  } else if (goal === 'deficit_aggressive') {
    targetCalories = deficitTiers.aggressive.calories;
    targetGoalLabel = 'Aggressive Cut (-750 kcal)';
  } else if (goal === 'surplus_lean') {
    targetCalories = surplusTiers.lean.calories;
    targetGoalLabel = 'Lean Bulk (+250 kcal)';
  } else if (goal === 'surplus_moderate') {
    targetCalories = surplusTiers.moderate.calories;
    targetGoalLabel = 'Standard Bulk (+500 kcal)';
  } else if (goal === 'surplus_aggressive') {
    targetCalories = surplusTiers.aggressive.calories;
    targetGoalLabel = 'Aggressive Bulk (+750 kcal)';
  }

  targetCalories = parseFloat(targetCalories.toFixed(1));

  return {
    bmr,
    tdee,
    bmi,
    bmiCategory,
    bmiColor,
    idealWeightRangeKg: { min: idealWeight.minKg, max: idealWeight.maxKg },
    idealWeightRangeLbs: { min: idealWeight.minLbs, max: idealWeight.maxLbs },
    waterIntakeLiters,
    waterIntakeOz,
    proteinRecommendationGrams,
    deficitTiers,
    surplusTiers,
    macros,
    targetCalories,
    targetGoalLabel,
  };
}

/**
 * Unit conversion helpers with minute decimal precision
 */
export function lbsToKg(lbs: number): number {
  if (isNaN(lbs) || lbs === 0) return 0;
  return parseFloat((lbs / 2.20462262).toFixed(2));
}

export function kgToLbs(kg: number): number {
  if (isNaN(kg) || kg === 0) return 0;
  return parseFloat((kg * 2.20462262).toFixed(2));
}

export function ftInToCm(feet: number, inches: number): number {
  const f = isNaN(feet) ? 0 : feet;
  const i = isNaN(inches) ? 0 : inches;
  return parseFloat(((f * 12 + i) * 2.54).toFixed(2));
}

export function cmToFtIn(cm: number): { feet: number; inches: number } {
  if (isNaN(cm) || cm <= 0) return { feet: 0, inches: 0 };
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = parseFloat((totalInches % 12).toFixed(2));
  return { feet, inches };
}
