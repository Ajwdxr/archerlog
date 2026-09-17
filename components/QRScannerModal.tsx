'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Camera, Image, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess?: (code: string) => void;
}

export function extractCodeFromQR(text: string): string {
  const trimmed = text.trim();
  // Check if it's a URL like .../join/ABC123
  const urlMatch = trimmed.match(/\/join\/([A-Za-z0-9]+)/i);
  if (urlMatch && urlMatch[1]) {
    return urlMatch[1].toUpperCase();
  }
  // Otherwise clean string
  const clean = trimmed.replace(/[^A-Za-z0-9]/g, '');
  return clean.toUpperCase();
}

export default function QRScannerModal({ isOpen, onClose, onScanSuccess }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(true);
  const [hasScanned, setHasScanned] = useState(false);
  const scannerRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDetected = (decodedText: string) => {
    if (hasScanned) return;
    setHasScanned(true);

    const code = extractCodeFromQR(decodedText);

    // Stop scanner
    if (scannerRef.current) {
      scannerRef.current.stop().catch(() => {});
    }

    if (onScanSuccess) {
      onScanSuccess(code);
    } else {
      router.push(`/join/${code}`);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    let html5QrCode: any = null;
    let isMounted = true;
    setIsStarting(true);
    setError(null);
    setHasScanned(false);

    // Dynamic import to prevent any SSR issues
    import('html5-qrcode')
      .then(({ Html5Qrcode }) => {
        if (!isMounted) return;

        html5QrCode = new Html5Qrcode('qr-camera-stream');
        scannerRef.current = html5QrCode;

        const config = {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        };

        html5QrCode
          .start(
            { facingMode: 'environment' },
            config,
            (decodedText: string) => {
              handleDetected(decodedText);
            },
            () => {
              // Frame scan error (normal when no QR is in frame)
            }
          )
          .then(() => {
            if (isMounted) setIsStarting(false);
          })
          .catch((err: any) => {
            console.error('Camera start error:', err);
            if (isMounted) {
              setIsStarting(false);
              setError(
                'Kamera tidak dapat diakses. Sila pastikan kebenaran kamera dibenarkan atau muat naik imej QR.'
              );
            }
          });
      })
      .catch((err) => {
        console.error('Failed to load html5-qrcode', err);
        if (isMounted) {
          setError('Gagal memuatkan modul pengimbas.');
          setIsStarting(false);
        }
      });

    return () => {
      isMounted = false;
      if (scannerRef.current) {
        try {
          scannerRef.current.stop().catch(() => {}).finally(() => {
            try {
              scannerRef.current.clear();
            } catch (e) {}
          });
        } catch (e) {}
      }
    };
  }, [isOpen]);

  // Handle image upload fallback
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { Html5Qrcode } = await import('html5-qrcode');
      const tempScanner = new Html5Qrcode('qr-temp-canvas');
      const result = await tempScanner.scanFile(file, true);
      tempScanner.clear();
      handleDetected(result);
    } catch (err) {
      setError('Tiada Kod QR yang sah ditemui dalam gambar ini.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm bg-charcoal-900 border border-charcoal-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-charcoal-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera size={18} className="text-sand-400" />
            <h3 className="font-bold text-sm text-sand-100">Imbas Kod QR Sesi</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-sand-300 flex items-center justify-center transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Viewfinder Area */}
        <div className="relative w-full aspect-square bg-black flex items-center justify-center overflow-hidden">
          <div id="qr-camera-stream" className="w-full h-full" />
          <div id="qr-temp-canvas" className="hidden" />

          {isStarting && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-charcoal-950 text-sand-300 text-xs">
              <RefreshCw size={24} className="animate-spin text-sand-400" />
              <span>Menghidupkan kamera...</span>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 p-6 flex flex-col items-center justify-center text-center bg-charcoal-950/95 gap-3">
              <AlertCircle size={32} className="text-danger-400" />
              <p className="text-xs text-sand-200 leading-relaxed">{error}</p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="mt-2 text-xs flex items-center gap-1.5"
              >
                <Image size={14} />
                Pilih Dari Galeri
              </Button>
            </div>
          )}

          {/* Scanner Overlay Box */}
          {!isStarting && !error && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 border-2 border-dashed border-sand-400/70 rounded-2xl relative shadow-[0_0_0_9999px_rgba(0,0,0,0.4)]">
                {/* Corner Accents */}
                <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-sand-400 rounded-tl-lg" />
                <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-sand-400 rounded-tr-lg" />
                <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-sand-400 rounded-bl-lg" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-sand-400 rounded-br-lg" />

                {/* Scanning laser effect */}
                <div className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-sand-400 to-transparent animate-pulse top-1/2 -translate-y-1/2 shadow-[0_0_8px_rgba(230,190,120,0.8)]" />
              </div>
            </div>
          )}
        </div>

        {/* Footer info & Upload alternative */}
        <div className="p-4 bg-charcoal-900 border-t border-charcoal-800 text-center">
          <p className="text-xs text-sand-300/50 mb-3">
            Arahkan kamera anda ke Kod QR penganjur di lapangan
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-xs text-sand-400 hover:text-sand-300 font-semibold inline-flex items-center gap-1.5 transition-colors"
          >
            <Image size={14} />
            Atau muat naik gambar QR dari galeri
          </button>
        </div>
      </div>
    </div>
  );
}
