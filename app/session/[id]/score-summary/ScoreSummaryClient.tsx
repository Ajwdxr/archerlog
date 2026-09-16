'use client';

import { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import IndividualCard from '@/components/result-card/IndividualCard';
import { ArrowLeft, Trophy, Share2, Award } from 'lucide-react';
import type { Session } from '@/types/database';

interface Props {
  sessionId: string;
  session: Session;
  archer: {
    id: string;
    display_name: string;
    bow_type?: string | null;
  };
  scores: {
    totalScore: number;
    totalArrows: number;
    completedEnds: number;
    ends: any[];
  } | null;
  average: number;
  rank?: number;
}

export default function ScoreSummaryClient({
  sessionId,
  session,
  archer,
  scores,
  average,
  rank = 1,
}: Props) {
  const [showShareCard, setShowShareCard] = useState(false);

  return (
    <main className="min-h-dvh pb-24">
      <div className="max-w-lg mx-auto px-5 py-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-8">
          <div className="flex items-center gap-3">
            <Link
              href={`/session/${sessionId}`}
              className="w-10 h-10 rounded-xl bg-charcoal-800 border border-charcoal-700 flex items-center justify-center text-sand-300 hover:bg-charcoal-700 transition-colors"
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-sand-100">{archer.display_name}</h1>
              <p className="text-xs text-sand-300/40 truncate">{session.name}</p>
            </div>
          </div>

          <Link href={`/results/${sessionId}`}>
            <Button variant="ghost" size="sm" icon={<Trophy size={14} />}>
              Results
            </Button>
          </Link>
        </div>

        {/* Score Hero */}
        <div className="text-center mb-8">
          <p className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-sand-100 to-sand-400 mb-1 tracking-tight">
            {scores?.totalScore || 0}
          </p>
          <p className="text-xs uppercase tracking-widest text-sand-300/50 font-bold">
            Total Points
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: 'Arrows', value: scores?.totalArrows || 0 },
            { label: 'Average', value: average.toFixed(2) },
            { label: 'Bow', value: archer.bow_type || session.bow_type || '—' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="text-center px-3 py-3.5 rounded-xl bg-surface border border-border-subtle shadow-sm"
            >
              <p className="text-lg font-bold text-sand-100">{stat.value}</p>
              <p className="text-xs text-sand-300/40 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Share Result Card Toggle */}
        <div className="mb-8">
          <Button
            variant={showShareCard ? 'secondary' : 'primary'}
            size="lg"
            fullWidth
            onClick={() => setShowShareCard(!showShareCard)}
            icon={showShareCard ? <Award size={18} /> : <Share2 size={18} />}
          >
            {showShareCard ? 'HIDE RESULT CARD' : 'GENERATE & SHARE RESULT CARD 🎯'}
          </Button>

          {showShareCard && (
            <div className="mt-6 p-4 rounded-2xl bg-charcoal-900 border border-charcoal-800">
              <IndividualCard
                data={{
                  sessionName: session.name,
                  venue: session.venue,
                  sessionDate: session.session_date,
                  archerName: archer.display_name,
                  totalScore: scores?.totalScore || 0,
                  rank: rank,
                  totalArrows: scores?.totalArrows || 0,
                  average: average,
                  bowType: archer.bow_type || session.bow_type,
                  communityName: 'Alor Setar Archery Community',
                }}
              />
            </div>
          )}
        </div>

        {/* End Scores */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-sand-300/40">
              End by End Breakdown
            </h2>
            <span className="text-xs text-sand-300/30">
              {scores?.completedEnds || 0} / {session.ends_count} Ends
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {scores?.ends.map((end: any) => (
              <div
                key={end.end_number}
                className="flex items-center justify-between px-4 py-3.5 rounded-xl bg-surface border border-border-subtle"
              >
                <span className="text-sm text-sand-300/50 font-mono w-8">
                  #{String(end.end_number).padStart(2, '0')}
                </span>
                <div className="flex gap-1.5 flex-1 justify-center flex-wrap">
                  {end.arrows?.map((arrow: any) => (
                    <span
                      key={arrow.arrow_number}
                      className={`
                        w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-sm
                        ${arrow.display_value === 'X' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                          arrow.numeric_value >= 9 ? 'bg-forest-600/20 text-forest-300 border border-forest-500/30' :
                          arrow.numeric_value >= 7 ? 'bg-sand-400/10 text-sand-400 border border-sand-400/20' :
                          'bg-charcoal-800 text-charcoal-400 border border-charcoal-700'}
                      `}
                    >
                      {arrow.display_value}
                    </span>
                  ))}
                </div>
                <span className="text-lg font-bold text-sand-100 w-10 text-right">
                  {end.total_score}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom Actions */}
        <div className="mt-8 flex flex-col gap-2.5">
          <Link href={`/session/${sessionId}/leaderboard`}>
            <Button variant="secondary" size="lg" fullWidth icon={<Trophy size={18} />}>
              VIEW LIVE LEADERBOARD
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
