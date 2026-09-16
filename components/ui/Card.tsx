import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export default function Card({
  children,
  className = '',
  hover = false,
  onClick,
}: CardProps) {
  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      className={`
        bg-surface rounded-2xl border border-border-subtle p-5
        ${hover ? 'hover:bg-surface-elevated hover:border-charcoal-600 transition-all duration-200 cursor-pointer' : ''}
        ${onClick ? 'w-full text-left' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </Component>
  );
}
