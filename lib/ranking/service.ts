import type { LeaderboardEntry } from '@/types/database';

/**
 * Ranking service — isolated per PRD §23.
 *
 * Primary: total_score DESC
 * Tie-breakers (in order):
 *   1. X count DESC
 *   2. 10 count DESC
 *   3. 9 count DESC
 *   4. Shared rank if still tied
 */
export function rankParticipants(entries: Omit<LeaderboardEntry, 'rank'>[]): LeaderboardEntry[] {
  // Sort by total_score DESC, then tie-breakers
  const sorted = [...entries].sort((a, b) => {
    // Primary: total score
    if (b.total_score !== a.total_score) return b.total_score - a.total_score;
    // Tie-breaker 1: X count
    if (b.x_count !== a.x_count) return b.x_count - a.x_count;
    // Tie-breaker 2: 10 count
    if (b.ten_count !== a.ten_count) return b.ten_count - a.ten_count;
    // Tie-breaker 3: 9 count
    if (b.nine_count !== a.nine_count) return b.nine_count - a.nine_count;
    // Still tied — shared rank
    return 0;
  });

  // Assign ranks, handling ties
  const ranked: LeaderboardEntry[] = [];
  let currentRank = 1;

  for (let i = 0; i < sorted.length; i++) {
    if (i > 0) {
      const prev = sorted[i - 1];
      const curr = sorted[i];
      const isTied =
        curr.total_score === prev.total_score &&
        curr.x_count === prev.x_count &&
        curr.ten_count === prev.ten_count &&
        curr.nine_count === prev.nine_count;

      if (!isTied) {
        currentRank = i + 1;
      }
    }

    ranked.push({ ...sorted[i], rank: currentRank });
  }

  return ranked;
}

/**
 * Get the medal emoji for a rank position.
 */
export function getMedalEmoji(rank: number): string {
  switch (rank) {
    case 1: return '🥇';
    case 2: return '🥈';
    case 3: return '🥉';
    default: return '';
  }
}

/**
 * Get the ordinal suffix for a number (1st, 2nd, 3rd, 4th...)
 */
export function getOrdinal(n: number): string {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}
