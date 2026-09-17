'use client';

import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Share,
  PlusSquare,
  CheckCircle2,
  Download,
  Globe,
  Zap,
  WifiOff,
  Sparkles
} from 'lucide-react';

interface InstallPwaModalProps {
  isOpen: boolean;
  onClose: () => void;
  isIOS: boolean;
  isStandalone: boolean;
  onTriggerInstall?: () => void;
  canInstallDirectly?: boolean;
}

type LangType = 'bm' | 'en';

export default function InstallPwaModal({
  isOpen,
  onClose,
  isIOS,
  isStandalone,
  onTriggerInstall,
  canInstallDirectly = false,
}: InstallPwaModalProps) {
  const [lang, setLang] = useState<LangType>('bm');

  if (!isOpen) return null;

  const content = {
    bm: {
      title: 'Pasang Aplikasi ARROWLOG',
      subtitle: 'Gunakan seperti aplikasi sebenar di telefon anda.',
      alreadyInstalled: 'Aplikasi Telah Dipasang',
      alreadyInstalledDesc: 'Anda kini sedang menggunakan ARROWLOG dalam mod aplikasi penuh (PWA). Nikmati skor pantas dan sokongan luar talian!',
      directInstallBtn: 'Pasang Sekarang (1-Tap)',
      benefitsHeading: 'Kenapa Pasang ARROWLOG?',
      benefits: [
        {
          icon: <Zap size={18} className="text-sand-400" />,
          title: 'Lebih Pantas & Lancar',
          desc: 'Dibuka terus tanpa perlu menaip URL setiap kali.',
        },
        {
          icon: <Smartphone size={18} className="text-forest-400" />,
          title: 'Skrin Penuh (Full Screen)',
          desc: 'Tiada palang alamat pelayar yang mengganggu semasa mengira skor di lapangan.',
        },
        {
          icon: <WifiOff size={18} className="text-bronze-400" />,
          title: 'Sedia Luar Talian (Offline)',
          desc: 'Boleh diakses walaupun talian internet di lapangan sasar perlahan.',
        },
      ],
      iosTitle: 'Langkah Pemasangan Untuk iPhone / iPad (Safari):',
      iosSteps: [
        {
          num: '1',
          icon: <Share size={18} className="text-sand-400" />,
          title: 'Tekan butang Kongsi (Share)',
          desc: 'Cari ikon petak dengan anak panah ke atas (Share) di bar bawah Safari anda.',
        },
        {
          num: '2',
          icon: <PlusSquare size={18} className="text-sand-400" />,
          title: 'Pilih "Add to Home Screen"',
          desc: 'Skrol ke bawah pada menu pop-up dan tekan "Add to Home Screen" (Tambah ke Skrin Utama).',
        },
        {
          num: '3',
          icon: <CheckCircle2 size={18} className="text-forest-400" />,
          title: 'Tekan "Add" di sudut atas',
          desc: 'Sahkan dan ikon ARROWLOG 🏹 akan muncul di skrin utama telefon anda!',
        },
      ],
      androidTitle: 'Langkah Pemasangan Untuk Android / Chrome:',
      androidSteps: [
        {
          num: '1',
          title: 'Tekan butang menu ⋮ (tiga titik)',
          desc: 'Terletak di sudut atas kanan pelayar Google Chrome.',
        },
        {
          num: '2',
          title: 'Pilih "Install app" atau "Add to Home screen"',
          desc: 'Tekan pilihan pemasangan untuk memuat turun pintasan aplikasi.',
        },
        {
          num: '3',
          title: 'Sahkan Pemasangan',
          desc: 'Aplikasi sedia dibuka bila-bila masa dari skrin telefon anda.',
        },
      ],
      closeBtn: 'Tutup',
    },
    en: {
      title: 'Install ARROWLOG App',
      subtitle: 'Experience it as a full-screen app right on your phone.',
      alreadyInstalled: 'App Already Installed',
      alreadyInstalledDesc: 'You are already enjoying ARROWLOG in standalone app mode (PWA). Fast scoring and offline support enabled!',
      directInstallBtn: 'Install Now (1-Tap)',
      benefitsHeading: 'Why Install ARROWLOG?',
      benefits: [
        {
          icon: <Zap size={18} className="text-sand-400" />,
          title: 'Instant & Fast',
          desc: 'Launch directly from your home screen without typing URLs.',
        },
        {
          icon: <Smartphone size={18} className="text-forest-400" />,
          title: 'Full Screen Experience',
          desc: 'No distracting browser address bars while scoring in the range.',
        },
        {
          icon: <WifiOff size={18} className="text-bronze-400" />,
          title: 'Offline Resilient',
          desc: 'Keep logging scores reliably even with patchy field connections.',
        },
      ],
      iosTitle: 'Installation Steps for iPhone / iPad (Safari):',
      iosSteps: [
        {
          num: '1',
          icon: <Share size={18} className="text-sand-400" />,
          title: 'Tap the Share Button',
          desc: 'Locate the square icon with an upward arrow at the bottom of Safari.',
        },
        {
          num: '2',
          icon: <PlusSquare size={18} className="text-sand-400" />,
          title: 'Select "Add to Home Screen"',
          desc: 'Scroll down the share sheet and tap "Add to Home Screen".',
        },
        {
          num: '3',
          icon: <CheckCircle2 size={18} className="text-forest-400" />,
          title: 'Tap "Add" in the top right',
          desc: 'Confirm and the ARROWLOG 🏹 icon will appear on your phone home screen!',
        },
      ],
      androidTitle: 'Installation Steps for Android / Chrome:',
      androidSteps: [
        {
          num: '1',
          title: 'Tap the ⋮ menu (three dots)',
          desc: 'Located at the top right of your Chrome browser.',
        },
        {
          num: '2',
          title: 'Select "Install app" or "Add to Home screen"',
          desc: 'Tap the install option to add the lightweight app.',
        },
        {
          num: '3',
          title: 'Confirm Install',
          desc: 'ARROWLOG is now accessible straight from your home app drawer.',
        },
      ],
      closeBtn: 'Close',
    },
  };

  const t = content[lang];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-charcoal-900 border border-charcoal-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-10 animate-slide-up">
        {/* Header */}
        <div className="p-5 border-b border-charcoal-800 bg-charcoal-900/95 sticky top-0 z-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-forest-500/20 border border-forest-500/30 flex items-center justify-center text-forest-400">
              <Download size={20} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-sand-100 leading-tight">
                {t.title}
              </h2>
              <p className="text-xs text-sand-300/60">
                {t.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(lang === 'bm' ? 'en' : 'bm')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-charcoal-800 border border-charcoal-700 text-xs font-semibold text-sand-300 hover:text-sand-100 hover:border-charcoal-600 transition-colors"
              title="Tukar Bahasa / Change Language"
            >
              <Globe size={13} className="text-sand-400" />
              <span>{lang === 'bm' ? 'BM' : 'EN'}</span>
            </button>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-charcoal-800 border border-charcoal-700 flex items-center justify-center text-sand-300 hover:bg-charcoal-700 hover:text-sand-100 transition-colors"
              aria-label="Tutup"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* If already installed */}
          {isStandalone ? (
            <div className="p-4 rounded-2xl bg-forest-900/30 border border-forest-500/40 text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-forest-500/20 text-forest-400 flex items-center justify-center">
                <CheckCircle2 size={28} />
              </div>
              <h3 className="text-sm font-bold text-sand-100">
                {t.alreadyInstalled}
              </h3>
              <p className="text-xs text-sand-300/70">
                {t.alreadyInstalledDesc}
              </p>
            </div>
          ) : (
            <>
              {/* Direct Install Button if browser supports it */}
              {canInstallDirectly && onTriggerInstall && (
                <div className="p-4 rounded-2xl bg-charcoal-800/80 border border-forest-500/40 text-center space-y-3">
                  <p className="text-xs text-sand-300/80">
                    Pelayar anda menyokong pemasangan pantas terus ke skrin utama:
                  </p>
                  <button
                    onClick={() => {
                      onTriggerInstall();
                      onClose();
                    }}
                    className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-gradient-to-r from-forest-500 to-forest-400 text-sand-100 font-bold text-sm shadow-lg shadow-forest-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    <Download size={18} />
                    {t.directInstallBtn}
                  </button>
                </div>
              )}

              {/* Instructions: iOS vs Android/Desktop */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-sand-400">
                  {isIOS ? t.iosTitle : t.androidTitle}
                </h3>

                <div className="space-y-2.5">
                  {(isIOS ? t.iosSteps : t.androidSteps).map((st: any) => (
                    <div
                      key={st.num}
                      className="p-3 rounded-2xl bg-charcoal-800/60 border border-charcoal-700/60 flex items-start gap-3"
                    >
                      <div className="w-7 h-7 rounded-lg bg-charcoal-900 border border-charcoal-700 text-sand-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {st.icon || st.num}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-sand-200 mb-0.5">
                          {st.title}
                        </h4>
                        <p className="text-[11px] text-sand-300/60 leading-normal">
                          {st.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Benefits */}
          <div className="pt-2 border-t border-charcoal-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-sand-300/60">
              {t.benefitsHeading}
            </h3>

            <div className="grid grid-cols-1 gap-2">
              {t.benefits.map((b, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-charcoal-800/40 border border-charcoal-800 flex items-center gap-3"
                >
                  <div className="p-1.5 rounded-lg bg-charcoal-900 shrink-0">
                    {b.icon}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-sand-200">
                      {b.title}
                    </h4>
                    <p className="text-[10px] text-sand-300/50">
                      {b.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-charcoal-800 bg-charcoal-900/95 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-sand-200 font-semibold text-xs border border-charcoal-700 transition-colors"
          >
            {t.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
