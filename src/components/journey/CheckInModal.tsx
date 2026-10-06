import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import {
  Camera,
  Check,
  Lock
} from 'lucide-react';
import { useNoor } from '../../context/NoorContext';
import { QualitativeSkinStatus } from '../../types';

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckInModal: React.FC<CheckInModalProps> = ({ isOpen, onClose }) => {
  const { addCheckIn } = useNoor();

  const [hydration, setHydration] = useState<
    'Parched' | 'Slightly dry' | 'Balanced' | 'Plump & dewy'
  >('Balanced');
  const [barrier, setBarrier] = useState<
    'Stinging / Irritated' | 'Sensitive' | 'Calm' | 'Resilient'
  >('Calm');
  const [clarity, setClarity] = useState<
    'Active breakouts' | 'Minor blemishes' | 'Clear & smooth'
  >('Clear & smooth');
  const [notes, setNotes] = useState('');
  const [photoIncluded, setPhotoIncluded] = useState(false);
  const [photoNote, setPhotoNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let qualitativeState: QualitativeSkinStatus = 'Stable';
    if (barrier === 'Resilient' && hydration === 'Plump & dewy') {
      qualitativeState = 'Improving';
    } else if (barrier === 'Stinging / Irritated' || barrier === 'Sensitive') {
      qualitativeState = 'Needs attention';
    }

    const qualitativeSummary =
      qualitativeState === 'Improving'
        ? 'Barrier resilience is peaking with supple hydration.'
        : qualitativeState === 'Needs attention'
        ? 'Barrier shows reactivity. Focus on restorative ceramides.'
        : 'Skin equilibrium is balanced and calm.';

    addCheckIn({
      hydrationLevel: hydration,
      barrierState: barrier,
      clarityState: clarity,
      qualitativeState,
      qualitativeSummary,
      notes: notes.trim() || undefined,
      photoUrl: photoIncluded
        ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'
        : undefined,
      photoNote: photoIncluded ? photoNote : undefined
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Skin Journal Check-In"
      subtitle="Reflect on how your skin feels today. Photos are strictly optional and stored privately."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
        {/* Hydration State */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono mb-1.5">
            1. HOW HYDRATED DOES YOUR SKIN FEEL?
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(
              ['Parched', 'Slightly dry', 'Balanced', 'Plump & dewy'] as const
            ).map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => setHydration(opt)}
                className={`p-2.5 rounded-sm border text-left font-medium transition-all cursor-pointer flex items-center justify-between ${
                  hydration === opt
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-neutral-800 border-neutral-200 hover:border-black'
                }`}
              >
                <span>{opt}</span>
                {hydration === opt && <Check className="w-3.5 h-3.5 stroke-[2]" />}
              </button>
            ))}
          </div>
        </div>

        {/* Barrier State */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono mb-1.5">
            2. BARRIER SENSITIVITY / REACTIVITY
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(
              ['Stinging / Irritated', 'Sensitive', 'Calm', 'Resilient'] as const
            ).map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => setBarrier(opt)}
                className={`p-2.5 rounded-sm border text-left font-medium transition-all cursor-pointer flex items-center justify-between ${
                  barrier === opt
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-neutral-800 border-neutral-200 hover:border-black'
                }`}
              >
                <span>{opt}</span>
                {barrier === opt && <Check className="w-3.5 h-3.5 stroke-[2]" />}
              </button>
            ))}
          </div>
        </div>

        {/* Clarity State */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono mb-1.5">
            3. CLARITY & TEXTURE
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(
              ['Active breakouts', 'Minor blemishes', 'Clear & smooth'] as const
            ).map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => setClarity(opt)}
                className={`p-2.5 rounded-sm border text-left font-medium transition-all cursor-pointer flex items-center justify-between ${
                  clarity === opt
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-neutral-800 border-neutral-200 hover:border-black'
                }`}
              >
                <span className="truncate">{opt}</span>
                {clarity === opt && <Check className="w-3.5 h-3.5 stroke-[2]" />}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono mb-1.5">
            OBSERVATIONS OR CONTEXT (OPTIONAL)
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="e.g. Skin felt soft after cleansing; zero morning redness."
            className="w-full bg-white border border-neutral-300 rounded-sm p-3 text-xs text-black focus:outline-none focus:border-black"
          />
        </div>

        {/* Optional Private Photo */}
        <div className="p-3.5 rounded-sm bg-neutral-50 border border-neutral-200 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-black stroke-[1.5]" />
              <span className="text-xs font-semibold text-black">
                Private Skin Photo (Optional)
              </span>
            </div>
            <label className="flex items-center gap-1.5 text-xs text-neutral-700 cursor-pointer">
              <input
                type="checkbox"
                checked={photoIncluded}
                onChange={e => setPhotoIncluded(e.target.checked)}
                className="w-4 h-4 accent-black rounded cursor-pointer"
              />
              <span>Attach Photo</span>
            </label>
          </div>

          {photoIncluded && (
            <div className="pt-2 animate-in fade-in space-y-2">
              <input
                type="text"
                value={photoNote}
                onChange={e => setPhotoNote(e.target.value)}
                placeholder="Optional lighting note (e.g. Indirect morning window light)"
                className="w-full bg-white border border-neutral-300 rounded-sm px-3 py-1.5 text-xs text-black"
              />
              <div className="flex items-center gap-1.5 text-[11px] text-neutral-500">
                <Lock className="w-3 h-3 text-black" />
                <span>Encrypted private storage. Never shared or used for public training.</span>
              </div>
            </div>
          )}
        </div>

        <Button type="submit" variant="primary" className="w-full mt-2">
          Save Skin Journal Entry
        </Button>
      </form>
    </Modal>
  );
};
