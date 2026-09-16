'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { joinSession } from '@/lib/sessions/actions';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { BOW_TYPES } from '@/types/database';
import type { Session } from '@/types/database';

interface Props {
  session: Session;
}

export default function JoinForm({ session }: Props) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [bowType, setBowType] = useState(session.bow_type || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [joined, setJoined] = useState(false);
  const [archerId, setArcherId] = useState('');

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await joinSession({
      join_code: session.join_code,
      display_name: name,
      bow_type: bowType as any || undefined,
    });

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setArcherId(result.data!.archer.id);
    setJoined(true);
    setLoading(false);

    // If session is already live, redirect to scoring
    if (session.status === 'live') {
      setTimeout(() => {
        router.push(`/session/${session.id}/score?archer=${result.data!.archer.id}`);
      }, 1500);
    }
  }

  if (joined) {
    return (
      <div className="text-center py-12 animate-scale-in">
        <div className="text-6xl mb-6">🏹</div>
        <h2 className="text-2xl font-bold text-sand-100 mb-2">
          You&apos;re in!
        </h2>
        <p className="text-sand-300/50 text-sm mb-8">
          {session.status === 'live'
            ? 'Redirecting to scoring...'
            : 'Wait for the organizer to start the session.'}
        </p>
        {session.status === 'live' && (
          <Button
            variant="accent"
            size="lg"
            onClick={() => router.push(`/session/${session.id}/score?archer=${archerId}`)}
          >
            START SCORING →
          </Button>
        )}
      </div>
    );
  }

  const totalArrows = session.ends_count * session.arrows_per_end;

  return (
    <div>
      {/* Session Info */}
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold text-sand-100 mb-3">
          {session.name}
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-sand-300/50">
          {session.venue && <span>{session.venue}</span>}
          {session.bow_type && <span>{session.bow_type}</span>}
          <span>{session.ends_count} Ends · {totalArrows} Arrows</span>
        </div>
      </div>

      {/* Join Form */}
      <form onSubmit={handleJoin} className="flex flex-col gap-4">
        <Input
          label="Name"
          placeholder="Your display name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoFocus
        />

        <Select
          label="Bow Type"
          placeholder="Select bow type"
          value={bowType}
          onChange={(e) => setBowType(e.target.value)}
          options={BOW_TYPES.map((b) => ({ value: b, label: b }))}
        />

        {error && (
          <div className="px-4 py-3 rounded-xl bg-danger-500/10 border border-danger-500/20 text-danger-400 text-sm">
            {error}
          </div>
        )}

        <Button
          type="submit"
          variant="accent"
          size="xl"
          fullWidth
          loading={loading}
          className="mt-2"
        >
          JOIN SESSION
        </Button>
      </form>
    </div>
  );
}
