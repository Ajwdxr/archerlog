'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateSessionStatus } from '@/lib/sessions/actions';
import Button from '@/components/ui/Button';
import type { SessionStatus } from '@/types/database';

interface Props {
  sessionId: string;
  currentStatus: SessionStatus;
}

const statusTransitions: Record<SessionStatus, { next: SessionStatus; label: string; variant: 'primary' | 'accent' | 'danger' }[]> = {
  draft: [
    { next: 'open', label: 'OPEN SESSION', variant: 'primary' },
  ],
  open: [
    { next: 'live', label: 'START SESSION', variant: 'accent' },
    { next: 'cancelled', label: 'Cancel', variant: 'danger' },
  ],
  live: [
    { next: 'completed', label: 'END SESSION', variant: 'danger' },
  ],
  completed: [],
  cancelled: [],
};

export default function SessionControls({ sessionId, currentStatus }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const transitions = statusTransitions[currentStatus];

  if (transitions.length === 0) return null;

  async function handleTransition(nextStatus: SessionStatus) {
    setLoading(nextStatus);
    const result = await updateSessionStatus(sessionId, nextStatus);
    if (!result.error) {
      router.refresh();
    }
    setLoading(null);
  }

  return (
    <section className="border-t border-charcoal-800 pt-6">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-sand-300/40 mb-3">
        Session Controls
      </h2>
      <div className="flex flex-col gap-2.5">
        {transitions.map((t) => (
          <Button
            key={t.next}
            variant={t.variant}
            size="lg"
            fullWidth
            loading={loading === t.next}
            onClick={() => handleTransition(t.next)}
          >
            {t.label}
          </Button>
        ))}
      </div>
    </section>
  );
}
