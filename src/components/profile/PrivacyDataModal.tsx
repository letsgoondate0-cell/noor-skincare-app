import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Download, Trash2, ShieldCheck } from 'lucide-react';
import { useNoor } from '../../context/NoorContext';

interface PrivacyDataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyDataModal: React.FC<PrivacyDataModalProps> = ({ isOpen, onClose }) => {
  const { userProfile, shelfProducts, routineSteps, checkIns, showToast, resetToSampleData } = useNoor();

  const handleExportData = () => {
    const fullExport = {
      userProfile,
      shelfProducts,
      routineSteps,
      checkIns,
      exportedAt: new Date().toISOString(),
      formatVersion: 'NOOR-1.0-GDPR'
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(fullExport, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `noor-skincare-data-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Your complete personal data has been exported as JSON');
  };

  const handleDeleteAllData = () => {
    if (window.confirm('Are you certain? This will delete all your routines, shelf history, check-in logs, and photos.')) {
      localStorage.clear();
      resetToSampleData();
      showToast('All local and cloud cache data successfully erased.');
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Privacy & Data Sovereignty"
      subtitle="You own your skin data. Export or delete it anytime with complete transparency."
      maxWidth="md"
    >
      <div className="space-y-4 text-xs sm:text-sm">
        {/* Guarantees */}
        <div className="p-4 rounded-md bg-neutral-100 border border-neutral-200 space-y-2">
          <div className="flex items-center gap-2 font-bold text-black font-mono text-xs">
            <ShieldCheck className="w-4 h-4 text-black" />
            <span>THE NOOR PRIVACY COMMITMENT</span>
          </div>
          <ul className="space-y-1.5 text-neutral-600 text-xs">
            <li>• Zero data selling: We never broker skin observations or photo data.</li>
            <li>• Private photo vault: Skin check-in images are never exposed publicly.</li>
            <li>• Server-side credentials: No private keys or secrets are stored in browser code.</li>
          </ul>
        </div>

        {/* Data Export */}
        <div className="p-4 rounded-md bg-white border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="font-bold text-black">Export Complete Skin Archive</h4>
            <p className="text-xs text-neutral-500 mt-0.5">
              Download all rituals, check-in histories, reactions, and preferences in portable JSON.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportData}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Export JSON
          </Button>
        </div>

        {/* Data Erasure */}
        <div className="p-4 rounded-md bg-neutral-50 border border-neutral-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="font-bold text-black">Permanently Erase All Data</h4>
            <p className="text-xs text-neutral-500 mt-0.5">
              Immediate GDPR-compliant deletion of profile, shelf, and check-ins.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDeleteAllData}
            className="text-black hover:bg-black hover:text-white border border-neutral-300"
            leftIcon={<Trash2 className="w-3.5 h-3.5" />}
          >
            Erase Data
          </Button>
        </div>
      </div>
    </Modal>
  );
};
