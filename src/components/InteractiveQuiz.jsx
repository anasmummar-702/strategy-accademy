import React, { useState } from 'react';
import { Sparkles, ArrowRight, RotateCcw, Check, Zap } from 'lucide-react';

export default function InteractiveQuiz({ onSelectProgram, onOpenShop }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    ageGroup: '',
    experience: '',
    goal: ''
  });

  const questions = [
    {
      title: "Who will be skating?",
      options: [
        { label: "Child (Age 4-8)", value: "kids-young", icon: "🧒" },
        { label: "Junior (Age 9-15)", value: "kids-teen", icon: "👦" },
        { label: "Adult (Age 16+)", value: "adult", icon: "🧑" }
      ]
    },
    {
      title: "What is your skating experience?",
      options: [
        { label: "First Time / Complete Beginner", value: "beginner", icon: "🌱" },
        { label: "Can Balance & Glide Forward", value: "intermediate", icon: "⚡" },
        { label: "Advanced / Seeking Speed & Tricks", value: "advanced", icon: "🔥" }
      ]
    },
    {
      title: "What is your primary goal?",
      options: [
        { label: "Fun, Fitness & Confidence", value: "fitness", icon: "💪" },
        { label: "Master Slalom & Speed", value: "speed", icon: "🏆" },
        { label: "Casual Urban & Park Gliding", value: "urban", icon: "🛹" }
      ]
    }
  ];

  const handleOptionSelect = (value) => {
    const keys = ['ageGroup', 'experience', 'goal'];
    const currentKey = keys[step];
    setAnswers({ ...answers, [currentKey]: value });
    setStep(step + 1);
  };

  const resetQuiz = () => {
    setStep(0);
    setAnswers({ ageGroup: '', experience: '', goal: '' });
  };

  // Recommendation engine logic
  const getRecommendation = () => {
    if (answers.ageGroup === 'kids-young' || answers.ageGroup === 'kids-teen') {
      if (answers.experience === 'beginner') {
        return {
          title: "Little Gliders (Kids Beginner)",
          category: "Kids (Beginners / Intermediate)",
          badge: "Best Match for Kids",
          desc: "Build rock-solid balance & fall safety with fun games and gentle guidance.",
          skateRec: "Junior Glide Adjustable Skates",
          skatePrice: "$89.99"
        };
      }
      return {
        title: "Junior Strikers (Kids Intermediate)",
        category: "Kids (Intermediate)",
        badge: "Skill Booster",
        desc: "Master crossover turns, backward movement, and speed agility.",
        skateRec: "Neon Vibes Quad Roller Skates",
        skatePrice: "$189.99"
      };
    } else {
      if (answers.goal === 'speed' || answers.experience === 'advanced') {
        return {
          title: "Pro Speed Skating Academy",
          category: "Advanced / Competitive Coaching",
          badge: "High Performance",
          desc: "Explosive sprint mechanics, marathon stamina, and 110mm inline optimization.",
          skateRec: "Volo Speed Carbon 110 Inline Skates",
          skatePrice: "$349.99"
        };
      }
      return {
        title: "Urban Roller & Cardio Fitness",
        category: "Adults & Fitness",
        badge: "Adult Favorite",
        desc: "Low-impact high-calorie cardio workout with supportive adult community.",
        skateRec: "Strategy Urban Freestyle 80 Inline",
        skatePrice: "$229.99"
      };
    }
  };

  const rec = step >= questions.length ? getRecommendation() : null;

  return (
    <div className="glass-panel p-6 md:p-8 rounded-3xl border border-cyan-500/30 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

      {step < questions.length ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="badge badge-cyan flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" /> 30-Second Matcher
            </span>
            <span className="text-xs text-cyan-400 font-bold">Step {step + 1} of {questions.length}</span>
          </div>

          <h3 className="text-xl md:text-2xl font-extrabold font-['Outfit'] text-white mb-4">
            {questions[step].title}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {questions[step].options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleOptionSelect(opt.value)}
                className="p-4 rounded-2xl bg-white/5 hover:bg-cyan-500/15 border border-white/10 hover:border-cyan-400/50 text-left transition-all duration-300 group flex items-center gap-3"
              >
                <span className="text-2xl">{opt.icon}</span>
                <span className="text-sm font-semibold text-white group-hover:text-cyan-300">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Result view */
        <div className="animate-fadeIn">
          <div className="flex items-center justify-between mb-3">
            <span className="badge badge-pink">{rec.badge}</span>
            <button onClick={resetQuiz} className="text-xs text-gray-400 hover:text-white flex items-center gap-1">
              <RotateCcw className="w-3.5 h-3.5" /> Retake Quiz
            </button>
          </div>

          <h3 className="text-2xl font-extrabold font-['Outfit'] text-white">
            We Recommend: <span className="text-cyan-400">{rec.title}</span>
          </h3>
          <p className="text-gray-300 text-sm mt-1 mb-4">{rec.desc}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                🎓
              </div>
              <div>
                <div className="text-[10px] text-gray-400 uppercase font-bold">RECOMMENDED PROGRAM</div>
                <div className="text-xs font-bold text-white">{rec.category}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 border-t md:border-t-0 md:border-l border-white/10 pt-3 md:pt-0 md:pl-4">
              <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold">
                🛼
              </div>
              <div>
                <div className="text-[10px] text-gray-400 uppercase font-bold">MATCHING PRO SKATE</div>
                <div className="text-xs font-bold text-white">{rec.skateRec} ({rec.skatePrice})</div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button onClick={onSelectProgram} className="btn-primary text-xs py-3">
              Book Trial for this Program
            </button>
            <button onClick={onOpenShop} className="btn-secondary text-xs py-3">
              View Gear in Pro Shop
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
