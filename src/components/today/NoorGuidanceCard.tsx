import React from 'react';
import { Sparkles, Sun, Droplets, ArrowRight } from 'lucide-react';
import { Card } from '../common/Card';
import { useNoor } from '../../context/NoorContext';

export const NoorGuidanceCard: React.FC = () => {
  const { userProfile, setActiveTab } = useNoor();

  return (
    <Card className="bg-white border-neutral-200">
      <div className="flex items-start gap-4">
        <div className="p-2 bg-black text-white rounded-sm shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4 stroke-[1.5]" />
        </div>

        <div className="space-y-2 grow">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 font-mono">
              DAILY NOOR INTELLIGENCE
            </span>
            <span className="text-[11px] text-neutral-400 font-mono">
              PERSONALIZED FOR {userProfile.name.split(' ')[0].toUpperCase()}
            </span>
          </div>

          <h4 className="text-lg sm:text-xl text-black font-semibold leading-snug">
            Hydrate on damp skin before sealing.
          </h4>

          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
            With your combination skin profile, pressing your milky essence toner onto slightly damp skin draws moisture deeper into the epidermis. Avoid scrubbing active serums; gentle palm pressing protects your lipid barrier.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100">
            <div className="flex items-center gap-3 text-[11px] text-neutral-500 font-mono">
              <span className="flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 stroke-[1.5] text-black" /> UV INDEX: MODERATE
              </span>
              <span className="text-neutral-300">•</span>
              <span className="flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 stroke-[1.5] text-black" /> HUMIDITY: 48%
              </span>
            </div>

            <button
              onClick={() => setActiveTab('ai')}
              className="text-xs font-semibold text-black hover:underline flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Ask NOOR</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2]" />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};
