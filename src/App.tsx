import React, { useState, useEffect } from 'react';
import { UserProfile, CalculationResults, MuscleGroup, FitnessGoal } from './types';
import { evaluateUserProfile } from './utils/calculator';
import { BodyHologram3D } from './components/BodyHologram3D';
import { BMRCalculatorForm } from './components/BMRCalculatorForm';
import { ResultsDashboard } from './components/ResultsDashboard';
import { GymWorkoutsSection } from './components/GymWorkoutsSection';
import { DietGuideSection } from './components/DietGuideSection';
import { AICoachModal } from './components/AICoachModal';
import { AyuvaLogo } from './components/AyuvaLogo';
import { 
  Calculator, 
  Dumbbell, 
  Utensils, 
  Bot, 
  Sparkles, 
  Activity, 
  Flame, 
  ShieldCheck,
  ChevronDown,
  Layers,
  MessageSquare
} from 'lucide-react';

const DEFAULT_PROFILE: UserProfile = {
  gender: 'male',
  age: 25,
  heightCm: 178,
  weightKg: 75,
  heightUnit: 'cm',
  weightUnit: 'kg',
  activityLevel: 'moderate',
  formula: 'mifflin',
  goal: 'deficit_moderate',
};

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('bmr_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // use default
      }
    }
    return DEFAULT_PROFILE;
  });

  const [results, setResults] = useState<CalculationResults>(() => evaluateUserProfile(DEFAULT_PROFILE));
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | null>(null);
  const [activeTab, setActiveTab] = useState<'calculator' | 'workouts' | 'diet'>('calculator');
  const [isCoachOpen, setIsCoachOpen] = useState(false);
  const [hasCalculated, setHasCalculated] = useState(false);

  // Re-evaluate whenever profile changes
  const handleCalculate = (newProfile: UserProfile) => {
    setProfile(newProfile);
    const newResults = evaluateUserProfile(newProfile);
    setResults(newResults);
    setHasCalculated(true);
    localStorage.setItem('bmr_user_profile', JSON.stringify(newProfile));

    // Smooth scroll down to results
    setTimeout(() => {
      const resultsElem = document.getElementById('results-dashboard');
      if (resultsElem) {
        resultsElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
  };

  const handleGoalChange = (newGoal: FitnessGoal) => {
    const updatedProfile = { ...profile, goal: newGoal };
    setProfile(updatedProfile);
    const newResults = evaluateUserProfile(updatedProfile);
    setResults(newResults);
    localStorage.setItem('bmr_user_profile', JSON.stringify(updatedProfile));
  };

  const handleSelectMuscle = (muscle: MuscleGroup) => {
    setSelectedMuscle(muscle);
    // Switch to workout view and scroll to exercises
    setActiveTab('workouts');
    setTimeout(() => {
      const workoutElem = document.getElementById('gym-workouts-section');
      if (workoutElem) {
        workoutElem.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleScrollToForm = () => {
    const formElem = document.getElementById('bmr-form-container');
    if (formElem) {
      formElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="min-h-screen bg-[#020612] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 1. Header Section */}
      <header className="sticky top-0 z-40 border-b border-cyan-900/50 bg-[#040814]/95 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <AyuvaLogo size="md" className="hover:scale-105 transition-transform" />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-sm sm:text-lg font-black tracking-tight text-white font-display truncate">
                  AYUVA HEALTH
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-mono bg-cyan-950 border border-cyan-500/40 text-cyan-300 shrink-0">
                  AI COACH PRO
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 hidden sm:block truncate">
                Basal Metabolic Rate, Maintenance TDEE, Caloric Targets &amp; 3D Training
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('calculator')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'calculator'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              Calculator &amp; Bio-Scan
            </button>
            <button
              onClick={() => setActiveTab('workouts')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'workouts'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Dumbbell className="w-3.5 h-3.5" />
              Gym Workouts
            </button>
            <button
              onClick={() => setActiveTab('diet')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'diet'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Utensils className="w-3.5 h-3.5" />
              Diet Blueprint
            </button>
          </nav>

          {/* AI Coach Action Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCoachOpen(true)}
              className="relative group px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white text-xs sm:text-sm font-bold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5 border border-cyan-300/30"
            >
              <Bot className="w-4 h-4 text-cyan-200 animate-bounce" />
              <span className="hidden sm:inline">CONSULT COACH AYUVA</span>
              <span className="sm:hidden">COACH</span>
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400"></span>
              </span>
            </button>
          </div>
        </div>

        {/* Mobile View Sub-Bar */}
        <div className="md:hidden border-t border-cyan-950/60 bg-slate-950/90 px-2 py-1.5 flex items-center justify-around gap-1">
          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-semibold text-center transition-all ${
              activeTab === 'calculator'
                ? 'bg-cyan-900/60 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Calculator
          </button>
          <button
            onClick={() => setActiveTab('workouts')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-semibold text-center transition-all ${
              activeTab === 'workouts'
                ? 'bg-cyan-900/60 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Workouts
          </button>
          <button
            onClick={() => setActiveTab('diet')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-semibold text-center transition-all ${
              activeTab === 'diet'
                ? 'bg-cyan-900/60 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Diet Plan
          </button>
        </div>
      </header>

      {/* 2. Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-10">
        {activeTab === 'calculator' && (
          <div className="space-y-12">
            {/* Top Grid: Bio-Form & 3D Interactive Scanner */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              {/* Left Column: Biometric Parameters Form */}
              <div id="bmr-form-container" className="lg:col-span-6 w-full">
                <BMRCalculatorForm
                  initialProfile={profile}
                  onCalculate={handleCalculate}
                  onOpenCoach={() => setIsCoachOpen(true)}
                />
              </div>

              {/* Right Column: 3D Hologram Bio-Scanner */}
              <div className="lg:col-span-6 w-full">
                <BodyHologram3D
                  profile={profile}
                  selectedMuscle={selectedMuscle}
                  onSelectMuscle={handleSelectMuscle}
                />
              </div>
            </div>

            {/* Results Dashboard */}
            <div id="results-dashboard">
              <ResultsDashboard
                results={results}
                profile={profile}
                onGoalChange={handleGoalChange}
                onOpenCoach={() => setIsCoachOpen(true)}
                onScrollToForm={handleScrollToForm}
              />
            </div>
          </div>
        )}

        {activeTab === 'workouts' && (
          <div id="gym-workouts-section">
            <GymWorkoutsSection
              selectedMuscle={selectedMuscle}
              onSelectMuscle={setSelectedMuscle}
              profile={profile}
              results={results}
              onOpenCoach={() => setIsCoachOpen(true)}
            />
          </div>
        )}

        {activeTab === 'diet' && (
          <div id="diet-blueprint-section">
            <DietGuideSection
              results={results}
              profile={profile}
              onOpenCoach={() => setIsCoachOpen(true)}
            />
          </div>
        )}
      </main>

      {/* 3. Footer */}
      <footer className="border-t border-slate-800/80 bg-[#020612] py-8 text-xs text-slate-500 mt-12 pb-24 sm:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AyuvaLogo size="sm" />
            <div>
              <p className="text-slate-300 font-bold font-display text-sm">Ayuva Health Systems</p>
              <p className="text-[11px] text-slate-500">Mifflin-St Jeor Engine &amp; Indian Macro Calibration Protocol</p>
            </div>
          </div>
          <div className="text-center sm:text-right text-[11px] text-slate-400">
            <p>Formulated for clinical accuracy &amp; sports bioenergetics.</p>
            <p className="text-cyan-400 font-mono mt-0.5">© 2026 Ayuva AI Health Assistant. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* 4. Mobile Fixed Bottom Quick Navigation */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#04091a]/95 backdrop-blur-xl border-t border-cyan-500/30 px-3 py-2 flex items-center justify-around shadow-2xl safe-area-pb">
        <button
          onClick={() => {
            setActiveTab('calculator');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors ${
            activeTab === 'calculator' ? 'text-cyan-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Calculator className="w-5 h-5" />
          <span className="text-[10px] font-mono">Calculator</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('workouts');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors ${
            activeTab === 'workouts' ? 'text-cyan-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Dumbbell className="w-5 h-5" />
          <span className="text-[10px] font-mono">Workouts</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('diet');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors ${
            activeTab === 'diet' ? 'text-cyan-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Utensils className="w-5 h-5" />
          <span className="text-[10px] font-mono">Diet Plan</span>
        </button>
        <button
          onClick={() => setIsCoachOpen(true)}
          className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-cyan-400 bg-cyan-950/60 border border-cyan-500/40 shadow-sm shadow-cyan-500/30"
        >
          <Bot className="w-4 h-4 animate-pulse" />
          <span className="text-[10px] font-mono font-bold">AI Coach</span>
        </button>
      </nav>

      {/* 5. AI Coach Modal */}
      <AICoachModal
        isOpen={isCoachOpen}
        onClose={() => setIsCoachOpen(false)}
        profile={profile}
        results={results}
        selectedMuscle={selectedMuscle}
      />
    </div>
  );
}
