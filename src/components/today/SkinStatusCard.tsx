import React from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { useNoor } from '../../context/NoorContext';

export const SkinStatusCard: React.FC = () => {
  const { userProfile, checkIns, setActiveTab } = useNoor();

  const statusConfig = {
    Improving: {
      headline: 'Barrier is resilient and improving',
      indicator: '●'
    },
    Stable: {
      headline: 'Barrier equilibrium maintained',
      indicator: '●'
    },
    'Needs attention': {
      headline: 'Temporary barrier sensitivity detected',
      indicator: '○'
    },
    'Recently changed': {
      headline: 'Adapting to recent routine adjustments',
      indicator: '◐'
    }
  };

  const current = statusConfig[userProfile.qualitativeStatus] || statusConfig.Stable;
  const latestCheckIn = checkIns[0];

  return (
    <Card className="border border-neutral-200 bg-white">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-neutral-500 font-sans">
              SKIN EQUILIBRIUM
            </span>
            <Badge variant="neutral" size="xs">
              <span className="text-black font-mono text-[9px] mr-0.5">{current.indicator}</span>
              <span className="font-medium">{userProfile.qualitativeStatus}</span>
            </Badge>
          </div>

          <h3 className="text-xl sm:text-2xl text-black font-semibold tracking-tight">
            {current.headline}
          </h3>

          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-xl font-normal">
            {userProfile.qualitativeStatusReason}
          </p>
        </div>

        <button
          onClick={() => setActiveTab('journey')}
          className="inline-flex items-center gap-1.5 text-xs text-black hover:text-neutral-600 font-semibold transition-colors shrink-0 cursor-pointer pt-1"
        >
          <span>Skin Journey</span>
          <ArrowRight className="w-3.5 h-3.5 stroke-[2]" />
        </button>
      </div>

      {latestCheckIn && (
        <div className="mt-4 pt-4 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-600">
          <div className="flex items-center gap-3">
            <span>Hydration: <strong className="font-semibold text-black">{latestCheckIn.hydrationLevel}</strong></span>
            <span className="text-neutral-300">•</span>
            <span>Barrier: <strong className="font-semibold text-black">{latestCheckIn.barrierState}</strong></span>
          </div>

          <span className="text-[11px] text-neutral-400 font-mono">
            LOGGED {new Date(latestCheckIn.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()}
          </span>
        </div>
      )}
    </Card>
  );
};
