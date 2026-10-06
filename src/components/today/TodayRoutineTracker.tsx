import React, { useState } from 'react';
import { Sun, Moon, Check, ChevronRight, Sparkles } from 'lucide-react';
import { Badge } from '../common/Badge';
import { useNoor } from '../../context/NoorContext';
import { RoutineTime } from '../../types';

export const TodayRoutineTracker: React.FC = () => {
  const {
    routineSteps,
    toggleStepCompletion,
    activeAdaptation,
    setActiveTab
  } = useNoor();

  const currentHour = new Date().getHours();
  const defaultTime: RoutineTime = currentHour < 17 ? 'Morning' : 'Evening';
  const [selectedTime, setSelectedTime] = useState<RoutineTime>(defaultTime);
  const [expandedStepId, setExpandedStepId] = useState<string | null>(null);

  const steps = routineSteps
    .filter(s => s.timeOfDay === selectedTime)
    .sort((a, b) => a.stepNumber - b.stepNumber);

  const completedCount = steps.filter(s => s.isCompletedToday).length;
  const nextIncompleteStep = steps.find(s => !s.isCompletedToday);
  const allCompleted = steps.length > 0 && completedCount === steps.length;

  return (
    <div className="space-y-3.5">
      {/* Time selector & status banner */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl text-black font-bold tracking-tight">
              What to do right now
            </h2>
            {activeAdaptation && (
              <Badge variant="dark" size="xs">
                {activeAdaptation}
              </Badge>
            )}
          </div>
          <p className="text-xs sm:text-sm text-neutral-600 font-normal">
            {allCompleted
              ? `Your ${selectedTime.toLowerCase()} ritual is complete. Your barrier is protected.`
              : nextIncompleteStep
              ? `Next: Step 0${nextIncompleteStep.stepNumber} • ${nextIncompleteStep.productName}`
              : `Your personalized ${selectedTime.toLowerCase()} sequence`}
          </p>
        </div>

        {/* Strict Monochrome AM/PM Segmented Control */}
        <div className="flex items-center bg-neutral-100 p-1 rounded-md border border-neutral-200 self-start sm:self-auto">
          <button
            onClick={() => setSelectedTime('Morning')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-sm text-xs font-medium transition-all cursor-pointer ${
              selectedTime === 'Morning'
                ? 'bg-black text-white font-semibold'
                : 'text-neutral-600 hover:text-black'
            }`}
          >
            <Sun className="w-3.5 h-3.5 stroke-[1.5]" />
            <span>Morning</span>
          </button>

          <button
            onClick={() => setSelectedTime('Evening')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-sm text-xs font-medium transition-all cursor-pointer ${
              selectedTime === 'Evening'
                ? 'bg-black text-white font-semibold'
                : 'text-neutral-600 hover:text-black'
            }`}
          >
            <Moon className="w-3.5 h-3.5 stroke-[1.5]" />
            <span>Evening</span>
          </button>
        </div>
      </div>

      {/* Routine Steps List */}
      <div className="space-y-2">
        {steps.map(step => {
          const isExpanded = expandedStepId === step.id;
          const isNext = nextIncompleteStep?.id === step.id;

          return (
            <div
              key={step.id}
              className={`rounded-lg border transition-all duration-150 overflow-hidden ${
                step.isCompletedToday
                  ? 'bg-neutral-50/70 border-neutral-200 opacity-60'
                  : isNext
                  ? 'bg-white border-black shadow-xs ring-1 ring-black/5'
                  : 'bg-white border-neutral-200 hover:border-neutral-400'
              }`}
            >
              <div className="p-4 sm:p-4.5 flex items-start justify-between gap-3.5">
                {/* Complete checkbox button */}
                <button
                  onClick={() => toggleStepCompletion(step.id)}
                  className={`w-6 h-6 rounded-sm border flex items-center justify-center shrink-0 mt-0.5 transition-all cursor-pointer ${
                    step.isCompletedToday
                      ? 'bg-black border-black text-white'
                      : 'border-neutral-300 hover:border-black bg-white'
                  }`}
                  aria-label={step.isCompletedToday ? 'Mark as incomplete' : 'Mark as complete'}
                >
                  {step.isCompletedToday && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                </button>

                {/* Step info */}
                <div
                  className="grow min-w-0 cursor-pointer"
                  onClick={() => setExpandedStepId(isExpanded ? null : step.id)}
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-500 font-mono">
                      STEP 0{step.stepNumber} • {step.category}
                    </span>
                    {isNext && (
                      <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-xs bg-black text-white tracking-wider">
                        Next
                      </span>
                    )}
                    {step.frequency && step.frequency !== 'Daily' && (
                      <span className="text-[10px] text-neutral-600 bg-neutral-100 border border-neutral-200 px-1.5 py-0.5 rounded-xs">
                        {step.frequency}
                      </span>
                    )}
                  </div>

                  <h4
                    className={`text-sm sm:text-base font-semibold mt-0.5 truncate ${
                      step.isCompletedToday ? 'line-through text-neutral-400' : 'text-black'
                    }`}
                  >
                    {step.productName}
                  </h4>
                  <p className="text-xs text-neutral-600 mt-0.5 truncate font-normal">
                    {step.usageTip}
                  </p>
                </div>

                {/* Expand / Details toggle */}
                <button
                  onClick={() => setExpandedStepId(isExpanded ? null : step.id)}
                  className="p-1 rounded-sm text-neutral-400 hover:text-black transition-colors cursor-pointer shrink-0 mt-1"
                  aria-label="Toggle details"
                >
                  <ChevronRight
                    className={`w-4 h-4 transition-transform duration-150 stroke-[1.5] ${
                      isExpanded ? 'rotate-90' : ''
                    }`}
                  />
                </button>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div className="px-5 pb-4 pt-2 border-t border-neutral-100 bg-neutral-50/70 space-y-2 text-xs animate-in fade-in duration-100">
                  <div className="flex items-start gap-2 pt-1">
                    <Sparkles className="w-3.5 h-3.5 text-black shrink-0 mt-0.5 stroke-[1.5]" />
                    <p className="text-neutral-700 leading-relaxed">
                      <strong className="text-black font-medium">Why NOOR selected this: </strong>
                      {step.whyChosen}
                    </p>
                  </div>
                  <div className="pt-2 flex items-center justify-between text-[11px] text-neutral-500 border-t border-neutral-200">
                    <span>Formulated by {step.brand}</span>
                    <button
                      onClick={() => setActiveTab('routine')}
                      className="text-black hover:underline font-semibold cursor-pointer"
                    >
                      Customize ritual sequence →
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Routine footer status */}
      <div className="flex items-center justify-between pt-1 text-xs text-neutral-500">
        <span>{completedCount} of {steps.length} completed</span>
        <button
          onClick={() => setActiveTab('routine')}
          className="text-black hover:underline font-semibold cursor-pointer"
        >
          View & adapt full routine →
        </button>
      </div>
    </div>
  );
};
