'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Card from '@/components/ui/Card';
import type { SessionArcher } from '@/types/database';
import { Users, UserPlus } from 'lucide-react';

interface Props {
  sessionId: string;
  initialArchers: SessionArcher[];
}

export default function ParticipantsList({ sessionId, initialArchers }: Props) {
  const [archers, setArchers] = useState<SessionArcher[]>(initialArchers);
  const [newlyAddedId, setNewlyAddedId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    // Subscribe to new archers joining in realtime
    const channel = supabase
      .channel(`participants-${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'session_archers',
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          const newArcher = payload.new as SessionArcher;
          if (newArcher) {
            setArchers((prev) => {
              if (prev.some((a) => a.id === newArcher.id)) return prev;
              return [...prev, newArcher];
            });
            setNewlyAddedId(newArcher.id);
            setTimeout(() => setNewlyAddedId(null), 3000);
          }
        }
      )
      .subscribe();

    // Periodic check to ensure accuracy
    const interval = setInterval(async () => {
      const { data } = await supabase
        .from('session_archers')
        .select('*')
        .eq('session_id', sessionId)
        .order('joined_at', { ascending: true });

      if (data) {
        setArchers(data as SessionArcher[]);
      }
    }, 4000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [sessionId]);

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Users size={14} className="text-sand-300/40" />
          <h2 className="text-xs font-semibold uppercase tracking-widest text-sand-300/40">
            Participants ({archers.length})
          </h2>
        </div>
        {archers.length > 0 && (
          <span className="inline-flex items-center gap-1.5 text-[11px] text-forest-400">
            <span className="w-1.5 h-1.5 rounded-full bg-forest-400 animate-pulse" />
            Live Sync
          </span>
        )}
      </div>

      {archers.length === 0 ? (
        <Card className="text-center py-8">
          <UserPlus size={28} className="mx-auto text-charcoal-600 mb-2" />
          <p className="text-sand-300/40 text-sm">No archers have joined yet</p>
          <p className="text-sand-300/30 text-xs mt-1">Share the QR code to invite archers</p>
        </Card>
      ) : (
        <div className="flex flex-col gap-1.5">
          {archers.map((archer) => {
            const isNew = newlyAddedId === archer.id;
            return (
              <div
                key={archer.id}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl bg-surface border transition-all duration-300
                  ${isNew ? 'border-forest-500 bg-forest-500/10 scale-[1.02]' : 'border-border-subtle'}
                `}
              >
                <div className="w-8 h-8 rounded-full bg-charcoal-700 flex items-center justify-center text-xs font-bold text-sand-400">
                  {archer.display_name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-sand-100 truncate">{archer.display_name}</p>
                  {archer.bow_type && (
                    <p className="text-xs text-sand-300/40 truncate">{archer.bow_type}</p>
                  )}
                </div>
                {isNew && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-forest-400 px-2 py-0.5 rounded-full bg-forest-500/20 animate-fade-in">
                    Baru Sertai
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
