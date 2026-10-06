import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import {
  Camera,
  Scan,
  Sparkles,
  CheckCircle2,
  Info,
  Layers
} from 'lucide-react';
import { useNoor } from '../../context/NoorContext';
import { Product, ProductCategory } from '../../types';

interface ProductScanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProductScanModal: React.FC<ProductScanModalProps> = ({ isOpen, onClose }) => {
  const { addProductToShelf } = useNoor();

  const [inputMode, setInputMode] = useState<'camera' | 'ocr_text'>('camera');
  const [analyzing, setAnalyzing] = useState(false);
  const [ingredientText, setIngredientText] = useState('');
  const [scannedProduct, setScannedProduct] = useState<Partial<Product> | null>(null);

  const samplePresets = [
    {
      label: 'Sample Label: Ceramide Barrier Cream',
      brand: 'Barrier Formulation Lab',
      name: 'Triple Ceramide Restorative Balm',
      category: 'Moisturizer' as ProductCategory,
      ingredients: 'Water, Glycerin, Caprylic/Capric Triglyceride, Ceramide NP, Ceramide AP, Phytosphingosine, Cholesterol, Carbomer, Dimethicone',
      actives: ['Ceramide NP', 'Ceramide AP', 'Cholesterol', 'Glycerin']
    },
    {
      label: 'Sample Label: Niacinamide & Zinc Fluid',
      brand: 'Pure Chemistry',
      name: 'Niacinamide 10% + Zinc 1% Clarity Serum',
      category: 'Serum' as ProductCategory,
      ingredients: 'Aqua (Water), Niacinamide, Pentylene Glycol, Zinc PCA, Dimethyl Isosorbide, Tamarindus Indica Seed Gum, Xanthan Gum, Phenoxyethanol',
      actives: ['Niacinamide 10%', 'Zinc PCA 1%']
    }
  ];

