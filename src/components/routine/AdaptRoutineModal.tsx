import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { ShieldAlert, Droplets, ZapOff, RefreshCw } from 'lucide-react';
import { useNoor } from '../../context/NoorContext';

interface AdaptRoutineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdaptRoutineModal: React.FC<AdaptRoutineModalProps> = ({ isOpen, onClose }) => {
  const { adaptRoutine, activeAdaptation } = useNoor();

  const handleSelect = (type: 'hydration_boost' | 'pause_actives' | 'minimalist' | 'reset') => {
    adaptRoutine(type);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Adapt Ritual to Today's Skin"
      subtitle="Skin is dynamic. Adjust your steps temporarily based on barrier feedback."
      maxWidth="md"
    >
      <div className="space-y-3">
        {/* Option 1: Barrier Rest Mode */}
        <div
          onClick={() => handleSelect('pause_actives')}
          className="p-4 rounded-md border border-neutral-300 bg-white hover:border-black transition-all cursor-pointer group"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xs bg-neutral-100 text-black border border-neutral-200 shrink-0 mt-0.5">
              <ShieldAlert className="w-4 h-4 stroke-[1.5]" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-black group-hover:underline">
                Skin Stinging or Irritated? (Barrier Rest Mode)
              </h4>
              <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                Immediately pauses retinoids and chemical exfoliants for 48 hours. Retains only gentle cleanser and barrier-restoring lipid moisturizer.
              </p>
            </div>
          </div>
        </div>

        {/* Option 2: Parched / Dry Skin */}
        <div
          onClick={() => handleSelect('hydration_boost')}
          className="p-4 rounded-md border border-neutral-300 bg-white hover:border-black transition-all cursor-pointer group"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xs bg-neutral-100 text-black border border-neutral-200 shrink-0 mt-0.5">
              <Droplets className="w-4 h-4 stroke-[1.5]" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-black group-hover:underline">
                Skin Parched or Flaking? (Hydration Recovery)
              </h4>
              <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                Prioritizes double-layering milky essence onto damp skin and sealing with a rich ceramide lipid balm.
              </p>
            </div>
          </div>
        </div>

        {/* Option 3: Minimalist 3-Step */}
        <div
          onClick={() => handleSelect('minimalist')}
          className="p-4 rounded-md border border-neutral-300 bg-white hover:border-black transition-all cursor-pointer group"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xs bg-neutral-100 text-black border border-neutral-200 shrink-0 mt-0.5">
              <ZapOff className="w-4 h-4 stroke-[1.5]" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-black group-hover:underline">
                Short on Time or Traveling? (Minimalist 3-Step)
              </h4>
              <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                Streamlines your ritual to the 3 non-negotiables: Gentle Cleanse, Hydrating Seal, and Broad-Spectrum SPF.
              </p>
            </div>
          </div>
        </div>

        {/* Reset button if adaptation active */}
        {activeAdaptation && (
          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => handleSelect('reset')}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Reset to Standard Ritual
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};
