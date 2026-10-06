import React, { useState } from 'react';
import {
  Compass,
  Plus,
  Camera,
  Search,
  ShoppingBag,
  AlertCircle
} from 'lucide-react';
import { ProductCard } from './ProductCard';
import { ProductDetailModal } from './ProductDetailModal';
import { AddProductModal } from './AddProductModal';
import { AiProductPhotoScanner } from './AiProductPhotoScanner';
import { PreventPurchaseModal } from './PreventPurchaseModal';
import { Button } from '../common/Button';
import { useNoor } from '../../context/NoorContext';
import { Product } from '../../types';

export const ShelfView: React.FC = () => {
  const { shelfProducts } = useNoor();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [scanModalOpen, setScanModalOpen] = useState(false);
  const [preventModalOpen, setPreventModalOpen] = useState(false);

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = [
    'All',
    'Cleanser',
    'Toner',
    'Serum',
    'Treatment',
    'Moisturizer',
    'SPF',
    'Face Oil',
    'Exfoliant'
  ];

  const filteredProducts = shelfProducts.filter(p => {
    const matchesCategory =
      activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase()) ||
      p.keyActives.some(a => a.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const hasSPF = shelfProducts.some(p => p.category === 'SPF');

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-8 sm:py-10 space-y-7 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-neutral-200">
        <div className="space-y-1">
          <span className="text-[10px] font-bold tracking-[0.24em] uppercase text-neutral-500 font-mono block">
            YOUR PERSONAL INVENTORY
          </span>
          <h1 className="text-3xl sm:text-4xl text-black font-bold tracking-tight">
            My Shelf
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 font-normal pt-0.5">
            {shelfProducts.length} curated formulas currently in your personal skincare ecosystem.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreventModalOpen(true)}
            leftIcon={<ShoppingBag className="w-3.5 h-3.5 stroke-[1.5]" />}
          >
            Before You Buy Check
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setScanModalOpen(true)}
            leftIcon={<Camera className="w-3.5 h-3.5 stroke-[1.5]" />}
          >
            Add by Photo
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setAddModalOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5 stroke-[1.5]" />}
          >
            Add Manually
          </Button>
        </div>
      </div>

      {/* Routine Gap Notice if SPF missing */}
      {!hasSPF && (
        <div className="p-4 rounded-md bg-neutral-100 border border-neutral-300 flex items-start gap-3.5 text-xs text-neutral-900">
          <AlertCircle className="w-4 h-4 text-black shrink-0 mt-0.5 stroke-[1.5]" />
          <div className="space-y-1">
            <h4 className="font-semibold text-sm">Routine Gap Identified: No Daily SPF on Shelf</h4>
            <p className="text-neutral-600 leading-relaxed">
              Active serums and natural skin lipids are vulnerable without broad-spectrum UV protection. We recommend cataloging or acquiring a gentle SPF 30+ mineral fluid.
            </p>
          </div>
        </div>
      )}

      {/* Search and Category filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 stroke-[1.5]" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search owned formulas by brand, name, or active ingredient..."
            className="w-full bg-white border border-neutral-200 rounded-md pl-10 pr-4 py-2.5 text-xs sm:text-sm text-black placeholder-neutral-400 focus:outline-none focus:border-black shadow-2xs"
          />
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map(cat => {
            const count =
              cat === 'All'
                ? shelfProducts.length
                : shelfProducts.filter(p => p.category === cat).length;
            const isSelected = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-sm shrink-0 transition-all cursor-pointer font-sans text-xs ${
                  isSelected
                    ? 'bg-black text-white font-semibold'
                    : 'bg-white text-neutral-600 hover:text-black border border-neutral-200 hover:border-black'
                }`}
              >
                {cat} <span className="opacity-60 text-[10px] font-mono">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white border border-neutral-200 rounded-lg p-6 space-y-3">
          <Compass className="w-8 h-8 text-neutral-400 mx-auto stroke-[1.5]" />
          <h3 className="text-lg text-black font-semibold">No matching formulas found</h3>
          <p className="text-xs text-neutral-600 max-w-sm mx-auto">
            Try adjusting your search query, or add a new bottle to your shelf.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearch('');
              setActiveCategory('All');
            }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => setSelectedProduct(product)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
      />

      <AddProductModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
      />

      <AiProductPhotoScanner
        isOpen={scanModalOpen}
        onClose={() => setScanModalOpen(false)}
      />

      <PreventPurchaseModal
        isOpen={preventModalOpen}
        onClose={() => setPreventModalOpen(false)}
      />
    </div>
  );
};