  const handleSimulateScan = (preset?: typeof samplePresets[0]) => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      const chosen = preset || samplePresets[0];
      setScannedProduct({
        brand: chosen.brand,
        name: chosen.name,
        category: chosen.category,
        keyActives: chosen.actives,
        allIngredients: chosen.ingredients.split(',').map(s => s.trim()),
        usageInstructions: 'Apply 1-2 pumps onto clean skin as directed by formulation label.',
        routinePlacement: ['Evening'],
        isFragranceFree: true,
        userReaction: 'Untested'
      });
    }, 800);
  };

  const handleTextAnalyze = () => {
    if (!ingredientText.trim()) return;
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      const parsedIngredients = ingredientText.split(/[,;\n]+/).map(s => s.trim()).filter(Boolean);
      const detectedActives = parsedIngredients.filter(ing => {
        const lower = ing.toLowerCase();
        return (
          lower.includes('ceramide') ||
          lower.includes('niacinamide') ||
          lower.includes('hyaluron') ||
          lower.includes('retin') ||
          lower.includes('centella') ||
          lower.includes('panthenol') ||
          lower.includes('squalane') ||
          lower.includes('zinc') ||
          lower.includes('ascorb')
        );
      });

      setScannedProduct({
        brand: 'Scanned Brand',
        name: 'Detected Skincare Formulation',
        category: 'Serum',
        keyActives: detectedActives.length > 0 ? detectedActives : ['Botanical Extracts', 'Glycerin'],
        allIngredients: parsedIngredients,
        usageInstructions: 'Apply as recommended for active serum category.',
        routinePlacement: ['Morning', 'Evening'],
        isFragranceFree: !ingredientText.toLowerCase().includes('fragrance') && !ingredientText.toLowerCase().includes('parfum'),
        userReaction: 'Untested'
      });
    }, 700);
  };

  const handleSaveToShelf = () => {
    if (!scannedProduct || !scannedProduct.name) return;
    addProductToShelf({
      brand: scannedProduct.brand || 'Scanned Product',
      name: scannedProduct.name,
      category: scannedProduct.category || 'Serum',
      keyActives: scannedProduct.keyActives || [],
      allIngredients: scannedProduct.allIngredients || [],
      usageInstructions: scannedProduct.usageInstructions || 'Apply gently onto clean face.',
      targetConcerns: ['Dryness'],
      isFragranceFree: scannedProduct.isFragranceFree ?? true,
      routinePlacement: scannedProduct.routinePlacement || ['Evening'],
      userReaction: 'Untested'
    });
    setScannedProduct(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setScannedProduct(null);
        onClose();
      }}
      title="Product Intelligence Scanner"
      subtitle="Clean recognition interface for OCR ingredient detection and label parsing."
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Mode selector */}
        <div className="flex items-center gap-2 border-b border-neutral-200 pb-3">
          <button
            onClick={() => { setScannedProduct(null); setInputMode('camera'); }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-sm text-xs font-medium cursor-pointer transition-all ${
              inputMode === 'camera'
                ? 'bg-black text-white font-semibold'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Bottle / Label Capture</span>
          </button>
          <button
            onClick={() => { setScannedProduct(null); setInputMode('ocr_text'); }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-sm text-xs font-medium cursor-pointer transition-all ${
              inputMode === 'ocr_text'
                ? 'bg-black text-white font-semibold'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            <Scan className="w-3.5 h-3.5" />
            <span>INCI Ingredient Text</span>
          </button>
        </div>

        {!scannedProduct ? (
          inputMode === 'camera' ? (
            <div className="space-y-4">
              {/* Camera Scanner Viewport */}
              <div className="border border-neutral-300 rounded-md p-6 text-center bg-neutral-50 space-y-3 relative overflow-hidden">
                <div className="w-12 h-12 bg-white border border-neutral-300 mx-auto flex items-center justify-center text-black">
                  <Camera className="w-6 h-6 stroke-[1.5]" />
                </div>
                <div>
                  <h4 className="text-base text-black font-semibold">
                    Position Product Label or Packaging
                  </h4>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1">
                    Frame the active ingredient list or front bottle label in clean lighting.
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleSimulateScan()}
                    isLoading={analyzing}
                    leftIcon={<Scan className="w-3.5 h-3.5" />}
                  >
                    Capture & Parse Label
                  </Button>
                </div>
              </div>

              {/* Sample Presets to test OCR */}
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 font-mono">
                  TEST WITH SAMPLE LABELS:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1.5">
                  {samplePresets.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSimulateScan(preset)}
                      className="p-2.5 rounded-sm bg-white border border-neutral-200 hover:border-black text-left text-xs transition-colors cursor-pointer"
                    >
                      <strong className="block text-black">{preset.label}</strong>
                      <span className="text-neutral-500 text-[11px] truncate block font-mono">
                        {preset.brand} • {preset.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono mb-1.5">
                  PASTE FULL INCI INGREDIENT LIST
                </label>
                <textarea
                  rows={4}
                  value={ingredientText}
                  onChange={e => setIngredientText(e.target.value)}
                  placeholder="e.g. Aqua, Niacinamide, Glycerin, Sodium Hyaluronate, Centella Asiatica Extract..."
                  className="w-full bg-white border border-neutral-300 rounded-md p-3 text-xs text-black focus:outline-none focus:border-black"
                />
              </div>
              <Button
                variant="primary"
                className="w-full"
                onClick={handleTextAnalyze}
                isLoading={analyzing}
                leftIcon={<Sparkles className="w-3.5 h-3.5" />}
              >
                Analyze INCI Ingredients
              </Button>
            </div>
          )
        ) : (
          /* Scanned Result Card */
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="p-4 rounded-md bg-white border border-neutral-200 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="dark" size="xs">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Recognized Formulation
                </Badge>
                <span className="text-[11px] text-neutral-500 font-mono">
                  {scannedProduct.category}
                </span>
              </div>

              <div>
                <p className="text-[11px] uppercase font-bold text-neutral-500 font-mono">
                  {scannedProduct.brand}
                </p>
                <h4 className="text-base text-black font-bold mt-0.5">
                  {scannedProduct.name}
                </h4>
              </div>

              <div>
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block font-mono mb-1">
                  DETECTED KEY ACTIVES:
                </span>
                <div className="flex flex-wrap gap-1">
                  {scannedProduct.keyActives?.map((act, idx) => (
                    <Badge key={idx} variant="neutral" size="xs">
                      {act}
                    </Badge>
                  ))}
                </div>
              </div>

              {scannedProduct.isFragranceFree && (
                <div className="flex items-center gap-1.5 text-xs text-black font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Fragrance-free formula confirmed</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="grow"
                onClick={() => setScannedProduct(null)}
              >
                Scan Another
              </Button>
              <Button
                variant="primary"
                className="grow"
                onClick={handleSaveToShelf}
                leftIcon={<Layers className="w-3.5 h-3.5" />}
              >
                Save to My Shelf
              </Button>
            </div>
          </div>
        )}

        <div className="p-3 rounded-md bg-neutral-100 border border-neutral-200 flex items-center gap-2 text-[11px] text-neutral-600">
          <Info className="w-3.5 h-3.5 text-black shrink-0" />
          <span>Real architectural interface: Ready for barcode SDK and vision recognition.</span>
        </div>
      </div>
    </Modal>
  );
};
