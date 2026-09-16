'use server';

import { createClient } from '@/lib/supabase/server';
import { calculateEndScore } from '@/lib/scoring/calculator';
import type { ArrowScore } from '@/types/database';

// ─── Submit End ───

interface SubmitEndInput {
  session_id: string;
  session_archer_id: string;
  end_number: number;
  arrows: ArrowScore[];
}

export async function submitEnd(input: SubmitEndInput) {
  const supabase = await createClient();

  // 1. Validate session exists and is active
  const { data: session, error: sessionError } = await supabase
    .from('sessions')
    .select('id, status, ends_count, arrows_per_end, maximum_arrow_score')
    .eq('id', input.session_id)
    .single();

  if (sessionError || !session) {
    return { error: 'Session not found.' };
  }

  const s = session as any;

  if (s.status !== 'live' && s.status !== 'open') {
    return { error: 'This session is not currently active.' };
  }

  if (input.end_number < 1 || input.end_number > s.ends_count) {
    return { error: `Invalid end number. Must be between 1 and ${s.ends_count}.` };
  }

  if (input.arrows.length !== s.arrows_per_end) {
    return { error: `Expected ${s.arrows_per_end} arrows, got ${input.arrows.length}.` };
  }

  for (const arrow of input.arrows) {
    if (arrow.numeric_value < 0 || arrow.numeric_value > s.maximum_arrow_score) {
      return { error: `Invalid arrow score: ${arrow.numeric_value}. Must be 0-${s.maximum_arrow_score}.` };
    }
  }

  // 5. Validate archer belongs to session
  const { data: archer } = await supabase
    .from('session_archers')
    .select('id')
    .eq('id', input.session_archer_id)
    .eq('session_id', input.session_id)
    .maybeSingle();

  if (!archer) {
    return { error: 'Archer not found in this session.' };
  }

  // 6. Check if end already submitted
  const { data: existingEnd } = await supabase
    .from('ends')
    .select('id')
    .eq('session_archer_id', input.session_archer_id)
    .eq('end_number', input.end_number)
    .maybeSingle();

  if (existingEnd) {
    return { error: 'This end has already been submitted.' };
  }

  // 7. Calculate end score
  const endScore = calculateEndScore(input.arrows);

  // 8. Insert end
  const { data: endData, error: endError } = await supabase
    .from('ends')
    .insert({
      session_archer_id: input.session_archer_id,
      end_number: input.end_number,
      total_score: endScore,
      submitted_at: new Date().toISOString(),
    } as any)
    .select()
    .single();

  if (endError) {
    return { error: 'Failed to save end: ' + endError.message };
  }

  const endRow = endData as any;

  // 9. Insert arrows
  const arrowInserts = input.arrows.map((arrow, index) => ({
    end_id: endRow.id,
    arrow_number: index + 1,
    display_value: arrow.display_value,
    numeric_value: arrow.numeric_value,
  }));

  const { error: arrowsError } = await supabase.from('arrows').insert(arrowInserts as any);

  if (arrowsError) {
    await supabase.from('ends').delete().eq('id', endRow.id);
    return { error: 'Failed to save arrows: ' + arrowsError.message };
  }

  return {
    data: {
      end_id: endRow.id,
      end_number: input.end_number,
      end_score: endScore,
    },
  };
}

// ─── Get Archer's Scores for a Session ───

export async function getArcherScores(sessionArcherId: string) {
  const supabase = await createClient();

  const { data: ends, error } = await supabase
    .from('ends')
    .select(`
      id,
      end_number,
      total_score,
      submitted_at,
      arrows (
        id,
        arrow_number,
        display_value,
        numeric_value
      )
    `)
    .eq('session_archer_id', sessionArcherId)
    .order('end_number', { ascending: true });

  if (error) return { error: error.message };

  const rows = (ends || []) as any[];
  const totalScore = rows.reduce((sum: number, end: any) => sum + end.total_score, 0);
  const totalArrows = rows.reduce((sum: number, end: any) => sum + (end.arrows?.length || 0), 0);

  return {
    data: {
      ends: rows,
      totalScore,
      totalArrows,
      completedEnds: rows.length,
    },
  };
}

// ─── Get Session Leaderboard ───

export async function getSessionLeaderboard(sessionId: string) {
  const supabase = await createClient();

  const { data: archers, error: archersError } = await supabase
    .from('session_archers')
    .select('id, display_name, bow_type')
    .eq('session_id', sessionId);

  if (archersError || !archers) return { error: 'Failed to load participants.' };

  const archerRows = archers as any[];
  const archerIds = archerRows.map((a: any) => a.id);

  if (archerIds.length === 0) return { data: [] };

  const { data: ends } = await supabase
    .from('ends')
    .select(`
      id,
      session_archer_id,
      end_number,
      total_score,
      arrows (
        display_value,
        numeric_value
      )
    `)
    .in('session_archer_id', archerIds)
    .order('end_number', { ascending: true });

  const endRows = (ends || []) as any[];

  const entries = archerRows.map((archer: any) => {
    const archerEnds = endRows.filter((e: any) => e.session_archer_id === archer.id);
    const allArrows = archerEnds.flatMap((e: any) => e.arrows || []);

    const totalScore = archerEnds.reduce((sum: number, e: any) => sum + e.total_score, 0);
    const totalArrows = allArrows.length;
    const completedEnds = archerEnds.length;

    return {
      session_archer_id: archer.id,
      display_name: archer.display_name,
      bow_type: archer.bow_type,
      total_score: totalScore,
      total_arrows: totalArrows,
      completed_ends: completedEnds,
      average: totalArrows > 0 ? Math.round((totalScore / totalArrows) * 100) / 100 : 0,
      x_count: allArrows.filter((a: any) => a.display_value === 'X').length,
      ten_count: allArrows.filter((a: any) => a.display_value === '10').length,
      nine_count: allArrows.filter((a: any) => a.display_value === '9').length,
    };
  });

  return { data: entries };
}

// ─── Update Arrow Score (Organizer Edit) ───

export async function updateArrowScore(
  arrowId: string,
  displayValue: string,
  numericValue: number
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: 'Unauthorized' };

  const { error: arrowError } = await supabase
    .from('arrows')
    .update({ display_value: displayValue, numeric_value: numericValue } as any)
    .eq('id', arrowId);

  if (arrowError) return { error: arrowError.message };

  const { data: arrow } = await supabase
    .from('arrows')
    .select('end_id')
    .eq('id', arrowId)
    .single();

  if (arrow) {
    const a = arrow as any;
    const { data: allArrows } = await supabase
      .from('arrows')
      .select('numeric_value')
      .eq('end_id', a.end_id);

    const newTotal = ((allArrows || []) as any[]).reduce((sum: number, ar: any) => sum + ar.numeric_value, 0);

    await supabase
      .from('ends')
      .update({ total_score: newTotal } as any)
      .eq('id', a.end_id);
  }

  return { success: true };
}
