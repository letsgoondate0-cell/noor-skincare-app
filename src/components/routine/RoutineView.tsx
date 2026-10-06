import React, { useState } from 'react';
import {
  Sun,
  Moon,
  Calendar,
  Sparkles,
  SlidersHorizontal,
  ShieldCheck
} from 'lucide-react';
import { RoutineStepCard } from './RoutineStepCard';
import { AdaptRoutineModal } from './AdaptRoutineModal';
import { BuildRoutineModal } from './BuildRoutineModal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useNoor } from '../../context/NoorContext';
import { RoutineTime } from '../../types';

export const RoutineView: React.FC = () => {
  const {
    routineSteps,
    toggleStepCompletion,
    removeRoutineStep,
    activeAdaptation,
    adaptRoutine,
    userProfile,
    setActiveTab
  } = useNoor();

  const [activeTab, setActiveTabLocal] = useState<RoutineTime>('Morning');
  const [adaptModalOpen, setAdaptModalOpen] = useState(false);
  const [buildModalOpen, setBuildModalOpen] = useState(false);

  const filteredSteps = routineSteps
    .filter(s => s.timeOfDay === activeTab)
    .sort((a, b) => a.stepNumber - b.stepNumber);

  const completedCount = filteredSteps.filter(s => s.isCompletedToday).length;

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-8 sm:py-10 space-y-7 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-neutral-200">
        <div className="space-y-1">
          <span className="text-[10px] font-bold tracking-[0.24em] uppercase text-neutral-500 font-mono block">
            YOUR PERSONAL RITUAL
          </span>
          <h1 className="text-3xl sm:text-4xl text-black font-bold tracking-tight">
            My Routine
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 font-normal pt-0.5">
            Calibrated for your {userProfile.skinType.toLowerCase()} profile and barrier equilibrium.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAdaptModalOpen(true)}
            leftIcon={<SlidersHorizontal className="w-3.5 h-3.5 stroke-[1.5]" />}
          >
            Adapt Ritual
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setBuildModalOpen(true)}
            leftIcon={<Sparkles className="w-3.5 h-3.5 stroke-[1.5]" />}
          >
            Rebuild with AI
          </Button>
        </div>
      </div>

      {/* Active Adaptation Notice */}
      {activeAdaptation && (
        <div className="p-4 rounded-md bg-neutral-100 border border-neutral-300 flex items-center justify-between text-xs text-neutral-900">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-black stroke-[1.5]" />
            <span>
              Temporary Adaptation Active: <strong>{activeAdaptation}</strong>
            </span>
          </div>
          <button
            onClick={() => adaptRoutine('reset')}
            className="text-xs font-semibold underline cursor-pointer hover:text-black"
          >
            Reset to Standard
          </button>
        </div>
      )}

      {/* Routine Time Navigation: Morning / Evening / Weekly */}
      <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setActiveTabLocal('Morning')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-sm text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'Morning'
                ? 'bg-black text-white font-semibold'
                : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
            }`}
          >
            <Sun className="w-3.5 h-3.5 stroke-[1.5]" />
            <span>Morning ({routineSteps.filter(s => s.timeOfDay === 'Morning').length})</span>
          </button>

          <button
            onClick={() => setActiveTabLocal('Evening')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-sm text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'Evening'
                ? 'bg-black text-white font-semibold'
                : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
            }`}
          >
            <Moon className="w-3.5 h-3.5 stroke-[1.5]" />
            <span>Evening ({routineSteps.filter(s => s.timeOfDay === 'Evening').length})</span>
          </button>

          <button
            onClick={() => setActiveTabLocal('Weekly')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-sm text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'Weekly'
                ? 'bg-black text-white font-semibold'
                : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 stroke-[1.5]" />
            <span>Weekly</span>
          </button>
        </div>

        <span className="hidden sm:inline-block text-xs text-neutral-500 font-mono">
          {completedCount} OF {filteredSteps.length} COMPLETE
        </span>
      </div>

      {/* Routine Steps List */}
      <div className="space-y-2.5">
        {filteredSteps.length === 0 ? (
          <div className="p-10 text-center bg-white border border-neutral-200 rounded-lg space-y-3">
            <Calendar className="w-8 h-8 text-neutral-400 mx-auto stroke-[1.5]" />
            <h4 className="text-lg text-black font-semibold">No weekly treatments scheduled</h4>
            <p className="text-xs text-neutral-600 max-w-sm mx-auto">
              Keeping your weekly cadence minimal protects your acid mantle from over-exfoliation.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab('shelf')}
            >
              Explore Products on My Shelf
            </Button>
          </div>
        ) : (
          filteredSteps.map(step => (
            <RoutineStepCard
              key={step.id}
              step={step}
              onToggleComplete={() => toggleStepCompletion(step.id)}
              onRemove={() => removeRoutineStep(step.id)}
              onViewProduct={() => setActiveTab('shelf')}
            />
          ))
        )}
      </div>

      {/* Philosophy Callout */}
      <div className="p-5 rounded-lg bg-white border border-neutral-200 space-y-2">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 font-mono">
          <ShieldCheck className="w-4 h-4 text-black stroke-[1.5]" />
          <span>The NOOR Routine Philosophy</span>
        </div>
        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
          Skin responds to consistency, not novelty. This ritual follows the physiological rule of thinnest to thickest consistency: clearing debris, infusing water-phase actives, targeting cell renewal, and sealing with biocompatible ceramides.
        </p>
      </div>

      {/* Modals */}
      <AdaptRoutineModal
        isOpen={adaptModalOpen}
        onClose={() => setAdaptModalOpen(false)}
      />

      <BuildRoutineModal
        isOpen={buildModalOpen}
        onClose={() => setBuildModalOpen(false)}
      />
    </div>
  );
};
