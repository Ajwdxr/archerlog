import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getSessionResults } from '@/lib/sessions/results';
import ResultsClient from './ResultsClient';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function SessionResultsPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await getSessionResults(id);

  if (error || !data) {
    notFound();
  }

  const isOrganizer = user ? (data.session as any).created_by === user.id : false;

  return (
    <ResultsClient
      session={data.session}
      results={data.results}
      isOrganizer={isOrganizer}
      isSnapshot={data.isSnapshot}
    />
  );
}
