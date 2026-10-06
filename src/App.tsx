import React, { useState, useEffect } from 'react';
import { NoorProvider, useNoor } from './context/NoorContext';
import { DeviceFrame } from './components/common/DeviceFrame';
import { Toast } from './components/common/Toast';
import { DesktopSidebar } from './components/navigation/DesktopSidebar';
import { MobileHeader } from './components/navigation/MobileHeader';
import { MobileBottomNav } from './components/navigation/MobileBottomNav';
import { TodayView } from './components/today/TodayView';
import { RoutineView } from './components/routine/RoutineView';
import { ShelfView } from './components/shelf/ShelfView';
import { AskNoorView } from './components/ai/AskNoorView';
import { SkinJourneyView } from './components/journey/SkinJourneyView';
import { ProfileView } from './components/profile/ProfileView';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { AuthScreen } from './components/auth/AuthScreen';
import { AuthModal } from './components/public/AuthModal';
import { QuickAiDrawer } from './components/ai/QuickAiDrawer';
import { Sparkles } from 'lucide-react';

const NoorMainApp: React.FC = () => {
  const {
    activeTab,
    userProfile,
    toastMessage,
    authModalOpen,
    setAuthModalOpen
  } = useNoor();

  const [quickAiOpen, setQuickAiOpen] = useState(false);

  // Keyboard shortcut listener: Cmd+K / Ctrl+K opens Ask NOOR anytime
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setQuickAiOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 1. Initial Authentication View: If user is not logged in, show monochrome AuthScreen
  if (!userProfile.isLoggedIn) {
    return (
      <DeviceFrame>
        <AuthScreen />
        <Toast message={toastMessage} />
      </DeviceFrame>
    );
  }

  // 2. If logged in but onboarding not yet completed
  if (!userProfile.onboardingCompleted) {
    return (
      <DeviceFrame>
        <OnboardingFlow onComplete={() => {}} />
        <Toast message={toastMessage} />
      </DeviceFrame>
    );
  }

  // Primary ecosystem view
  return (
    <DeviceFrame>
      <div className="flex w-full min-h-screen bg-[#FAFAFA] text-[#0A0A0A]">
        {/* Desktop Sidebar (lg+) */}
        <DesktopSidebar onOpenQuickAi={() => setQuickAiOpen(true)} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 relative">
          {/* Mobile Header (<lg) */}
          <MobileHeader onOpenQuickAi={() => setQuickAiOpen(true)} />

          {/* Active Tab Screen */}
          <main className="flex-1 overflow-y-auto pb-20 lg:pb-10">
            {activeTab === 'today' && <TodayView />}
            {activeTab === 'routine' && <RoutineView />}
            {activeTab === 'shelf' && <ShelfView />}
            {activeTab === 'ai' && <AskNoorView />}
            {activeTab === 'journey' && <SkinJourneyView />}
            {activeTab === 'profile' && <ProfileView />}
          </main>

          {/* Floating AI Launch Button available on all screens */}
          {activeTab !== 'ai' && (
            <button
              onClick={() => setQuickAiOpen(true)}
              className="fixed bottom-20 lg:bottom-8 right-5 lg:right-8 z-40 flex items-center gap-2 px-4 py-2.5 bg-black text-white rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.25)] border border-neutral-800 hover:bg-neutral-800 transition-all cursor-pointer group"
              aria-label="Ask NOOR AI"
            >
              <Sparkles className="w-4 h-4 text-white stroke-[1.5]" />
              <span className="text-xs font-semibold tracking-tight font-sans">Ask NOOR</span>
              <span className="hidden sm:inline text-[10px] text-neutral-400 font-mono ml-1">⌘K</span>
            </button>
          )}

          {/* Mobile Bottom Navigation (<lg) */}
          <MobileBottomNav />
        </div>
      </div>

      {/* Floating Quick AI Drawer */}
      <QuickAiDrawer
        isOpen={quickAiOpen}
        onClose={() => setQuickAiOpen(false)}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      <Toast message={toastMessage} />
    </DeviceFrame>
  );
};

export default function App() {
  return (
    <NoorProvider>
      <NoorMainApp />
    </NoorProvider>
  );
}
