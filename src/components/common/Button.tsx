import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'blush' | 'subtle';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium font-sans transition-all duration-150 cursor-pointer select-none disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-black active:scale-[0.99] rounded-md tracking-tight';

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 min-h-[32px]',
    md: 'text-xs sm:text-sm px-4 py-2.5 gap-2 min-h-[40px]',
    lg: 'text-sm sm:text-base px-6 py-3.5 gap-2.5 min-h-[48px]'
  };

  const variantClasses = {
    primary:
      'bg-black text-white hover:bg-neutral-800 border border-black shadow-xs',
    secondary:
      'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 border border-neutral-200',
    outline:
      'bg-transparent text-black hover:bg-black hover:text-white border border-black',
    ghost:
      'bg-transparent text-neutral-600 hover:text-black hover:bg-neutral-100',
    blush:
      'bg-neutral-100 text-black hover:bg-neutral-200 border border-neutral-300',
    subtle:
      'bg-white text-black hover:bg-neutral-50 border border-neutral-200 shadow-2xs'
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : leftIcon ? (
        <span className="shrink-0">{leftIcon}</span>
      ) : null}
      <span>{children}</span>
      {rightIcon && !isLoading && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
