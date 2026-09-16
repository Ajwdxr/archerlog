import Link from 'next/link';
import Button from '@/components/ui/Button';
import { Target, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-[75dvh] flex flex-col items-center justify-center px-6 text-center max-w-sm mx-auto">
      <div className="w-16 h-16 rounded-2xl bg-charcoal-900 border border-charcoal-800 flex items-center justify-center text-sand-400 mb-4 shadow-md">
        <Target size={32} />
      </div>

      <h1 className="text-4xl font-black text-sand-100 mb-1">404</h1>
      <h2 className="text-base font-bold text-sand-200 mb-2">Target Missed</h2>

      <p className="text-xs text-sand-300/50 mb-6 leading-relaxed">
        The page or session you're looking for doesn't exist or may have been moved.
      </p>

      <div className="flex flex-col gap-2.5 w-full">
        <Link href="/">
          <Button variant="primary" size="md" fullWidth icon={<Home size={16} />}>
            Back to Home
          </Button>
        </Link>
        <Link href="/sessions">
          <Button variant="secondary" size="md" fullWidth icon={<ArrowLeft size={16} />}>
            Browse Sessions
          </Button>
        </Link>
      </div>
    </main>
  );
}
