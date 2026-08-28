import React, { useState, useEffect } from 'react';
import { Exercise, MuscleGroup } from '../types';
import { EXERCISES_DATABASE, WORKOUT_SPLIT_PRESETS } from '../data/workouts';
import { 
  Dumbbell, 
  Flame, 
  Clock, 
  RotateCcw, 
  Play, 
  Pause, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  ChevronRight, 
  ShieldAlert, 
  Layers, 
  Filter,
  Search,
  Check,
  Zap,
  Target
} from 'lucide-react';

interface GymWorkoutsSectionProps {
  selectedMuscle?: MuscleGroup | null;
  onClearMuscleFilter?: () => void;
  onSelectMuscle?: (muscle: MuscleGroup) => void;
}

const MUSCLE_FILTER_OPTIONS: { id: MuscleGroup | 'all'; label: string; count?: number }[] = [
  { id: 'all', label: 'All Muscles' },
  { id: 'chest', label: 'Chest' },
  { id: 'back', label: 'Back' },
  { id: 'shoulders', label: 'Shoulders' },
  { id: 'biceps', label: 'Biceps' },
  { id: 'triceps', label: 'Triceps' },
  { id: 'quads', label: 'Quads' },
  { id: 'hamstrings', label: 'Hamstrings' },
  { id: 'glutes', label: 'Glutes' },
  { id: 'calves', label: 'Calves' },
  { id: 'core', label: 'Core / Abs' },
  { id: 'cardio', label: 'Cardio HIIT' },
];

