import React, { useState } from 'react';
import {
  Check,
  ChevronDown,
  Trash2,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { RoutineStep } from '../../types';

interface RoutineStepCardProps {
  step: RoutineStep;
  onToggleComplete: () => void;
  onRemove: () => void;
  onViewProduct?: () => void;
}

export const RoutineStepCard: React.FC<RoutineStepCardProps> = ({
  step,
  onToggleComplete,
  onRemove,
  onViewProduct
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`rounded-lg border transition-all duration-150 overflow-hidden ${
        step.isCompletedToday
          ? 'bg-neutral-50/70 border-neutral-200 opacity-60'
          : 'bg-white border-neutral-200 hover:border-black'
      }`}
    >
      <div className="p-4 sm:p-5 flex items-start gap-4">
        {/* Step indicator button */}
        <button
          onClick={onToggleComplete}
          className={`w-7 h-7 rounded-sm border flex items-center justify-center shrink-0 mt-0.5 transition-all cursor-pointer ${
            step.isCompletedToday
              ? 'bg-black border-black text-white'
              : 'border-neutral-300 hover:border-black bg-white text-xs font-mono font-bold text-neutral-700'
          }`}
          aria-label={step.isCompletedToday ? 'Undo step' : 'Complete step'}
        >
          {step.isCompletedToday ? (
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
          ) : (
            <span>0{step.stepNumber}</span>
          )}
        </button>

        {/* Content */}
        <div className="grow min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-500 font-mono">
              {step.category}
            </span>
            <span className="text-[11px] text-neutral-300">•</span>
            <span className="text-[11px] text-neutral-600 font-medium">
              {step.brand}
            </span>
            {step.frequency && step.frequency !== 'Daily' && (
              <Badge variant="neutral" size="xs">
                {step.frequency}
              </Badge>
            )}
          </div>

          <h4
            className={`text-base sm:text-lg font-bold mt-1 leading-snug ${
              step.isCompletedToday ? 'line-through text-neutral-400' : 'text-black'
            }`}
          >
            {step.productName}
          </h4>

          <p className="text-xs text-neutral-600 mt-1 leading-relaxed font-normal">
            {step.usageTip}
          </p>
        </div>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-1.5 rounded-sm text-neutral-400 hover:text-black transition-colors cursor-pointer shrink-0"
          aria-label="Toggle details"
        >
          <ChevronDown
            className={`w-4 h-4 transition-transform stroke-[1.5] ${expanded ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="px-5 pb-4 pt-2 border-t border-neutral-100 bg-neutral-50/70 space-y-3 text-xs animate-in fade-in duration-100">
          <div className="flex items-start gap-2.5 pt-1">
            <Sparkles className="w-4 h-4 text-black shrink-0 mt-0.5 stroke-[1.5]" />
            <div>
              <span className="font-semibold text-black">Why NOOR selected this step: </span>
              <p className="text-neutral-700 leading-relaxed mt-0.5">{step.whyChosen}</p>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-neutral-200 text-[11px]">
            <button
              onClick={onViewProduct}
              className="text-black hover:underline font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <ExternalLink className="w-3 h-3 stroke-[1.5]" />
              <span>View Formulation Details</span>
            </button>

            <button
              onClick={onRemove}
              className="text-neutral-600 hover:text-black font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Trash2 className="w-3 h-3 stroke-[1.5]" />
              <span>Remove from ritual</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
