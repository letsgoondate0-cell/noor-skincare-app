import React, { useState } from 'react';
import {
  Bell,
  Sparkles,
  RotateCcw,
  Smartphone,
  CheckCircle2,
  Lock,
  ChevronRight,
  LogOut,
  LogIn
} from 'lucide-react';
import { PrivacyDataModal } from './PrivacyDataModal';
import { NotificationModal } from './NotificationModal';
import { SubscriptionModal } from './SubscriptionModal';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useNoor } from '../../context/NoorContext';

export const ProfileView: React.FC = () => {
  const {
    userProfile,
    updateUserProfile,
    resetToSampleData,
    lastSyncedAt,
    setAuthModalOpen,
    signOut
  } = useNoor();

  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [notifModalOpen, setNotifModalOpen] = useState(false);
  const [subModalOpen, setSubModalOpen] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-8 sm:py-10 space-y-7 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-neutral-200">
        <div className="space-y-1">
          <span className="text-[10px] font-bold tracking-[0.24em] uppercase text-neutral-500 font-mono block">
            ACCOUNT & CONFIGURATION
          </span>
          <h1 className="text-3xl sm:text-4xl text-black font-bold tracking-tight">
            Profile & Privacy
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 font-normal pt-0.5">
            Personal skin parameters, cross-platform cloud state, and data sovereignty.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {userProfile.isLoggedIn ? (
            <Button
              variant="outline"
              size="sm"
              onClick={signOut}
              leftIcon={<LogOut className="w-3.5 h-3.5 stroke-[1.5]" />}
            >
              Sign Out
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setAuthModalOpen(true)}
              leftIcon={<LogIn className="w-3.5 h-3.5 stroke-[1.5]" />}
            >
              Sign In
            </Button>
          )}
        </div>
      </div>

      {/* User Card */}
      <Card className="border-neutral-200 space-y-4 bg-white">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-sm bg-black text-white flex items-center justify-center font-bold text-lg">
              {userProfile.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl text-black font-bold">
                  {userProfile.name}
                </h3>
                <Badge variant="neutral" size="xs">
                  {userProfile.membershipTier}
                </Badge>
              </div>
              <p className="text-xs text-neutral-500 font-mono mt-0.5">{userProfile.email}</p>
            </div>
          </div>

          <button
            onClick={() => setSubModalOpen(true)}
            className="text-xs text-black hover:underline font-semibold cursor-pointer"
          >
            Manage Tier →
          </button>
        </div>

        {/* Skin Profile Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-neutral-100 text-xs">
          <div>
            <span className="text-neutral-400 text-[10px] uppercase font-bold font-mono block">Skin Type</span>
            <strong className="text-black font-semibold text-sm">{userProfile.skinType}</strong>
          </div>
          <div>
            <span className="text-neutral-400 text-[10px] uppercase font-bold font-mono block">Sensitivity</span>
            <strong className="text-black font-semibold text-sm">{userProfile.sensitivity}</strong>
          </div>
          <div>
            <span className="text-neutral-400 text-[10px] uppercase font-bold font-mono block">Rhythm</span>
            <strong className="text-black font-semibold text-sm truncate block">
              {userProfile.routinePreference.split(' ')[0]}
            </strong>
          </div>
          <div>
            <span className="text-neutral-400 text-[10px] uppercase font-bold font-mono block">Status</span>
            <strong className="text-black font-semibold text-sm">{userProfile.qualitativeStatus}</strong>
          </div>
        </div>
      </Card>

      {/* Cross-Platform Cloud State */}
      <Card className="border-neutral-200 bg-neutral-50 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-black stroke-[1.5]" />
            <h4 className="text-base text-black font-bold">
              One Account • Multi-Platform Synchronization
            </h4>
          </div>
          <Badge variant="dark" size="xs">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Cloud Sync Active
          </Badge>
        </div>
        <p className="text-xs text-neutral-600 leading-relaxed font-normal">
          Your skin history, shelf formulas, custom rituals, and AI memory are unified in a single cloud profile accessible seamlessly across iPhone, Android, and Web.
        </p>
        <div className="flex items-center gap-4 pt-1 text-[11px] text-neutral-500 font-mono border-t border-neutral-200">
          <span>• iPhone: SYNCHRONIZED</span>
          <span>• Android: SYNCHRONIZED</span>
          <span>• Web: LIVE</span>
          <span className="ml-auto">SYNC: {lastSyncedAt.toUpperCase()}</span>
        </div>
      </Card>

      {/* Configuration Action List */}
      <div className="space-y-2">
        <button
          onClick={() => setPrivacyModalOpen(true)}
          className="w-full p-4 rounded-md bg-white hover:bg-neutral-50 border border-neutral-200 hover:border-black flex items-center justify-between transition-colors text-left cursor-pointer group shadow-2xs"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-2 rounded-xs bg-neutral-100 text-black">
              <Lock className="w-4 h-4 stroke-[1.5]" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-black">
                Privacy Controls & Data Export
              </h4>
              <p className="text-xs text-neutral-500 mt-0.5">
                Export complete JSON archive, review encryption status, or erase records.
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400 stroke-[1.5]" />
        </button>

        <button
          onClick={() => setNotifModalOpen(true)}
          className="w-full p-4 rounded-md bg-white hover:bg-neutral-50 border border-neutral-200 hover:border-black flex items-center justify-between transition-colors text-left cursor-pointer group shadow-2xs"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-2 rounded-xs bg-neutral-100 text-black">
              <Bell className="w-4 h-4 stroke-[1.5]" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-black">
                Ritual Reminders & Notifications
              </h4>
              <p className="text-xs text-neutral-500 mt-0.5">
                Gentle AM and PM reminder scheduling without guilt mechanics.
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400 stroke-[1.5]" />
        </button>

        <button
          onClick={() => setSubModalOpen(true)}
          className="w-full p-4 rounded-md bg-white hover:bg-neutral-50 border border-neutral-200 hover:border-black flex items-center justify-between transition-colors text-left cursor-pointer group shadow-2xs"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-2 rounded-xs bg-neutral-100 text-black">
              <Sparkles className="w-4 h-4 stroke-[1.5]" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-black">
                Membership Tier (Free vs NOOR Privilege)
              </h4>
              <p className="text-xs text-neutral-500 mt-0.5">
                Review subscription capabilities and transparent limits.
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400 stroke-[1.5]" />
        </button>
      </div>

      {/* Developer / Demo tools */}
      <div className="pt-4 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500 font-mono">
        <span>NOOR SYSTEM • BLACK & WHITE EDITION</span>

        <button
          onClick={resetToSampleData}
          className="text-xs text-neutral-600 hover:text-black flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3 h-3 stroke-[1.5]" />
          <span>Reset to Reference Profile</span>
        </button>
      </div>

      {/* Modals */}
      <PrivacyDataModal
        isOpen={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
      />

      <NotificationModal
        isOpen={notifModalOpen}
        onClose={() => setNotifModalOpen(false)}
      />

      <SubscriptionModal
        isOpen={subModalOpen}
        onClose={() => setSubModalOpen(false)}
      />
    </div>
  );
};
