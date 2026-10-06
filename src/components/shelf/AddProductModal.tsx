import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Plus, Search } from 'lucide-react';
import { useNoor } from '../../context/NoorContext';
import { Product, ProductCategory } from '../../types';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose }) => {
  const { addProductToShelf, catalogProducts, shelfProducts } = useNoor();

  const [tab, setTab] = useState<'catalog' | 'custom'>('catalog');
  const [search, setSearch] = useState('');

  // Custom form fields
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Serum');
  const [actives, setActives] = useState('');
  const [instructions, setInstructions] = useState('');
  const [routineAM, setRoutineAM] = useState(true);
  const [routinePM, setRoutinePM] = useState(true);

  const ownedIds = shelfProducts.map(p => p.id);
  const availableCatalog = catalogProducts.filter(p => !ownedIds.includes(p.id));

  const filteredCatalog = availableCatalog.filter(
    p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddCatalogItem = (prod: Product) => {
    addProductToShelf(prod);
    onClose();
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const routinePlacement: ('Morning' | 'Evening' | 'Weekly')[] = [];
    if (routineAM) routinePlacement.push('Morning');
    if (routinePM) routinePlacement.push('Evening');

    addProductToShelf({
      name: name.trim(),
      brand: brand.trim() || 'My Product',
      category,
      keyActives: actives
        .split(',')
        .map(s => s.trim())
        .filter(Boolean),
      usageInstructions: instructions.trim() || 'Apply as directed on container.',
      routinePlacement: routinePlacement.length > 0 ? routinePlacement : ['Morning'],
      targetConcerns: ['Dryness'],
      isFragranceFree: true,
      userReaction: 'Untested'
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add to My Shelf"
      subtitle="Catalog what you own so NOOR can build your personalized ritual."
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Tab switch */}
        <div className="flex items-center gap-2 border-b border-neutral-200 pb-2.5">
          <button
            onClick={() => setTab('catalog')}
            className={`px-3.5 py-1.5 rounded-sm text-xs font-medium cursor-pointer transition-all ${
              tab === 'catalog'
                ? 'bg-black text-white font-semibold'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            Curated Library
          </button>
          <button
            onClick={() => setTab('custom')}
            className={`px-3.5 py-1.5 rounded-sm text-xs font-medium cursor-pointer transition-all ${
              tab === 'custom'
                ? 'bg-black text-white font-semibold'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            Manual Custom Entry
          </button>
        </div>

        {tab === 'catalog' ? (
          <div className="space-y-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by brand, category, or active..."
                className="w-full bg-white border border-neutral-300 rounded-sm pl-9 pr-3.5 py-2 text-xs text-black focus:outline-none focus:border-black"
              />
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {filteredCatalog.length === 0 ? (
                <div className="text-center py-6 text-xs text-neutral-500">
                  All catalog essentials are already on your shelf! Use custom entry for other brands.
                </div>
              ) : (
                filteredCatalog.map(prod => (
                  <div
                    key={prod.id}
                    className="p-3 rounded-md bg-white border border-neutral-200 flex items-center justify-between gap-3 hover:border-black transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] uppercase font-bold text-neutral-500 font-mono">
                          {prod.category}
                        </span>
                        <span className="text-[10px] text-neutral-300">
                          • {prod.brand}
                        </span>
                      </div>
                      <h4 className="font-semibold text-xs sm:text-sm text-black mt-0.5">
                        {prod.name}
                      </h4>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddCatalogItem(prod)}
                      leftIcon={<Plus className="w-3.5 h-3.5" />}
                    >
                      Add
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleAddCustom} className="space-y-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono mb-1">
                PRODUCT NAME
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Snail Mucin 96% Power Essence"
                className="w-full bg-white border border-neutral-300 rounded-sm px-3.5 py-2 text-xs text-black focus:outline-none focus:border-black"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono mb-1">
                  BRAND
                </label>
                <input
                  type="text"
                  value={brand}
                  onChange={e => setBrand(e.target.value)}
                  placeholder="e.g. COSRX, La Roche-Posay"
                  className="w-full bg-white border border-neutral-300 rounded-sm px-3.5 py-2 text-xs text-black focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono mb-1">
                  CATEGORY
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as ProductCategory)}
                  className="w-full bg-white border border-neutral-300 rounded-sm px-3 py-2 text-xs text-black focus:outline-none focus:border-black"
                >
                  {[
                    'Cleanser',
                    'Toner',
                    'Essence',
                    'Serum',
                    'Treatment',
                    'Exfoliant',
                    'Moisturizer',
                    'SPF',
                    'Face Oil',
                    'Eye Cream',
                    'Mask'
                  ].map(c => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono mb-1">
                KEY ACTIVES (COMMA SEPARATED)
              </label>
              <input
                type="text"
                value={actives}
                onChange={e => setActives(e.target.value)}
                placeholder="e.g. Hyaluronic Acid, Panthenol, Peptides"
                className="w-full bg-white border border-neutral-300 rounded-sm px-3.5 py-2 text-xs text-black focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono mb-1">
                USAGE INSTRUCTIONS (OPTIONAL)
              </label>
              <textarea
                rows={2}
                value={instructions}
                onChange={e => setInstructions(e.target.value)}
                placeholder="e.g. Apply 2 pumps onto damp skin after cleansing"
                className="w-full bg-white border border-neutral-300 rounded-sm p-2.5 text-xs text-black focus:outline-none focus:border-black"
              />
            </div>

            <div className="flex items-center gap-4 pt-1">
              <label className="flex items-center gap-2 text-xs text-neutral-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={routineAM}
                  onChange={e => setRoutineAM(e.target.checked)}
                  className="w-4 h-4 accent-black rounded cursor-pointer"
                />
                <span>Morning use</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-neutral-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={routinePM}
                  onChange={e => setRoutinePM(e.target.checked)}
                  className="w-4 h-4 accent-black rounded cursor-pointer"
                />
                <span>Evening use</span>
              </label>
            </div>

            <Button type="submit" variant="primary" className="w-full mt-2">
              Save Product to Shelf
            </Button>
          </form>
        )}
      </div>
    </Modal>
  );
};
