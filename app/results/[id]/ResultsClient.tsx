'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import SessionPoster from '@/components/result-card/SessionPoster';
import IndividualCard from '@/components/result-card/IndividualCard';
import { generateResults, EnrichedResult } from '@/lib/sessions/results';
import { getMedalEmoji } from '@/lib/ranking/service';
import type { Session } from '@/types/database';
import {
  ArrowLeft,
  Trophy,
  Share2,
  Award,
  Sparkles,
  Users,
  CheckCircle2,
  Lock,
} from 'lucide-react';

interface Props {
  session: Session;
  results: EnrichedResult[];
  isOrganizer: boolean;
  isSnapshot: boolean;
}

export default function ResultsClient({
  session,
  results: initialResults,
  isOrganizer,
  isSnapshot: initialSnapshot,
}: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'podium' | 'poster' | 'cards'>('podium');
  const [selectedArcherId, setSelectedArcherId] = useState<string>(
    initialResults[0]?.session_archer_id || ''
  );
  const [results, setResults] = useState(initialResults);
  const [isSnapshot, setIsSnapshot] = useState(initialSnapshot);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const top3 = results.slice(0, 3);
  const totalSessionArrows = session.ends_count * session.arrows_per_end;

  const handleGenerateResults = async () => {
    setIsGenerating(true);
    setError(null);
    const res = await generateResults(session.id);
    setIsGenerating(false);

    if (res.error) {
      setError(res.error);
    } else {
      setIsSnapshot(true);
      if (res.data) {
        setResults(res.data.map((r) => ({ ...r, session_id: session.id })));
      }
      router.refresh();
    }
  };

  const selectedArcher =
    results.find((r) => r.session_archer_id === selectedArcherId) || results[0];

  return (
    <main className="min-h-dvh pb-28 pt-4 px-4 max-w-lg mx-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <Link
          href={`/session/${session.id}`}
          className="w-10 h-10 rounded-xl bg-charcoal-800 border border-charcoal-700 flex items-center justify-center text-sand-300 hover:bg-charcoal-700 transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-sand-100 truncate">
              {session.name}
            </h1>
            <Badge status={isSnapshot ? 'completed' : 'live'} />
          </div>
          <p className="text-xs text-sand-300/50 mt-0.5">
            {[session.venue, session.session_date].filter(Boolean).join(' · ')}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 gap-1.5 p-1.5 rounded-2xl bg-charcoal-900 border border-charcoal-800 mb-6">
        <button
          type="button"
          onClick={() => setActiveTab('podium')}
          className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'podium'
              ? 'bg-charcoal-800 text-sand-100 shadow-sm'
              : 'text-sand-300/50 hover:text-sand-200'
          }`}
        >
          <Trophy size={14} />
          Podium
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('poster')}
          className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'poster'
              ? 'bg-charcoal-800 text-sand-100 shadow-sm'
              : 'text-sand-300/50 hover:text-sand-200'
          }`}
        >
          <Share2 size={14} />
          Poster
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('cards')}
          className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'cards'
              ? 'bg-charcoal-800 text-sand-100 shadow-sm'
              : 'text-sand-300/50 hover:text-sand-200'
          }`}
        >
          <Award size={14} />
          Cards
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3.5 rounded-xl bg-danger-500/10 border border-danger-500/30 text-danger-400 text-xs font-medium">
          {error}
        </div>
      )}

      {/* TAB 1: PODIUM & RANKINGS */}
      {activeTab === 'podium' && (
        <div className="flex flex-col gap-6">
          {/* Podium Visual for Top 3 */}
          {results.length > 0 && (
            <div className="pt-2 pb-4 px-2">
              <div className="grid grid-cols-3 gap-2 items-end">
                {/* 2nd Place */}
                <div className="flex flex-col items-center">
                  {top3[1] ? (
                    <>
                      <div className="text-2xl mb-1">🥈</div>
                      <p className="text-xs font-bold text-sand-200 text-center truncate w-full">
                        {top3[1].display_name}
                      </p>
                      <p className="text-sm font-extrabold text-silver mt-0.5">
                        {top3[1].total_score}
                      </p>
                      <div className="w-full h-20 bg-charcoal-800 border-t-2 border-silver/50 rounded-t-xl mt-2 flex items-center justify-center text-silver font-bold text-lg shadow-inner">
                        2
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-20 bg-charcoal-900/50 rounded-t-xl" />
                  )}
                </div>

                {/* 1st Place */}
                <div className="flex flex-col items-center">
                  {top3[0] ? (
                    <>
                      <div className="text-3xl mb-1 animate-bounce">🥇</div>
                      <p className="text-xs font-bold text-sand-100 text-center truncate w-full">
                        {top3[0].display_name}
                      </p>
                      <p className="text-base font-extrabold text-gold mt-0.5">
                        {top3[0].total_score}
                      </p>
                      <div className="w-full h-28 bg-gradient-to-b from-forest-600/40 to-charcoal-800 border-t-2 border-gold rounded-t-xl mt-2 flex items-center justify-center text-gold font-black text-2xl shadow-lg shadow-forest-500/20">
                        1
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-28 bg-charcoal-900/50 rounded-t-xl" />
                  )}
                </div>

                {/* 3rd Place */}
                <div className="flex flex-col items-center">
                  {top3[2] ? (
                    <>
                      <div className="text-2xl mb-1">🥉</div>
                      <p className="text-xs font-bold text-sand-300 text-center truncate w-full">
                        {top3[2].display_name}
                      </p>
                      <p className="text-sm font-extrabold text-copper mt-0.5">
                        {top3[2].total_score}
                      </p>
                      <div className="w-full h-16 bg-charcoal-800 border-t-2 border-copper/50 rounded-t-xl mt-2 flex items-center justify-center text-copper font-bold text-lg shadow-inner">
                        3
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-16 bg-charcoal-900/50 rounded-t-xl" />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Session Overview Stats */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 rounded-xl bg-charcoal-900 border border-charcoal-800 text-center">
              <p className="text-xs text-sand-300/40">Total Archers</p>
              <p className="text-lg font-bold text-sand-100 mt-0.5">
                {results.length}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-charcoal-900 border border-charcoal-800 text-center">
              <p className="text-xs text-sand-300/40">Ends / Arrows</p>
              <p className="text-lg font-bold text-sand-100 mt-0.5">
                {session.ends_count} / {totalSessionArrows}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-charcoal-900 border border-charcoal-800 text-center">
              <p className="text-xs text-sand-300/40">Bow Type</p>
              <p className="text-xs font-bold text-sand-100 mt-1.5 truncate">
                {session.bow_type || 'Horse Bow'}
              </p>
            </div>
          </div>

          {/* Full Standings List */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-sand-300/40">
                Official Standings
              </h2>
              <span className="text-xs text-sand-300/30">
                {results.length} participants
              </span>
            </div>

            {results.length === 0 ? (
              <div className="text-center py-12 bg-charcoal-900/40 rounded-2xl border border-charcoal-800">
                <Users size={32} className="mx-auto text-charcoal-600 mb-2" />
                <p className="text-xs text-sand-300/40">No participants yet</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {results.map((archer) => {
                  const medal = getMedalEmoji(archer.rank);
                  const isTop1 = archer.rank === 1;

                  return (
                    <div
                      key={archer.session_archer_id}
                      onClick={() => {
                        setSelectedArcherId(archer.session_archer_id);
                        setActiveTab('cards');
                      }}
                      className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer hover:border-sand-400/40 ${
                        isTop1
                          ? 'bg-charcoal-800/90 border-gold/30'
                          : archer.rank <= 3
                          ? 'bg-charcoal-900 border-charcoal-700'
                          : 'bg-charcoal-900/60 border-charcoal-800'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-7 text-center font-bold text-sm shrink-0">
                          {medal || <span className="text-charcoal-500">{archer.rank}</span>}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-sand-100 truncate">
                            {archer.display_name}
                          </p>
                          <p className="text-xs text-sand-300/40">
                            avg {archer.average.toFixed(2)} · {archer.total_arrows} arrows
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <p className="text-base font-extrabold text-sand-100">
                            {archer.total_score}
                          </p>
                          <p className="text-[10px] uppercase tracking-wider text-sand-300/30">
                            PTS
                          </p>
                        </div>
                        <Award size={16} className="text-sand-400/60" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Organizer Controls */}
          {isOrganizer && (
            <div className="pt-2 flex flex-col gap-2.5">
              {!isSnapshot ? (
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={isGenerating}
                  onClick={handleGenerateResults}
                  icon={<Lock size={18} />}
                >
                  LOCK & FINALIZE RESULTS
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  size="md"
                  fullWidth
                  loading={isGenerating}
                  onClick={handleGenerateResults}
                  icon={<Sparkles size={16} />}
                >
                  Recalculate & Re-snapshot
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SESSION POSTER */}
      {activeTab === 'poster' && (
        <div className="flex flex-col items-center">
          <SessionPoster
            data={{
              sessionName: session.name,
              venue: session.venue,
              sessionDate: session.session_date,
              bowType: session.bow_type,
              endsCount: session.ends_count,
              arrowsPerEnd: session.arrows_per_end,
              totalArrows: totalSessionArrows,
              archers: results.map((r) => ({
                rank: r.rank,
                displayName: r.display_name,
                totalScore: r.total_score,
                average: r.average,
              })),
            }}
          />
        </div>
      )}

      {/* TAB 3: INDIVIDUAL RESULT CARDS */}
      {activeTab === 'cards' && (
        <div className="flex flex-col gap-4">
          {/* Select Archer Dropdown */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-sand-300/50 uppercase tracking-wider">
              Select Archer Card
            </label>
            <select
              value={selectedArcherId}
              onChange={(e) => setSelectedArcherId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-charcoal-900 border border-charcoal-700 text-sand-100 font-medium text-sm focus:outline-none focus:border-sand-400"
            >
              {results.map((a) => (
                <option key={a.session_archer_id} value={a.session_archer_id}>
                  #{a.rank} {a.display_name} ({a.total_score} pts)
                </option>
              ))}
            </select>
          </div>

          {selectedArcher ? (
            <IndividualCard
              data={{
                sessionName: session.name,
                venue: session.venue,
                sessionDate: session.session_date,
                archerName: selectedArcher.display_name,
                totalScore: selectedArcher.total_score,
                rank: selectedArcher.rank,
                totalArrows: selectedArcher.total_arrows,
                average: selectedArcher.average,
                bowType: selectedArcher.bow_type || session.bow_type,
                communityName: 'Alor Setar Archery Community',
              }}
            />
          ) : (
            <p className="text-xs text-sand-300/40 text-center py-8">
              Select an archer to render card
            </p>
          )}
        </div>
      )}
    </main>
  );
}
