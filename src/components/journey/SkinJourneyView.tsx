import React, { useState } from 'react';
import {
  Plus,
  Calendar,
  Lock,
  TrendingUp,
  Activity,
  CheckCircle2,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { CheckInModal } from './CheckInModal';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useNoor } from '../../context/NoorContext';

export const SkinJourneyView: React.FC = () => {
  const { checkIns, consistencyDays, userProfile } = useNoor();
  const [checkInModalOpen, setCheckInModalOpen] = useState(false);

  // Calculate authentic weekly adherence
  const totalDays = consistencyDays.length || 7;
  const amDone = consistencyDays.filter(d => d.morningCompleted).length;
  const pmDone = consistencyDays.filter(d => d.eveningCompleted).length;
  const adherenceRate = Math.round(((amDone + pmDone) / (totalDays * 2)) * 100);

  // Derive skin trend states from actual check-ins
  const improvingCount = checkIns.filter(c => c.qualitativeState === 'Improving').length;
  const stableCount = checkIns.filter(c => c.qualitativeState === 'Stable').length;
  const attentionCount = checkIns.filter(c => c.qualitativeState === 'Needs attention').length;

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-8 sm:py-10 space-y-7 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-neutral-200">
        <div className="space-y-1">
          <span className="text-[10px] font-bold tracking-[0.24em] uppercase text-neutral-500 font-mono block">
            YOUR LONG-TERM PROGRESS
          </span>
          <h1 className="text-3xl sm:text-4xl text-black font-bold tracking-tight">
            Skin Journey
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 font-normal pt-0.5">
            Observing meaningful trends, barrier adaptation, and consistency without toxic streak pressure.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setCheckInModalOpen(true)}
          leftIcon={<Plus className="w-3.5 h-3.5 stroke-[2]" />}
        >
          New Check-In
        </Button>
      </div>

      {/* Dedicated Weekly Progress & Qualitative Trends Section */}
      <Card className="border-neutral-200 bg-white space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-3">
          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-500 font-mono tracking-wider block">
              WEEKLY PROGRESS & ADHERENCE
            </span>
            <h3 className="text-xl text-black font-bold mt-0.5">
              Ritual Consistency & Skin Trends
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2.5 py-1 bg-black text-white">
              {adherenceRate}% Adherence
            </span>
            <Badge variant="dark" size="xs">
              {userProfile.qualitativeStatus}
            </Badge>
          </div>
        </div>

        {/* 3 Metric Pillars: Adherence, State Distribution, Reassurance */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 bg-neutral-50 border border-neutral-200 space-y-1">
            <span className="text-[10px] font-mono uppercase text-neutral-500 font-bold">
              Morning & Evening Adherence
            </span>
            <div className="text-2xl font-bold font-mono text-black">
              {amDone + pmDone} / {totalDays * 2}
            </div>
            <p className="text-[11px] text-neutral-600">
              Completed ritual steps recorded this week.
            </p>
          </div>

          <div className="p-3.5 bg-neutral-50 border border-neutral-200 space-y-1">
            <span className="text-[10px] font-mono uppercase text-neutral-500 font-bold">
              Qualitative Skin State Trends
            </span>
            <div className="flex items-center gap-3 pt-1">
              <div>
                <span className="text-xs font-bold text-black block">{improvingCount}</span>
                <span className="text-[10px] text-neutral-500 font-mono">Improving</span>
              </div>
              <div className="h-6 w-[1px] bg-neutral-300" />
              <div>
                <span className="text-xs font-bold text-black block">{stableCount}</span>
                <span className="text-[10px] text-neutral-500 font-mono">Stable</span>
              </div>
              <div className="h-6 w-[1px] bg-neutral-300" />
              <div>
                <span className="text-xs font-bold text-black block">{attentionCount}</span>
                <span className="text-[10px] text-neutral-500 font-mono">Attention</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-neutral-50 border border-neutral-200 space-y-1">
            <span className="text-[10px] font-mono uppercase text-neutral-500 font-bold">
              Scientific Ethics
            </span>
            <div className="text-xs font-semibold text-black pt-0.5">
              Zero Artificial Precision Scores
            </div>
            <p className="text-[11px] text-neutral-600 leading-relaxed">
              NOOR rejects fake "78/100" algorithms. Skin biology is dynamic and qualitative.
            </p>
          </div>
        </div>
      </Card>

      {/* Meaningful Milestones */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <Card className="p-5 border-neutral-200 space-y-1.5">
          <span className="text-[10px] uppercase font-bold text-neutral-500 font-mono tracking-wider">
            BARRIER MILESTONE
          </span>
          <h4 className="text-lg text-black font-bold">
            18 Days Acid-Calm
          </h4>
          <p className="text-xs text-neutral-600 leading-relaxed font-normal">
            Zero stripping episodes since transitioning to amino acid cleanse.
          </p>
        </Card>

        <Card className="p-5 border-neutral-200 space-y-1.5">
          <span className="text-[10px] uppercase font-bold text-neutral-500 font-mono tracking-wider">
            ACTIVE TOLERANCE
          </span>
          <h4 className="text-lg text-black font-bold">
            Retinaldehyde 0.05%
          </h4>
          <p className="text-xs text-neutral-600 leading-relaxed font-normal">
            Stabilized at 2x weekly evening application with zero flaking.
          </p>
        </Card>

        <Card className="p-5 border-neutral-200 space-y-1.5">
          <span className="text-[10px] uppercase font-bold text-neutral-500 font-mono tracking-wider">
            HYDRATION TREND
          </span>
          <h4 className="text-lg text-black font-bold">
            Consistent Plumpness
          </h4>
          <p className="text-xs text-neutral-600 leading-relaxed font-normal">
            Stratum corneum logs show 4 consecutive balanced check-ins.
          </p>
        </Card>
      </div>

      {/* Daily Rhythm Calendar (No streak guilt) */}
      <Card className="border-neutral-200 space-y-3.5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl text-black font-bold">
              Weekly Adherence Rhythm
            </h3>
            <p className="text-xs text-neutral-600 mt-0.5">
              Gentle adherence over recent days. Missed days are normal; your barrier forgives.
            </p>
          </div>
          <Badge variant="neutral" size="xs">
            Balanced Cadence
          </Badge>
        </div>

        <div className="grid grid-cols-7 gap-2 pt-1">
          {consistencyDays.map((day, idx) => {
            const dateObj = new Date(day.date);
            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'narrow' });
            const dayNumber = dateObj.getDate();

            return (
              <div
                key={idx}
                className="flex flex-col items-center p-2.5 rounded-none bg-neutral-50 border border-neutral-200 text-center"
              >
                <span className="text-[10px] uppercase font-bold text-neutral-400 font-mono">
                  {dayName}
                </span>
                <span className="text-xs font-bold text-black my-1 font-mono">
                  {dayNumber}
                </span>
                <div className="flex gap-1">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      day.morningCompleted ? 'bg-black' : 'bg-neutral-300'
                    }`}
                    title="AM Routine"
                  />
                  <div
                    className={`w-2 h-2 rounded-full ${
                      day.eveningCompleted ? 'bg-black' : 'bg-neutral-300'
                    }`}
                    title="PM Routine"
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-2 text-[11px] text-neutral-500 border-t border-neutral-100 font-mono">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-black" /> COMPLETED
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-neutral-300" /> REST
            </span>
          </div>
          <span>REST DAYS NOURISH THE STRATUM CORNEUM</span>
        </div>
      </Card>

      {/* Check-In Journal Timeline */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xl sm:text-2xl text-black font-bold">
            Check-In History
          </h3>
          <span className="text-xs text-neutral-400 font-mono">
            {checkIns.length} ENTRIES
          </span>
        </div>

        <div className="space-y-3">
          {checkIns.map(chk => (
            <div
              key={chk.id}
              className="p-5 rounded-none bg-white border border-neutral-200 space-y-3 shadow-2xs"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-black font-mono">
                      {new Date(chk.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      }).toUpperCase()}
                    </span>
                    <Badge variant="neutral" size="xs">
                      {chk.qualitativeState}
                    </Badge>
                  </div>
                  <h4 className="text-base text-black font-semibold mt-1">
                    {chk.qualitativeSummary}
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-neutral-400">
                  PRIVATE LOG
                </span>
              </div>

              {/* Sensory & Barrier Indicators */}
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="px-2.5 py-1 bg-neutral-100 border border-neutral-200 text-black text-[11px] font-mono">
                  Hydration: {chk.hydrationLevel}
                </span>
                <span className="px-2.5 py-1 bg-neutral-100 border border-neutral-200 text-black text-[11px] font-mono">
                  Barrier: {chk.barrierState}
                </span>
                <span className="px-2.5 py-1 bg-neutral-100 border border-neutral-200 text-black text-[11px] font-mono">
                  Clarity: {chk.clarityState}
                </span>
              </div>

              {chk.notes && (
                <p className="text-xs text-neutral-600 bg-neutral-50 p-3 rounded-none border border-neutral-100 leading-relaxed">
                  "{chk.notes}"
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <CheckInModal
        isOpen={checkInModalOpen}
        onClose={() => setCheckInModalOpen(false)}
      />
    </div>
  );
};
