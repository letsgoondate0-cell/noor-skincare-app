import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
  variant?: 'dark' | 'light' | 'grey';
  align?: 'left' | 'center';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showSubtitle = false,
  className = '',
  variant = 'dark',
  align = 'center'
}) => {
  const isLight = variant === 'light';
  const isGrey = variant === 'grey';

  const textColor = isLight ? 'text-white' : isGrey ? 'text-neutral-500 hover:text-black transition-colors' : 'text-black';
  const leafColor = isLight ? 'text-white' : isGrey ? 'text-neutral-400 group-hover:text-black transition-colors' : 'text-black';
  const subColor = isLight ? 'text-neutral-400' : isGrey ? 'text-neutral-400' : 'text-neutral-500';

  const sizeConfig = {
    sm: {
      text: 'text-sm tracking-[0.34em]',
      leafSize: 15,
      sub: 'text-[8px] tracking-[0.24em]',
      gap: 'gap-2'
    },
    md: {
      text: 'text-base sm:text-lg tracking-[0.36em]',
      leafSize: 18,
      sub: 'text-[9px] tracking-[0.28em]',
      gap: 'gap-2.5'
    },
    lg: {
      text: 'text-2xl tracking-[0.40em]',
      leafSize: 22,
      sub: 'text-[10px] tracking-[0.32em]',
      gap: 'gap-3'
    },
    xl: {
      text: 'text-4xl sm:text-5xl tracking-[0.44em]',
      leafSize: 32,
      sub: 'text-xs tracking-[0.36em]',
      gap: 'gap-3.5'
    }
  };

  const current = sizeConfig[size];
  const alignmentClass = align === 'left' ? 'items-start' : 'items-center';

  return (
    <div className={`inline-flex flex-col ${alignmentClass} select-none group ${className}`}>
      {/* Brand Lockup: Delicate Single-Line Minimalist Botanical Leaf Contour + Bold NOOR Wordmark */}
      <div className={`flex items-center ${current.gap}`}>
        {/* Delicate, thin, single-line minimalist botanical leaf contour */}
        <svg
          className={`shrink-0 ${leafColor} transition-transform duration-300 group-hover:scale-105`}
          style={{ width: current.leafSize, height: current.leafSize }}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Outer leaf contour */}
          <path
            d="M4.5 19.5C4.5 19.5 5.5 13.5 10.5 8.5C15.5 3.5 20.5 3 20.5 3C20.5 3 20 8 15 13C10 18 4.5 19.5 4.5 19.5Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Delicate single-line leaf vein */}
          <path
            d="M4.5 19.5C8 16.5 11.5 12.5 15 8"
            stroke="currentColor"
            strokeWidth="1.0"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Bold, modern sans-serif NOOR wordmark */}
        <span
          className={`font-sans font-extrabold uppercase leading-none pl-0.5 ${textColor} ${current.text}`}
          style={{ letterSpacing: '0.36em' }}
        >
          NOOR
        </span>
      </div>

      {showSubtitle && (
        <span
          className={`uppercase font-mono font-medium mt-1.5 ${subColor} ${current.sub}`}
        >
          SKINCARE SYSTEM
        </span>
      )}
    </div>
  );
};
