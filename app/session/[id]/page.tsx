import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import SessionControls from './SessionControls';
import ParticipantsList from './ParticipantsList';
import type { SessionStatus, SessionArcher } from '@/types/database';
import { formatDate, formatTime } from '@/lib/sessions/utils';
import { QrCode, Trophy, ChevronRight, ArrowLeft, Award, Target, ArrowRight } from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function SessionPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: session } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', id)
    .single();

  if (!session) notFound();

  const s = session as any;

  const { data: archers } = await supabase
    .from('session_archers')
    .select('*')
    .eq('session_id', id)
    .order('joined_at', { ascending: true });

  const archerList = (archers || []) as SessionArcher[];
  const archerCount = archerList.length;
  const totalArrows = s.ends_count * s.arrows_per_end;
  const { data: { user } } = await supabase.auth.getUser();
  const isOrganizer = user?.id === s.created_by;

  // Check if the current user is a participating archer in this session
  const currentArcher = user ? archerList.find((a) => a.user_id === user.id) : null;

  return (
    <main className="min-h-dvh pb-24">
      <div className="max-w-lg mx-auto px-5 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/dashboard"
            className="w-10 h-10 rounded-xl bg-charcoal-800 border border-charcoal-700 flex items-center justify-center text-sand-300 hover:bg-charcoal-700 transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-sand-100">{s.name}</h1>
            <p className="text-xs text-sand-300/40">
              {s.venue && `${s.venue} · `}
              {formatDate(s.session_date)}
              {s.start_time && ` · ${formatTime(s.start_time)}`}
            </p>
          </div>
          <Badge status={s.status as SessionStatus} />
        </div>

        {/* Participant Scoring Action CTA */}
        {currentArcher && s.status === 'live' && (
          <Link
            href={`/session/${id}/score?archer=${currentArcher.id}`}
            className="block mb-6"
          >
            <div className="p-4 rounded-2xl bg-gradient-to-r from-forest-600 to-forest-500 text-white shadow-xl shadow-forest-500/20 flex items-center justify-between hover:brightness-105 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">
                  🎯
                </div>
                <div>
                  <p className="font-bold text-base leading-tight">Sesi Sedang Berlangsung!</p>
                  <p className="text-xs text-forest-100 mt-0.5">
                    Isi markah sebagai <strong>{currentArcher.display_name}</strong>
                  </p>
                </div>
              </div>
              <ArrowRight size={20} className="text-forest-100" />
            </div>
          </Link>
        )}

        {/* Session Info */}
        <Card className="mb-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-sand-100">{archerCount}</p>
              <p className="text-xs text-sand-300/40 mt-0.5">Archers</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-sand-100">{totalArrows}</p>
              <p className="text-xs text-sand-300/40 mt-0.5">Arrows</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-sand-100">{s.ends_count}</p>
              <p className="text-xs text-sand-300/40 mt-0.5">Ends</p>
            </div>
          </div>
          {s.bow_type && (
            <div className="mt-4 pt-4 border-t border-charcoal-800 text-center">
              <span className="text-xs text-sand-300/50">{s.bow_type}</span>
              {s.distance_m && (
                <span className="text-xs text-sand-300/50"> · {s.distance_m}m</span>
              )}
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        <div className="flex flex-col gap-2.5 mb-6">
          {currentArcher && (
            <Link
              href={`/session/${id}/score?archer=${currentArcher.id}`}
              className="flex items-center gap-3 p-4 rounded-xl bg-forest-500/10 border border-forest-500/20 hover:bg-forest-500/15 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-forest-500/20 flex items-center justify-center text-forest-400">
                <Target size={20} />
              </div>
              <span className="flex-1 font-medium text-forest-300">Papan Skor Saya ({currentArcher.display_name})</span>
              <ChevronRight size={16} className="text-forest-400/60" />
            </Link>
          )}

          <Link
            href={`/session/${id}/qr`}
            className="flex items-center gap-3 p-4 rounded-xl bg-surface border border-border-subtle hover:bg-surface-elevated transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-sand-400/10 flex items-center justify-center text-sand-400">
              <QrCode size={20} />
            </div>
            <span className="flex-1 font-medium text-sand-100">QR Code</span>
            <ChevronRight size={16} className="text-charcoal-600" />
          </Link>

          <Link
            href={`/session/${id}/leaderboard`}
            className="flex items-center gap-3 p-4 rounded-xl bg-surface border border-border-subtle hover:bg-surface-elevated transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-forest-500/10 flex items-center justify-center text-forest-300">
              <Trophy size={20} />
            </div>
            <span className="flex-1 font-medium text-sand-100">Leaderboard</span>
            <ChevronRight size={16} className="text-charcoal-600" />
          </Link>

          <Link
            href={`/results/${id}`}
            className="flex items-center gap-3 p-4 rounded-xl bg-surface border border-border-subtle hover:bg-surface-elevated transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-300">
              <Award size={20} />
            </div>
            <span className="flex-1 font-medium text-sand-100">Results & Shareable Posters</span>
            <ChevronRight size={16} className="text-charcoal-600" />
          </Link>
        </div>

        {/* Live Participants */}
        <ParticipantsList sessionId={id} initialArchers={archerList} />

        {/* Organizer Controls */}
        {isOrganizer && (
          <SessionControls sessionId={s.id} currentStatus={s.status as SessionStatus} />
        )}
      </div>
    </main>
  );
}
