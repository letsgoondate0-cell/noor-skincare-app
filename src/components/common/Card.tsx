import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = false
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg border border-neutral-200 p-5 sm:p-6 transition-all duration-150 ${
        hoverable
          ? 'hover:border-black cursor-pointer'
          : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
