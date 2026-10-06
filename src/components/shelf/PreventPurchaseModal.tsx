import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import {
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  ShoppingBag
} from 'lucide-react';
import { useNoor } from '../../context/NoorContext';
import { ProductCategory } from '../../types';

interface PreventPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PreventPurchaseModal: React.FC<PreventPurchaseModalProps> = ({
  isOpen,
  onClose
}) => {
  const { shelfProducts } = useNoor();

  const [category, setCategory] = useState<ProductCategory>('Serum');
  const [activeIngredient, setActiveIngredient] = useState('');
  const [result, setResult] = useState<{
    verdict: 'unnecessary' | 'genuine_gap' | 'caution';
    title: string;
    reason: string;
    matchingProducts: string[];
  } | null>(null);

  const handleEvaluate = () => {
    const existingSameCategory = shelfProducts.filter(p => p.category === category);
    const existingWithActive = activeIngredient.trim()
      ? shelfProducts.filter(p =>
          p.keyActives.some(a =>
            a.toLowerCase().includes(activeIngredient.toLowerCase().trim())
          )
        )
      : [];

    if (existingWithActive.length > 0) {
      setResult({
        verdict: 'unnecessary',
        title: 'You do not need another product right now.',
        reason: `Your shelf already contains ${existingWithActive
          .map(p => `"${p.name}" (${p.brand})`)
          .join(', ')} which delivers ${activeIngredient}. Layering duplicate actives increases irritation risk.`,
        matchingProducts: existingWithActive.map(p => p.name)
      });
    } else if (existingSameCategory.length >= 2) {
      setResult({
        verdict: 'unnecessary',
        title: 'You already own multiple formulas in this category.',
        reason: `You have ${existingSameCategory
          .map(p => p.name)
          .join(' and ')}. Using what you currently own protects your skin from chaotic ingredient turnover.`,
        matchingProducts: existingSameCategory.map(p => p.name)
      });
    } else if (category === 'SPF' && !shelfProducts.some(p => p.category === 'SPF')) {
      setResult({
        verdict: 'genuine_gap',
        title: 'This is a genuine routine gap.',
        reason: 'Daily broad-spectrum sunscreen is currently missing from your shelf. UV defense is vital for cellular skin health.',
        matchingProducts: []
      });
    } else {
      setResult({
        verdict: 'caution',
        title: 'Consider introducing carefully.',
        reason: 'You do not have an exact duplicate, but ensure you introduce it slowly without combining with strong exfoliants.',
        matchingProducts: []
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setResult(null);
        onClose();
      }}
      title="Before You Buy: The NOOR Honest Check"
      subtitle="NOOR actively protects you from unnecessary purchases and marketing fatigue."
      maxWidth="md"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono mb-1.5">
            WHAT TYPE OF PRODUCT ARE YOU CONSIDERING?
          </label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value as ProductCategory)}
            className="w-full bg-white border border-neutral-300 rounded-md px-3.5 py-2.5 text-xs sm:text-sm text-black focus:outline-none focus:border-black"
          >
            {[
              'Cleanser',
              'Toner',
              'Serum',
              'Exfoliant',
              'Moisturizer',
              'SPF',
              'Face Oil',
              'Eye Cream'
            ].map(cat => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono mb-1.5">
            MAIN ACTIVE INGREDIENT BEING MARKETED (OPTIONAL)
          </label>
          <input
            type="text"
            value={activeIngredient}
            onChange={e => setActiveIngredient(e.target.value)}
            placeholder="e.g. Niacinamide, Retinol, Vitamin C, Hyaluronic Acid"
            className="w-full bg-white border border-neutral-300 rounded-md px-3.5 py-2.5 text-xs sm:text-sm text-black placeholder-neutral-400 focus:outline-none focus:border-black"
          />
        </div>

        <Button
          variant="primary"
          className="w-full"
          onClick={handleEvaluate}
          leftIcon={<ShoppingBag className="w-4 h-4 stroke-[1.5]" />}
        >
          Check My Shelf Compatibility
        </Button>

        {result && (
          <div className="p-4 rounded-md border border-neutral-300 bg-neutral-100 space-y-2 animate-in fade-in duration-150">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-black stroke-[2]" />
              <h4 className="text-sm font-bold text-black uppercase tracking-tight">
                {result.title}
              </h4>
            </div>

            <p className="text-xs text-neutral-700 leading-relaxed font-normal">
              {result.reason}
            </p>

            {result.matchingProducts.length > 0 && (
              <div className="pt-1 text-[11px] text-neutral-500 font-mono">
                ALREADY ACTIVE ON SHELF: {result.matchingProducts.join(', ')}
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
