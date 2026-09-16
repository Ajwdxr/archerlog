'use server';

import { createClient } from '@/lib/supabase/server';
import { generateJoinCode } from '@/lib/sessions/utils';
import type { Session, SessionStatus, BowType } from '@/types/database';

// ─── Create Session ───

interface CreateSessionInput {
  name: string;
  venue?: string;
  session_date: string;
  start_time?: string;
  bow_type?: BowType;
  distance_m?: number;
  ends_count: number;
  arrows_per_end: number;
  maximum_arrow_score?: number;
  community_id?: string;
}

export async function createSession(input: CreateSessionInput) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be logged in to create a session.' };
  }

  // Generate unique join code
  let joinCode = generateJoinCode();
  let attempts = 0;

  while (attempts < 5) {
    const { data: existing } = await supabase
      .from('sessions')
      .select('id')
      .eq('join_code', joinCode)
      .maybeSingle();

    if (!existing) break;
    joinCode = generateJoinCode();
    attempts++;
  }

  const { data, error } = await supabase
    .from('sessions')
    .insert({
      name: input.name,
      venue: input.venue || null,
      session_date: input.session_date,
      start_time: input.start_time || null,
      bow_type: input.bow_type || null,
      distance_m: input.distance_m || null,
      ends_count: input.ends_count,
      arrows_per_end: input.arrows_per_end,
      maximum_arrow_score: input.maximum_arrow_score || 10,
      community_id: input.community_id || null,
      join_code: joinCode,
      created_by: user.id,
      status: 'draft',
    } as any)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  return { data: data as Session };
}

// ─── Update Session Status ───

export async function updateSessionStatus(sessionId: string, status: SessionStatus) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Unauthorized' };
  }

  const { error } = await supabase
    .from('sessions')
    .update({ status } as any)
    .eq('id', sessionId)
    .eq('created_by', user.id);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

// ─── Join Session ───

interface JoinSessionInput {
  join_code: string;
  display_name: string;
  bow_type?: BowType;
}

export async function joinSession(input: JoinSessionInput) {
  const supabase = await createClient();

  const { data: session, error: sessionError } = await supabase
    .from('sessions')
    .select('*')
    .eq('join_code', input.join_code.toUpperCase())
    .single();

  if (sessionError || !session) {
    return { error: 'Session not found. Please check the join code.' };
  }

  const s = session as any;

  if (s.status === 'completed' || s.status === 'cancelled') {
    return { error: 'This session has ended. Scores can no longer be submitted.' };
  }

  if (s.status === 'draft') {
    return { error: 'This session has not been opened yet.' };
  }

  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const { data: existing } = await supabase
      .from('session_archers')
      .select('id')
      .eq('session_id', s.id)
      .eq('user_id', user.id)
      .maybeSingle();

    if (existing) {
      return { data: { session: s as Session, archer: existing as any } };
    }
  }

  const { data: archer, error: archerError } = await supabase
    .from('session_archers')
    .insert({
      session_id: s.id,
      user_id: user?.id || null,
      display_name: input.display_name,
      bow_type: input.bow_type || s.bow_type,
    } as any)
    .select()
    .single();

  if (archerError) {
    return { error: archerError.message };
  }

  return { data: { session: s as Session, archer: archer as any } };
}

// ─── Get Session by Join Code ───

export async function getSessionByCode(joinCode: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('join_code', joinCode.toUpperCase())
    .single();

  if (error) return { error: 'Session not found.' };
  return { data: data as Session };
}

// ─── Get User's Sessions ───

export async function getUserSessions() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: 'Not authenticated' };

  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('created_by', user.id)
    .order('created_at', { ascending: false });

  if (error) return { error: error.message };
  return { data: (data || []) as Session[] };
}
