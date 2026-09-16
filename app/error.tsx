'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-[75dvh] flex flex-col items-center justify-center px-6 text-center max-w-sm mx-auto">
      <div className="w-16 h-16 rounded-2xl bg-danger-500/10 border border-danger-500/20 flex items-center justify-center text-danger-400 mb-4 shadow-md">
        <AlertTriangle size={32} />
      </div>

      <h1 className="text-xl font-bold text-sand-100 mb-2">Something went wrong</h1>

      <p className="text-xs text-sand-300/50 mb-6 leading-relaxed">
        {error.message || 'An unexpected error occurred. Please try again or return to home.'}
      </p>

      <div className="flex flex-col gap-2.5 w-full">
        <Button variant="primary" size="md" onClick={() => reset()} icon={<RotateCcw size={16} />}>
          Try Again
        </Button>
        <Link href="/">
          <Button variant="secondary" size="md" fullWidth icon={<Home size={16} />}>
            Back to Home
          </Button>
        </Link>
      </div>
    </main>
  );
}
