'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { submitEnd } from '@/lib/scoring/actions';
import { calculateEndScore } from '@/lib/scoring/calculator';
import { addToOfflineQueue, flushOfflineQueue } from '@/lib/scoring/offline';
import type { ArrowScore, Session, SessionArcher } from '@/types/database';
import { DEFAULT_SCORE_OPTIONS } from '@/types/database';
import Button from '@/components/ui/Button';
import Toast from '@/components/ui/Toast';
import { Undo2, Trophy, WifiOff, CloudUpload } from 'lucide-react';

interface Props {
  session: Session;
  archer: SessionArcher;
  completedEnds: number;
  totalScore: number;
}

export default function ScoreEntry({ session, archer, completedEnds, totalScore }: Props) {
  const router = useRouter();
  const [currentEnd, setCurrentEnd] = useState(completedEnds + 1);
  const [arrows, setArrows] = useState<ArrowScore[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [runningTotal, setRunningTotal] = useState(totalScore);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    setIsOffline(!navigator.onLine);

    const handleOnline = async () => {
      setIsOffline(false);
      const res = await flushOfflineQueue((endNum) => {
        setToast({ message: `Synced End ${endNum} to server! ☁️`, type: 'success' });
      });
      if (res.synced > 0) {
        router.refresh();
      }
    };

    const handleOffline = () => {
      setIsOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial flush if online
    if (navigator.onLine) {
      flushOfflineQueue();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [router]);

  const arrowsPerEnd = session.arrows_per_end;
  const isEndComplete = arrows.length >= arrowsPerEnd;
  const currentEndScore = calculateEndScore(arrows);
  const allEndsComplete = currentEnd > session.ends_count;

  const handleScoreTap = useCallback(
    (score: ArrowScore) => {
      if (arrows.length >= arrowsPerEnd) return;
      setArrows((prev) => [...prev, score]);
    },
    [arrows.length, arrowsPerEnd]
  );

  const handleUndo = useCallback(() => {
    setArrows((prev) => prev.slice(0, -1));
  }, []);

  async function handleSubmitEnd() {
    if (!isEndComplete) return;
    setLoading(true);

    // If offline or network fails
    if (!navigator.onLine) {
      addToOfflineQueue({
        session_id: session.id,
        session_archer_id: archer.id,
        end_number: currentEnd,
        arrows,
      });

      const endScore = currentEndScore;
      setRunningTotal((prev) => prev + endScore);
      setToast({
        message: `END ${currentEnd} SAVED OFFLINE ⚡ (Auto-syncs when online)`,
        type: 'success',
      });

      setArrows([]);
      setCurrentEnd((prev) => prev + 1);
      setLoading(false);
      return;
    }

    try {
      const result = await submitEnd({
        session_id: session.id,
        session_archer_id: archer.id,
        end_number: currentEnd,
        arrows,
      });

      if (result.error) {
        // If it looks like a network or auth error, fallback to queue
        if (result.error.toLowerCase().includes('fetch') || result.error.toLowerCase().includes('network')) {
          addToOfflineQueue({
            session_id: session.id,
            session_archer_id: archer.id,
            end_number: currentEnd,
            arrows,
          });
          const endScore = currentEndScore;
          setRunningTotal((prev) => prev + endScore);
          setToast({
            message: `END ${currentEnd} QUEUED LOCALLY ⚡`,
            type: 'success',
          });
          setArrows([]);
          setCurrentEnd((prev) => prev + 1);
          setLoading(false);
          return;
        }

        setToast({ message: result.error, type: 'error' });
        setLoading(false);
        return;
      }

      const endScore = result.data!.end_score;
      setRunningTotal((prev) => prev + endScore);
      setToast({
        message: `END ${currentEnd} SAVED ✓ — ${endScore} POINTS`,
        type: 'success',
      });

      // Move to next end
      setArrows([]);
      setCurrentEnd((prev) => prev + 1);
      setLoading(false);
    } catch {
      // Catch any unexpected exception, queue locally
      addToOfflineQueue({
        session_id: session.id,
        session_archer_id: archer.id,
        end_number: currentEnd,
        arrows,
      });
      const endScore = currentEndScore;
      setRunningTotal((prev) => prev + endScore);
      setToast({
        message: `END ${currentEnd} SAVED TO LOCAL QUEUE ⚡`,
        type: 'success',
      });
      setArrows([]);
      setCurrentEnd((prev) => prev + 1);
      setLoading(false);
    }
  }

  // All ends complete — show summary
  if (allEndsComplete) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60dvh] px-6 text-center animate-scale-in">
        <div className="text-5xl mb-4">🎯</div>
        <h2 className="text-2xl font-bold text-sand-100 mb-2">Session Complete!</h2>
        <p className="text-5xl font-black text-sand-400 mb-2">{runningTotal}</p>
        <p className="text-xs uppercase tracking-widest text-sand-300/50 mb-8 font-bold">TOTAL POINTS</p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Button
            variant="accent"
            size="lg"
            fullWidth
            icon={<Trophy size={18} />}
            onClick={() => router.push(`/session/${session.id}/leaderboard`)}
          >
            VIEW LEADERBOARD
          </Button>
          <Button
            variant="secondary"
            size="lg"
            fullWidth
            onClick={() => router.push(`/session/${session.id}/score-summary?archer=${archer.id}`)}
          >
            VIEW SCORE DETAILS & SHARE
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-dvh">
      {/* Header */}
      <div className="px-5 pt-6 pb-2 text-center">
        {isOffline && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-semibold mb-2">
            <WifiOff size={12} />
            Offline Mode Active · Scores saved locally
          </div>
        )}
        <p className="text-sm font-semibold text-sand-400 mb-0.5">
          {archer.display_name}
        </p>
        <p className="text-xs text-sand-300/40">{archer.bow_type || session.bow_type}</p>
      </div>

      {/* End Progress */}
      <div className="px-5 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-bold text-sand-100">
            END {currentEnd} <span className="text-sand-300/30 font-normal">/ {session.ends_count}</span>
          </span>
          <span className="text-sm text-sand-300/40">
            Total: <span className="text-sand-400 font-semibold">{runningTotal}</span>
          </span>
        </div>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${((currentEnd - 1) / session.ends_count) * 100}%` }}
          />
        </div>
      </div>

      {/* Arrow Indicators */}
      <div className="px-5 mb-4">
        <div className="flex items-center justify-center gap-2.5">
          {Array.from({ length: arrowsPerEnd }).map((_, i) => (
            <div
              key={i}
              className={`
                flex items-center justify-center
                w-10 h-10 rounded-full
                text-sm font-bold transition-all duration-200
                ${
                  i < arrows.length
                    ? 'bg-sand-400 text-charcoal-950 animate-score-pop'
                    : 'bg-charcoal-800 border border-charcoal-700 text-charcoal-600'
                }
              `}
            >
              {i < arrows.length ? arrows[i].display_value : ''}
            </div>
          ))}
        </div>

        {/* Current End Score */}
        <div className="text-center mt-3">
          <span className="text-xs text-sand-300/40">Current End: </span>
          <span className="text-lg font-bold text-sand-100">{currentEndScore}</span>
        </div>
      </div>

      {/* Score Keypad */}
      <div className="flex-1 flex flex-col justify-end px-4 pb-4">
        <div className="grid grid-cols-4 gap-2.5 mb-4">
          {DEFAULT_SCORE_OPTIONS.map((score) => (
            <button
              key={score.display_value}
              className={`
                score-btn
                ${score.display_value === 'X' ? 'bg-bronze-600/20 border-bronze-600/40 text-bronze-300' : ''}
                ${isEndComplete ? 'opacity-30 pointer-events-none' : ''}
              `}
              onClick={() => handleScoreTap(score)}
              disabled={isEndComplete}
            >
              {score.display_value}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2.5">
          <Button
            variant="ghost"
            size="lg"
            onClick={handleUndo}
            disabled={arrows.length === 0 || loading}
            icon={<Undo2 size={18} />}
            className="shrink-0"
          >
            UNDO
          </Button>

          <Button
            variant="accent"
            size="lg"
            fullWidth
            loading={loading}
            disabled={!isEndComplete}
            onClick={handleSubmitEnd}
          >
            SUBMIT END
          </Button>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
