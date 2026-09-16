'use server';

import { createClient } from '@/lib/supabase/server';
import { getSessionLeaderboard } from '@/lib/scoring/actions';
import { rankParticipants } from '@/lib/ranking/service';
import type { LeaderboardEntry, Result, Session } from '@/types/database';

export interface EnrichedResult extends LeaderboardEntry {
  id?: string;
  session_id: string;
}

/**
 * Generate and snapshot results into the `results` table when session completes.
 */
export async function generateResults(sessionId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Unauthorized. Please log in.' };
  }

  // Get current leaderboard
  const { data: rawEntries, error: lbError } = await getSessionLeaderboard(sessionId);
  if (lbError || !rawEntries) {
    return { error: lbError || 'Failed to calculate results.' };
  }

  const ranked = rankParticipants(rawEntries);

  // Update session status to 'completed'
  await supabase
    .from('sessions')
    .update({ status: 'completed', updated_at: new Date().toISOString() } as any)
    .eq('id', sessionId);

  // Delete existing results snapshot if re-generating
  await supabase
    .from('results')
    .delete()
    .eq('session_id', sessionId);

  if (ranked.length > 0) {
    const resultRows = ranked.map((r) => ({
      session_id: sessionId,
      session_archer_id: r.session_archer_id,
      total_score: r.total_score,
      total_arrows: r.total_arrows,
      average_score: r.average,
      x_count: r.x_count,
      ten_count: r.ten_count,
      rank: r.rank,
    }));

    const { error: insertError } = await supabase
      .from('results')
      .insert(resultRows as any);

    if (insertError) {
      return { error: 'Failed to snapshot results: ' + insertError.message };
    }
  }

  return { data: ranked, success: true };
}

/**
 * Fetch results for a session (either from `results` snapshot or calculated live).
 */
export async function getSessionResults(sessionId: string) {
  const supabase = await createClient();

  const { data: session, error: sessionError } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', sessionId)
    .single();

  if (sessionError || !session) {
    return { error: 'Session not found' };
  }

  // Check if snapshot results exist
  const { data: snapshotResults } = await supabase
    .from('results')
    .select(`
      id,
      session_id,
      session_archer_id,
      total_score,
      total_arrows,
      average_score,
      x_count,
      ten_count,
      rank,
      session_archers (
        display_name,
        bow_type
      )
    `)
    .eq('session_id', sessionId)
    .order('rank', { ascending: true });

  if (snapshotResults && snapshotResults.length > 0) {
    const enriched: EnrichedResult[] = (snapshotResults as any[]).map((row) => ({
      id: row.id,
      session_id: row.session_id,
      session_archer_id: row.session_archer_id,
      display_name: row.session_archers?.display_name || 'Anonymous Archer',
      bow_type: row.session_archers?.bow_type || (session as any).bow_type || 'Horse Bow',
      total_score: row.total_score,
      total_arrows: row.total_arrows,
      completed_ends: Math.round(row.total_arrows / ((session as any).arrows_per_end || 6)),
      average: row.average_score ?? 0,
      x_count: row.x_count,
      ten_count: row.ten_count,
      nine_count: 0,
      rank: row.rank || 1,
    }));

    return {
      data: {
        session: session as Session,
        results: enriched,
        isSnapshot: true,
      },
    };
  }

  // Otherwise calculate live from scoring
  const { data: rawEntries } = await getSessionLeaderboard(sessionId);
  const ranked = rankParticipants(rawEntries || []);

  const enriched: EnrichedResult[] = ranked.map((r) => ({
    ...r,
    session_id: sessionId,
  }));

  return {
    data: {
      session: session as Session,
      results: enriched,
      isSnapshot: false,
    },
  };
}
