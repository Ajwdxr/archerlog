'use client';

import { useEffect, useRef, useState } from 'react';
import { renderSessionPoster } from '@/lib/poster/generator';
import {
  SessionPosterData,
  generateSessionShareText,
  shareResult,
  downloadCanvas,
} from '@/lib/poster/share';
import Button from '@/components/ui/Button';
import { Share2, Download, MessageSquare, Check, Sparkles } from 'lucide-react';

interface Props {
  data: SessionPosterData;
}

export default function SessionPoster({ data }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [theme, setTheme] = useState<'dark' | 'forest'>('dark');
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    if (canvasRef.current) {
      renderSessionPoster(canvasRef.current, data, theme);
    }
  }, [data, theme]);

  const handleShare = async () => {
    const text = generateSessionShareText(data);
    const res = await shareResult({
      title: `${data.sessionName} — Final Results — ARROWLOG`,
      text,
      canvas: canvasRef.current,
      filename: `${data.sessionName.toLowerCase().replace(/\s+/g, '-')}-leaderboard.png`,
    });

    if (res.shared) {
      setShared(true);
      setTimeout(() => setShared(false), 2500);
    }
  };

  const handleDownload = () => {
    if (canvasRef.current) {
      downloadCanvas(
        canvasRef.current,
        `${data.sessionName.toLowerCase().replace(/\s+/g, '-')}-leaderboard.png`
      );
    }
  };

  const handleCopyWhatsApp = async () => {
    const text = generateSessionShareText(data);
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      {/* Theme Toggle */}
      <div className="flex items-center gap-2 p-1 rounded-xl bg-charcoal-800 border border-charcoal-700 text-xs">
        <button
          type="button"
          onClick={() => setTheme('dark')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            theme === 'dark'
              ? 'bg-charcoal-900 text-sand-100 shadow-sm'
              : 'text-sand-300/60 hover:text-sand-200'
          }`}
        >
          Minimal Dark
        </button>
        <button
          type="button"
          onClick={() => setTheme('forest')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
            theme === 'forest'
              ? 'bg-forest-600 text-sand-100 shadow-sm'
              : 'text-sand-300/60 hover:text-sand-200'
          }`}
        >
          <Sparkles size={12} />
          Forest Theme
        </button>
      </div>

      {/* Canvas Preview Container (responsive square aspect ratio) */}
      <div className="relative w-full max-w-[380px] aspect-square rounded-2xl overflow-hidden border border-sand-400/20 shadow-2xl shadow-black/80 bg-charcoal-950">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain block"
          style={{ imageRendering: 'auto' }}
        />
      </div>

      {/* Share Actions */}
      <div className="flex flex-col gap-2.5 w-full max-w-[380px]">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleShare}
          icon={shared ? <Check size={18} /> : <Share2 size={18} />}
        >
          {shared ? 'SHARED!' : 'SHARE POSTER'}
        </Button>

        <div className="grid grid-cols-2 gap-2.5">
          <Button
            variant="secondary"
            size="md"
            onClick={handleDownload}
            icon={<Download size={16} />}
          >
            Download PNG
          </Button>

          <Button
            variant="ghost"
            size="md"
            onClick={handleCopyWhatsApp}
            icon={copied ? <Check size={16} /> : <MessageSquare size={16} />}
          >
            {copied ? 'Copied!' : 'WhatsApp List'}
          </Button>
        </div>
      </div>
    </div>
  );
}
