import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import {
  ShieldAlert,
  Calendar,
  Layers,
  Trash2,
  Check
} from 'lucide-react';
import { Product, UserReaction } from '../../types';
import { useNoor } from '../../context/NoorContext';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose
}) => {
  const {
    updateShelfProduct,
    removeProductFromShelf,
    shelfProducts,
    routineSteps,
    addRoutineStep
  } = useNoor();

  if (!product) return null;

  const [notes, setNotes] = useState(product.userNotes || '');
  const [reaction, setReaction] = useState<UserReaction>(product.userReaction || 'Neutral');

  const handleSaveNotes = () => {
    updateShelfProduct(product.id, {
      userNotes: notes,
      userReaction: reaction
    });
  };

  const isInRoutine = routineSteps.some(s => s.productId === product.id);

  const handleAddToRoutine = (timeOfDay: 'Morning' | 'Evening') => {
    addRoutineStep({
      stepNumber: routineSteps.filter(s => s.timeOfDay === timeOfDay).length + 1,
      timeOfDay,
      category: product.category,
      productId: product.id,
      productName: product.name,
      brand: product.brand,
      usageTip: product.usageInstructions,
      whyChosen: `Included from user shelf for targeted ${product.keyActives[0] || 'hydration'} support.`,
      isCompletedToday: false,
      frequency: 'Daily'
    });
  };

  const activeCollisions = shelfProducts.filter(p => {
    if (p.id === product.id) return false;
    if (
      product.category === 'Treatment' &&
      product.keyActives.some(a => a.toLowerCase().includes('retin')) &&
      p.category === 'Exfoliant'
    ) {
      return true;
    }
    return false;
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product.name}
      subtitle={`${product.brand} • ${product.category}`}
      maxWidth="md"
    >
      <div className="space-y-5 text-sm">
        {/* Placement banner */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-md bg-neutral-100 border border-neutral-200">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider font-mono">
              ROUTINE CADENCE:
            </span>
            <span className="text-xs font-semibold text-black">
              {product.routinePlacement.join(' & ')}
            </span>
          </div>

          {product.isFragranceFree && (
            <Badge variant="dark" size="xs">
              Fragrance-Free
            </Badge>
          )}
        </div>

        {/* How to use */}
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono mb-1.5">
            HOW TO USE
          </h4>
          <p className="text-xs sm:text-sm text-neutral-800 leading-relaxed bg-white p-3.5 rounded-md border border-neutral-200">
            {product.usageInstructions}
          </p>
        </div>

        {/* Key Actives */}
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono mb-1.5">
            KEY BIOCOMPATIBLE ACTIVES
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {product.keyActives.map((active, idx) => (
              <Badge key={idx} variant="neutral" size="sm">
                {active}
              </Badge>
            ))}
          </div>
        </div>

        {/* Compatibility Check */}
        {activeCollisions.length > 0 && (
          <div className="p-3.5 rounded-md bg-neutral-100 border border-neutral-300 space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-black">
              <ShieldAlert className="w-4 h-4 stroke-[1.5]" />
              <span>Ingredient Synergy Caution</span>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Contains active ingredients that should not be layered directly with <strong>{activeCollisions.map(c => c.name).join(', ')}</strong> on the same evening. Alternate nights instead.
            </p>
          </div>
        )}

        {/* Personal Skin Reaction */}
        <div className="space-y-2">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono">
            HOW YOUR SKIN RESPONDS
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                'Loving it',
                'Neutral',
                'Caused breakout',
                'Caused redness/dryness'
              ] as UserReaction[]
            ).map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  setReaction(opt);
                  updateShelfProduct(product.id, { userReaction: opt });
                }}
                className={`p-2.5 rounded-md border text-xs font-medium text-left transition-all cursor-pointer flex items-center justify-between ${
                  reaction === opt
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-neutral-800 border-neutral-200 hover:border-black'
                }`}
              >
                <span>{opt}</span>
                {reaction === opt && <Check className="w-3.5 h-3.5 stroke-[2]" />}
              </button>
            ))}
          </div>
        </div>

        {/* Notes & Expiry */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono">
              PERSONAL NOTES
            </h4>
            {product.openedDate && (
              <span className="text-[11px] text-neutral-500 font-mono flex items-center gap-1">
                <Calendar className="w-3 h-3 stroke-[1.5]" /> OPENED: {product.openedDate}
              </span>
            )}
          </div>
          <textarea
            rows={2}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            onBlur={handleSaveNotes}
            placeholder="e.g. Feels best when sandwiched over milky essence; zero stinging."
            className="w-full bg-white border border-neutral-300 rounded-md p-3 text-xs text-black focus:outline-none focus:border-black"
          />
        </div>

        {/* Routine Integration Actions */}
        <div className="pt-2 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {!isInRoutine ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddToRoutine('Morning')}
                  leftIcon={<Layers className="w-3.5 h-3.5" />}
                >
                  Add to AM
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddToRoutine('Evening')}
                  leftIcon={<Layers className="w-3.5 h-3.5" />}
                >
                  Add to PM
                </Button>
              </>
            ) : (
              <Badge variant="dark" size="md">
                <Check className="w-3 h-3 mr-1" /> Active in Routine
              </Badge>
            )}
          </div>

          <button
            onClick={() => {
              removeProductFromShelf(product.id);
              onClose();
            }}
            className="text-xs text-neutral-500 hover:text-black font-semibold flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Remove from Shelf</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
