import { notFound } from 'next/navigation';
import Link from 'next/link';
import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import QRDisplay from './QRDisplay';
import { ArrowLeft } from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function QRPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: session } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', id)
    .single();

  if (!session) notFound();

  const s = session as any;

  // Resolve host from incoming request headers
  const headersList = await headers();
  const host = headersList.get('x-forwarded-host') || headersList.get('host') || 'localhost:3000';
  const proto = headersList.get('x-forwarded-proto') || (host.startsWith('localhost') ? 'http' : 'https');
  const baseOrigin = process.env.NEXT_PUBLIC_APP_URL || `${proto}://${host}`;
  const joinUrl = `${baseOrigin}/join/${s.join_code}`;
  const totalArrows = s.ends_count * s.arrows_per_end;

  return (
    <main className="min-h-dvh flex flex-col bg-charcoal-950">
      {/* Back button */}
      <div className="px-5 py-4">
        <Link
          href={`/session/${id}`}
          className="w-10 h-10 rounded-xl bg-charcoal-800 border border-charcoal-700 flex items-center justify-center text-sand-300 hover:bg-charcoal-700 transition-colors inline-flex"
        >
          <ArrowLeft size={18} />
        </Link>
      </div>

      {/* QR Display */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 pb-12">
        {/* Brand */}
        <div className="text-center mb-8">
          <p className="text-sand-400 text-sm font-bold tracking-widest mb-2">🏹 ARROWLOG</p>
          <h1 className="text-2xl font-extrabold text-sand-100 mb-3">
            {s.name}
          </h1>
          <div className="flex items-center justify-center gap-2 text-sm text-sand-300/60">
            {s.bow_type && (
              <span className="uppercase font-semibold text-sand-400/80 tracking-wide text-xs">
                {s.bow_type}
              </span>
            )}
            {s.bow_type && <span>·</span>}
            <span>{s.ends_count} Ends · {totalArrows} Arrows</span>
          </div>
        </div>

        {/* QR Code */}
        <QRDisplay value={joinUrl} joinCode={s.join_code} />

        {/* Instructions */}
        <p className="mt-6 text-sand-300/40 text-sm text-center">
          Scan to Join
        </p>
      </div>
    </main>
  );
}
