import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Badge } from '../common/Badge';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const reactionBadges = {
    'Loving it': { label: 'Optimal tolerance' },
    Neutral: { label: 'Well tolerated' },
    'Caused breakout': { label: 'Reaction logged' },
    'Caused redness/dryness': { label: 'Sensitivity logged' },
    Untested: { label: 'Recently added' }
  };

  const reaction = reactionBadges[product.userReaction || 'Untested'];

  return (
    <div
      onClick={onClick}
      className="p-5 rounded-lg bg-white border border-neutral-200 hover:border-black transition-all duration-150 cursor-pointer flex flex-col justify-between group shadow-2xs"
    >
      <div>
        {/* Category & Cadence */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="text-[10px] uppercase font-bold tracking-[0.18em] text-neutral-500 font-mono">
            {product.category}
          </span>
          <span className="text-[11px] text-neutral-400 font-mono">
            {product.routinePlacement?.join(' • ')}
          </span>
        </div>

        {/* Brand & Name */}
        <p className="text-[11px] uppercase tracking-wider text-neutral-500 font-semibold font-mono">
          {product.brand}
        </p>
        <h3 className="text-base sm:text-lg text-black font-bold mt-0.5 group-hover:underline transition-all leading-snug">
          {product.name}
        </h3>

        {/* Key Actives */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {product.keyActives?.slice(0, 3).map((active, idx) => (
            <span
              key={idx}
              className="text-[10px] px-2 py-0.5 rounded-xs bg-neutral-100 text-neutral-700 border border-neutral-200 font-mono"
            >
              {active}
            </span>
          ))}
          {product.keyActives?.length > 3 && (
            <span className="text-[10px] px-1.5 py-0.5 text-neutral-400 font-mono">
              +{product.keyActives.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Footer: Reaction status */}
      <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
        <Badge variant="neutral" size="xs">
          {reaction.label}
        </Badge>

        <span className="text-xs text-neutral-500 group-hover:text-black flex items-center gap-0.5 transition-colors font-medium">
          <span>Details</span>
          <ChevronRight className="w-3.5 h-3.5 stroke-[1.5]" />
        </span>
      </div>
    </div>
  );
};
