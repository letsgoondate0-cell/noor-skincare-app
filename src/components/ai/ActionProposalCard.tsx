import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface ActionProposalCardProps {
  action: {
    id: string;
    label: string;
    type: 'adapt_routine' | 'pause_actives' | 'simplify_routine' | 'view_routine' | 'add_product';
    summary: string;
  };
  onApply: () => void;
}

export const ActionProposalCard: React.FC<ActionProposalCardProps> = ({ action, onApply }) => {
  return (
    <div className="mt-3 p-4 rounded-md bg-white border border-neutral-300 space-y-2.5">
      <div className="flex items-center justify-between">
        <Badge variant="dark" size="xs">
          <Sparkles className="w-3 h-3 text-white mr-1 stroke-[1.5]" /> Proposed Action
        </Badge>
        <span className="text-[10px] uppercase font-bold text-neutral-500 font-mono tracking-wider">
          ROUTINE ADJUSTMENT
        </span>
      </div>

      <div>
        <h4 className="text-sm font-bold text-black">
          {action.label}
        </h4>
        <p className="text-xs text-neutral-600 leading-relaxed mt-1">
          {action.summary}
        </p>
      </div>

      <div className="pt-1">
        <Button
          variant="primary"
          size="sm"
          className="w-full"
          onClick={onApply}
          rightIcon={<ArrowRight className="w-3.5 h-3.5 stroke-[2]" />}
        >
          Confirm & Apply to Ritual
        </Button>
      </div>
    </div>
  );
};
