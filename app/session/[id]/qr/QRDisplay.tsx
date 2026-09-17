'use client';

import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, Share2, ExternalLink, Wifi, Edit3 } from 'lucide-react';
import Button from '@/components/ui/Button';

interface Props {
  value: string;
  joinCode: string;
}

export default function QRDisplay({ value, joinCode }: Props) {
  const [actualUrl, setActualUrl] = useState(value);
  const [copied, setCopied] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isLocalhost, setIsLocalhost] = useState(false);
  const [showCustomHost, setShowCustomHost] = useState(false);
  const [customHost, setCustomHost] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      setIsLocalhost(isLocal);

      // If value uses localhost but window is accessible or vice-versa, prefer actual window origin
      const computed = `${origin}/join/${joinCode}`;
      setActualUrl(computed);
      setCustomHost(origin);
    }
  }, [joinCode]);

  function handleCopy() {
    navigator.clipboard.writeText(actualUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleCopyCode() {
    navigator.clipboard.writeText(joinCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  }

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Sertai Sesi Memanah: ${joinCode}`,
          text: `Sertai sesi memanah saya di ARROWLOG menggunakan kod sesi: ${joinCode}`,
          url: actualUrl,
        });
      } catch (e) {
        // User cancelled share
      }
    } else {
      handleCopy();
    }
  }

  function handleApplyCustomHost(e: React.FormEvent) {
    e.preventDefault();
    if (!customHost.trim()) return;
    let clean = customHost.trim().replace(/\/+$/, '');
    if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
      clean = `http://${clean}`;
    }
    setActualUrl(`${clean}/join/${joinCode}`);
    setShowCustomHost(false);
  }

  return (
    <div className="flex flex-col items-center w-full max-w-sm">
      {/* QR Code Container */}
      <div className="p-6 bg-white rounded-3xl shadow-2xl shadow-black/40 flex items-center justify-center">
        <QRCodeSVG
          value={actualUrl}
          size={220}
          bgColor="#ffffff"
          fgColor="#1a1a1a"
          level="M"
          marginSize={0}
        />
      </div>

      {/* Join Code Display */}
      <div className="mt-5 w-full flex items-center justify-between px-5 py-3 rounded-2xl bg-charcoal-900 border border-charcoal-800">
        <div>
          <p className="text-[11px] text-sand-300/40 uppercase font-semibold tracking-wider">Kod Sesi</p>
          <p className="text-2xl font-mono font-black text-sand-400 tracking-[0.25em]">
            {joinCode}
          </p>
        </div>
        <button
          onClick={handleCopyCode}
          className="p-2.5 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-sand-300 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          title="Salin Kod"
        >
          {copiedCode ? <Check size={16} className="text-forest-400" /> : <Copy size={16} />}
          <span>{copiedCode ? 'Disalin' : 'Salin'}</span>
        </button>
      </div>

      {/* Action Buttons */}
      <div className="mt-3 flex items-center gap-2 w-full">
        <Button
          variant="secondary"
          size="md"
          className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold"
          onClick={handleCopy}
        >
          {copied ? <Check size={14} className="text-forest-400" /> : <Copy size={14} />}
          {copied ? 'Pautan Disalin!' : 'Salin Pautan'}
        </Button>

        <Button
          variant="secondary"
          size="md"
          className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold"
          onClick={handleShare}
        >
          <Share2 size={14} />
          Kongsi
        </Button>

        <a
          href={actualUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-sand-300 border border-charcoal-700 transition-colors"
          title="Buka pautan di tab baharu"
        >
          <ExternalLink size={16} />
        </a>
      </div>

      {/* Localhost / Network Helper */}
      {isLocalhost && (
        <div className="mt-4 p-3.5 rounded-2xl bg-charcoal-900/90 border border-sand-400/20 w-full text-left">
          <div className="flex items-start gap-2.5">
            <Wifi size={16} className="text-sand-400 shrink-0 mt-0.5" />
            <div className="text-xs text-sand-300/70 leading-relaxed">
              <strong className="text-sand-200 block mb-0.5">Petua Ujian Telefon / Wi-Fi:</strong>
              Jika mengimbas menggunakan telefon dalam rangkaian Wi-Fi yang sama, buka laman ini menggunakan IP komputer anda (cth: <span className="font-mono text-sand-300">192.168.x.x:3000</span>) supaya telefon boleh akses.
            </div>
          </div>

          <div className="mt-2.5 pt-2.5 border-t border-charcoal-800 flex items-center justify-between text-[11px]">
            <span className="text-sand-300/40 truncate max-w-[200px]">{actualUrl}</span>
            <button
              onClick={() => setShowCustomHost(!showCustomHost)}
              className="text-sand-400 hover:text-sand-300 font-semibold flex items-center gap-1"
            >
              <Edit3 size={12} />
              {showCustomHost ? 'Tutup' : 'Tukar IP'}
            </button>
          </div>

          {showCustomHost && (
            <form onSubmit={handleApplyCustomHost} className="mt-2.5 flex items-center gap-2">
              <input
                type="text"
                placeholder="cth: 192.168.1.50:3000"
                value={customHost}
                onChange={(e) => setCustomHost(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg bg-charcoal-950 border border-charcoal-700 text-xs text-sand-100 font-mono"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-sand-400 text-charcoal-950 text-xs font-bold hover:bg-sand-300"
              >
                Guna
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

