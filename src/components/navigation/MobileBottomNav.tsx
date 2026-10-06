import React from 'react';
import {
  SunMedium,
  Layers,
  Sparkles,
  TrendingUp,
  Compass
} from 'lucide-react';
import { useNoor } from '../../context/NoorContext';
import { ActiveTab } from '../../types';

export const MobileBottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useNoor();

  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'today', label: 'Today', icon: <SunMedium className="w-4 h-4 stroke-[1.5]" /> },
    { id: 'routine', label: 'Routine', icon: <Layers className="w-4 h-4 stroke-[1.5]" /> },
    { id: 'shelf', label: 'Shelf', icon: <Compass className="w-4 h-4 stroke-[1.5]" /> },
    { id: 'ai', label: 'Ask NOOR', icon: <Sparkles className="w-4 h-4 stroke-[1.5]" /> },
    { id: 'journey', label: 'Journey', icon: <TrendingUp className="w-4 h-4 stroke-[1.5]" /> }
  ];

  return (
    <nav className="lg:hidden sticky bottom-0 z-30 bg-white border-t border-neutral-200 px-2 py-1.5 flex items-center justify-around select-none">
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-md transition-all duration-150 cursor-pointer ${
              isActive
                ? 'text-black font-semibold'
                : 'text-neutral-500 hover:text-black'
            }`}
          >
            <div className={`p-0.5 ${isActive ? 'text-black' : 'text-neutral-400'}`}>
              {tab.icon}
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
