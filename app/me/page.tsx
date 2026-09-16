import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import BottomNav from '@/components/ui/BottomNav';
import { getMedalEmoji } from '@/lib/ranking/service';
import { formatDate } from '@/lib/sessions/utils';
import { Target, Trophy, Flame, History, ArrowRight, User } from 'lucide-react';

export default async function ArcherDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="min-h-dvh pb-28 pt-8 px-4 max-w-lg mx-auto flex flex-col justify-center items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-charcoal-900 border border-charcoal-800 flex items-center justify-center text-3xl mb-4 shadow-inner">
          🏹
        </div>
        <h1 className="text-xl font-bold text-sand-100 mb-2">My Arrowlog</h1>
        <p className="text-sm text-sand-300/50 mb-6 max-w-xs">
          Sign in or create an account to view your shooting history, personal records, and statistical trends.
        </p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Link href="/auth/login">
            <Button variant="primary" size="lg" fullWidth>
              LOG IN
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button variant="secondary" size="lg" fullWidth>
              CREATE ACCOUNT
            </Button>
          </Link>
        </div>
        <BottomNav role="archer" />
      </main>
    );
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const displayName = profile?.display_name || user.email?.split('@')[0] || 'Archer';

  // Get user's session_archers records
  const { data: userArchers } = await supabase
    .from('session_archers')
    .select(`
      id,
      session_id,
      display_name,
      bow_type,
      joined_at,
      sessions (
        id,
        name,
        venue,
        session_date,
        bow_type,
        ends_count,
        arrows_per_end
      ),
      ends (
        id,
        total_score,
        arrows (
          id,
          numeric_value,
          display_value
        )
      )
    `)
    .eq('user_id', user.id);

  const entries = (userArchers || []) as any[];

  // Also check results table for ranks
  const archerIds = entries.map((e) => e.id);
  let resultsMap = new Map<string, any>();

  if (archerIds.length > 0) {
    const { data: results } = await supabase
      .from('results')
      .select('session_archer_id, rank, total_score')
      .in('session_archer_id', archerIds);

    if (results) {
      results.forEach((r: any) => resultsMap.set(r.session_archer_id, r));
    }
  }

  // Compute aggregate stats
  let totalSessions = entries.length;
  let totalArrows = 0;
  let totalScoreSum = 0;
  let bestScore = 0;

  const sessionHistory = entries
    .map((e) => {
      const ends = e.ends || [];
      const sessionScore = ends.reduce((sum: number, end: any) => sum + (end.total_score || 0), 0);
      const allArrows = ends.flatMap((end: any) => end.arrows || []);
      const arrowCount = allArrows.length;

      totalArrows += arrowCount;
      totalScoreSum += sessionScore;
      if (sessionScore > bestScore) bestScore = sessionScore;

      const resultRow = resultsMap.get(e.id);
      const rank = resultRow?.rank || null;

      return {
        archerId: e.id,
        sessionId: e.session_id,
        sessionName: e.sessions?.name || 'Archery Session',
        sessionDate: e.sessions?.session_date || e.joined_at,
        venue: e.sessions?.venue,
        bowType: e.bow_type || e.sessions?.bow_type,
        score: sessionScore,
        arrows: arrowCount,
        rank: rank,
      };
    })
    .sort((a, b) => new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime());

  const averagePerArrow = totalArrows > 0 ? (totalScoreSum / totalArrows).toFixed(2) : '0.00';

  return (
    <main className="min-h-dvh pb-28 pt-6 px-4 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-sand-400 font-bold mb-0.5">
            MY ARROWLOG
          </p>
          <h1 className="text-2xl font-black text-sand-100">
            {displayName.toUpperCase()}
          </h1>
        </div>
        <Link
          href="/profile"
          className="w-10 h-10 rounded-xl bg-charcoal-800 border border-charcoal-700 flex items-center justify-center text-sand-300 hover:bg-charcoal-700 transition-colors"
        >
          <User size={18} />
        </Link>
      </div>

      {/* 4 Stat Cards Grid (per PRD §33) */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        {/* Best Score */}
        <div className="p-4 rounded-2xl bg-charcoal-900 border border-sand-400/20 shadow-md">
          <div className="flex items-center gap-1.5 text-gold text-xs font-bold uppercase tracking-wider mb-2">
            <Trophy size={14} />
            Best Score
          </div>
          <p className="text-3xl font-black text-sand-100">{bestScore || '—'}</p>
          <p className="text-[11px] text-sand-300/40 mt-1">Personal record</p>
        </div>

        {/* Sessions */}
        <div className="p-4 rounded-2xl bg-charcoal-900 border border-charcoal-800">
          <div className="flex items-center gap-1.5 text-forest-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Flame size={14} />
            Sessions
          </div>
          <p className="text-3xl font-black text-sand-100">{totalSessions}</p>
          <p className="text-[11px] text-sand-300/40 mt-1">Total completed</p>
        </div>

        {/* Arrows */}
        <div className="p-4 rounded-2xl bg-charcoal-900 border border-charcoal-800">
          <div className="flex items-center gap-1.5 text-sand-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Target size={14} />
            Arrows
          </div>
          <p className="text-3xl font-black text-sand-100">{totalArrows}</p>
          <p className="text-[11px] text-sand-300/40 mt-1">Shots recorded</p>
        </div>

        {/* Average */}
        <div className="p-4 rounded-2xl bg-charcoal-900 border border-charcoal-800">
          <div className="flex items-center gap-1.5 text-bronze-300 text-xs font-bold uppercase tracking-wider mb-2">
            <History size={14} />
            Avg / Arrow
          </div>
          <p className="text-3xl font-black text-sand-100">{averagePerArrow}</p>
          <p className="text-[11px] text-sand-300/40 mt-1">Points per shot</p>
        </div>
      </div>

      {/* Recent Sessions List */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-sand-300/40">
            Recent Sessions
          </h2>
          <span className="text-xs text-sand-300/30">
            {sessionHistory.length} sessions
          </span>
        </div>

        {sessionHistory.length === 0 ? (
          <div className="text-center py-12 bg-charcoal-900/40 rounded-2xl border border-charcoal-800">
            <Target size={32} className="mx-auto text-charcoal-600 mb-2" />
            <p className="text-xs text-sand-300/40">No shooting history yet</p>
            <Link href="/join" className="mt-3 inline-block">
              <Button variant="secondary" size="sm">
                Join a Session
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {sessionHistory.map((s) => {
              const medal = s.rank ? getMedalEmoji(s.rank) : null;

              return (
                <Link
                  key={s.archerId}
                  href={`/session/${s.sessionId}/score-summary?archer=${s.archerId}`}
                >
                  <Card hover className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sand-100 text-sm truncate">
                          {s.sessionName}
                        </h3>
                        {medal && <span className="text-sm">{medal}</span>}
                      </div>

                      <p className="text-xs text-sand-300/40 mt-0.5">
                        {formatDate(s.sessionDate)}
                        {s.venue && ` · ${s.venue}`}
                        {s.bowType && ` · ${s.bowType}`}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <p className="text-base font-extrabold text-sand-100">
                          {s.score}
                        </p>
                        <p className="text-[10px] text-sand-300/40">
                          {s.rank ? `${s.rank}th place` : `${s.arrows} arrows`}
                        </p>
                      </div>
                      <ArrowRight size={16} className="text-charcoal-600" />
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <BottomNav role="archer" />
    </main>
  );
}
