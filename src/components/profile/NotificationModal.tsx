import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Sun, Moon, Calendar } from 'lucide-react';
import { useNoor } from '../../context/NoorContext';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose }) => {
  const { showToast } = useNoor();

  const [amEnabled, setAmEnabled] = useState(true);
  const [amTime, setAmTime] = useState('08:00');
  const [pmEnabled, setPmEnabled] = useState(true);
  const [pmTime, setPmTime] = useState('21:30');
  const [weeklyCheckin, setWeeklyCheckin] = useState(true);

  const handleSave = () => {
    showToast('Intelligent reminders saved. No streak guilt.');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Gentle Routine Reminders"
      subtitle="NOOR helps you remember skincare without making it feel like homework."
      maxWidth="md"
    >
      <div className="space-y-4 text-xs sm:text-sm">
        {/* Morning reminder */}
        <div className="p-4 rounded-md bg-white border border-neutral-200 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 stroke-[1.5] text-black" />
              <h4 className="font-bold text-black">Morning Ritual Guidance</h4>
            </div>
            <input
              type="checkbox"
              checked={amEnabled}
              onChange={e => setAmEnabled(e.target.checked)}
              className="w-4 h-4 accent-black rounded-xs cursor-pointer"
            />
          </div>
          {amEnabled && (
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-neutral-500">Preferred AM time:</span>
              <input
                type="time"
                value={amTime}
                onChange={e => setAmTime(e.target.value)}
                className="bg-neutral-50 border border-neutral-300 rounded-sm px-2.5 py-1 text-xs text-black"
              />
            </div>
          )}
        </div>

        {/* Evening reminder */}
        <div className="p-4 rounded-md bg-white border border-neutral-200 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 stroke-[1.5] text-black" />
              <h4 className="font-bold text-black">Evening Wind-Down Ritual</h4>
            </div>
            <input
              type="checkbox"
              checked={pmEnabled}
              onChange={e => setPmEnabled(e.target.checked)}
              className="w-4 h-4 accent-black rounded-xs cursor-pointer"
            />
          </div>
          {pmEnabled && (
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-neutral-500">Preferred PM time:</span>
              <input
                type="time"
                value={pmTime}
                onChange={e => setPmTime(e.target.value)}
                className="bg-neutral-50 border border-neutral-300 rounded-sm px-2.5 py-1 text-xs text-black"
              />
            </div>
          )}
        </div>

        {/* Weekly Reflection */}
        <div className="p-4 rounded-md bg-white border border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 stroke-[1.5] text-black" />
            <div>
              <h4 className="font-bold text-black">Sunday Skin Check-In</h4>
              <p className="text-[11px] text-neutral-500">Gentle prompt to log barrier trends once a week.</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={weeklyCheckin}
            onChange={e => setWeeklyCheckin(e.target.checked)}
            className="w-4 h-4 accent-black rounded-xs cursor-pointer"
          />
        </div>

        <Button variant="primary" className="w-full mt-2" onClick={handleSave}>
          Save Preferences
        </Button>
      </div>
    </Modal>
  );
};
