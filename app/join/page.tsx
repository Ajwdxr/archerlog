'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import QRScannerModal from '@/components/QRScannerModal';
import { QrCode, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function JoinEntryPage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (code.trim()) {
      router.push(`/join/${code.trim().toUpperCase()}`);
    }
  }

  function handleScanSuccess(scannedCode: string) {
    setIsScannerOpen(false);
    if (scannedCode) {
      router.push(`/join/${scannedCode}`);
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
        <p className="text-sand-300/50 text-sm mb-6">
          Imbas kod QR di lapangan atau masukkan kod sesi 6-digit
        </p>

        {/* Big Scan QR Button */}
        <Button
          type="button"
          variant="accent"
          size="xl"
          fullWidth
          onClick={() => setIsScannerOpen(true)}
          className="mb-6 flex items-center justify-center gap-2.5 shadow-xl shadow-forest-500/20 py-4"
        >
          <QrCode size={22} />
          <span>IMBAS KOD QR / SCAN QR</span>
        </Button>

        {/* Divider */}
        <div className="relative flex items-center justify-center mb-6">
          <div className="border-t border-charcoal-800 w-full" />
          <span className="bg-charcoal-950 px-3 text-[11px] font-bold uppercase tracking-widest text-sand-300/40 absolute">
            ATAU MASUKKAN KOD
          </span>
        </div>

        {/* Manual Code Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            placeholder="KOD 6-DIGIT"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="text-center text-xl font-mono tracking-[0.3em] uppercase"
            maxLength={6}
            required
          />

          <Button
            type="submit"
            variant="secondary"
            size="lg"
            fullWidth
            disabled={code.length < 4}
            className="flex items-center justify-center gap-2 font-bold"
          >
            TERUSKAN <ArrowRight size={16} />
          </Button>
        </form>

        <div className="mt-8">
          <Link
            href="/"
            className="text-sand-400 hover:text-sand-300 text-xs font-medium"
          >
            ← Kembali ke Laman Utama
          </Link>
        </div>
      </div>

      {/* QR Scanner Camera Modal */}
      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleScanSuccess}
      />
    </main>
  );
}
