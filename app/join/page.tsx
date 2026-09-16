'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function JoinEntryPage() {
  const router = useRouter();
  const [code, setCode] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (code.trim()) {
      router.push(`/join/${code.trim().toUpperCase()}`);
    }
  }

  return (
    <main className="min-h-dvh flex flex-col items-center justify-center px-6 py-12">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-forest-500/6 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-sm text-center">
        <p className="text-sand-400 text-xs font-bold tracking-widest mb-2">🏹 ARROWLOG</p>
        <h1 className="text-2xl font-bold text-sand-100 mb-2">Join Session</h1>
        <p className="text-sand-300/50 text-sm mb-8">
          Enter the session code or scan the QR code at the range
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            placeholder="Enter session code"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="text-center text-xl font-mono tracking-[0.3em] uppercase"
            maxLength={6}
            required
            autoFocus
          />

          <Button
            type="submit"
            variant="accent"
            size="xl"
            fullWidth
            disabled={code.length < 4}
          >
            JOIN
          </Button>
        </form>
      </div>
    </main>
  );
}
