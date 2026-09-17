'use client';

import React, { useState } from 'react';
import {
  X,
  Target,
  Trophy,
  Share2,
  BookOpen,
  ShieldCheck,
  Smartphone,
  Globe
} from 'lucide-react';

interface HowToUseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'overview' | 'organizer' | 'archer' | 'results';
type LangType = 'bm' | 'en';

export default function HowToUseModal({ isOpen, onClose }: HowToUseModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [lang, setLang] = useState<LangType>('bm');

  if (!isOpen) return null;

  const content = {
    bm: {
      title: 'Panduan Penggunaan',
      subtitle: 'Ketahui cara menggunakan ARROWLOG dalam beberapa langkah mudah.',
      tabs: {
        overview: 'Pengenalan',
        organizer: 'Penganjur',
        archer: 'Pemanah',
        results: 'Keputusan',
      },
      overview: {
        heading: 'Selamat Datang ke ARROWLOG 🏹',
        desc: 'ARROWLOG ialah buku skor digital (digital scorebook) moden yang dicipta khas untuk komuniti memanah tradisional dan sukan memanah.',
        points: [
          {
            icon: <Target className="text-forest-400" size={20} />,
            title: 'Skor Auto-Kalkulasi',
            text: 'Tiada lagi kiraan manual di kertas. Masukkan skor anak panah dan sistem akan mengira jumlah serta kiraan X secara automatik.',
          },
          {
            icon: <Trophy className="text-sand-400" size={20} />,
            title: 'Leaderboard Masa Nyata (Live)',
            text: 'Kedudukan peserta dikemaskini secara langsung semasa sesi sedang berlangsung. Semua pemanah boleh pantau ranking serta-merta.',
          },
          {
            icon: <Share2 className="text-bronze-400" size={20} />,
            title: 'Kad Keputusan Sedia Dikongsi',
            text: 'Jana poster grafik keputusan (Result Card) bertaraf profesional untuk dikongsi terus ke WhatsApp, Instagram, atau Telegram.',
          },
          {
            icon: <Smartphone className="text-emerald-400" size={20} />,
            title: 'Aplikasi Web Pantas (PWA)',
            text: 'Boleh dipasang terus ke skrin telefon anda seperti aplikasi native tanpa perlu muat turun dari App Store / Play Store.',
          },
        ],
      },
      organizer: {
        heading: 'Panduan Untuk Penganjur / Admin 📋',
        desc: 'Cara memulakan dan menguruskan sesi memanah komuniti anda:',
        steps: [
          {
            num: '1',
            title: 'Daftar / Log Masuk',
            desc: 'Tekan butang "CREATE SESSION" atau log masuk akaun penganjur anda.',
          },
          {
            num: '2',
            title: 'Cipta Sesi Baharu',
            desc: 'Tetapkan nama sesi, jarak (contoh: 10m, 15m), bilangan pusingan (ends) dan jumlah anak panah bagi setiap pusingan (contoh: 6 round × 3 arrows).',
          },
          {
            num: '3',
            title: 'Pamerkan Kod QR / Kod Sesi',
            desc: 'Sistem akan menjana Kod QR dan Kod Sesi 6-digit yang unik. Tunjukkan kepada para pemanah untuk mereka scan menggunakan kamera telefon.',
          },
          {
            num: '4',
            title: 'Pantau Sesi & Sahkan Markah',
            desc: 'Penganjur boleh melihat kemasukan markah setiap peserta secara live dan menamatkan sesi apabila semua pusingan selesai.',
          },
        ],
      },
      archer: {
        heading: 'Panduan Untuk Pemanah (Archer) 🎯',
        desc: 'Cara menyertai sesi dan mencatat markah anak panah anda:',
        steps: [
          {
            num: '1',
            title: 'Sertai Sesi (Join)',
            desc: 'Tekan "JOIN SESSION" di laman utama, kemudian imbas Kod QR penganjur atau taip 6-digit Kod Sesi.',
          },
          {
            num: '2',
            title: 'Pilih / Masukkan Nama',
            desc: 'Masukkan nama samaran atau nama pemanah anda untuk dipaparkan di papan pendahulu (leaderboard).',
          },
          {
            num: '3',
            title: 'Kunci Masuk Skor Setiap Arrow',
            desc: 'Selepas selesai menembak setiap end, tekan butang skor anak panah (X, 10, 9, 8 ... sehingga M/0). Antaramuka sentuh direka besar dan mesra satu tangan di lapangan.',
          },
          {
            num: '4',
            title: 'Hantar Markah Pusingan',
            desc: 'Sahkan markah bagi setiap pusingan. Markah anda akan terus dikemas kini ke leaderboard langsung!',
          },
        ],
      },
      results: {
        heading: 'Keputusan & Perkongsian 🏆',
        desc: 'Raikan pencapaian memanah anda dengan mudah:',
        steps: [
          {
            num: '1',
            title: 'Live Leaderboard',
            desc: 'Lihat kedudukan ranking semasa, jumlah mata, dan beza markah antara peserta dari telefon masing-masing.',
          },
          {
            num: '2',
            title: 'Kad Keputusan Rasmi (Result Card)',
            desc: 'Bila sesi tamat, kad keputusan grafik berkualiti tinggi dijana secara automatik dengan statistik peribadi anda.',
          },
          {
            num: '3',
            title: 'Muat Turun & Kongsi',
            desc: 'Tekan butang "Share" atau "Download Image" untuk simpan imej atau kongsikan ke status WhatsApp & group memanah!',
          },
        ],
      },
      closeBtn: 'Faham, Tutup Panduan',
    },
    en: {
      title: 'How to Use ARROWLOG',
      subtitle: 'Learn how to get the most out of ARROWLOG in a few simple steps.',
      tabs: {
        overview: 'Overview',
        organizer: 'Organizer',
        archer: 'Archer',
        results: 'Results',
      },
      overview: {
        heading: 'Welcome to ARROWLOG 🏹',
        desc: 'ARROWLOG is a modern digital scorebook designed for traditional archery communities and archery tournaments.',
        points: [
          {
            icon: <Target className="text-forest-400" size={20} />,
            title: 'Auto-Calculated Scores',
            text: 'No more manual math or pen-and-paper tallying. Tap arrow values and the system computes totals and X-counts instantly.',
          },
          {
            icon: <Trophy className="text-sand-400" size={20} />,
            title: 'Live Leaderboards',
            text: 'Participant rankings update in real time throughout the session. Everyone can track standings right from their phone.',
          },
          {
            icon: <Share2 className="text-bronze-400" size={20} />,
            title: 'Shareable Result Cards',
            text: 'Generate sleek, high-resolution result graphics ready to share directly to WhatsApp, Instagram, or social channels.',
          },
          {
            icon: <Smartphone className="text-emerald-400" size={20} />,
            title: 'Progressive Web App (PWA)',
            text: 'Install straight to your home screen with zero app store hassle, working fast and offline-ready.',
          },
        ],
      },
      organizer: {
        heading: 'Organizer Guide 📋',
        desc: 'How to host and manage community archery sessions:',
        steps: [
          {
            num: '1',
            title: 'Sign In / Register',
            desc: 'Click "CREATE SESSION" or log in with your organizer account.',
          },
          {
            num: '2',
            title: 'Create a New Session',
            desc: 'Set the session title, target distance (e.g. 10m, 15m), number of ends, and arrows per end (e.g. 6 rounds × 3 arrows).',
          },
          {
            num: '3',
            title: 'Display QR Code / Session Code',
            desc: 'The app generates a distinct QR code and 6-character session pin. Archers simply scan or enter it to join instantly.',
          },
          {
            num: '4',
            title: 'Monitor & Wrap Up',
            desc: 'Follow live scoring progress across all lanes and finalize the session once all rounds are shot.',
          },
        ],
      },
      archer: {
        heading: 'Archer Guide 🎯',
        desc: 'How to join a session and log your shooting scores:',
        steps: [
          {
            num: '1',
            title: 'Join Session',
            desc: 'Tap "JOIN SESSION" on the home page, then scan the organizer QR code or type the 6-character session code.',
          },
          {
            num: '2',
            title: 'Enter Archer Name',
            desc: 'Pick your profile or type your archer callsign to be listed on the live leaderboard.',
          },
          {
            num: '3',
            title: 'Log Arrow Scores',
            desc: 'After retrieving arrows, tap the score buttons (X, 10, 9, 8 ... down to M/0). Large touch targets make one-handed field input easy.',
          },
          {
            num: '4',
            title: 'Submit Round Score',
            desc: 'Confirm your round. Your stats and rank instantly sync to the live community leaderboard!',
          },
        ],
      },
      results: {
        heading: 'Results & Sharing 🏆',
        desc: 'Celebrate and archive your archery milestones:',
        steps: [
          {
            num: '1',
            title: 'Live Leaderboard',
            desc: 'Review real-time rankings, point differentials, and highest arrow averages.',
          },
          {
            num: '2',
            title: 'Official Result Card',
            desc: 'When the session concludes, a branded result card graphic is auto-generated showcasing your achievement.',
          },
          {
            num: '3',
            title: 'Download & Share',
            desc: 'Tap "Share" or "Download Image" to save to your photos or post directly to WhatsApp groups and social media.',
          },
        ],
      },
      closeBtn: 'Got it, Close Guide',
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

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-charcoal-900 border border-charcoal-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-10 animate-slide-up">
        {/* Header */}
        <div className="p-5 border-b border-charcoal-800 bg-charcoal-900/95 sticky top-0 z-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-forest-500/20 border border-forest-500/30 flex items-center justify-center text-forest-400">
              <BookOpen size={20} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-sand-100 leading-tight">
                {t.title}
              </h2>
              <p className="text-xs text-sand-300/60 hidden sm:block">
                {t.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <button
              onClick={() => setLang(lang === 'bm' ? 'en' : 'bm')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-charcoal-800 border border-charcoal-700 text-xs font-semibold text-sand-300 hover:text-sand-100 hover:border-charcoal-600 transition-colors"
              title="Tukar Bahasa / Change Language"
            >
              <Globe size={13} className="text-sand-400" />
              <span>{lang === 'bm' ? 'BM' : 'EN'}</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-charcoal-800 border border-charcoal-700 flex items-center justify-center text-sand-300 hover:bg-charcoal-700 hover:text-sand-100 transition-colors"
              aria-label="Tutup modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-charcoal-800 bg-charcoal-950/60 px-3 pt-2 gap-1 overflow-x-auto no-scrollbar">
          {(['overview', 'organizer', 'archer', 'results'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                px-3 py-2 text-xs font-semibold rounded-t-xl transition-all whitespace-nowrap border-b-2
                ${
                  activeTab === tab
                    ? 'text-sand-400 border-sand-400 bg-charcoal-900'
                    : 'text-sand-300/60 border-transparent hover:text-sand-200 hover:bg-charcoal-800/40'
                }
              `}
            >
              {t.tabs[tab]}
            </button>
          ))}
        </div>

        {/* Scrollable Content Area */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {activeTab === 'overview' && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h3 className="text-base font-bold text-sand-100 mb-1">
                  {t.overview.heading}
                </h3>
                <p className="text-xs text-sand-300/70 leading-relaxed">
                  {t.overview.desc}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {t.overview.points.map((pt, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-charcoal-800/60 border border-charcoal-700/60 flex items-start gap-3"
                  >
                    <div className="p-2 rounded-xl bg-charcoal-900 border border-charcoal-700 shrink-0 mt-0.5">
                      {pt.icon}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-sand-200 mb-0.5">
                        {pt.title}
                      </h4>
                      <p className="text-[11px] text-sand-300/60 leading-normal">
                        {pt.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'organizer' && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h3 className="text-base font-bold text-sand-100 mb-1">
                  {t.organizer.heading}
                </h3>
                <p className="text-xs text-sand-300/70 leading-relaxed">
                  {t.organizer.desc}
                </p>
              </div>

              <div className="space-y-2.5">
                {t.organizer.steps.map((st) => (
                  <div
                    key={st.num}
                    className="p-3.5 rounded-2xl bg-charcoal-800/60 border border-charcoal-700/60 flex items-start gap-3"
                  >
                    <div className="w-7 h-7 rounded-lg bg-forest-500 text-sand-100 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      {st.num}
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
          )}

          {activeTab === 'archer' && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h3 className="text-base font-bold text-sand-100 mb-1">
                  {t.archer.heading}
                </h3>
                <p className="text-xs text-sand-300/70 leading-relaxed">
                  {t.archer.desc}
                </p>
              </div>

              <div className="space-y-2.5">
                {t.archer.steps.map((st) => (
                  <div
                    key={st.num}
                    className="p-3.5 rounded-2xl bg-charcoal-800/60 border border-charcoal-700/60 flex items-start gap-3"
                  >
                    <div className="w-7 h-7 rounded-lg bg-sand-400 text-charcoal-950 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      {st.num}
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
          )}

          {activeTab === 'results' && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h3 className="text-base font-bold text-sand-100 mb-1">
                  {t.results.heading}
                </h3>
                <p className="text-xs text-sand-300/70 leading-relaxed">
                  {t.results.desc}
                </p>
              </div>

              <div className="space-y-2.5">
                {t.results.steps.map((st) => (
                  <div
                    key={st.num}
                    className="p-3.5 rounded-2xl bg-charcoal-800/60 border border-charcoal-700/60 flex items-start gap-3"
                  >
                    <div className="w-7 h-7 rounded-lg bg-bronze-400 text-charcoal-950 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      {st.num}
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
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-charcoal-800 bg-charcoal-900/95 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-[11px] text-sand-300/50">
            <ShieldCheck size={14} className="text-forest-400" />
            <span>PWA & Offline Ready</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-forest-500 hover:bg-forest-400 text-sand-100 font-bold text-xs transition-colors"
          >
            {t.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
