import React from 'react';
import { Sparkles } from 'lucide-react';

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
      <div className="flex items-center gap-2.5 px-4.5 py-2.5 rounded-md bg-black text-white text-xs sm:text-sm font-medium border border-neutral-800 shadow-[0_8px_24px_rgba(0,0,0,0.2)] animate-in fade-in slide-in-from-bottom-2 duration-150">
        <Sparkles className="w-3.5 h-3.5 text-white shrink-0 stroke-[1.5]" />
        <span className="tracking-tight">{message}</span>
      </div>
    </div>
  );
};
