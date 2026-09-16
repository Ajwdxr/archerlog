import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getArcherScores, getSessionLeaderboard } from '@/lib/scoring/actions';
import { calculateAverage } from '@/lib/scoring/calculator';
import { rankParticipants } from '@/lib/ranking/service';
import ScoreSummaryClient from './ScoreSummaryClient';
import type { Session } from '@/types/database';

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ archer?: string }>;
}

export default async function ScoreSummaryPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { archer: archerId } = await searchParams;

  if (!archerId) redirect(`/session/${id}`);

  const supabase = await createClient();

  const { data: session } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', id)
    .single();

  if (!session) notFound();

  const { data: archer } = await supabase
    .from('session_archers')
    .select('*')
    .eq('id', archerId)
    .single();

  if (!archer) notFound();

  const { data: scores } = await getArcherScores(archerId);

  const average = scores
    ? calculateAverage(scores.totalScore, scores.totalArrows)
    : 0;

  // Fetch rank
  let rank = 1;
  const { data: rawLeaderboard } = await getSessionLeaderboard(id);
  if (rawLeaderboard) {
    const ranked = rankParticipants(rawLeaderboard);
    const found = ranked.find((r) => r.session_archer_id === archerId);
    if (found) rank = found.rank;
  }

  return (
    <ScoreSummaryClient
      sessionId={id}
      session={session as Session}
      archer={archer as any}
      scores={scores || null}
      average={average}
      rank={rank}
    />
  );
}
