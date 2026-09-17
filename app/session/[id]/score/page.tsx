import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ScoreEntry from './ScoreEntry';

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ archer?: string }>;
}

export default async function ScorePage({ params, searchParams }: Props) {
  const { id } = await params;
  const { archer: archerId } = await searchParams;
  const supabase = await createClient();

  let targetArcherId = archerId;

  if (!targetArcherId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: myArcher } = await supabase
        .from('session_archers')
        .select('id')
        .eq('session_id', id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (myArcher) {
        targetArcherId = myArcher.id;
      }
    }
  }

  if (!targetArcherId) {
    redirect(`/session/${id}`);
  }

  // Get session
  const { data: session } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', id)
    .single();

  if (!session) notFound();

  // Get archer
  const { data: archer } = await supabase
    .from('session_archers')
    .select('*')
    .eq('id', targetArcherId)
    .eq('session_id', id)
    .single();

  if (!archer) notFound();

  // Get completed ends
  const { data: ends } = await supabase
    .from('ends')
    .select('end_number, total_score')
    .eq('session_archer_id', targetArcherId)
    .order('end_number', { ascending: true });

  const completedEnds = ends?.length || 0;
  const totalScore = ends?.reduce((sum, e) => sum + e.total_score, 0) || 0;

  return (
    <ScoreEntry
      session={session}
      archer={archer}
      completedEnds={completedEnds}
      totalScore={totalScore}
    />
  );
}
