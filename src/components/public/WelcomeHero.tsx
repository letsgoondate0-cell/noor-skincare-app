import React from 'react';
import { BrandLogo } from '../common/BrandLogo';
import { Button } from '../common/Button';
import {
  ArrowRight,
  ShieldCheck,
  Compass,
  Layers
} from 'lucide-react';

interface WelcomeHeroProps {
  onStartOnboarding: () => void;
  onOpenAuth: () => void;
  onExploreDemo: () => void;
}

export const WelcomeHero: React.FC<WelcomeHeroProps> = ({
  onStartOnboarding,
  onOpenAuth,
  onExploreDemo
}) => {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#0A0A0A] flex flex-col justify-between p-6 sm:p-12 lg:p-16 max-w-6xl mx-auto selection:bg-black selection:text-white">
      {/* Top Brand Bar */}
      <div className="w-full flex items-center justify-between pb-6 border-b border-neutral-200">
        <BrandLogo size="md" showSubtitle />

        <div className="flex items-center gap-2.5">
          <Button variant="ghost" size="sm" onClick={onOpenAuth}>
            Sign In
          </Button>
          <Button variant="primary" size="sm" onClick={onStartOnboarding}>
            Begin System
          </Button>
        </div>
      </div>

      {/* Main Editorial Hero Section */}
      <div className="py-16 sm:py-24 max-w-3xl space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-neutral-100 border border-neutral-200 text-[10px] uppercase font-bold tracking-[0.2em] text-neutral-800 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-black" />
          <span>PERSONAL SKINCARE SYSTEM</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl text-black font-extrabold leading-[1.08] tracking-tight">
          What should you do next for your skin?
        </h1>

        <p className="text-base sm:text-xl text-neutral-600 leading-relaxed max-w-2xl font-normal">
          NOOR understands your skin, optimizes what you already own, sequences your morning and evening rituals, and adapts intelligently to what your barrier asks for each day.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Button
            variant="primary"
            size="lg"
            onClick={onStartOnboarding}
            rightIcon={<ArrowRight className="w-4 h-4 stroke-[2]" />}
          >
            Create Your Skin Profile
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={onExploreDemo}
          >
            Explore Live Sanctuary
          </Button>
        </div>

        {/* Pillars */}
        <div className="pt-8 flex flex-wrap items-center gap-8 text-xs text-neutral-600 border-t border-neutral-200 font-mono">
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-black stroke-[1.5]" />
            <span>PRIVATE & ENCRYPTED</span>
          </span>
          <span className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-black stroke-[1.5]" />
            <span>USE WHAT YOU OWN FIRST</span>
          </span>
          <span className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-black stroke-[1.5]" />
            <span>IPHONE • ANDROID • WEB</span>
          </span>
        </div>
      </div>

      {/* Editorial Footer */}
      <div className="pt-6 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-3 font-mono">
        <p>NOOR IS A PERSONAL SKIN INTELLIGENCE SYSTEM. NEVER MEDICAL DIAGNOSIS.</p>
        <p>© 2026 NOOR SYSTEM INC. ALL RIGHTS RESERVED.</p>
      </div>
    </div>
  );
};
