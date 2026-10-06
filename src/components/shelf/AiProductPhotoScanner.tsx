import React, { useState, useRef } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import {
  Camera,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  RefreshCw,
  Sun,
  Moon,
  Layers,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useNoor } from '../../context/NoorContext';
import { Product, ProductCategory, RoutineStep } from '../../types';
import { analyzeProductPhotoApi, ProductRecognitionResult } from '../../services/api';

interface AiProductPhotoScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded?: (product: Product) => void;
}

export const AiProductPhotoScanner: React.FC<AiProductPhotoScannerProps> = ({
  isOpen,
  onClose,
  onProductAdded
}) => {
  const { userProfile, addProductToShelf, addRoutineStep, routineSteps, showToast } = useNoor();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [textHint, setTextHint] = useState<string>('');
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [scanStep, setScanStep] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<ProductRecognitionResult | null>(null);
  const [editableBrand, setEditableBrand] = useState('');
  const [editableName, setEditableName] = useState('');
  const [editableCategory, setEditableCategory] = useState<ProductCategory>('Moisturizer');
  const [editableSlot, setEditableSlot] = useState<'Morning' | 'Evening' | 'Both'>('Both');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Curated demo test samples for immediate testing
  const sampleBottles = [
    {
      label: 'CeraVe Hydrating Cleanser',
      brand: 'CeraVe',
      hint: 'CeraVe Hydrating Facial Cleanser with ceramides and hyaluronic acid for normal to dry skin',
      category: 'Cleanser' as ProductCategory,
      preview: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80'
    },
    {
      label: 'La Roche-Posay Anthelios SPF 50+',
      brand: 'La Roche-Posay',
      hint: 'La Roche-Posay Anthelios Light Fluid Broad Spectrum SPF 50 mineral sunscreen',
      category: 'SPF' as ProductCategory,
      preview: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=400&q=80'
    },
    {
      label: "Paula's Choice 2% BHA Liquid Exfoliant",
      brand: "Paula's Choice",
      hint: "Paula's Choice Skin Perfecting 2% BHA Liquid Salicylic Acid Exfoliant",
      category: 'Exfoliant' as ProductCategory,
      preview: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80'
    },
    {
      label: 'The Ordinary Niacinamide 10% + Zinc 1%',
      brand: 'The Ordinary',
      hint: 'The Ordinary Niacinamide 10% + Zinc 1% high-strength vitamin and mineral blemish formula',
      category: 'Serum' as ProductCategory,
      preview: 'https://images.unsplash.com/photo-1608248597359-00508e2f896b?auto=format&fit=crop&w=400&q=80'
    }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setImagePreview(base64);
      triggerAnalysis(base64, file.name.replace(/\.[^/.]+$/, ''));
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = (sample: typeof sampleBottles[0]) => {
    setImagePreview(sample.preview);
    setTextHint(sample.hint);
    triggerAnalysis(sample.preview, sample.hint);
  };

  const triggerAnalysis = async (imgData: string, hint: string) => {
    setAnalyzing(true);
    setAnalysisResult(null);

    // Realistic multi-stage HUD scanning feedback
    setScanStep('Detecting label geometry and packaging typography...');
    await new Promise(r => setTimeout(r, 450));

    setScanStep('Identifying active chemical compounds & lipid carriers...');
    await new Promise(r => setTimeout(r, 400));

    setScanStep('Determining circadian routine placement & barrier compatibility...');

    try {
      const result = await analyzeProductPhotoApi(imgData, hint, userProfile);
      setAnalysisResult(result);
      setEditableBrand(result.brand);
      setEditableName(result.name);
      setEditableCategory(result.category as ProductCategory);
      
      const hasAm = result.routinePlacement.includes('Morning');
      const hasPm = result.routinePlacement.includes('Evening');
      if (hasAm && hasPm) {
        setEditableSlot('Both');
      } else if (hasAm) {
        setEditableSlot('Morning');
      } else {
        setEditableSlot('Evening');
      }
    } catch (err) {
      console.error('Error during AI analysis:', err);
    } finally {
      setAnalyzing(false);
      setScanStep('');
    }
  };

  const handleAddToShelfAndRoutine = () => {
    if (!analysisResult) return;

    const chosenPlacements: ('Morning' | 'Evening' | 'Weekly')[] =
      editableSlot === 'Both'
        ? ['Morning', 'Evening']
        : [editableSlot];

    const newProduct: Product = {
      id: `prod-ai-${Date.now()}`,
      brand: editableBrand.trim() || 'Recognized Brand',
      name: editableName.trim() || 'Recognized Formula',
      category: editableCategory,
      keyActives: analysisResult.keyActives,
      usageInstructions: analysisResult.usageTip,
      routinePlacement: chosenPlacements,
      targetConcerns: ['Dryness', 'Texture'],
      isFragranceFree: true,
      userReaction: 'Untested',
      imageUrl: imagePreview || undefined,
      isOwned: true,
      openedDate: new Date().toISOString().split('T')[0]
    };

    // 1. Add to My Shelf
    addProductToShelf(newProduct);

    // 2. Automatically slot into NOOR Morning / Evening Routine
    if (editableSlot === 'Morning' || editableSlot === 'Both') {
      const amStepNumber = getOptimalStepNumber('Morning', editableCategory);
      addRoutineStep({
        stepNumber: amStepNumber,
        timeOfDay: 'Morning',
        category: editableCategory,
        productId: newProduct.id,
        productName: newProduct.name,
        brand: newProduct.brand,
        usageTip: analysisResult.usageTip,
        whyChosen: analysisResult.whyChosen || `Integrated into Morning routine for ${userProfile.skinType.toLowerCase()} skin.`,
        isCompletedToday: false,
        frequency: analysisResult.frequency || 'Daily'
      });
    }

    if (editableSlot === 'Evening' || editableSlot === 'Both') {
      const pmStepNumber = getOptimalStepNumber('Evening', editableCategory);
      addRoutineStep({
        stepNumber: pmStepNumber,
        timeOfDay: 'Evening',
        category: editableCategory,
        productId: newProduct.id,
        productName: newProduct.name,
        brand: newProduct.brand,
        usageTip: analysisResult.usageTip,
        whyChosen: analysisResult.whyChosen || `Integrated into Evening nocturnal barrier routine.`,
        isCompletedToday: false,
        frequency: analysisResult.frequency || 'Daily'
      });
    }

    if (onProductAdded) {
      onProductAdded(newProduct);
    }

    showToast(`Added ${newProduct.name} to My Shelf and your ${editableSlot} routine.`);
    handleReset();
    onClose();
  };

  const getOptimalStepNumber = (timeOfDay: 'Morning' | 'Evening', cat: ProductCategory): number => {
    if (cat === 'Cleanser') return 1;
    if (cat === 'Toner' || cat === 'Essence') return 2;
    if (cat === 'Serum' || cat === 'Treatment' || cat === 'Exfoliant') return 3;
    if (cat === 'Moisturizer' || cat === 'Eye Cream') return 4;
    if (cat === 'SPF') return 5;
    return 6;
  };

  const handleReset = () => {
    setImagePreview(null);
    setTextHint('');
    setAnalysisResult(null);
    setAnalyzing(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        handleReset();
        onClose();
      }}
      title="AI Product Recognition & Setup"
      subtitle="Upload a photo of any product you own. NOOR extracts formulation actives and sequences your routine."
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Step 1: Upload or select photo if no analysis result */}
        {!analysisResult && !analyzing && (
          <div className="space-y-5">
            {/* Primary Drag & Drop / Photo Input */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-neutral-300 hover:border-black p-8 text-center transition-all cursor-pointer bg-neutral-50 hover:bg-white group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="w-12 h-12 bg-black text-white mx-auto flex items-center justify-center mb-3 transition-transform group-hover:scale-105">
                <Camera className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h3 className="text-sm font-bold text-black uppercase tracking-wider font-mono">
                Upload or Take Product Photo
              </h3>
              <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto leading-relaxed">
                Photograph front label, active ingredients list, or bottle. High contrast produces the best recognition.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-neutral-300 text-xs text-neutral-800 font-medium">
                <Upload className="w-3.5 h-3.5" />
                <span>Select from device</span>
              </div>
            </div>

            {/* Optional text hint */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500 font-bold">
                Optional Label Text or Name Hint
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={textHint}
                  onChange={e => setTextHint(e.target.value)}
                  placeholder="e.g. CeraVe hydrating cleanser or Paula's Choice 2% BHA"
                  className="flex-1 bg-white border border-neutral-300 px-3.5 py-2 text-xs sm:text-sm text-black placeholder-neutral-400 focus:outline-none focus:border-black transition-colors"
                />
                <Button
                  variant="primary"
                  size="sm"
                  disabled={!textHint.trim()}
                  onClick={() => triggerAnalysis('', textHint)}
                  leftIcon={<Sparkles className="w-3.5 h-3.5" />}
                >
                  Analyze Text
                </Button>
              </div>
            </div>

            {/* Quick Sample Photos for Instant Evaluation */}
            <div className="pt-2 border-t border-neutral-200 space-y-2.5">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400 block">
                Or test with sample bottle formulations:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {sampleBottles.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSample(sample)}
                    className="p-2.5 text-left bg-white border border-neutral-200 hover:border-black transition-all flex items-center justify-between cursor-pointer group"
                  >
                    <div>
                      <span className="text-[10px] font-mono uppercase font-bold text-neutral-400 block">
                        {sample.brand}
                      </span>
                      <span className="text-xs font-semibold text-black group-hover:text-black">
                        {sample.label}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-400 group-hover:text-black font-semibold">
                      Analyze →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Live AI Vision Analysis Scanning HUD */}
        {analyzing && (
          <div className="py-12 px-6 text-center space-y-6 bg-neutral-50 border border-neutral-200">
            {imagePreview && (
              <div className="w-32 h-32 mx-auto border-2 border-black overflow-hidden relative shadow-sm">
                <img
                  src={imagePreview}
                  alt="Scanning product"
                  className="w-full h-full object-cover grayscale"
                />
                <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                  <div className="w-full h-0.5 bg-black animate-pulse shadow-[0_0_8px_rgba(0,0,0,0.8)]" />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white text-[10px] font-mono uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                <span>NOOR AI VISION IN PROGRESS</span>
              </div>
              <h3 className="text-base font-bold text-black tracking-tight">
                Examining Skincare Formulation
              </h3>
              <p className="text-xs text-neutral-500 font-mono animate-pulse">
                {scanStep}
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Structured AI Recognition Results & Setup */}
        {analysisResult && !analyzing && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Top Success Banner */}
            <div className="p-3.5 bg-neutral-100 border border-neutral-300 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-black stroke-[2]" />
                <span className="text-xs font-semibold text-black">
                  Product identified with {analysisResult.confidence || 'High'} confidence
                </span>
              </div>
              <span className="text-[10px] font-mono text-neutral-500 uppercase">
                {analysisResult.analyzedBy || 'NOOR Engine'}
              </span>
            </div>

            {/* Editable Product Details Card */}
            <div className="p-4 border border-neutral-200 bg-white space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500 font-bold mb-1">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    value={editableBrand}
                    onChange={e => setEditableBrand(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-300 px-3 py-2 text-xs font-semibold text-black focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500 font-bold mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={editableName}
                    onChange={e => setEditableName(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-300 px-3 py-2 text-xs font-semibold text-black focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500 font-bold mb-1">
                    Category Classification
                  </label>
                  <select
                    value={editableCategory}
                    onChange={e => setEditableCategory(e.target.value as ProductCategory)}
                    className="w-full bg-neutral-50 border border-neutral-300 px-3 py-2 text-xs text-black focus:outline-none focus:border-black cursor-pointer font-medium"
                  >
                    <option value="Cleanser">Cleanser</option>
                    <option value="Toner">Toner</option>
                    <option value="Essence">Essence</option>
                    <option value="Serum">Serum</option>
                    <option value="Treatment">Treatment</option>
                    <option value="Exfoliant">Exfoliant</option>
                    <option value="Moisturizer">Moisturizer</option>
                    <option value="SPF">SPF (Sunscreen)</option>
                    <option value="Face Oil">Face Oil</option>
                    <option value="Eye Cream">Eye Cream</option>
                    <option value="Mask">Mask</option>
                    <option value="Spot Treatment">Spot Treatment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500 font-bold mb-1">
                    Assigned Routine Slot
                  </label>
                  <div className="flex border border-neutral-300">
                    <button
                      type="button"
                      onClick={() => setEditableSlot('Morning')}
                      className={`flex-1 py-1.5 text-xs font-medium cursor-pointer transition-colors ${
                        editableSlot === 'Morning' ? 'bg-black text-white font-bold' : 'bg-white text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      Morning
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditableSlot('Evening')}
                      className={`flex-1 py-1.5 text-xs font-medium cursor-pointer transition-colors ${
                        editableSlot === 'Evening' ? 'bg-black text-white font-bold' : 'bg-white text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      Evening
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditableSlot('Both')}
                      className={`flex-1 py-1.5 text-xs font-medium cursor-pointer transition-colors ${
                        editableSlot === 'Both' ? 'bg-black text-white font-bold' : 'bg-white text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      Both AM/PM
                    </button>
                  </div>
                </div>
              </div>

              {/* Detected Key Actives */}
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500 font-bold mb-1.5">
                  Detected Key Actives & Lipids
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {analysisResult.keyActives.map((active, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-neutral-100 border border-neutral-300 text-[11px] font-medium text-black"
                    >
                      {active}
                    </span>
                  ))}
                </div>
              </div>

              {/* Dermatological Usage Guidance */}
              <div className="p-3 bg-neutral-50 border border-neutral-200 space-y-1.5">
                <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase font-bold text-neutral-500">
                  <Clock className="w-3.5 h-3.5 text-black" />
                  <span>How & When To Use (Best Practice)</span>
                </div>
                <p className="text-xs text-neutral-700 leading-relaxed font-sans">
                  {analysisResult.usageTip}
                </p>
              </div>

              {/* Why Chosen & Skin Compatibility */}
              <div className="p-3 bg-neutral-50 border border-neutral-200 space-y-1.5">
                <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase font-bold text-neutral-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-black" />
                  <span>Barrier Reason & Compatibility</span>
                </div>
                <p className="text-xs text-neutral-700 leading-relaxed font-sans">
                  {analysisResult.whyChosen}
                </p>
                {analysisResult.suitabilityNotes && (
                  <p className="text-[11px] text-neutral-500 italic pt-1">
                    Note: {analysisResult.suitabilityNotes}
                  </p>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              >
                Scan Another
              </Button>

              <Button
                variant="primary"
                size="md"
                onClick={handleAddToShelfAndRoutine}
                rightIcon={<ArrowRight className="w-4 h-4 stroke-[2]" />}
              >
                Add to Shelf & Sequence Routine
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
