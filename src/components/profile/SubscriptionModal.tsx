import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Check } from 'lucide-react';
import { useNoor } from '../../context/NoorContext';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose }) => {
  const { userProfile, updateUserProfile, showToast } = useNoor();

  const handleToggle = (tier: 'Free' | 'Privilege') => {
    updateUserProfile({ membershipTier: tier });
    showToast(`Membership set to NOOR ${tier}`);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="NOOR Membership Architecture"
      subtitle="Free provides complete value. Privilege unlocks deep formulation intelligence."
      maxWidth="lg"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
        {/* Free Plan */}
        <div className="p-5 rounded-md bg-white border border-neutral-300 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-lg text-black font-bold">Standard Sanctuary</h4>
              <Badge variant="neutral" size="xs">Included</Badge>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Every essential feature to understand your skin, optimize owned formulas, and track daily rituals.
            </p>
            <ul className="space-y-2 text-xs text-neutral-800">
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-black shrink-0 mt-0.5 stroke-[2]" />
                <span>Complete skin profile & barrier assessment</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-black shrink-0 mt-0.5 stroke-[2]" />
                <span>Unlimited products in My Shelf</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-black shrink-0 mt-0.5 stroke-[2]" />
                <span>AM & PM ritual sequencing & tracking</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-black shrink-0 mt-0.5 stroke-[2]" />
                <span>Standard Ask NOOR skin consultation</span>
              </li>
            </ul>
          </div>

          <Button
            variant={userProfile.membershipTier === 'Free' ? 'outline' : 'secondary'}
            size="sm"
            className="w-full"
            onClick={() => handleToggle('Free')}
          >
            {userProfile.membershipTier === 'Free' ? 'Current Tier (Active)' : 'Select Free'}
          </Button>
        </div>

        {/* NOOR Privilege */}
        <div className="p-5 rounded-md bg-black text-white border-2 border-black space-y-4 flex flex-col justify-between shadow-lg">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-lg text-white font-bold">NOOR Privilege</h4>
              <Badge variant="dark" size="xs" className="border-neutral-700 bg-neutral-900">
                Premium System
              </Badge>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              For individuals seeking continuous formulation analysis, seasonal climate adaptation, and long-term cellular trends.
            </p>
            <ul className="space-y-2 text-xs text-neutral-300">
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-white shrink-0 mt-0.5 stroke-[2]" />
                <span>Continuous conversational memory & action execution</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-white shrink-0 mt-0.5 stroke-[2]" />
                <span>Deep INCI ingredient collision detection</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-white shrink-0 mt-0.5 stroke-[2]" />
                <span>Temporary adaptive rituals (Barrier Rest & Hydration)</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-white shrink-0 mt-0.5 stroke-[2]" />
                <span>Private photo journal with encrypted cloud sync</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleToggle('Privilege')}
            className="w-full py-2.5 px-4 rounded-sm text-xs font-bold uppercase tracking-wider bg-white text-black hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            {userProfile.membershipTier === 'Privilege' ? 'Current Active Tier' : 'Activate Privilege'}
          </button>
        </div>
      </div>
    </Modal>
  );
};
