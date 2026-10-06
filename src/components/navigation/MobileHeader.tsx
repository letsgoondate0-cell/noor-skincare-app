import React from 'react';
import { Sparkles } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { useNoor } from '../../context/NoorContext';

interface MobileHeaderProps {
  onOpenQuickAi?: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({ onOpenQuickAi }) => {
  const { userProfile, setActiveTab } = useNoor();

  return (
    <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-neutral-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <BrandLogo size="sm" />
      </div>

      <div className="flex items-center gap-2">
        {/* Qualitative Skin State Chip (Strict Monochrome) */}
        <button
          onClick={() => setActiveTab('journey')}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-neutral-100 border border-neutral-200 text-[11px] text-neutral-800 cursor-pointer hover:border-black transition-colors"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-black" />
          <span className="tracking-tight font-medium">{userProfile.qualitativeStatus}</span>
        </button>

        {/* Quick Ask NOOR */}
        <button
          onClick={onOpenQuickAi || (() => setActiveTab('ai'))}
          className="p-1.5 rounded-sm bg-black text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          aria-label="Ask NOOR"
        >
          <Sparkles className="w-3.5 h-3.5 stroke-[1.5]" />
        </button>
      </div>
    </header>
  );
};
