import React, { useState } from 'react';
import { Sparkles, Bell, ArrowRight, Sun, Moon, CheckCircle2, ShieldCheck } from 'lucide-react';
import { SkinStatusCard } from './SkinStatusCard';
import { TodayRoutineTracker } from './TodayRoutineTracker';
import { NoorGuidanceCard } from './NoorGuidanceCard';
import { NotificationModal } from '../profile/NotificationModal';
import { Button } from '../common/Button';
import { useNoor } from '../../context/NoorContext';

export const TodayView: React.FC = () => {
  const { userProfile, setActiveTab, sendMessageToNoor, showToast } = useNoor();

  const [notifModalOpen, setNotifModalOpen] = useState(false);
  const [activeNotification, setActiveNotification] = useState<{ title: string; body: string } | null>(null);

  const currentHour = new Date().getHours();
  const isMorning = currentHour < 12;
  const isMidday = currentHour >= 12 && currentHour < 17;

  const reminderCue = isMorning
    ? {
        title: 'Time for your Morning Routine',
        body: 'Cleanse gently and apply your broad-spectrum mineral SPF before heading out.',
        icon: <Sun className="w-3.5 h-3.5 text-black" />
      }
    : isMidday
    ? {
        title: 'Midday UV Protection',
        body: "Don't forget to reapply your SPF shield if you have spent extended time near windows or outdoors.",
        icon: <Sun className="w-3.5 h-3.5 text-black" />
      }
    : {
        title: 'Time for your Evening Routine',
        body: 'Remove daily impurities and seal hydration with your barrier restorative moisturizer.',
        icon: <Moon className="w-3.5 h-3.5 text-black" />
      };

  const handleTestNotification = () => {
    setActiveNotification({
      title: `NOOR • ${reminderCue.title}`,
      body: reminderCue.body
    });
    showToast(`Calm reminder delivered: ${reminderCue.title}`);
    setTimeout(() => {
      setActiveNotification(null);
    }, 6000);
  };

  const quickQuestions = [
    'What should I use tonight?',
    'My skin feels dry or tight today',
    'Can I simplify my routine tonight?',
    'Can I use retinol and vitamin C together?'
  ];

  const handleAsk = (question: string) => {
    setActiveTab('ai');
    sendMessageToNoor(question);
  };

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-8 sm:py-10 space-y-7 animate-in fade-in duration-150">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-neutral-200">
        <div className="space-y-1">
          <span className="text-[10px] font-bold tracking-[0.24em] uppercase text-neutral-500 font-mono block">
            TODAY WITH NOOR
          </span>
          <h1 className="text-3xl sm:text-4xl text-black font-bold tracking-tight">
            Good day, {userProfile.name.split(' ')[0] || 'friend'}.
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 font-normal pt-0.5">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric'
            })} • What to do next for your skin
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setNotifModalOpen(true)}
            leftIcon={<Bell className="w-3.5 h-3.5 stroke-[1.5]" />}
          >
            Reminders
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setActiveTab('ai')}
            leftIcon={<Sparkles className="w-3.5 h-3.5 stroke-[1.5]" />}
          >
            Ask NOOR
          </Button>
        </div>
      </div>

      {/* Interactive In-App Notification Banner Simulation */}
      {activeNotification && (
        <div className="p-4 bg-black text-white rounded-none border border-neutral-800 shadow-[0_4px_20px_rgba(0,0,0,0.15)] flex items-start justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 bg-white text-black flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4 stroke-[2]" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-mono font-bold tracking-wider uppercase">
                {activeNotification.title}
              </h4>
              <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                {activeNotification.body}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveNotification(null)}
            className="text-xs text-neutral-400 hover:text-white cursor-pointer px-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Intelligent Timing Reminder Bar */}
      <div className="p-3.5 bg-white border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-neutral-100 border border-neutral-300">
            {reminderCue.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase font-bold text-neutral-500">
                CALM ROUTINE TIMING
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-black" />
              <span className="text-xs font-semibold text-black">
                {reminderCue.title}
              </span>
            </div>
            <p className="text-xs text-neutral-600 font-sans mt-0.5">
              {reminderCue.body}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <button
            onClick={handleTestNotification}
            className="text-[11px] font-mono uppercase font-semibold text-neutral-700 hover:text-black underline cursor-pointer"
          >
            Simulate Push →
          </button>
        </div>
      </div>

      {/* Priority 1: What to do right now */}
      <TodayRoutineTracker />

      {/* Priority 2: Skin Status (Qualitative state, NOT fake 78/100 score) */}
      <SkinStatusCard />

      {/* Priority 3: NOOR Daily Guidance */}
      <NoorGuidanceCard />

      {/* Priority 4: Quick Skincare Consultations */}
      <div className="pt-2 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-500 font-mono">
            QUICK CONSULTATION
          </span>
          <span className="text-[11px] text-neutral-400 font-mono">
            CONTINUOUS SKIN MEMORY
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleAsk(q)}
              className="text-left p-3.5 rounded-none bg-white hover:bg-neutral-50 border border-neutral-200 hover:border-black text-xs text-black transition-all flex items-center justify-between group cursor-pointer shadow-2xs"
            >
              <span className="truncate pr-2 font-medium">{q}</span>
              <Sparkles className="w-3.5 h-3.5 text-neutral-400 group-hover:text-black shrink-0 transition-colors stroke-[1.5]" />
            </button>
          ))}
        </div>
      </div>

      <NotificationModal
        isOpen={notifModalOpen}
        onClose={() => setNotifModalOpen(false)}
      />
    </div>
  );
};
