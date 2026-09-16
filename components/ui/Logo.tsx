import React from 'react';
import Link from 'next/link';

interface LogoProps {
  variant?: 'full' | 'icon' | 'mark';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  className?: string;
}

export default function Logo({
  variant = 'full',
  size = 'md',
  href,
  className = '',
}: LogoProps) {
  const iconSizes = {
    sm: 28,
    md: 38,
    lg: 52,
  };

  const textSizes = {
    sm: 'text-base tracking-wider',
    md: 'text-xl tracking-widest',
    lg: 'text-3xl tracking-widest',
  };

  const currentSize = iconSizes[size];

  const IconElement = (
    <div
      style={{ width: currentSize, height: currentSize }}
      className="relative rounded-2xl bg-gradient-to-br from-charcoal-800 via-charcoal-900 to-black border border-sand-400/30 flex items-center justify-center shrink-0 shadow-md shadow-black/60 overflow-hidden group"
    >
      {/* Target ring watermark */}
      <div className="absolute inset-1 rounded-full border border-sand-400/15" />
      <div className="absolute inset-2.5 rounded-full border border-gold/30" />
      <div className="absolute w-2 h-2 rounded-full bg-gold/90 shadow-sm shadow-gold/50" />

      {/* Archery Symbol */}
      <span
        style={{ fontSize: currentSize * 0.52 }}
        className="relative transform -rotate-45 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-12"
      >
        🏹
      </span>
    </div>
  );

  const Content = (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {IconElement}

      {variant === 'full' && (
        <div className="flex flex-col">
          <span className={`font-black text-sand-100 uppercase ${textSizes[size]}`}>
            ARROW<span className="text-sand-400">LOG</span>
          </span>
          {size === 'lg' && (
            <span className="text-[10px] font-bold tracking-[0.3em] text-sand-300/50 uppercase -mt-1">
              Shoot · Score · Share
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="focus:outline-none hover:opacity-95 transition-opacity">
        {Content}
      </Link>
    );
  }

  return Content;
}
