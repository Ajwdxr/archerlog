'use client';

import React, { useState } from 'react';
import { BookOpen, HelpCircle, Smartphone, Info } from 'lucide-react';
import HowToUseModal from './HowToUseModal';
import InstallPwaButton from './InstallPwaButton';

export default function ProfileHelpSection() {
  const [isHowToUseOpen, setIsHowToUseOpen] = useState(false);

  return (
    <>
      <div className="mt-8 pt-6 border-t border-charcoal-800 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-sand-300/60 flex items-center gap-1.5">
          <Info size={14} className="text-sand-400" />
          Bantuan & Aplikasi PWA
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => setIsHowToUseOpen(true)}
            className="
              flex items-center justify-between p-3.5 rounded-2xl
              bg-charcoal-900 border border-charcoal-800 hover:border-charcoal-700
              text-left transition-all group
            "
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-forest-500/15 border border-forest-500/30 flex items-center justify-center text-forest-400">
                <BookOpen size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-sand-100 group-hover:text-sand-300 transition-colors">
                  Cara Penggunaan
                </p>
                <p className="text-[10px] text-sand-300/50">
                  Panduan lengkap penganjur & pemanah
                </p>
              </div>
            </div>
          </button>

          <div className="p-3.5 rounded-2xl bg-charcoal-900 border border-charcoal-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sand-400/15 border border-sand-400/30 flex items-center justify-center text-sand-400">
                <Smartphone size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-sand-100">
                  Pasang Aplikasi
                </p>
                <p className="text-[10px] text-sand-300/50">
                  Pasang ke skrin utama telefon
                </p>
              </div>
            </div>

            <InstallPwaButton variant="compact" showText={false} />
          </div>
        </div>
      </div>

      <HowToUseModal
        isOpen={isHowToUseOpen}
        onClose={() => setIsHowToUseOpen(false)}
      />
    </>
  );
}
