import React, { useState, useEffect } from 'react';
import { UserProfile, Gender, HeightUnit, WeightUnit, ActivityLevel, FitnessGoal, CalculationFormula } from '../types';
import { ACTIVITY_LABELS, cmToFtIn, ftInToCm, kgToLbs, lbsToKg } from '../utils/calculator';
import { Flame, Calculator, Sparkles, Scale, Ruler, Activity, Sliders, ChevronDown, ChevronUp, User, Minus, Plus } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BMRCalculatorFormProps {
  initialProfile: UserProfile;
  onCalculate: (profile: UserProfile) => void;
  isLoading?: boolean;
}

export const BMRCalculatorForm: React.FC<BMRCalculatorFormProps> = ({
  initialProfile,
  onCalculate,
  isLoading = false,
}) => {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // String state for smooth typing in number inputs
  const [ageStr, setAgeStr] = useState<string>(() => initialProfile.age.toString());
  const [weightKgStr, setWeightKgStr] = useState<string>(() => initialProfile.weightKg.toString());
  const [weightLbsStr, setWeightLbsStr] = useState<string>(() => kgToLbs(initialProfile.weightKg).toString());
  const [heightCmStr, setHeightCmStr] = useState<string>(() => initialProfile.heightCm.toString());
  const [feetStr, setFeetStr] = useState<string>(() => cmToFtIn(initialProfile.heightCm).feet.toString());
  const [inchesStr, setInchesStr] = useState<string>(() => cmToFtIn(initialProfile.heightCm).inches.toString());
  const [bodyFatStr, setBodyFatStr] = useState<string>(() => (initialProfile.bodyFatPercent || 15).toString());

  // Keep string states in sync if initialProfile changes
  useEffect(() => {
    setProfile(initialProfile);
    setAgeStr(initialProfile.age.toString());
    setWeightKgStr(initialProfile.weightKg.toString());
    setWeightLbsStr(kgToLbs(initialProfile.weightKg).toString());
    setHeightCmStr(initialProfile.heightCm.toString());
    const { feet: f, inches: i } = cmToFtIn(initialProfile.heightCm);
    setFeetStr(f.toString());
    setInchesStr(i.toString());
  }, [initialProfile]);

  const handleGenderChange = (gender: Gender) => {
    setProfile(prev => ({ ...prev, gender }));
  };

  const handleHeightUnitToggle = (unit: HeightUnit) => {
    if (unit === 'ft_in' && profile.heightUnit === 'cm') {
      const cmVal = parseFloat(heightCmStr) || profile.heightCm;
      const { feet: f, inches: i } = cmToFtIn(cmVal);
      setFeetStr(f.toString());
      setInchesStr(i.toString());
    } else if (unit === 'cm' && profile.heightUnit === 'ft_in') {
      const f = parseFloat(feetStr) || 5;
      const i = parseFloat(inchesStr) || 0;
      const cm = ftInToCm(f, i);
      setHeightCmStr(cm.toString());
      setProfile(prev => ({ ...prev, heightCm: cm }));
    }
    setProfile(prev => ({ ...prev, heightUnit: unit }));
  };

  const handleWeightUnitToggle = (unit: WeightUnit) => {
    if (unit === 'lbs' && profile.weightUnit === 'kg') {
      const kgVal = parseFloat(weightKgStr) || profile.weightKg;
      const lbs = kgToLbs(kgVal);
      setWeightLbsStr(lbs.toString());
    } else if (unit === 'kg' && profile.weightUnit === 'lbs') {
      const lbsVal = parseFloat(weightLbsStr) || kgToLbs(profile.weightKg);
      const kg = lbsToKg(lbsVal);
      setWeightKgStr(kg.toString());
      setProfile(prev => ({ ...prev, weightKg: kg }));
    }
    setProfile(prev => ({ ...prev, weightUnit: unit }));
  };

  // Age changes (minute decimal precision supported)
  const handleAgeChange = (val: string) => {
    setAgeStr(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      setProfile(prev => ({ ...prev, age: num }));
    }
  };

  const stepAge = (delta: number) => {
    const current = parseFloat(ageStr) || profile.age;
    const next = Math.max(1, Math.min(120, Math.round((current + delta) * 10) / 10));
    setAgeStr(next.toString());
    setProfile(prev => ({ ...prev, age: next }));
  };

  // Weight changes (minute decimal precision supported)
  const handleWeightKgInput = (val: string) => {
    setWeightKgStr(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      setProfile(prev => ({ ...prev, weightKg: num }));
      setWeightLbsStr(kgToLbs(num).toString());
    }
  };

  const stepWeightKg = (delta: number) => {
    const current = parseFloat(weightKgStr) || profile.weightKg;
    const next = Math.max(15, Math.min(350, Math.round((current + delta) * 100) / 100));
    setWeightKgStr(next.toString());
    setProfile(prev => ({ ...prev, weightKg: next }));
    setWeightLbsStr(kgToLbs(next).toString());
  };

  const handleWeightLbsInput = (val: string) => {
    setWeightLbsStr(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      const kg = lbsToKg(num);
      setProfile(prev => ({ ...prev, weightKg: kg }));
      setWeightKgStr(kg.toString());
    }
  };

  const stepWeightLbs = (delta: number) => {
    const current = parseFloat(weightLbsStr) || kgToLbs(profile.weightKg);
    const next = Math.max(30, Math.min(770, Math.round((current + delta) * 100) / 100));
    setWeightLbsStr(next.toString());
    const kg = lbsToKg(next);
    setWeightKgStr(kg.toString());
    setProfile(prev => ({ ...prev, weightKg: kg }));
  };

  // Height changes (minute decimal precision supported)
  const handleHeightCmInput = (val: string) => {
    setHeightCmStr(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      setProfile(prev => ({ ...prev, heightCm: num }));
      const { feet: f, inches: i } = cmToFtIn(num);
      setFeetStr(f.toString());
      setInchesStr(i.toString());
    }
  };

  const stepHeightCm = (delta: number) => {
    const current = parseFloat(heightCmStr) || profile.heightCm;
    const next = Math.max(50, Math.min(270, Math.round((current + delta) * 100) / 100));
    setHeightCmStr(next.toString());
    setProfile(prev => ({ ...prev, heightCm: next }));
    const { feet: f, inches: i } = cmToFtIn(next);
    setFeetStr(f.toString());
    setInchesStr(i.toString());
  };

  const handleFtInInput = (fVal: string, iVal: string) => {
    setFeetStr(fVal);
    setInchesStr(iVal);
    const f = parseFloat(fVal) || 0;
    const i = parseFloat(iVal) || 0;
    const cm = ftInToCm(f, i);
    setHeightCmStr(cm.toString());
    setProfile(prev => ({ ...prev, heightCm: cm }));
  };

  const handleBodyFatInput = (val: string) => {
    setBodyFatStr(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      setProfile(prev => ({ ...prev, bodyFatPercent: num }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Final normalization with minute decimal retention
    const finalAge = parseFloat(ageStr) || profile.age;
    const finalWeightKg = profile.weightUnit === 'kg' 
      ? (parseFloat(weightKgStr) || profile.weightKg)
      : (lbsToKg(parseFloat(weightLbsStr) || 150));
    
    let finalHeightCm = profile.heightCm;
    if (profile.heightUnit === 'cm') {
      finalHeightCm = parseFloat(heightCmStr) || profile.heightCm;
    } else {
      const f = parseFloat(feetStr) || 5;
      const i = parseFloat(inchesStr) || 0;
      finalHeightCm = ftInToCm(f, i);
    }

    const finalProfile: UserProfile = {
      ...profile,
      age: Math.max(1, Math.min(120, finalAge)),
      weightKg: Math.max(15, Math.min(350, finalWeightKg)),
      heightCm: Math.max(50, Math.min(270, finalHeightCm)),
      bodyFatPercent: parseFloat(bodyFatStr) || profile.bodyFatPercent,
    };

    setProfile(finalProfile);

    // Trigger celebratory burst
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.75 },
      colors: ['#06b6d4', '#38bdf8', '#0284c7', '#10b981', '#f59e0b'],
    });

    onCalculate(finalProfile);
  };

  return (
    <form id="bmr-calc-form" onSubmit={handleSubmit} className="w-full bg-[#081226]/90 border border-cyan-500/30 rounded-2xl p-6 shadow-2xl backdrop-blur-xl glow-cyan-sm">
      {/* Header Banner */}
      <div className="flex items-center justify-between pb-5 border-b border-cyan-900/50 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-black shadow-lg shadow-cyan-500/30">
            <Calculator className="w-5 h-5 font-bold" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white font-display flex items-center gap-2">
              BIOMETRIC PARAMETERS
            </h2>
            <p className="text-xs text-slate-400">Enter your exact physiological measurements in the spaces below</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-[11px] font-mono text-cyan-300">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span>DIRECT INPUT MODE</span>
        </div>
      </div>

      <div className="space-y-6">
        {/* 1. Gender Selection */}
        <div>
          <label className="block text-xs font-mono tracking-wider uppercase text-slate-300 mb-2">
            1. Biological Sex
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              id="gender-male-btn"
              onClick={() => handleGenderChange('male')}
              className={`py-3 px-4 rounded-xl border font-semibold text-sm flex items-center justify-center gap-2.5 transition-all ${
                profile.gender === 'male'
                  ? 'bg-gradient-to-r from-cyan-500/30 to-blue-600/30 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-500/20 glow-cyan-sm'
                  : 'bg-slate-900/80 border-slate-700/80 text-slate-400 hover:border-slate-600 hover:text-white'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${profile.gender === 'male' ? 'bg-cyan-400' : 'bg-slate-600'}`} />
              <span>Male (♂)</span>
            </button>

            <button
              type="button"
              id="gender-female-btn"
              onClick={() => handleGenderChange('female')}
              className={`py-3 px-4 rounded-xl border font-semibold text-sm flex items-center justify-center gap-2.5 transition-all ${
                profile.gender === 'female'
                  ? 'bg-gradient-to-r from-rose-500/30 to-purple-600/30 border-rose-400 text-rose-200 shadow-md shadow-rose-500/20'
                  : 'bg-slate-900/80 border-slate-700/80 text-slate-400 hover:border-slate-600 hover:text-white'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${profile.gender === 'female' ? 'bg-rose-400' : 'bg-slate-600'}`} />
              <span>Female (♀)</span>
            </button>
          </div>
        </div>

        {/* 2. Age & Weight Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Age (Direct Number Space with Highlighted Light Box) */}
          <div className="bg-slate-950/70 border border-cyan-900/40 rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="age-input" className="text-xs font-mono text-slate-200 uppercase flex items-center gap-1.5 font-bold">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                2. Age
              </label>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
                Years
              </span>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <button
                type="button"
                onClick={() => stepAge(-1)}
                className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/50 flex items-center justify-center text-slate-300 hover:text-white transition-all active:scale-95 shrink-0"
                title="Decrease 1 year"
              >
                <Minus className="w-4 h-4" />
              </button>

              <div className="relative flex-1">
                <input
                  id="age-input"
                  type="number"
                  step="any"
                  min="1"
                  max="120"
                  value={ageStr}
                  onChange={(e) => handleAgeChange(e.target.value)}
                  placeholder="Enter your age"
                  aria-label="Enter your age"
                  className="w-full bg-cyan-50 text-slate-950 font-mono text-center font-black text-lg rounded-xl px-4 py-2.5 border-2 border-cyan-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-300/40 focus:outline-none transition-all placeholder:text-slate-500 placeholder:font-semibold placeholder:text-xs shadow-inner"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-slate-600 pointer-events-none">
                  yrs
                </span>
              </div>

              <button
                type="button"
                onClick={() => stepAge(1)}
                className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/50 flex items-center justify-center text-slate-300 hover:text-white transition-all active:scale-95 shrink-0"
                title="Increase 1 year"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[11px] font-mono text-cyan-300/90 mt-2 text-center font-medium">
              Enter your age in years
            </p>
          </div>

          {/* Weight (Direct Number Space with Highlighted Light Box) */}
          <div className="bg-slate-950/70 border border-cyan-900/40 rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="weight-input" className="text-xs font-mono text-slate-200 uppercase flex items-center gap-1.5 font-bold">
                <Scale className="w-3.5 h-3.5 text-cyan-400" />
                3. Body Weight
              </label>
              {/* Unit Toggle */}
              <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-700">
                <button
                  type="button"
                  onClick={() => handleWeightUnitToggle('kg')}
                  className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                    profile.weightUnit === 'kg' ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  KG
                </button>
                <button
                  type="button"
                  onClick={() => handleWeightUnitToggle('lbs')}
                  className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                    profile.weightUnit === 'lbs' ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  LBS
                </button>
              </div>
            </div>

            {profile.weightUnit === 'kg' ? (
              <div className="flex items-center gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => stepWeightKg(-1)}
                  className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/50 flex items-center justify-center text-slate-300 hover:text-white transition-all active:scale-95 shrink-0"
                  title="Decrease 1 kg"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <div className="relative flex-1">
                  <input
                    id="weight-input"
                    type="number"
                    step="any"
                    min="15"
                    max="350"
                    value={weightKgStr}
                    onChange={(e) => handleWeightKgInput(e.target.value)}
                    placeholder="Enter your body weight"
                    aria-label="Enter your body weight"
                    className="w-full bg-cyan-50 text-slate-950 font-mono text-center font-black text-lg rounded-xl px-4 py-2.5 border-2 border-cyan-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-300/40 focus:outline-none transition-all placeholder:text-slate-500 placeholder:font-semibold placeholder:text-xs shadow-inner"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-slate-600 pointer-events-none">
                    kg
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => stepWeightKg(1)}
                  className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/50 flex items-center justify-center text-slate-300 hover:text-white transition-all active:scale-95 shrink-0"
                  title="Increase 1 kg"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => stepWeightLbs(-1)}
                  className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/50 flex items-center justify-center text-slate-300 hover:text-white transition-all active:scale-95 shrink-0"
                  title="Decrease 1 lb"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <div className="relative flex-1">
                  <input
                    id="weight-input"
                    type="number"
                    step="any"
                    min="30"
                    max="770"
                    value={weightLbsStr}
                    onChange={(e) => handleWeightLbsInput(e.target.value)}
                    placeholder="Enter your body weight"
                    aria-label="Enter your body weight"
                    className="w-full bg-cyan-50 text-slate-950 font-mono text-center font-black text-lg rounded-xl px-4 py-2.5 border-2 border-cyan-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-300/40 focus:outline-none transition-all placeholder:text-slate-500 placeholder:font-semibold placeholder:text-xs shadow-inner"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-slate-600 pointer-events-none">
                    lbs
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => stepWeightLbs(1)}
                  className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/50 flex items-center justify-center text-slate-300 hover:text-white transition-all active:scale-95 shrink-0"
                  title="Increase 1 lb"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            )}
            <p className="text-[11px] font-mono text-cyan-300/90 mt-2 text-center font-medium">
              Enter your body weight ({profile.weightUnit.toUpperCase()})
            </p>
          </div>
        </div>

        {/* 3. Height (Direct Number Space with Highlighted Light Box) */}
        <div className="bg-slate-950/70 border border-cyan-900/40 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="height-input" className="text-xs font-mono text-slate-200 uppercase flex items-center gap-1.5 font-bold">
              <Ruler className="w-3.5 h-3.5 text-cyan-400" />
              4. Height
            </label>
            <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-700">
              <button
                type="button"
                onClick={() => handleHeightUnitToggle('cm')}
                className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                  profile.heightUnit === 'cm' ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                CM
              </button>
              <button
                type="button"
                onClick={() => handleHeightUnitToggle('ft_in')}
                className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                  profile.heightUnit === 'ft_in' ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                FT / IN
              </button>
            </div>
          </div>

          {profile.heightUnit === 'cm' ? (
            <div className="flex items-center gap-2 mt-1">
              <button
                type="button"
                onClick={() => stepHeightCm(-1)}
                className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/50 flex items-center justify-center text-slate-300 hover:text-white transition-all active:scale-95 shrink-0"
                title="Decrease 1 cm"
              >
                <Minus className="w-4 h-4" />
              </button>

              <div className="relative flex-1">
                <input
                  id="height-input"
                  type="number"
                  step="any"
                  min="50"
                  max="270"
                  value={heightCmStr}
                  onChange={(e) => handleHeightCmInput(e.target.value)}
                  placeholder="Enter your height"
                  aria-label="Enter your height"
                  className="w-full bg-cyan-50 text-slate-950 font-mono text-center font-black text-lg rounded-xl px-4 py-2.5 border-2 border-cyan-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-300/40 focus:outline-none transition-all placeholder:text-slate-500 placeholder:font-semibold placeholder:text-xs shadow-inner"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-slate-600 pointer-events-none">
                  cm
                </span>
              </div>

              <button
                type="button"
                onClick={() => stepHeightCm(1)}
                className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/50 flex items-center justify-center text-slate-300 hover:text-white transition-all active:scale-95 shrink-0"
                title="Increase 1 cm"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 mt-1">
              {/* Feet */}
              <div className="relative">
                <input
                  id="height-feet-input"
                  type="number"
                  step="any"
                  min="1"
                  max="8"
                  value={feetStr}
                  onChange={(e) => handleFtInInput(e.target.value, inchesStr)}
                  placeholder="Enter your height (ft)"
                  aria-label="Enter your height (feet)"
                  className="w-full bg-cyan-50 text-slate-950 font-mono text-center font-black text-lg rounded-xl px-4 py-2.5 border-2 border-cyan-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-300/40 focus:outline-none transition-all placeholder:text-slate-500 placeholder:font-semibold placeholder:text-xs shadow-inner"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-slate-600 pointer-events-none">
                  ft (′)
                </span>
              </div>

              {/* Inches */}
              <div className="relative">
                <input
                  id="height-inches-input"
                  type="number"
                  step="any"
                  min="0"
                  max="12"
                  value={inchesStr}
                  onChange={(e) => handleFtInInput(feetStr, e.target.value)}
                  placeholder="Enter your height (in)"
                  aria-label="Enter your height (inches)"
                  className="w-full bg-cyan-50 text-slate-950 font-mono text-center font-black text-lg rounded-xl px-4 py-2.5 border-2 border-cyan-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-300/40 focus:outline-none transition-all placeholder:text-slate-500 placeholder:font-semibold placeholder:text-xs shadow-inner"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-slate-600 pointer-events-none">
                  in (″)
                </span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-2">
            <p className="text-[11px] font-mono text-cyan-300/90 font-medium">
              Enter your height ({profile.heightUnit === 'cm' ? 'Centimeters' : 'Feet & Inches'})
            </p>
            <div className="text-[11px] font-mono text-slate-400">
              Converted: {profile.heightUnit === 'cm' 
                ? `${cmToFtIn(profile.heightCm).feet}′ ${cmToFtIn(profile.heightCm).inches}″`
                : `${profile.heightCm} cm`}
            </div>
          </div>
        </div>

        {/* 4. Activity Level Selector */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-mono tracking-wider uppercase text-slate-300 flex items-center gap-1.5 font-bold">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              5. Daily Activity Level (TDEE Factor)
            </label>
          </div>

          <div className="space-y-2">
            {(Object.entries(ACTIVITY_LABELS) as [ActivityLevel, { label: string; multiplier: string; desc: string }][]).map(([key, info]) => {
              const isSelected = profile.activityLevel === key;
              return (
                <button
                  key={key}
                  type="button"
                  id={`activity-${key}-btn`}
                  onClick={() => setProfile(prev => ({ ...prev, activityLevel: key }))}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-md shadow-cyan-500/20'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-cyan-400 bg-cyan-500/30' : 'border-slate-600'
                    }`}>
                      {isSelected && <span className="w-2 h-2 rounded-full bg-cyan-400" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold font-mono text-slate-100 flex items-center gap-2">
                        <span>{info.label}</span>
                        <span className="text-[10px] text-cyan-400 font-normal">×{info.multiplier}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 leading-tight mt-0.5">{info.desc}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. Primary Fitness Target Goal */}
        <div>
          <label className="block text-xs font-mono tracking-wider uppercase text-slate-300 mb-2 font-bold">
            6. Primary Caloric Objective
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              type="button"
              id="goal-deficit-btn"
              onClick={() => setProfile(prev => ({ ...prev, goal: 'deficit_moderate' }))}
              className={`p-3 rounded-xl border text-center transition-all ${
                profile.goal.startsWith('deficit')
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 glow-cyan-sm'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="text-xs font-bold font-mono">FAT LOSS (CUT)</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Calorie Deficit (-500)</div>
            </button>

            <button
              type="button"
              id="goal-maintain-btn"
              onClick={() => setProfile(prev => ({ ...prev, goal: 'maintain' }))}
              className={`p-3 rounded-xl border text-center transition-all ${
                profile.goal === 'maintain'
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 glow-emerald'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="text-xs font-bold font-mono">MAINTENANCE</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Equilibrium TDEE (0)</div>
            </button>

            <button
              type="button"
              id="goal-surplus-btn"
              onClick={() => setProfile(prev => ({ ...prev, goal: 'surplus_lean' }))}
              className={`p-3 rounded-xl border text-center transition-all ${
                profile.goal.startsWith('surplus')
                  ? 'bg-amber-500/20 border-amber-400 text-amber-200 glow-amber'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="text-xs font-bold font-mono">MUSCLE GAIN (BULK)</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Calorie Surplus (+250)</div>
            </button>
          </div>
        </div>

        {/* CALCULATE BUTTON */}
        <button
          type="submit"
          id="calculate-bmr-btn"
          disabled={isLoading}
          className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-black text-base uppercase tracking-wider font-display shadow-xl shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all flex items-center justify-center gap-3 active:scale-[0.99] cursor-pointer"
        >
          <Calculator className="w-5 h-5 stroke-[2.5]" />
          <span>CALCULATE BMR & TDEE CALORIES</span>
          <Flame className="w-5 h-5 fill-slate-950" />
        </button>
      </div>
    </form>
  );
};
