import { createClient } from '@/lib/supabase/server';
import JoinForm from './JoinForm';
import Link from 'next/link';

interface Props {
  params: Promise<{ code: string }>;
}

export default async function JoinPage({ params }: Props) {
  const { code } = await params;
  const supabase = await createClient();

  const { data: session, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('join_code', code.toUpperCase())
    .single();

  if (error || !session) {
    return (
      <main className="min-h-dvh flex flex-col items-center justify-center px-6">
        <div className="text-center">
          <div className="text-5xl mb-6">🎯</div>
          <h1 className="text-2xl font-bold text-sand-100 mb-3">Session not found</h1>
          <p className="text-sand-300/50 text-sm mb-8">
            The session code &quot;{code}&quot; doesn&apos;t match any active session.
          </p>
          <Link
            href="/"
            className="text-sand-400 hover:text-sand-300 font-medium text-sm"
          >
            ← Go back home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh flex flex-col items-center justify-center px-6 py-12">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-forest-500/6 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <p className="text-sand-400 text-xs font-bold tracking-widest mb-1">🏹 ARROWLOG</p>
        </div>

        <JoinForm session={session} />
      </div>
    </main>
  );
}
