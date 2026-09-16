import Link from 'next/link';
import Button from '@/components/ui/Button';
import { WifiOff, RotateCcw, Home, Target } from 'lucide-react';

export default function OfflinePage() {
  return (
    <main className="min-h-dvh flex flex-col items-center justify-center px-6 text-center max-w-md mx-auto">
      <div className="w-20 h-20 rounded-3xl bg-charcoal-900 border border-charcoal-800 flex items-center justify-center text-sand-400 mb-6 shadow-xl">
        <WifiOff size={36} />
      </div>

      <h1 className="text-2xl font-black text-sand-100 mb-2">
        You're Offline
      </h1>

      <p className="text-sm text-sand-300/60 mb-6 leading-relaxed">
        ARROWLOG is designed for the range. Any arrows you enter during active shooting will be saved locally and synchronized automatically when your connection returns.
      </p>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Link href="/">
          <Button variant="primary" size="lg" fullWidth icon={<Home size={18} />}>
            Back to Home
          </Button>
        </Link>
        <Link href="/sessions">
          <Button variant="secondary" size="md" fullWidth icon={<Target size={18} />}>
            View Saved Sessions
          </Button>
        </Link>
      </div>

      <p className="text-xs text-sand-300/30 mt-8 font-mono">
        ARROWLOG PWA · Offline Resilient Engine
      </p>
    </main>
  );
}
