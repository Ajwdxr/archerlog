import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import BottomNav from '@/components/ui/BottomNav';
import { formatDate } from '@/lib/sessions/utils';
import type { SessionStatus } from '@/types/database';
import { Plus, QrCode, ChevronRight, Target, Trophy } from 'lucide-react';

export default async function SessionsListPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: sessions } = await supabase
    .from('sessions')
    .select(`
      *,
      session_archers (id)
    `)
    .order('session_date', { ascending: false });

  const sessionList = (sessions || []) as any[];

  return (
    <main className="min-h-dvh pb-28 pt-4 px-4 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl font-bold text-sand-100 flex items-center gap-2">
            <Target className="text-sand-400" size={22} />
            Archery Sessions
          </h1>
          <p className="text-xs text-sand-300/50 mt-0.5">
            Browse live competitions and community shoots
          </p>
        </div>

        <Link href="/join">
          <Button variant="secondary" size="sm" icon={<QrCode size={14} />}>
            Join
          </Button>
        </Link>
      </div>

      {/* Action Banner */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-charcoal-900 to-forest-900/40 border border-charcoal-800 mb-6">
        <div>
          <p className="text-sm font-bold text-sand-100">Ready to organize?</p>
          <p className="text-xs text-sand-300/40 mt-0.5">Start a shoot in 30 seconds</p>
        </div>
        <Link href={user ? '/sessions/create' : '/auth/login'}>
          <Button variant="primary" size="sm" icon={<Plus size={16} />}>
            Create Shoot
          </Button>
        </Link>
      </div>

      {/* Sessions List */}
      <div className="flex flex-col gap-3">
        {sessionList.length === 0 ? (
          <div className="text-center py-16 bg-charcoal-900/50 rounded-2xl border border-charcoal-800">
            <Target size={36} className="mx-auto text-charcoal-600 mb-3" />
            <p className="text-sm font-semibold text-sand-200">No sessions yet</p>
            <p className="text-xs text-sand-300/40 mt-1 max-w-xs mx-auto">
              Create your first shooting session or join with a code from your community.
            </p>
          </div>
        ) : (
          sessionList.map((session) => {
            const archerCount = session.session_archers?.length || 0;
            const isLive = session.status === 'live' || session.status === 'open';

            return (
              <Link key={session.id} href={`/session/${session.id}`}>
                <Card hover className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-sand-100 text-sm truncate">
                        {session.name}
                      </h3>
                      <Badge status={session.status as SessionStatus} />
                    </div>

                    <p className="text-xs text-sand-300/40 truncate">
                      {[
                        session.venue,
                        formatDate(session.session_date),
                        session.bow_type || 'Horse Bow',
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>

                    <div className="flex items-center gap-3 mt-2 text-[11px] text-sand-300/50">
                      <span>👥 {archerCount} archers</span>
                      <span>🎯 {session.ends_count} ends</span>
                      <span className="font-mono bg-charcoal-800 px-1.5 py-0.5 rounded text-sand-400">
                        {session.join_code}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 text-charcoal-600">
                    <ChevronRight size={18} />
                  </div>
                </Card>
              </Link>
            );
          })
        )}
      </div>

      <BottomNav role={user ? 'organizer' : 'archer'} />
    </main>
  );
}
