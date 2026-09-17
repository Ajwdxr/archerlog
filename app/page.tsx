import Link from 'next/link';
import { Target, Users, Share2, Zap, ChevronRight } from 'lucide-react';
import HomeActions from '@/components/HomeActions';

export default function HomePage() {
  return (
    <main className="min-h-dvh flex flex-col relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Radial gradient spotlight */}
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-forest-500/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-sand-400/5 rounded-full blur-[100px]" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(var(--sand-400) 1px, transparent 1px), linear-gradient(90deg, var(--sand-400) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Logo */}
        <div className="flex flex-col items-center mb-12 animate-fade-in">
          {/* Arrow icon */}
          <div className="relative mb-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-forest-500 to-forest-700 flex items-center justify-center shadow-lg shadow-forest-500/20">
              <span className="text-4xl">🏹</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-sand-400 flex items-center justify-center">
              <Zap size={14} className="text-charcoal-950" />
            </div>
          </div>

          {/* Brand */}
          <h1 className="text-4xl font-extrabold tracking-tight text-sand-100 mb-2">
            ARROW<span className="text-sand-400">LOG</span>
          </h1>
          <p className="text-sand-300/80 text-lg font-medium tracking-wide">
            Shoot. Score. Share.
          </p>
        </div>

        {/* Tagline */}
        <div className="text-center mb-12 max-w-sm animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <p className="text-sand-300/60 text-sm leading-relaxed">
            Track your shots. See your score.
            <br />
            Share your session.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="w-full max-w-xs flex flex-col gap-3 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <Link
            href="/auth/login"
            className="
              flex items-center justify-center gap-2 h-14 rounded-2xl
              bg-gradient-to-r from-forest-500 to-forest-400
              text-sand-100 font-bold text-base
              shadow-lg shadow-forest-500/25
              hover:shadow-forest-500/40 hover:scale-[1.02]
              active:scale-[0.98]
              transition-all duration-200
            "
          >
            <Target size={20} />
            CREATE SESSION
          </Link>

          <Link
            href="/join"
            className="
              flex items-center justify-center gap-2 h-14 rounded-2xl
              bg-charcoal-800 border border-charcoal-700
              text-sand-300 font-semibold text-base
              hover:bg-charcoal-700 hover:border-charcoal-600 hover:text-sand-100
              active:scale-[0.98]
              transition-all duration-200
            "
          >
            JOIN SESSION
            <ChevronRight size={18} className="opacity-50" />
          </Link>

          {/* Quick Guide & PWA Install */}
          <HomeActions />
        </div>

        {/* Feature highlights */}
        <div className="mt-16 grid grid-cols-3 gap-6 max-w-sm w-full animate-slide-up" style={{ animationDelay: '0.3s' }}>
          {[
            { icon: <Target size={20} />, label: 'Live Scoring' },
            { icon: <Users size={20} />, label: 'Leaderboard' },
            { icon: <Share2 size={20} />, label: 'Share Results' },
          ].map((feature) => (
            <div
              key={feature.label}
              className="flex flex-col items-center gap-2 text-center"
            >
              <div className="w-11 h-11 rounded-xl bg-charcoal-800/80 border border-charcoal-700/50 flex items-center justify-center text-sand-400">
                {feature.icon}
              </div>
              <span className="text-[11px] text-sand-300/50 font-medium">
                {feature.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center">
        <p className="text-[11px] text-charcoal-600">
          Made for archery communities 🏹
        </p>
      </footer>
    </main>
  );
}
