'use client';

import React, { useState } from 'react';
import { BookOpen, Sparkles } from 'lucide-react';
import HowToUseModal from './HowToUseModal';
import InstallPwaButton from './InstallPwaButton';

export default function HomeActions() {
  const [isHowToUseOpen, setIsHowToUseOpen] = useState(false);

  return (
    <>
      <div className="w-full flex flex-col gap-2.5 pt-1">
        {/* Divider / Subtitle */}
        <div className="flex items-center gap-2 my-1">
          <div className="flex-1 h-px bg-charcoal-800" />
          <span className="text-[11px] font-semibold tracking-wider uppercase text-sand-300/40">
            Panduan & PWA
          </span>
          <div className="flex-1 h-px bg-charcoal-800" />
        </div>

        {/* 2-column or stacked action buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => setIsHowToUseOpen(true)}
            className="
              flex items-center justify-center gap-2 h-12 rounded-xl
              bg-charcoal-900 border border-charcoal-700/80
              text-sand-200 font-semibold text-xs sm:text-sm
              hover:bg-charcoal-800 hover:border-sand-400/50 hover:text-sand-100
              active:scale-[0.98]
              transition-all duration-200 shadow-sm
            "
          >
            <BookOpen size={16} className="text-sand-400 shrink-0" />
            <span>Cara Guna</span>
          </button>

          <InstallPwaButton
            variant="secondary"
            className="!h-12 !rounded-xl !text-xs sm:!text-sm !bg-charcoal-900 !border-charcoal-700/80 hover:!border-forest-500/50"
          />
        </div>
      </div>

      <HowToUseModal
        isOpen={isHowToUseOpen}
        onClose={() => setIsHowToUseOpen(false)}
      />
    </>
  );
}
