import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getUserSessions } from '@/lib/sessions/actions';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Plus, ChevronRight } from 'lucide-react';
import type { SessionStatus } from '@/types/database';
import { formatDate } from '@/lib/sessions/utils';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name')
    .eq('id', user.id)
    .single();

  const { data: sessions } = await getUserSessions();

  const activeSessions = sessions?.filter(
    (s) => s.status === 'live' || s.status === 'open'
  ) || [];

  const recentSessions = sessions?.filter(
    (s) => s.status === 'completed'
  ).slice(0, 5) || [];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <main className="min-h-dvh pb-24">
      <div className="max-w-lg mx-auto px-5 py-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sand-300/50 text-sm mb-1">{greeting} 👋</p>
          <h1 className="text-2xl font-bold text-sand-100">
            {profile?.display_name || 'Organizer'}
          </h1>
        </div>

        {/* Create Session Button */}
        <Link
          href="/sessions/create"
          className="
            flex items-center justify-center gap-2.5 w-full h-14 rounded-2xl mb-8
            bg-gradient-to-r from-forest-500 to-forest-400
            text-sand-100 font-bold text-base
            shadow-lg shadow-forest-500/20
            hover:shadow-forest-500/35 hover:scale-[1.01]
            active:scale-[0.98]
            transition-all duration-200
          "
        >
          <Plus size={20} strokeWidth={3} />
          CREATE SESSION
        </Link>

        {/* Active Sessions */}
        {activeSessions.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-sand-300/40 mb-3">
              Active Sessions
            </h2>
            <div className="flex flex-col gap-3">
              {activeSessions.map((session) => (
                <Link key={session.id} href={`/session/${session.id}`}>
                  <Card hover className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <h3 className="font-semibold text-sand-100">{session.name}</h3>
                        <Badge status={session.status as SessionStatus} />
                      </div>
                      <p className="text-xs text-sand-300/40">
                        {session.venue && `${session.venue} · `}
                        {session.ends_count} Ends · {session.arrows_per_end * session.ends_count} Arrows
                      </p>
                    </div>
                    <ChevronRight size={18} className="text-charcoal-600" />
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Recent Sessions */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-sand-300/40 mb-3">
            Recent Sessions
          </h2>
          {recentSessions.length === 0 ? (
            <Card className="text-center py-10">
              <div className="text-3xl mb-3">🏹</div>
              <p className="text-sand-300/40 text-sm">No sessions yet</p>
              <p className="text-sand-300/30 text-xs mt-1">Create your first session to get started</p>
            </Card>
          ) : (
            <div className="flex flex-col gap-2.5">
              {recentSessions.map((session) => (
                <Link key={session.id} href={`/session/${session.id}`}>
                  <Card hover className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-sand-100 text-sm mb-0.5">{session.name}</h3>
                      <p className="text-xs text-sand-300/40">
                        {formatDate(session.session_date)}
                        {session.venue && ` · ${session.venue}`}
                      </p>
                    </div>
                    <Badge status={session.status as SessionStatus} />
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