export const GymWorkoutsSection: React.FC<GymWorkoutsSectionProps> = ({
  selectedMuscle,
  onClearMuscleFilter,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [internalMuscleFilter, setInternalMuscleFilter] = useState<MuscleGroup | 'all'>(selectedMuscle || 'all');
  const [activeSplitId, setActiveSplitId] = useState<string>('ppl');
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Gym Rest Timer State
  const [restSeconds, setRestSeconds] = useState<number>(60);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [timerRemaining, setTimerRemaining] = useState<number>(60);
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>({});

  // Sync prop changes
  useEffect(() => {
    if (selectedMuscle) {
      setInternalMuscleFilter(selectedMuscle);
      setSelectedDayIndex(null);
    } else {
      setInternalMuscleFilter('all');
    }
  }, [selectedMuscle]);

  useEffect(() => {
    let interval: any;
    if (timerRunning && timerRemaining > 0) {
      interval = setInterval(() => {
        setTimerRemaining(prev => prev - 1);
      }, 1000);
    } else if (timerRemaining === 0 && timerRunning) {
      setTimerRunning(false);
      // Play web audio chime beep
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.5);
      } catch (e) {
        // Audio fallback
      }
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerRemaining]);

  const startTimer = (seconds: number) => {
    setRestSeconds(seconds);
    setTimerRemaining(seconds);
    setTimerRunning(true);
  };

  const toggleExerciseComplete = (id: string) => {
    setCompletedExercises(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const selectedSplit = WORKOUT_SPLIT_PRESETS.find(s => s.id === activeSplitId) || WORKOUT_SPLIT_PRESETS[0];

  // Filter exercises with strict, accurate muscle group targeting
  let filteredExercises = EXERCISES_DATABASE;

  // 1. If a full routine day is selected (e.g., Push, Pull, Legs):
  if (selectedDayIndex !== null && selectedSplit.schedule[selectedDayIndex]) {
    const dayExerciseIds = selectedSplit.schedule[selectedDayIndex].exercises;
    filteredExercises = filteredExercises.filter(ex => dayExerciseIds.includes(ex.id));
  } else {
    // 2. Filter strictly by chosen muscle group (e.g., biceps only shows biceps workouts)
    const currentMuscle = internalMuscleFilter;
    if (currentMuscle !== 'all') {
      filteredExercises = filteredExercises.filter(
        ex => ex.primaryMuscle === currentMuscle
      );
    }

    // 3. Optional category filter (Push / Pull / Legs / Core) if user explicitly clicked one
    if (activeCategory !== 'All') {
      filteredExercises = filteredExercises.filter(ex => ex.category === activeCategory);
    }
  }

  // 4. Search query filter
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    filteredExercises = filteredExercises.filter(
      ex => 
        ex.name.toLowerCase().includes(q) ||
        ex.primaryMuscle.toLowerCase().includes(q) ||
        ex.equipment.toLowerCase().includes(q)
    );
  }

  const handleMuscleFilterChange = (muscleId: MuscleGroup | 'all') => {
    setInternalMuscleFilter(muscleId);
    setSelectedDayIndex(null);
    setActiveCategory('All');
    if (muscleId === 'all' && onClearMuscleFilter) {
      onClearMuscleFilter();
    }
  };

  const handleDaySelect = (dayIndex: number) => {
    if (selectedDayIndex === dayIndex) {
      setSelectedDayIndex(null); // toggle off
    } else {
      setSelectedDayIndex(dayIndex);
      setInternalMuscleFilter('all');
      if (onClearMuscleFilter) onClearMuscleFilter();
    }
  };

  return (
    <div id="gym-workouts-section" className="space-y-6">
      {/* Header & Quick Gym Rest Timer */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#09152b] via-[#071124] to-[#0a1b38] border border-cyan-500/40 shadow-xl backdrop-blur-md flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
            <Dumbbell className="w-4 h-4" /> SCIENTIFIC STRENGTH &amp; HYPERTROPHY ARCHITECTURE
          </div>
          <h2 className="text-2xl font-bold text-white font-display">
            Gym Workouts &amp; Muscle Targeting Library
          </h2>
          <p className="text-xs text-slate-300 max-w-xl mt-1">
            Precision compound and isolation movements engineered to stimulate muscle protein synthesis, optimize biomechanics, and accelerate metabolic burn.
          </p>
        </div>

        {/* Built-in Gym Rest Timer Widget */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-500/30 flex items-center gap-4 shadow-lg min-w-[280px]">
          <div className="relative flex items-center justify-center">
            <div className="w-14 h-14 rounded-full border-2 border-cyan-500/20 flex items-center justify-center font-mono text-lg font-bold text-cyan-300">
              {timerRemaining}s
            </div>
            {timerRunning && (
              <span className="absolute inset-0 rounded-full border-2 border-cyan-400 animate-ping opacity-25 pointer-events-none" />
            )}
          </div>

          <div className="flex-1">
            <div className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1">
              <Clock className="w-3 h-3 text-cyan-400" /> Rest Timer Between Sets
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              {[45, 60, 90, 120].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => startTimer(s)}
                  className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition-all ${
                    restSeconds === s && timerRunning ? 'bg-cyan-400 text-black' : 'bg-slate-900 border border-slate-700 text-slate-300 hover:text-white'
                  }`}
                >
                  {s}s
                </button>
              ))}
              <button
                type="button"
                onClick={() => setTimerRunning(!timerRunning)}
                className="p-1 rounded bg-cyan-500 text-black ml-auto hover:bg-cyan-400"
                title={timerRunning ? 'Pause' : 'Start'}
              >
                {timerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-black" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Workout Split Presets (PPL, Upper/Lower, Full Body) */}
      <div className="p-5 rounded-2xl bg-[#081224] border border-slate-800 shadow-lg">
        <div className="flex items-center gap-2 mb-3">
          <Layers className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
            Curated Gym Training Splits &amp; Daily Protocols
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          {WORKOUT_SPLIT_PRESETS.map((split) => {
            const isSelected = activeSplitId === split.id;
            return (
              <button
                key={split.id}
                type="button"
                onClick={() => {
                  setActiveSplitId(split.id);
                  setSelectedDayIndex(null);
                }}
                className={`p-4 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-cyan-500/20 border-cyan-400 glow-cyan-sm shadow-md'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold font-display text-white">{split.name}</span>
                  <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800 font-bold">
                    {split.daysPerWeek}
                  </span>
                </div>
                <div className="text-[11px] text-cyan-400 font-mono mb-1">{split.idealFor}</div>
                <p className="text-[11px] text-slate-400 line-clamp-2">{split.description}</p>
              </button>
            );
          })}
        </div>

        {/* Selected Split Weekly Schedule with Interactive Day Cards */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-900/40">
          <div className="text-xs font-mono text-slate-300 mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-cyan-400 font-bold">{selectedSplit.name} Routine Schedule:</span>
            <span className="text-slate-400 text-[11px]">
              {selectedDayIndex !== null 
                ? `Active Day Filter: ${selectedSplit.schedule[selectedDayIndex].day} (Click again to clear)` 
                : 'Click any day to load exercises into view'}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {selectedSplit.schedule.map((day, idx) => {
              const isDayActive = selectedDayIndex === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleDaySelect(idx)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    isDayActive 
                      ? 'bg-cyan-500/30 border-cyan-400 ring-2 ring-cyan-400/40 shadow-lg' 
                      : 'bg-slate-900/80 border-slate-800 hover:border-cyan-500/50 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className={`font-mono font-bold text-xs ${isDayActive ? 'text-white' : 'text-cyan-300'}`}>
                      {day.day}
                    </div>
                    {isDayActive && (
                      <span className="px-1.5 py-0.5 rounded bg-cyan-400 text-black text-[9px] font-bold font-mono">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <div className="text-slate-200 text-xs font-medium mb-1.5 leading-snug">{day.focus}</div>
                  <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between">
                    <span>{day.exercises.length} Exercises</span>
                    <span className="text-cyan-400 hover:underline">View →</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Target Muscle Group Filter Bar */}
      <div className="p-4 rounded-2xl bg-[#081226] border border-cyan-500/30 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Filter By Target Muscle Group:
            </span>
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search exercise, barbell, squat..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Muscle Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {MUSCLE_FILTER_OPTIONS.map((opt) => {
            const isSelected = internalMuscleFilter === opt.id && selectedDayIndex === null;
            const count = opt.id === 'all' 
              ? EXERCISES_DATABASE.length 
              : EXERCISES_DATABASE.filter(e => e.primaryMuscle === opt.id).length;

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleMuscleFilterChange(opt.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-cyan-500 text-black border-cyan-400 shadow-md shadow-cyan-500/30 scale-105'
                    : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/40'
                }`}
              >
                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                <span>{opt.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected ? 'bg-black/30 text-black font-extrabold' : 'bg-slate-800 text-slate-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Category Filter Pills (Push / Pull / Legs / Core) */}
        <div className="flex items-center gap-2 pt-1 overflow-x-auto no-scrollbar border-t border-slate-800/80">
          <span className="text-[10px] font-mono text-slate-400 uppercase mr-1">Movement Arc:</span>
          {['All', 'Push', 'Pull', 'Legs', 'Core & Cardio'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setActiveCategory(cat);
                setSelectedDayIndex(null);
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold transition-all border ${
                activeCategory === cat && selectedDayIndex === null
                  ? 'bg-cyan-950 border-cyan-400 text-cyan-300 font-bold'
                  : 'bg-slate-950/60 border-slate-850 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Active Filter State Banner */}
      {(internalMuscleFilter !== 'all' || selectedDayIndex !== null || searchQuery) && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-cyan-950/80 border border-cyan-400/50">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-300">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              {selectedDayIndex !== null ? (
                <>SHOWING ROUTINE: <strong className="text-white uppercase">{selectedSplit.schedule[selectedDayIndex].day} - {selectedSplit.schedule[selectedDayIndex].focus}</strong></>
              ) : (
                <>
                  SHOWING <strong className="text-white">{filteredExercises.length}</strong> EXCLUSIVE{' '}
                  <strong className="text-cyan-300 uppercase">
                    {internalMuscleFilter !== 'all' ? `${internalMuscleFilter} WORKOUTS ONLY` : 'EXERCISES'}
                  </strong>
                  {searchQuery && <> (Matching &quot;{searchQuery}&quot;)</>}
                </>
              )}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setInternalMuscleFilter('all');
              setSelectedDayIndex(null);
              setSearchQuery('');
              setActiveCategory('All');
              if (onClearMuscleFilter) onClearMuscleFilter();
            }}
            className="px-2.5 py-1 rounded bg-cyan-500 text-black text-[11px] font-mono font-bold hover:bg-cyan-400 shrink-0 ml-2"
          >
            RESET ALL FILTERS
          </button>
        </div>
      )}

      {/* Exercises Count & Results Grid */}
      {filteredExercises.length === 0 ? (
        <div className="p-8 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 mx-auto flex items-center justify-center">
            <Dumbbell className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-white font-display">No Exercises Match Current Filter</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try choosing a different muscle group above or reset filters to explore the full training database.
          </p>
          <button
            type="button"
            onClick={() => {
              setInternalMuscleFilter('all');
              setSelectedDayIndex(null);
              setSearchQuery('');
              setActiveCategory('All');
            }}
            className="px-4 py-2 rounded-xl bg-cyan-500 text-black font-mono font-bold text-xs"
          >
            Show All Exercises
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredExercises.map((exercise) => {
            const isExpanded = expandedExerciseId === exercise.id;
            const isDone = completedExercises[exercise.id];
            const isPrimaryMatch = internalMuscleFilter !== 'all' && exercise.primaryMuscle === internalMuscleFilter;

            return (
              <div
                key={exercise.id}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isDone 
                    ? 'bg-emerald-950/20 border-emerald-500/40 opacity-80' 
                    : isPrimaryMatch
                    ? 'bg-[#091733]/90 border-cyan-500/50 shadow-md shadow-cyan-500/10'
                    : 'bg-[#081226]/90 border-slate-800 hover:border-cyan-500/40'
                }`}
              >
                {/* Main Card Header */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        onClick={() => toggleExerciseComplete(exercise.id)}
                        className="mt-0.5 text-slate-400 hover:text-emerald-400 transition-colors"
                        title={isDone ? 'Mark Incomplete' : 'Mark Completed'}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-600 hover:text-cyan-400" />
                        )}
                      </button>
                      <div>
                        <h4 className={`text-base font-bold font-display ${isDone ? 'line-through text-slate-400' : 'text-white'}`}>
                          {exercise.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 uppercase font-bold">
                            PRIMARY: {exercise.primaryMuscle}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {exercise.equipment}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                            {exercise.difficulty}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span className="text-xs font-mono text-cyan-400 bg-slate-900 px-2 py-1 rounded border border-slate-800 flex items-center gap-1 font-bold shrink-0">
                      <Flame className="w-3 h-3 text-amber-400" />
                      ~{exercise.burnRateKcalPerHour} <span className="text-[9px] text-slate-400">kcal/hr</span>
                    </span>
                  </div>

                  {/* Sets, Reps, Rest & Tempo Badges */}
                  <div className="grid grid-cols-4 gap-2 mt-4 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-center font-mono">
                    <div>
                      <div className="text-[9px] text-slate-400 uppercase">Sets</div>
                      <div className="text-xs font-bold text-white mt-0.5">{exercise.sets}</div>
                    </div>
                    <div>
                      <div className="text-[9px] text-slate-400 uppercase">Reps</div>
                      <div className="text-xs font-bold text-cyan-300 mt-0.5">{exercise.reps}</div>
                    </div>
                    <div>
                      <div className="text-[9px] text-slate-400 uppercase">Rest</div>
                      <div className="text-xs font-bold text-amber-300 mt-0.5">{exercise.rest}</div>
                    </div>
                    <div>
                      <div className="text-[9px] text-slate-400 uppercase">Tempo</div>
                      <div className="text-xs font-bold text-slate-300 mt-0.5">{exercise.tempo}</div>
                    </div>
                  </div>

                  {/* Secondary Muscle Recruitment */}
                  {exercise.secondaryMuscles.length > 0 && (
                    <div className="mt-3 text-[11px] font-mono text-slate-400 flex items-center gap-1.5 flex-wrap">
                      <span className="text-slate-500">Secondary Muscles:</span>
                      {exercise.secondaryMuscles.map((sec, sIdx) => (
                        <span key={sIdx} className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 text-[10px]">
                          {sec}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Form Coach Tip */}
                  <div className="mt-3 p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-500/20 text-xs text-slate-300 flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span><strong>Coach Cue:</strong> {exercise.coachTips}</span>
                  </div>

                  {/* Accordion Toggle */}
                  <button
                    type="button"
                    onClick={() => setExpandedExerciseId(isExpanded ? null : exercise.id)}
                    className="mt-3 w-full py-1.5 text-xs font-mono text-cyan-400 flex items-center justify-center gap-1 hover:text-cyan-300 border-t border-slate-850 pt-2"
                  >
                    <span>{isExpanded ? 'Hide Step-by-Step Cues' : 'View Biomechanical Execution Guide'}</span>
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </button>
                </div>

                {/* Expanded Detailed Steps */}
                {isExpanded && (
                  <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-2.5 animate-in fade-in">
                    <div className="text-[11px] font-mono uppercase text-slate-400 font-bold flex items-center gap-1">
                      <Zap className="w-3 h-3 text-cyan-400" />
                      Step-by-Step Biomechanical Execution:
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                      {exercise.formCues.map((cue, idx) => (
                        <li key={idx} className="leading-relaxed">{cue}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
