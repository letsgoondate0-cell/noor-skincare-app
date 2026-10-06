import React, { useState } from 'react';
import { Smartphone, Monitor } from 'lucide-react';
import { useNoor } from '../../context/NoorContext';

interface DeviceFrameProps {
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children }) => {
  const { deviceMode, setDeviceMode } = useNoor();

  // Responsive mode
  if (deviceMode === 'responsive') {
    return (
      <div className="w-full min-h-screen bg-[#FAFAFA] text-[#0A0A0A] flex flex-col relative selection:bg-black selection:text-white">
        {children}

        {/* Minimalist device preview switcher */}
        <div className="fixed bottom-4 right-4 z-40 hidden xl:flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-sm border border-neutral-300 shadow-md text-xs font-mono text-neutral-600">
          <span className="text-[10px] font-bold text-black uppercase pr-1">
            VIEWPORT
          </span>
          <button
            onClick={() => setDeviceMode('mobile-iphone')}
            className="flex items-center gap-1 px-2 py-0.5 rounded-xs hover:bg-black hover:text-white text-black transition-colors"
            title="Preview iPhone 16 Pro (393px)"
          >
            <Smartphone className="w-3 h-3" />
            <span>IPHONE</span>
          </button>
          <span className="text-neutral-300">•</span>
          <button
            onClick={() => setDeviceMode('mobile-android')}
            className="flex items-center gap-1 px-2 py-0.5 rounded-xs hover:bg-black hover:text-white text-black transition-colors"
            title="Preview Android Pixel (412px)"
          >
            <Smartphone className="w-3 h-3" />
            <span>ANDROID</span>
          </button>
        </div>
      </div>
    );
  }

  // Mobile simulator container
  return (
    <div className="min-h-screen bg-neutral-200 flex flex-col items-center justify-center p-4 sm:p-8">
      {/* Simulator top toolbar */}
      <div className="mb-4 flex items-center justify-between w-full max-w-[420px] px-2 text-xs text-neutral-700 font-mono">
        <span className="tracking-widest text-black uppercase font-bold text-[11px]">
          NOOR MOBILE CLIENT
        </span>
        <button
          onClick={() => setDeviceMode('responsive')}
          className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-xs border border-neutral-300 text-black hover:bg-black hover:text-white transition-colors shadow-2xs text-[11px]"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>FULL WEB VIEW</span>
        </button>
      </div>

      {/* Device canvas */}
      <div
        className={`bg-[#FAFAFA] text-[#0A0A0A] rounded-[44px] shadow-[0_24px_64px_rgba(0,0,0,0.3)] border-[10px] border-black overflow-hidden flex flex-col relative transition-all duration-200 ${
          deviceMode === 'mobile-iphone'
            ? 'w-[393px] h-[852px]'
            : 'w-[412px] h-[890px]'
        }`}
      >
        {/* Notch / Dynamic Island */}
        <div className="h-10 w-full bg-[#FAFAFA] shrink-0 flex items-center justify-between px-7 pt-1 z-30 select-none">
          <span className="text-[12px] font-bold text-black font-mono">09:41</span>
          <div className="w-24 h-4 bg-black rounded-full" />
          <span className="text-[11px] font-bold text-black font-mono">5G</span>
        </div>

        {/* Content */}
        <div className="grow overflow-y-auto flex flex-col relative">
          {children}
        </div>

        {/* Home bar */}
        <div className="h-5 w-full bg-[#FAFAFA] shrink-0 flex justify-center items-center pb-1">
          <div className="w-32 h-1 bg-black/40 rounded-full" />
        </div>
      </div>
    </div>
  );
};
