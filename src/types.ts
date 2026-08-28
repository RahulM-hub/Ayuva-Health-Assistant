export type Gender = 'male' | 'female';
export type HeightUnit = 'cm' | 'ft_in';
export type WeightUnit = 'kg' | 'lbs';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very_active' | 'extra_active';
export type CalculationFormula = 'mifflin' | 'harris_benedict' | 'katch_mcardle';
export type FitnessGoal = 'maintain' | 'deficit_mild' | 'deficit_moderate' | 'deficit_aggressive' | 'surplus_lean' | 'surplus_moderate' | 'surplus_aggressive';

export interface UserProfile {
  gender: Gender;
  age: number;
  heightCm: number;
  weightKg: number;
  heightUnit: HeightUnit;
  weightUnit: WeightUnit;
  heightFt?: number;
  heightIn?: number;
  weightLbs?: number;
  activityLevel: ActivityLevel;
  bodyFatPercent?: number;
  formula: CalculationFormula;
  goal: FitnessGoal;
}

export interface DeficitTier {
  type: 'mild' | 'moderate' | 'aggressive';
  label: string;
  calories: number;
  diff: number;
  weeklyLossKg: number;
  weeklyLossLbs: number;
  description: string;
  recommendedFor: string;
}

export interface SurplusTier {
  type: 'lean' | 'moderate' | 'aggressive';
  label: string;
  calories: number;
  diff: number;
  weeklyGainKg: number;
  weeklyGainLbs: number;
  description: string;
  recommendedFor: string;
}

export interface MacroSplit {
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  proteinCalories: number;
  carbsCalories: number;
  fatsCalories: number;
  proteinPercent: number;
  carbsPercent: number;
  fatsPercent: number;
}

export interface CalculationResults {
  bmr: number;
  tdee: number;
  bmi: number;
  bmiCategory: string;
  bmiColor: string;
  idealWeightRangeKg: { min: number; max: number };
  idealWeightRangeLbs: { min: number; max: number };
  waterIntakeLiters: number;
  waterIntakeOz: number;
  proteinRecommendationGrams: { min: number; max: number };
  deficitTiers: {
    mild: DeficitTier;
    moderate: DeficitTier;
    aggressive: DeficitTier;
  };
  surplusTiers: {
    lean: SurplusTier;
    moderate: SurplusTier;
    aggressive: SurplusTier;
  };
  macros: {
    maintenance: MacroSplit;
    deficit: MacroSplit;
    surplus: MacroSplit;
  };
  targetCalories: number;
  targetGoalLabel: string;
}

export type MuscleGroup = 
  | 'chest' 
  | 'back' 
  | 'shoulders' 
  | 'biceps' 
  | 'triceps' 
  | 'quads' 
  | 'hamstrings' 
  | 'glutes' 
  | 'calves' 
  | 'core' 
  | 'cardio';

export interface Exercise {
  id: string;
  name: string;
  primaryMuscle: MuscleGroup;
  secondaryMuscles: string[];
  category: 'Push' | 'Pull' | 'Legs' | 'Core & Cardio' | 'Full Body';
  equipment: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  sets: string;
  reps: string;
  rest: string;
  tempo: string;
  formCues: string[];
  coachTips: string;
  burnRateKcalPerHour: number;
}

export type DietPreference = 'veg' | 'non_veg';

export interface MealPlanItem {
  id: string;
  name: string;
  time: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  description: string;
  foods: string[];
}

export interface DailyMealPlan {
  goal: 'Deficit (Fat Loss)' | 'Maintenance (Equilibrium)' | 'Surplus (Muscle Growth)';
  preference?: 'Vegetarian' | 'Non-Vegetarian';
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  meals: MealPlanItem[];
}
