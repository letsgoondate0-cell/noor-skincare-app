import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  ShieldCheck,
  Camera
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { Button } from '../common/Button';
import { AiProductPhotoScanner } from '../shelf/AiProductPhotoScanner';
import { useNoor } from '../../context/NoorContext';
import {
  SkinType,
  SkinConcern,
  SensitivityLevel,
  SkincareGoal,
  Product
} from '../../types';
import { DEFAULT_CATALOG } from '../../data/defaultCatalog';

interface OnboardingFlowProps {
  onComplete: () => void;
}

const SKIN_TYPES: { type: SkinType; label: string; desc: string }[] = [
  { type: 'Combination', label: 'Combination', desc: 'Oily T-zone, normal to dry cheeks' },
  { type: 'Dry', label: 'Dry', desc: 'Feels tight, prone to flaking or dullness' },
  { type: 'Oily', label: 'Oily', desc: 'Excess shine throughout day, enlarged pores' },
  { type: 'Normal', label: 'Balanced / Normal', desc: 'Comfortable, neither dry nor greasy' },
  { type: 'Unsure', label: 'Unsure', desc: 'Varies with weather, stress, or cycle' }
];

const SKIN_CONCERNS: SkinConcern[] = [
  'Dryness',
  'Texture',
  'Redness',
  'Dullness',
  'Dark spots',
  'Acne',
  'Sensitivity',
  'Fine lines',
  'Oiliness',
  'Uneven tone'
];

const SENSITIVITIES: { level: SensitivityLevel; desc: string }[] = [
  { level: 'Not sensitive', desc: 'Rarely stings or reacts to new formulas' },
  { level: 'Sometimes sensitive', desc: 'Stings with certain acids, perfumes, or wind' },
  { level: 'Very sensitive', desc: 'Easily turns red, burns, or breaks out' },
  { level: 'Unsure', desc: 'Have not paid close attention yet' }
];

