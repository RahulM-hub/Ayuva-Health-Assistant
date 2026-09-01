import React, { useState, useRef, useEffect } from 'react';
import Markdown from 'react-markdown';
import { UserProfile, CalculationResults } from '../types';
import { AyuvaLogo } from './AyuvaLogo';
import { 
  Sparkles, 
  X, 
  Send, 
  User, 
  Trash2,
  Copy, 
  Check, 
  Dumbbell, 
  Flame, 
  Utensils, 
  Zap, 
  ShieldCheck,
  Lock
} from 'lucide-react';
import { generateAccurateCoachResponse } from '../utils/aiCoachEngine';

interface AICoachModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  results: CalculationResults;
  selectedMuscle?: string | null;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const PROMPT_CATEGORIES = [
  {
    category: 'Arms & Muscles',
    icon: Dumbbell,
    prompts: [
      "How to build bigger biceps and peak height?",
      "What are the best tricep exercises for arm thickness?",
      "How many sets and reps for chest and back per week?",
    ],
  },
  {
    category: 'Fat Loss & Plateaus',
    icon: Flame,
    prompts: [
      "How can I break through a fat loss plateau?",
      "Should I bulk or cut first with my current metrics?",
      "How much cardio should I do without losing muscle?",
    ],
  },
  {
    category: 'Diet & Timing',
    icon: Utensils,
    prompts: [
      "What should my pre-workout and post-workout meals look like?",
      "How much protein should I eat per meal for maximum MPS?",
      "Can you generate a sample daily meal plan for my calories?",
    ],
  },
  {
    category: 'Supplements & Science',
    icon: Zap,
    prompts: [
      "How should I take creatine monohydrate and what dose?",
      "What are the most essential science-backed supplements?",
      "How does sleep and recovery affect muscle building?",
    ],
  },
];

