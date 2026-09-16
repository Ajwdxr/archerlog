'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getSessionLeaderboard } from '@/lib/scoring/actions';
import { rankParticipants, getMedalEmoji } from '@/lib/ranking/service';
import type { LeaderboardEntry } from '@/types/database';

interface Props {
  sessionId: string;
  initialEntries: LeaderboardEntry[];
  endsCount: number;
  arrowsPerEnd: number;
  isLive: boolean;
}

export default function LeaderboardLive({
  sessionId,
  initialEntries,
  endsCount,
  arrowsPerEnd,
  isLive,
}: Props) {
  const [entries, setEntries] = useState(initialEntries);

  // Subscribe to realtime updates
  useEffect(() => {
    if (!isLive) return;

    const supabase = createClient();

    const channel = supabase
      .channel(`leaderboard-${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ends',
        },
        async () => {
          // Refetch leaderboard on any score change
          const { data } = await getSessionLeaderboard(sessionId);
          if (data) {
            setEntries(rankParticipants(data));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId, isLive]);

  const totalArrows = endsCount * arrowsPerEnd;

  return (
    <div className="flex flex-col gap-1.5">
      {entries.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-4xl mb-3">🎯</div>
          <p className="text-sand-300/40 text-sm">No scores yet</p>
          <p className="text-sand-300/30 text-xs mt-1">
            Scores will appear here as archers submit
          </p>
        </div>
      ) : (
        entries.map((entry, index) => {
          const medal = getMedalEmoji(entry.rank);
          const isTop3 = entry.rank <= 3;
          const progressPct = (entry.completed_ends / endsCount) * 100;

          return (
            <div
              key={entry.session_archer_id}
              className={`
                flex items-center gap-3 px-4 py-3.5 rounded-xl
                transition-all duration-300 ease-out
                ${isTop3
                  ? 'bg-surface-elevated border border-charcoal-700'
                  : 'bg-surface border border-border-subtle'}
                ${entry.rank === 1 ? 'ring-1 ring-gold/20' : ''}
              `}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Rank */}
              <div className="w-8 text-center shrink-0">
                {medal ? (
                  <span className="text-lg">{medal}</span>
                ) : (
                  <span className="text-sm font-bold text-charcoal-500">{entry.rank}</span>
                )}
              </div>

              {/* Name & Details */}
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-sm truncate ${isTop3 ? 'text-sand-100' : 'text-sand-300'}`}>
                  {entry.display_name}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-sand-300/30">
                    {entry.completed_ends}/{endsCount} ends
                  </span>
                  <span className="text-xs text-sand-300/30">·</span>
                  <span className="text-xs text-sand-300/30">
                    avg {entry.average}
                  </span>
                </div>
                {/* Progress bar */}
                <div className="mt-1.5 h-1 bg-charcoal-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-forest-600 to-forest-400 rounded-full transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              {/* Score */}
              <div className="text-right shrink-0">
                <p className={`text-lg font-bold ${isTop3 ? 'text-sand-400' : 'text-sand-300'}`}>
                  {entry.total_score}
                </p>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
