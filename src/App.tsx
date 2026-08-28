import React, { useState, useEffect } from 'react';
import { UserProfile, CalculationResults, MuscleGroup, FitnessGoal } from './types';
import { evaluateUserProfile } from './utils/calculator';
import { BodyHologram3D } from './components/BodyHologram3D';
import { BMRCalculatorForm } from './components/BMRCalculatorForm';
import { ResultsDashboard } from './components/ResultsDashboard';
import { GymWorkoutsSection } from './components/GymWorkoutsSection';
import { DietGuideSection } from './components/DietGuideSection';
import { AICoachModal } from './components/AICoachModal';
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
  Layers
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
    <div className="min-h-screen bg-[#040814] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      {/* Top Cybernetic Nav Header */}
      <header className="sticky top-0 z-40 border-b border-cyan-900/50 bg-[#040814]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-black border border-cyan-400/40 p-1 flex items-center justify-center shadow-lg shadow-cyan-500/25 overflow-hidden group">
              <img 
                src="/ayuva_logo.jpg" 
                alt="Ayuva Health Assistant Logo" 
                className="w-full h-full object-contain rounded-lg group-hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black tracking-tight text-white font-display">AYUVA HEALTH ASSISTANT</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 border border-cyan-500/40 text-cyan-300">
                  AI COACH PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Basal Metabolic Rate, Maintenance TDEE, Caloric Targets &amp; 3D Training</p>
            </div>
          </div>

          {/* Navigation Pill Tabs */}
          <nav className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('calculator')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'calculator'
                  ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Calculator & Bio-Scan</span>
              <span className="md:hidden">BMR</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('workouts')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'workouts'
                  ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Dumbbell className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Gym Workouts</span>
              <span className="md:hidden">Gym</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('diet')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'diet'
                  ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Utensils className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Diet Blueprint</span>
              <span className="md:hidden">Diet</span>
            </button>
          </nav>

          {/* AI Coach Ayuva Action Button */}
          <button
            type="button"
            id="top-coach-ayuva-btn"
            onClick={() => setIsCoachOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-black text-xs font-mono transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/25 active:scale-95 border border-cyan-300/40 cursor-pointer"
            title="Open Coach Ayuva: Private & Encrypted AI Nutrition & Workout Coaching"
          >
            <Bot className="w-4 h-4 text-black" />
            <span className="tracking-wide">COACH AYUVA</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse hidden sm:inline-block" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* TAB 1: CALCULATOR & 3D BIO-SCAN LAYER */}
        {activeTab === 'calculator' && (
          <div className="space-y-8 animate-in fade-in">
            {/* Top Grid: Form on Left + 3D Hologram Bio-Scanner on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Form (7 Cols) */}
              <div id="bmr-form-container" className="lg:col-span-6 xl:col-span-6 space-y-6">
                <BMRCalculatorForm
                  initialProfile={profile}
                  onCalculate={handleCalculate}
                />
              </div>

              {/* Right Column: 3D Holographic Bio-Digital Scanner (6 Cols) */}
              <div className="lg:col-span-6 xl:col-span-6 space-y-4">
                <BodyHologram3D
                  bmr={results.bmr}
                  tdee={results.tdee}
                  targetCalories={results.targetCalories}
                  goalLabel={results.targetGoalLabel}
                  selectedMuscle={selectedMuscle}
                  onSelectMuscle={handleSelectMuscle}
                  hasCalculated={hasCalculated}
                />

                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-cyan-900/40 text-xs text-slate-400 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Click any muscle group on the 3D figure to filter targeted gym exercises.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('workouts')}
                    className="text-cyan-400 font-mono font-bold hover:text-cyan-300 ml-2 whitespace-nowrap"
                  >
                    View All Gym Exercises →
                  </button>
                </div>
              </div>
            </div>

            {/* Results Flow: ONLY displayed after pressing 'CALCULATE BMR & TDEE CALORIES' */}
            {!hasCalculated ? (
              <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-br from-[#061126]/90 via-[#07142d]/80 to-[#030917]/95 border border-cyan-500/30 text-center space-y-5 shadow-2xl relative overflow-hidden animate-in fade-in">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(6,182,212,0.09),transparent_70%)] pointer-events-none" />
                
                <div className="w-16 h-16 rounded-2xl bg-cyan-950/90 border border-cyan-500/50 text-cyan-400 mx-auto flex items-center justify-center shadow-lg shadow-cyan-500/20">
                  <Flame className="w-8 h-8 animate-pulse text-cyan-400" />
                </div>

                <div className="space-y-2 max-w-xl mx-auto">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>AWAITING INPUT • CALCULATION ENGINE ARMED</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
                    Press &quot;CALCULATE BMR & TDEE CALORIES&quot; Above
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Once you click calculate, the complete metabolic architecture will unlock below — including your Basal Metabolic Rate, Maintenance TDEE, Deficit &amp; Surplus Tiers, Macronutrient splits, and personalized training schedule.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs font-mono text-slate-400">
                  <span className="px-3 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-cyan-300">⚡ Clinical BMR &amp; TDEE</span>
                  <span className="px-3 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-cyan-300">🎯 Fat Loss &amp; Bulking Tiers</span>
                  <span className="px-3 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-cyan-300">🥗 Macro Blueprint</span>
                  <span className="px-3 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-cyan-300">🏋️ 3D Workout Integration</span>
                </div>
              </div>
            ) : (
              <ResultsDashboard
                results={results}
                profile={profile}
                onGoalChange={handleGoalChange}
                onOpenCoach={() => setIsCoachOpen(true)}
                onScrollToForm={handleScrollToForm}
              />
            )}
          </div>
        )}

        {/* TAB 2: GYM WORKOUTS & TRAINING */}
        {activeTab === 'workouts' && (
          <div className="animate-in fade-in">
            <GymWorkoutsSection
              selectedMuscle={selectedMuscle}
              onClearMuscleFilter={() => setSelectedMuscle(null)}
            />
          </div>
        )}

        {/* TAB 3: DIET BLUEPRINT & NUTRITION */}
        {activeTab === 'diet' && (
          <div className="animate-in fade-in">
            <DietGuideSection
              results={results}
              profile={profile}
              currentGoal={
                profile.goal.startsWith('deficit') 
                  ? 'deficit' 
                  : profile.goal.startsWith('surplus') 
                  ? 'surplus' 
                  : 'maintenance'
              }
              onGoalChange={handleGoalChange}
              onNavigateToCalculator={() => setActiveTab('calculator')}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-cyan-950/80 bg-[#02050c] py-6 text-center text-xs text-slate-400 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <img 
              src="/ayuva_logo.jpg" 
              alt="Ayuva Logo" 
              className="w-5 h-5 rounded object-contain border border-cyan-500/30"
              referrerPolicy="no-referrer"
            />
            <span>© {new Date().getFullYear()} Ayuva Health Assistant • All Rights Reserved. Clinical Precision Metabolic Engine.</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-cyan-400/80">
            <span>3D Biometric Overlay • Coach Ayuva Sports Nutrition • Safe Caloric Science</span>
            <span className="hidden md:inline text-slate-700">|</span>
            <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-300 transition-colors underline decoration-cyan-500/40">Sitemap</a>
            <a href="/seo.json" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-300 transition-colors underline decoration-cyan-500/40">SEO Registry</a>
          </div>
        </div>
      </footer>

      {/* AI Fitness Coach Interactive Consultation Modal */}
      <AICoachModal
        isOpen={isCoachOpen}
        onClose={() => setIsCoachOpen(false)}
        profile={profile}
        results={results}
      />
    </div>
  );
}
