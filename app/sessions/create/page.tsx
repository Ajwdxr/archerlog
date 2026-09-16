'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSession } from '@/lib/sessions/actions';
import { calculateMaximumScore } from '@/lib/scoring/calculator';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { BOW_TYPES } from '@/types/database';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreateSessionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    venue: '',
    session_date: new Date().toISOString().split('T')[0],
    start_time: '',
    bow_type: '',
    distance_m: '',
    ends_count: '6',
    arrows_per_end: '6',
    maximum_arrow_score: '10',
  });

  const maxScore = calculateMaximumScore(
    parseInt(form.ends_count) || 0,
    parseInt(form.arrows_per_end) || 0,
    parseInt(form.maximum_arrow_score) || 10
  );

  function updateField(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await createSession({
      name: form.name,
      venue: form.venue || undefined,
      session_date: form.session_date,
      start_time: form.start_time || undefined,
      bow_type: form.bow_type as any || undefined,
      distance_m: form.distance_m ? parseFloat(form.distance_m) : undefined,
      ends_count: parseInt(form.ends_count),
      arrows_per_end: parseInt(form.arrows_per_end),
      maximum_arrow_score: parseInt(form.maximum_arrow_score) || 10,
    });

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    router.push(`/session/${result.data!.id}`);
  }

  return (
    <main className="min-h-dvh pb-12">
      <div className="max-w-lg mx-auto px-5 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/dashboard"
            className="w-10 h-10 rounded-xl bg-charcoal-800 border border-charcoal-700 flex items-center justify-center text-sand-300 hover:bg-charcoal-700 transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-xl font-bold text-sand-100">Create Session</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Session Info */}
          <div className="space-y-4">
            <Input
              label="Session Name"
              placeholder="Wednesday Night Shoot"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              required
            />

            <Input
              label="Venue"
              placeholder="Alor Setar Archery Range"
              value={form.venue}
              onChange={(e) => updateField('venue', e.target.value)}
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Date"
                type="date"
                value={form.session_date}
                onChange={(e) => updateField('session_date', e.target.value)}
                required
              />
              <Input
                label="Time"
                type="time"
                value={form.start_time}
                onChange={(e) => updateField('start_time', e.target.value)}
              />
            </div>
          </div>

          {/* Separator */}
          <div className="border-t border-charcoal-800" />

          {/* Bow & Distance */}
          <div className="space-y-4">
            <Select
              label="Bow Type"
              placeholder="Select bow type"
              value={form.bow_type}
              onChange={(e) => updateField('bow_type', e.target.value)}
              options={BOW_TYPES.map((b) => ({ value: b, label: b }))}
            />

            <Input
              label="Distance (meters)"
              type="number"
              placeholder="10"
              value={form.distance_m}
              onChange={(e) => updateField('distance_m', e.target.value)}
              min="1"
            />
          </div>

          <div className="border-t border-charcoal-800" />

          {/* Scoring Config */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Ends"
                type="number"
                value={form.ends_count}
                onChange={(e) => updateField('ends_count', e.target.value)}
                required
                min="1"
                max="20"
              />
              <Input
                label="Arrows / End"
                type="number"
                value={form.arrows_per_end}
                onChange={(e) => updateField('arrows_per_end', e.target.value)}
                required
                min="1"
                max="12"
              />
            </div>

            {/* Max Score Display */}
            <div className="px-4 py-3 rounded-xl bg-charcoal-800/50 border border-charcoal-700/50">
              <div className="flex justify-between items-center">
                <span className="text-sm text-sand-300/50">Maximum Score</span>
                <span className="text-lg font-bold text-sand-400">{maxScore}</span>
              </div>
              <p className="text-xs text-sand-300/30 mt-1">
                {form.ends_count} ends × {form.arrows_per_end} arrows × {form.maximum_arrow_score} max
              </p>
            </div>
          </div>

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
            className="mt-4"
          >
            CREATE SESSION
          </Button>
        </form>
      </div>
    </main>
  );
}
