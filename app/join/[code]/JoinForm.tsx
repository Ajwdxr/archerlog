'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { joinSession } from '@/lib/sessions/actions';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { BOW_TYPES } from '@/types/database';
import type { Session, SessionArcher, SessionStatus } from '@/types/database';
import { Radio, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';

interface Props {
  session: Session;
  initialArcher?: SessionArcher | null;
}

export default function JoinForm({ session, initialArcher }: Props) {
  const router = useRouter();
  const [name, setName] = useState(initialArcher?.display_name || '');
  const [bowType, setBowType] = useState(initialArcher?.bow_type || session.bow_type || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [joined, setJoined] = useState(!!initialArcher);
  const [archerId, setArcherId] = useState(initialArcher?.id || '');
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>(session.status);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Prevent multiple redirects
  const redirectedRef = useRef(false);

  const redirectToScoring = (idToUse: string) => {
    if (redirectedRef.current) return;
    redirectedRef.current = true;
    setIsRedirecting(true);
    router.replace(`/session/${session.id}/score?archer=${idToUse}`);
  };

  // 1. Check localStorage for previously joined guest archer on mount
  useEffect(() => {
    if (initialArcher) {
      try {
        localStorage.setItem(
          `archer_session_${session.id}`,
          JSON.stringify({ archerId: initialArcher.id, name: initialArcher.display_name })
        );
      } catch (e) {
        console.error('Failed to cache archer info', e);
      }
      return;
    }

    try {
      const saved = localStorage.getItem(`archer_session_${session.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.archerId) {
          setArcherId(parsed.archerId);
          setJoined(true);
          if (parsed.name && !name) setName(parsed.name);

          // If session is already live, redirect immediately
          if (sessionStatus === 'live') {
            redirectToScoring(parsed.archerId);
          }
        }
      }
    } catch (e) {
      console.error('Failed to read saved archer session', e);
    }
  }, [initialArcher, session.id, sessionStatus]);

  // 2. Realtime listener & polling fallback when user is joined and waiting
  useEffect(() => {
    if (!joined || !archerId) return;

    // If session is already live, navigate right away
    if (sessionStatus === 'live') {
      redirectToScoring(archerId);
      return;
    }

    const supabase = createClient();

    // A. Realtime subscription to sessions table
    const channel = supabase
      .channel(`session-status-${session.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'sessions',
          filter: `id=eq.${session.id}`,
        },
        (payload) => {
          const updated = payload.new as Session;
          if (updated?.status === 'live') {
            setSessionStatus('live');
            redirectToScoring(archerId);
          } else if (updated?.status) {
            setSessionStatus(updated.status);
          }
        }
      )
      .subscribe();

    // B. Polling interval fallback (every 2.5s) to guarantee fast pickup even on mobile networks
    const pollInterval = setInterval(async () => {
      const { data, error: fetchErr } = await supabase
        .from('sessions')
        .select('status')
        .eq('id', session.id)
        .single();

      if (!fetchErr && data) {
        if (data.status === 'live') {
          setSessionStatus('live');
          redirectToScoring(archerId);
        } else if (data.status) {
          setSessionStatus(data.status as SessionStatus);
        }
      }
    }, 2500);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(pollInterval);
    };
  }, [joined, archerId, session.id, sessionStatus]);

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await joinSession({
      join_code: session.join_code,
      display_name: name,
      bow_type: (bowType as any) || undefined,
    });

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    const newArcher = result.data!.archer;
    const currentStatus = result.data!.session.status;

    setArcherId(newArcher.id);
    setJoined(true);
    setSessionStatus(currentStatus);
    setLoading(false);

    // Persist to localStorage for reliability
    try {
      localStorage.setItem(
        `archer_session_${session.id}`,
        JSON.stringify({ archerId: newArcher.id, name: name })
      );
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }

    // If session is already live, transition straight to scoring
    if (currentStatus === 'live') {
      redirectToScoring(newArcher.id);
    }
  }

  // ─── WAITING ROOM / REDIRECTING VIEW ───
  if (joined) {
    const isLive = sessionStatus === 'live' || isRedirecting;

    return (
      <div className="text-center py-8 animate-scale-in">
        {isLive ? (
          <div className="flex flex-col items-center">
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-3xl bg-forest-500/20 border border-forest-500/30 flex items-center justify-center text-4xl shadow-xl shadow-forest-500/10 animate-bounce">
                🎯
              </div>
              <div className="absolute -inset-2 rounded-3xl bg-forest-400/20 blur-xl animate-pulse" />
            </div>

            <h2 className="text-2xl font-black text-sand-100 mb-2">
              Sesi Bermula!
            </h2>
            <p className="text-forest-400 font-medium text-sm mb-6 flex items-center justify-center gap-2">
              <Loader2 size={16} className="animate-spin" />
              Membuka papan pemarkahan anda...
            </p>

            <Button
              variant="accent"
              size="lg"
              fullWidth
              className="mt-2 flex items-center justify-center gap-2 shadow-lg shadow-forest-500/25"
              onClick={() => router.replace(`/session/${session.id}/score?archer=${archerId}`)}
            >
              MASUK KE SKRIN MARKAH <ArrowRight size={18} />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-charcoal-800 border border-charcoal-700 flex items-center justify-center text-3xl mb-5 shadow-inner">
              🏹
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-forest-500/10 border border-forest-500/30 text-forest-300 text-xs font-semibold mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-forest-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-forest-500" />
              </span>
              Sambungan Langsung Aktif
            </div>

            <h2 className="text-2xl font-bold text-sand-100 mb-1">
              Anda Sudah Sertai!
            </h2>
            <p className="text-sand-300/60 text-sm mb-6 max-w-xs leading-relaxed">
              Menunggu penganjur memulakan sesi. Skrin markah akan <strong className="text-sand-200">terbuka secara automatik</strong> tanpa perlu refresh.
            </p>

            {/* Session Info Pill */}
            <div className="w-full bg-charcoal-900 border border-charcoal-800 rounded-2xl p-4 text-left mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-sand-400 font-bold uppercase tracking-wider">
                  Profil Pemanah
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] text-forest-400 font-medium">
                  <CheckCircle2 size={13} /> Sedia
                </span>
              </div>
              <p className="text-base font-bold text-sand-100 truncate">{name}</p>
              {bowType && (
                <p className="text-xs text-sand-300/50 mt-0.5">{bowType}</p>
              )}

              <div className="mt-3 pt-3 border-t border-charcoal-800/80 flex items-center justify-between text-xs text-sand-300/40">
                <span>{session.name}</span>
                <span>{session.ends_count} Ends · {session.ends_count * session.arrows_per_end} Panah</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-sand-300/40">
              <Radio size={14} className="text-sand-400 animate-pulse" />
              <span>Menunggu penganjur klik &apos;Start Session&apos;...</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─── JOIN FORM VIEW ───
  const totalArrows = session.ends_count * session.arrows_per_end;

  return (
    <div>
      {/* Session Info */}
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold text-sand-100 mb-3">
          {session.name}
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-sand-300/50">
          {session.venue && <span>{session.venue}</span>}
          {session.bow_type && <span>{session.bow_type}</span>}
          <span>{session.ends_count} Ends · {totalArrows} Arrows</span>
        </div>
      </div>

      {/* Join Form */}
      <form onSubmit={handleJoin} className="flex flex-col gap-4">
        <Input
          label="Name"
          placeholder="Your display name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoFocus
        />

        <Select
          label="Bow Type"
          placeholder="Select bow type"
          value={bowType}
          onChange={(e) => setBowType(e.target.value)}
          options={BOW_TYPES.map((b) => ({ value: b, label: b }))}
        />

        {error && (
          <div className="px-4 py-3 rounded-xl bg-danger-500/10 border border-danger-500/20 text-danger-400 text-sm">
            {error}
          </div>
        )}

        <Button
          type="submit"
          variant="accent"
          size="xl"
          fullWidth
          loading={loading}
          className="mt-2"
        >
          JOIN SESSION
        </Button>
      </form>
    </div>
  );
}