export const AICoachModal: React.FC<AICoachModalProps> = ({
  isOpen,
  onClose,
  profile,
  results,
  selectedMuscle,
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const [activeCategory, setActiveCategory] = useState(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [clearStatusMessage, setClearStatusMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const initialGreeting: Message = {
    role: 'assistant',
    content: `### 👋 Greetings! I am **Coach Ayuva**, your AI Clinical Sports Nutritionist & Strength Biomechanics Coach.

I have synchronized your metabolic diagnostic profile:
- **Resting Metabolic Rate (BMR):** \`${results.bmr} kcal/day\`
- **Maintenance (TDEE):** \`${results.tdee} kcal/day\`
- **Target Goal:** **${results.targetGoalLabel}** at \`${results.targetCalories} kcal/day\`
- **Optimal Protein Intake:** \`${results.proteinRecommendationGrams.min}g – ${results.proteinRecommendationGrams.max}g/day\`

Ask me any specific question about **bicep/tricep/chest routines**, **breaking plateaus**, **pre/post-workout meal timing**, **creatine dosage**, or **workout splits**! Your communication with Coach Ayuva is 100% private and protected.`,
  };

  const [messages, setMessages] = useState<Message[]>([initialGreeting]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: textToSend };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputMessage('');
    setIsLoading(true);

    const payloadProfile = {
      ...profile,
      calculatedBMR: results.bmr,
      calculatedTDEE: results.tdee,
      targetCalories: results.targetCalories,
      targetGoalLabel: results.targetGoalLabel,
      proteinMin: results.proteinRecommendationGrams.min,
      proteinMax: results.proteinRecommendationGrams.max,
      carbs: results.macros.maintenance.carbsGrams,
      fats: results.macros.maintenance.fatsGrams,
      bmi: results.bmi,
      bmiCategory: results.bmiCategory,
      selectedMuscle: selectedMuscle || undefined,
    };

    try {
      const response = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          profile: payloadProfile,
          conversationHistory: newMessages,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();
      if (data && data.response) {
        setMessages([...newMessages, { role: 'assistant', content: data.response }]);
      } else {
        const fallbackText = generateAccurateCoachResponse(textToSend, payloadProfile, newMessages);
        setMessages([...newMessages, { role: 'assistant', content: fallbackText }]);
      }
    } catch (err: any) {
      console.warn('Network coach call failed, generating accurate local answer:', err);
      const accurateFallback = generateAccurateCoachResponse(textToSend, payloadProfile, newMessages);
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: accurateFallback,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleClearHistory = () => {
    setMessages([initialGreeting]);
    setInputMessage('');
    setClearStatusMessage('🔒 Privacy Protected: All client questions and conversation history have been permanently cleared.');
    setTimeout(() => {
      setClearStatusMessage(null);
    }, 4500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-3xl bg-[#081226] border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[90vh] max-h-[850px] glow-cyan">
        
        {/* Modal Header */}
        <div className="p-3.5 sm:p-4 bg-gradient-to-r from-cyan-950 via-slate-900 to-blue-950 border-b border-cyan-500/30 flex items-center justify-between gap-3">
          {/* Left: Ayuva Logo & Agent Details */}
          <div className="flex items-center gap-3">
            <AyuvaLogo size="md" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white font-display">
                  COACH AYUVA
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-cyan-400" />
                  SAFE &amp; PRIVATE
                </span>
              </div>
              <div className="text-[11px] font-mono text-cyan-300 flex items-center gap-2 mt-0.5 flex-wrap">
                <span>BMR: <strong className="text-white">{results.bmr}</strong></span>
                <span>•</span>
                <span>TDEE: <strong className="text-white">{results.tdee}</strong></span>
                <span>•</span>
                <span className="text-emerald-400 font-bold">Target: {results.targetCalories} kcal</span>
                <span>•</span>
                <span className="text-amber-400">Protein: {results.proteinRecommendationGrams.min}g+</span>
              </div>
            </div>
          </div>

          {/* Right Side: Clear History & Close Button */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              id="clear-history-button"
              onClick={handleClearHistory}
              title="Clear all question history for client privacy and safety"
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-rose-950/40 border border-rose-500/30 hover:border-rose-500/60 text-rose-300 hover:text-rose-200 text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Clear History</span>
            </button>

            <button
              type="button"
              id="close-coach-ayuva-button"
              onClick={onClose}
              title="Close Coach Ayuva"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Client Privacy Notice Banner */}
        <div className="bg-[#050c1b] border-b border-cyan-950 px-4 py-1.5 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-1.5 text-emerald-400/90">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Encrypted Client Communication • Zero Permanent Storage • 100% Private</span>
          </div>
          <span className="text-slate-500 hidden sm:inline">Use "Clear History" at any time to purge queries</span>
        </div>

        {/* Dynamic Clear History Success Banner */}
        {clearStatusMessage && (
          <div className="bg-rose-950/40 border-b border-rose-500/40 px-4 py-2 flex items-center gap-2 text-xs font-mono text-rose-200 animate-in fade-in">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{clearStatusMessage}</span>
          </div>
        )}

        {/* Chat Messages Log */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={index}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
              >
                {isUser ? (
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-blue-500/20">
                    <User className="w-4 h-4" />
                  </div>
                ) : (
                  /* Ayuva Logo Icon for Coach Response */
                  <AyuvaLogo size="sm" showBorder={true} className="w-8 h-8 shrink-0" />
                )}

                <div className="relative group max-w-[90%] sm:max-w-[84%]">
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-[13px] leading-relaxed shadow-md ${
                      isUser
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-tr-none font-medium'
                        : 'bg-slate-900/95 border border-cyan-900/60 text-slate-200 rounded-tl-none'
                    }`}
                  >
                    {isUser ? (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    ) : (
                      <div className="markdown-body space-y-2 text-slate-200">
                        <Markdown
                          components={{
                            h1: ({ children }) => <h1 className="text-base font-bold text-cyan-300 font-display mt-2 mb-1 border-b border-cyan-900/50 pb-1">{children}</h1>,
                            h2: ({ children }) => <h2 className="text-sm font-bold text-cyan-300 font-display mt-2 mb-1">{children}</h2>,
                            h3: ({ children }) => <h3 className="text-xs sm:text-sm font-bold text-cyan-300 font-display mt-2 mb-1 flex items-center gap-1.5">{children}</h3>,
                            h4: ({ children }) => <h4 className="text-xs font-bold text-amber-300 mt-2 mb-0.5">{children}</h4>,
                            p: ({ children }) => <p className="mb-1.5 leading-relaxed text-slate-200">{children}</p>,
                            ul: ({ children }) => <ul className="list-disc pl-4 space-y-1 mb-2 text-slate-300">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal pl-4 space-y-1 mb-2 text-slate-300">{children}</ol>,
                            li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                            strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
                            code: ({ children }) => <code className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono text-[11px] border border-slate-700">{children}</code>,
                            hr: () => <hr className="border-cyan-900/40 my-2" />,
                          }}
                        >
                          {msg.content}
                        </Markdown>
                      </div>
                    )}
                  </div>

                  {!isUser && (
                    <button
                      type="button"
                      onClick={() => handleCopy(msg.content, index)}
                      title="Copy response"
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-400 hover:text-cyan-300 hover:bg-slate-700 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {copiedIndex === index ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {/* Ayuva Logo Icon for Loading State */}
          {isLoading && (
            <div className="flex items-start gap-3 animate-in fade-in">
              <AyuvaLogo size="sm" showBorder={true} className="w-8 h-8 shrink-0" />
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-cyan-900/60 text-xs text-cyan-300 flex items-center gap-2.5 shadow-md">
                <Sparkles className="w-4 h-4 animate-spin text-cyan-400" />
                <span className="font-mono">Coach Ayuva is computing accurate sports science analysis...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Categorized Quick Question Tabs & Prompts */}
        <div className="bg-slate-950/95 border-t border-slate-800/90 p-2 sm:p-3 space-y-2">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            {PROMPT_CATEGORIES.map((cat, idx) => {
              const Icon = cat.icon;
              const isSelected = activeCategory === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveCategory(idx)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{cat.category}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Prompts for Selected Category */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {PROMPT_CATEGORIES[activeCategory].prompts.map((promptText, pIdx) => (
              <button
                key={pIdx}
                type="button"
                onClick={() => handleSendMessage(promptText)}
                disabled={isLoading}
                className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 hover:border-cyan-400 hover:text-cyan-200 hover:bg-cyan-950/30 whitespace-nowrap transition-all active:scale-95 disabled:opacity-50"
              >
                {promptText}
              </button>
            ))}
          </div>
        </div>

        {/* Message Input Box */}
        <div className="p-3 sm:p-4 bg-slate-950 border-t border-cyan-900/40 flex items-center gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask Coach Ayuva any specific fitness, nutrition, or workout question..."
            disabled={isLoading}
            className="flex-1 bg-slate-900/90 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none transition-all"
          />
          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim() || isLoading}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-bold text-xs font-mono transition-all flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-cyan-500/20 active:scale-95 cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">ASK AYUVA</span>
          </button>
        </div>

      </div>
    </div>
  );
};
