import React from 'react';
import {
  SunMedium,
  Layers,
  Sparkles,
  TrendingUp,
  User,
  ShieldCheck,
  Compass,
  MessageSquare
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { useNoor } from '../../context/NoorContext';
import { ActiveTab } from '../../types';

interface DesktopSidebarProps {
  onOpenQuickAi?: () => void;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({ onOpenQuickAi }) => {
  const { activeTab, setActiveTab, userProfile } = useNoor();

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'today', label: 'Today', icon: <SunMedium className="w-4 h-4 stroke-[1.5]" /> },
    { id: 'routine', label: 'My Routine', icon: <Layers className="w-4 h-4 stroke-[1.5]" /> },
    { id: 'shelf', label: 'My Shelf', icon: <Compass className="w-4 h-4 stroke-[1.5]" /> },
    { id: 'ai', label: 'Ask NOOR', icon: <Sparkles className="w-4 h-4 stroke-[1.5]" />, badge: 'AI' },
    { id: 'journey', label: 'Skin Journey', icon: <TrendingUp className="w-4 h-4 stroke-[1.5]" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4 stroke-[1.5]" /> }
  ];

  return (
    <aside className="hidden lg:flex w-64 flex-col justify-between border-r border-neutral-200 bg-white p-6 shrink-0 select-none">
      <div className="space-y-6">
        {/* Brand */}
        <div className="pt-1 pb-2">
          <BrandLogo size="md" align="left" showSubtitle />
        </div>

        {/* Quick Launch Ask NOOR button */}
        {onOpenQuickAi && (
          <button
            onClick={onOpenQuickAi}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-md bg-neutral-900 text-white text-xs font-medium hover:bg-black transition-all cursor-pointer shadow-xs"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-neutral-300 stroke-[1.5]" />
              <span className="tracking-tight">Instant Consultation</span>
            </div>
            <span className="text-[10px] text-neutral-400 uppercase font-mono">⌘K</span>
          </button>
        )}

        {/* Primary Navigation */}
        <nav className="space-y-1">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-md text-xs sm:text-sm transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-neutral-100 text-black font-semibold border-l-2 border-black pl-3'
                    : 'text-neutral-600 hover:text-black hover:bg-neutral-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-black' : 'text-neutral-400'}>
                    {item.icon}
                  </span>
                  <span className="tracking-tight font-sans">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-xs bg-neutral-200 text-neutral-900 tracking-wider">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Account Snapshot */}
      <div className="pt-4 border-t border-neutral-200">
        <button
          onClick={() => setActiveTab('profile')}
          className="w-full flex items-center gap-3 p-2.5 rounded-md hover:bg-neutral-50 transition-all text-left cursor-pointer group border border-transparent hover:border-neutral-200"
        >
          <div className="w-8 h-8 rounded-sm bg-neutral-100 border border-neutral-300 flex items-center justify-center font-bold text-xs text-black">
            {userProfile.name.charAt(0) || 'E'}
          </div>
          <div className="grow min-w-0">
            <p className="text-xs font-semibold text-black truncate tracking-tight">
              {userProfile.name}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-black" />
              <p className="text-[11px] text-neutral-500 truncate">
                {userProfile.skinType} • {userProfile.qualitativeStatus}
              </p>
            </div>
          </div>
          <ShieldCheck className="w-3.5 h-3.5 text-neutral-400 group-hover:text-black transition-colors shrink-0" />
        </button>
      </div>
    </aside>
  );
};
