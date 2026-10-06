import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Sparkles, ShieldCheck, Check } from 'lucide-react';
import { useNoor } from '../../context/NoorContext';

interface BuildRoutineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BuildRoutineModal: React.FC<BuildRoutineModalProps> = ({ isOpen, onClose }) => {
  const { userProfile, rebuildRoutineWithAI, isRebuildingRoutine, shelfProducts } = useNoor();
  const [selectedGoal, setSelectedGoal] = useState<string>(userProfile.goals[0] || 'Deep hydration');
  const [customGoal, setCustomGoal] = useState('');

  const quickGoals = [
    'Deep hydration & moisture barrier lock',
    'Calm redness & reduce surface irritation',
    'Clear blemishes & decongest pores',
    'Smooth texture & refine rough tone',
    'Gentle healthy aging & collagen support'
  ];

  const handleBuild = async () => {
    const finalGoal = customGoal.trim() ? `${selectedGoal} — ${customGoal.trim()}` : selectedGoal;
    await rebuildRoutineWithAI(finalGoal);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Intelligent Routine Builder"
      subtitle="NOOR analyzes your skin profile, selected goals, and uploaded shelf inventory to generate your single Best Routine."
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* User context summary */}
        <div className="p-4 bg-neutral-100 border border-neutral-200 space-y-2 text-xs">
          <span className="font-bold uppercase tracking-wider text-neutral-500 text-[10px] font-mono">
            INPUT PARAMETERS & INVENTORY
          </span>
          <div className="grid grid-cols-2 gap-2 text-neutral-800">
            <div>• Skin Type: <strong>{userProfile.skinType}</strong></div>
            <div>• Reactivity: <strong>{userProfile.sensitivity}</strong></div>
            <div>• Shelf Inventory: <strong>{shelfProducts.length} formulas available</strong></div>
            <div>• Baseline Status: <strong>{userProfile.qualitativeStatus}</strong></div>
          </div>
        </div>

        {/* Primary Goal Selector */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono mb-2">
            SELECT PRIMARY ROUTINE OBJECTIVE
          </label>
          <div className="space-y-1.5">
            {quickGoals.map((g, idx) => {
              const isSelected = selectedGoal === g;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedGoal(g)}
                  className={`w-full text-left p-2.5 text-xs border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-black text-white border-black font-semibold'
                      : 'bg-white text-black border-neutral-200 hover:border-black'
                  }`}
                >
                  <span>{g}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[2]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom notes or seasonal constraints */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono mb-1.5">
            OPTIONAL SEASONAL CONSTRAINTS OR PREFERENCES
          </label>
          <input
            type="text"
            value={customGoal}
            onChange={e => setCustomGoal(e.target.value)}
            placeholder="e.g. Dry indoor heating, high altitude travel, chin congestion"
            className="w-full bg-white border border-neutral-300 px-3.5 py-2 text-xs text-black focus:outline-none focus:border-black"
          />
        </div>

        <div className="p-3 bg-neutral-50 border border-neutral-200 flex items-start gap-2.5 text-xs text-neutral-600">
          <ShieldCheck className="w-4 h-4 text-black shrink-0 mt-0.5 stroke-[1.5]" />
          <p className="leading-relaxed">
            The engine prioritizes what you already own on your shelf. Non-compatible active layers will be separated into alternate nights.
          </p>
        </div>

        <div className="pt-2">
          <Button
            variant="primary"
            className="w-full"
            onClick={handleBuild}
            isLoading={isRebuildingRoutine}
            rightIcon={<Sparkles className="w-4 h-4 stroke-[1.5]" />}
          >
            Generate Best Routine
          </Button>
        </div>
      </div>
    </Modal>
  );
};
