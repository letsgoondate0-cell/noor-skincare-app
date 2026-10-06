import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'neutral' | 'blush' | 'sage' | 'amber' | 'dark' | 'outline';
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'sm',
  className = ''
}) => {
  const sizeClasses = {
    xs: 'text-[10px] px-2 py-0.5 font-medium tracking-wider',
    sm: 'text-[11px] px-2.5 py-0.5 font-medium tracking-wide',
    md: 'text-xs px-3 py-1 font-medium tracking-wide'
  };

  // Strictly black, white, and sophisticated neutral grays
  const variantClasses = {
    neutral: 'bg-neutral-100 text-neutral-900 border border-neutral-200',
    blush: 'bg-neutral-200 text-neutral-900 border border-neutral-300', // Monochrome replacement for alert/blush
    sage: 'bg-neutral-100 text-neutral-900 border border-neutral-300',  // Monochrome replacement for sage/calm
    amber: 'bg-neutral-100 text-neutral-900 border border-neutral-300', // Monochrome replacement for amber
    dark: 'bg-black text-white border border-black',
    outline: 'bg-transparent text-neutral-700 border border-neutral-300'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-sm font-sans ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