const SKIN_GOALS: SkincareGoal[] = [
  'Barrier repair',
  'Deep hydration',
  'Calm redness',
  'Restore natural glow',
  'Smooth skin texture',
  'Fade hyperpigmentation',
  'Clear blemishes',
  'Gentle healthy aging'
];

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const { completeOnboarding, rebuildRoutineWithAI } = useNoor();

  const [step, setStep] = useState<number>(0);
  const [name, setName] = useState('Elena Vance');
  const [skinType, setSkinType] = useState<SkinType>('Combination');
  const [concerns, setConcerns] = useState<SkinConcern[]>(['Dryness', 'Texture', 'Dullness']);
  const [sensitivity, setSensitivity] = useState<SensitivityLevel>('Sometimes sensitive');
  const [goals, setGoals] = useState<SkincareGoal[]>(['Barrier repair', 'Deep hydration', 'Restore natural glow']);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([
    'prod-cleanse-1',
    'prod-toner-1',
    'prod-moist-1',
    'prod-spf-1'
  ]);
  const [routinePreference, setRoutinePreference] = useState<'Minimalist (2-3 steps)' | 'Balanced (4-5 steps)' | 'Comprehensive'>('Balanced (4-5 steps)');
  const [fragranceFree, setFragranceFree] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [customOnboardingProducts, setCustomOnboardingProducts] = useState<Product[]>([]);

  const totalSteps = 7;

  const toggleConcern = (concern: SkinConcern) => {
    setConcerns(prev =>
      prev.includes(concern) ? prev.filter(c => c !== concern) : [...prev, concern]
    );
  };

  const toggleGoal = (goal: SkincareGoal) => {
    setGoals(prev =>
      prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]
    );
  };

  const toggleProduct = (id: string) => {
    setSelectedProductIds(prev =>
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  const handleFinish = async () => {
    setIsGenerating(true);
    const chosenCatalogProducts = DEFAULT_CATALOG.filter(p => selectedProductIds.includes(p.id));
    const allChosen = [...customOnboardingProducts, ...chosenCatalogProducts];

    completeOnboarding(
      {
        name: name.trim() || 'Elena',
        skinType,
        concerns,
        sensitivity,
        goals,
        routinePreference,
        fragranceFreePreferred: fragranceFree,
        qualitativeStatus: 'Stable',
        qualitativeStatusReason: `Initial baseline set for ${skinType.toLowerCase()} skin profile prioritizing ${goals[0] || 'barrier defense'}.`
      },
      allChosen
    );

    await rebuildRoutineWithAI();
    setIsGenerating(false);
    onComplete();
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#0A0A0A] flex flex-col justify-between p-5 sm:p-10 max-w-2xl mx-auto selection:bg-black selection:text-white">
      {/* Header */}
      <div className="w-full flex items-center justify-between pb-6 pt-2 border-b border-neutral-200">
        <BrandLogo size="md" showSubtitle />
        <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-mono font-bold tracking-wider">
          <span>{step + 1}</span>
          <span className="text-neutral-300">/</span>
          <span>{totalSteps}</span>
        </div>
      </div>

      {/* Progress line */}
      <div className="w-full bg-neutral-200 h-0.5 my-4 overflow-hidden">
        <div
          className="bg-black h-full transition-all duration-200"
          style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
        />
      </div>

      {/* Body Content */}
      <div className="py-6 grow flex flex-col justify-center">
        {/* STEP 0: Welcome & Name */}
        {step === 0 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="text-[10px] font-bold tracking-[0.24em] uppercase text-neutral-500 font-mono block">
                WELCOME TO NOOR
              </span>
              <h2 className="text-3xl sm:text-4xl text-black mt-2 font-bold leading-tight">
                Your skin deserves a calm, intelligent companion.
              </h2>
              <p className="text-sm sm:text-base text-neutral-600 mt-2.5 leading-relaxed font-normal">
                NOOR helps you understand your skin, optimize what you already own, and gives you thoughtful guidance each day. Let’s start with what to call you.
              </p>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-500 font-mono mb-2">
                WHAT SHOULD NOOR CALL YOU?
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Elena"
                className="w-full bg-white border border-neutral-300 rounded-sm px-4 py-3 text-sm sm:text-base text-black focus:outline-none focus:border-black shadow-2xs"
              />
            </div>

            <div className="p-4 rounded-sm bg-white border border-neutral-200 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-black shrink-0 stroke-[1.5]" />
              <p className="text-xs text-neutral-600 leading-relaxed font-normal">
                NOOR never sells your personal skin records. Your privacy and skin health always come before monetization.
              </p>
            </div>
          </div>
        )}

        {/* STEP 1: Skin Type */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="text-[10px] font-bold tracking-[0.24em] uppercase text-neutral-500 font-mono block">
                SKIN UNDERSTANDING
              </span>
              <h2 className="text-3xl sm:text-4xl text-black mt-2 font-bold leading-tight">
                How would you describe your skin?
              </h2>
              <p className="text-sm text-neutral-600 mt-2">
                Select what best describes your skin’s natural behavior by midday.
              </p>
            </div>

            <div className="space-y-2">
              {SKIN_TYPES.map(item => (
                <div
                  key={item.type}
                  onClick={() => setSkinType(item.type)}
                  className={`p-4 rounded-sm border transition-all cursor-pointer flex items-center justify-between ${
                    skinType === item.type
                      ? 'bg-white border-black shadow-xs ring-1 ring-black/5'
                      : 'bg-white border-neutral-200 hover:border-black'
                  }`}
                >
                  <div>
                    <h4 className="font-bold text-sm text-black">{item.label}</h4>
                    <p className="text-xs text-neutral-500 mt-0.5">{item.desc}</p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-xs border flex items-center justify-center shrink-0 ${
                      skinType === item.type
                        ? 'border-black bg-black text-white'
                        : 'border-neutral-300'
                    }`}
                  >
                    {skinType === item.type && <Check className="w-3 h-3 stroke-[2.5]" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Concerns */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="text-[10px] font-bold tracking-[0.24em] uppercase text-neutral-500 font-mono block">
                TARGET CONCERNS
              </span>
              <h2 className="text-3xl sm:text-4xl text-black mt-2 font-bold leading-tight">
                What does your skin face most often?
              </h2>
              <p className="text-sm text-neutral-600 mt-2">
                Select any concerns you’d like NOOR to support. (Multiple allowed)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {SKIN_CONCERNS.map(concern => {
                const isSelected = concerns.includes(concern);
                return (
                  <button
                    key={concern}
                    type="button"
                    onClick={() => toggleConcern(concern)}
                    className={`p-3.5 rounded-sm border text-left transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-black text-white border-black font-semibold'
                        : 'bg-white text-black border-neutral-200 hover:border-black'
                    }`}
                  >
                    <span className="text-sm">{concern}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[2.5]" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: Sensitivity */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="text-[10px] font-bold tracking-[0.24em] uppercase text-neutral-500 font-mono block">
                BARRIER REACTIVITY
              </span>
              <h2 className="text-3xl sm:text-4xl text-black mt-2 font-bold leading-tight">
                How sensitive is your barrier?
              </h2>
              <p className="text-sm text-neutral-600 mt-2">
                This prevents NOOR from recommending conflicting actives or harsh exfoliation.
              </p>
            </div>

            <div className="space-y-2">
              {SENSITIVITIES.map(item => (
                <div
                  key={item.level}
                  onClick={() => setSensitivity(item.level)}
                  className={`p-4 rounded-sm border transition-all cursor-pointer flex items-center justify-between ${
                    sensitivity === item.level
                      ? 'bg-white border-black shadow-xs ring-1 ring-black/5'
                      : 'bg-white border-neutral-200 hover:border-black'
                  }`}
                >
                  <div>
                    <h4 className="font-bold text-sm text-black">{item.level}</h4>
                    <p className="text-xs text-neutral-500 mt-0.5">{item.desc}</p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-xs border flex items-center justify-center shrink-0 ${
                      sensitivity === item.level
                        ? 'border-black bg-black text-white'
                        : 'border-neutral-300'
                    }`}
                  >
                    {sensitivity === item.level && <Check className="w-3 h-3 stroke-[2.5]" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: Goals */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="text-[10px] font-bold tracking-[0.24em] uppercase text-neutral-500 font-mono block">
                YOUR GOALS
              </span>
              <h2 className="text-3xl sm:text-4xl text-black mt-2 font-bold leading-tight">
                What does healthy skin look like to you?
              </h2>
              <p className="text-sm text-neutral-600 mt-2">
                Choose the outcomes that matter most to your skin journey.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SKIN_GOALS.map(goal => {
                const isSelected = goals.includes(goal);
                return (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => toggleGoal(goal)}
                    className={`p-3.5 rounded-sm border text-left transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-black text-white border-black font-semibold'
                        : 'bg-white text-black border-neutral-200 hover:border-black'
                    }`}
                  >
                    <span className="text-sm">{goal}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[2.5]" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 5: Products Owned */}
        {step === 5 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="text-[10px] font-bold tracking-[0.24em] uppercase text-neutral-500 font-mono block">
                USE WHAT YOU OWN
              </span>
              <h2 className="text-3xl sm:text-4xl text-black mt-2 font-bold leading-tight">
                What products do you already own?
              </h2>
              <p className="text-sm text-neutral-600 mt-2">
                NOOR optimizes what you own before ever recommending anything new.
              </p>
            </div>

            {/* Quick action: Add by Photo */}
            <div className="flex items-center justify-between p-3.5 bg-neutral-100 border border-neutral-300">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-black font-mono uppercase tracking-wider block">
                  AI Product Scanner
                </span>
                <span className="text-[11px] text-neutral-600 font-sans">
                  Photograph your bottle or packaging to detect actives automatically.
                </span>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsScannerOpen(true)}
                leftIcon={<Camera className="w-3.5 h-3.5 stroke-[1.5]" />}
              >
                Add by Photo
              </Button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {/* Custom Scanned Products first */}
              {customOnboardingProducts.map(prod => (
                <div
                  key={prod.id}
                  onClick={() => toggleProduct(prod.id)}
                  className="p-3 rounded-sm border border-black bg-white shadow-xs cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold text-black font-mono">
                        {prod.category}
                      </span>
                      <span className="text-[10px] text-neutral-500 font-mono">• {prod.brand}</span>
                      <span className="px-1.5 py-0.2 bg-black text-white text-[9px] font-mono uppercase">
                        AI Recognized
                      </span>
                    </div>
                    <h4 className="font-bold text-xs sm:text-sm text-black mt-0.5">
                      {prod.name}
                    </h4>
                  </div>
                  <div className="w-5 h-5 rounded-xs border border-black bg-black text-white flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[2.5]" />
                  </div>
                </div>
              ))}
              {DEFAULT_CATALOG.map(prod => {
                const isSelected = selectedProductIds.includes(prod.id);
                return (
                  <div
                    key={prod.id}
                    onClick={() => toggleProduct(prod.id)}
                    className={`p-3 rounded-sm border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-white border-black shadow-xs'
                        : 'bg-white border-neutral-200 hover:border-black'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold text-neutral-500 font-mono">
                          {prod.category}
                        </span>
                        <span className="text-[10px] text-neutral-400 font-mono">• {prod.brand}</span>
                      </div>
                      <h4 className="font-bold text-xs sm:text-sm text-black mt-0.5">
                        {prod.name}
                      </h4>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-xs border flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'border-black bg-black text-white'
                          : 'border-neutral-300'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[2.5]" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 6: Routine Rhythm */}
        {step === 6 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="text-[10px] font-bold tracking-[0.24em] uppercase text-neutral-500 font-mono block">
                ROUTINE RHYTHM
              </span>
              <h2 className="text-3xl sm:text-4xl text-black mt-2 font-bold leading-tight">
                How much time do you want to spend?
              </h2>
              <p className="text-sm text-neutral-600 mt-2">
                Sustainable consistency always beats overwhelming complexity.
              </p>
            </div>

            <div className="space-y-2">
              {[
                { title: 'Minimalist (2-3 steps)', desc: 'Cleanse, Hydrate, Protect. Fast and barrier-focused.' },
                { title: 'Balanced (4-5 steps)', desc: 'Cleanser, Toner/Essence, Target Treatment, Barrier Seal & SPF.' },
                { title: 'Comprehensive', desc: 'Full layered ritual with targeted treatments and essence cushions.' }
              ].map(opt => (
                <div
                  key={opt.title}
                  onClick={() => setRoutinePreference(opt.title as any)}
                  className={`p-4 rounded-sm border transition-all cursor-pointer flex items-center justify-between ${
                    routinePreference === opt.title
                      ? 'bg-white border-black shadow-xs'
                      : 'bg-white border-neutral-200 hover:border-black'
                  }`}
                >
                  <div>
                    <h4 className="font-bold text-sm text-black">{opt.title}</h4>
                    <p className="text-xs text-neutral-500 mt-0.5">{opt.desc}</p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-xs border flex items-center justify-center shrink-0 ${
                      routinePreference === opt.title
                        ? 'border-black bg-black text-white'
                        : 'border-neutral-300'
                    }`}
                  >
                    {routinePreference === opt.title && <Check className="w-3 h-3 stroke-[2.5]" />}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-between p-3.5 bg-white border border-neutral-200 rounded-sm">
              <div>
                <p className="text-xs font-bold text-black">PREFER FRAGRANCE-FREE FORMULAS?</p>
                <p className="text-[11px] text-neutral-500">Recommended to prevent barrier irritation</p>
              </div>
              <input
                type="checkbox"
                checked={fragranceFree}
                onChange={e => setFragranceFree(e.target.checked)}
                className="w-4 h-4 accent-black rounded cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="pt-6 border-t border-neutral-200 flex items-center justify-between">
        {step > 0 ? (
          <Button
            variant="ghost"
            onClick={() => setStep(prev => prev - 1)}
            leftIcon={<ArrowLeft className="w-4 h-4 stroke-[2]" />}
          >
            Back
          </Button>
        ) : (
          <div />
        )}

        {step < totalSteps - 1 ? (
          <Button
            variant="primary"
            onClick={() => setStep(prev => prev + 1)}
            rightIcon={<ArrowRight className="w-4 h-4 stroke-[2]" />}
          >
            Continue
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={handleFinish}
            isLoading={isGenerating}
            rightIcon={<Sparkles className="w-4 h-4 stroke-[2]" />}
          >
            Build My Personalized Ritual
          </Button>
        )}
      </div>

      <AiProductPhotoScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onProductAdded={(prod) => {
          setCustomOnboardingProducts(prev => [prod, ...prev]);
          setSelectedProductIds(prev => [prod.id, ...prev]);
        }}
      />
    </div>
  );
};
