import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getSessionLeaderboard } from '@/lib/scoring/actions';
import { rankParticipants, getMedalEmoji } from '@/lib/ranking/service';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import LeaderboardLive from './LeaderboardLive';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function LeaderboardPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: session } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', id)
    .single();

  if (!session) notFound();

  const s = session as any;

  const { data: entries } = await getSessionLeaderboard(id);
  const ranked = entries ? rankParticipants(entries) : [];

  return (
    <main className="min-h-dvh pb-24">
      <div className="max-w-lg mx-auto px-5 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            href={`/session/${id}`}
            className="w-10 h-10 rounded-xl bg-charcoal-800 border border-charcoal-700 flex items-center justify-center text-sand-300 hover:bg-charcoal-700 transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-sand-100">
              🏆 {s.status === 'completed' ? 'FINAL RESULTS' : 'LIVE LEADERBOARD'}
            </h1>
            <p className="text-xs text-sand-300/40">{s.name}</p>
          </div>
          {s.status === 'live' && (
            <div className="flex items-center gap-1.5 text-xs text-forest-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-forest-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-forest-400" />
              </span>
              LIVE
            </div>
          )}
        </div>

        {/* Leaderboard */}
        <LeaderboardLive
          sessionId={id}
          initialEntries={ranked}
          endsCount={s.ends_count}
          arrowsPerEnd={s.arrows_per_end}
          isLive={s.status === 'live'}
        />
      </div>
    </main>
  );
}
