import React, { useState } from 'react';
import { Flame, ShieldAlert, Trophy, Users } from 'lucide-react';
import ByteGuide from './ByteGuide.jsx';
import { BOSS_CHALLENGES } from '../data/questionBank.js';
import { BADGE_CATALOG } from '../utils/scoring.js';

export default function BossBattle({
  teams,
  bossEnergy,
  onDamageBoss,
  onAward,
  onOpenReport
}) {
  const [roundIdx, setRoundIdx] = useState(0);
  const [resolved, setResolved] = useState(false);
  const [byteMsg, setByteMsg] = useState('FINAL BOSS BATTLE! Both TEAM BLUE & TEAM ORANGE must collaborate to drain THE BUG MASTER’s energy to 0%!');

  const defeated = bossEnergy <= 0 || roundIdx >= BOSS_CHALLENGES.length;
  const cur = BOSS_CHALLENGES[Math.min(roundIdx, BOSS_CHALLENGES.length - 1)];

  const strikeBoss = (opt) => {
    if (resolved || defeated) return;
    setResolved(true);
    if (opt === cur.correctAnswer) {
      onDamageBoss(20);
      // Co-op award: both teams earn points + collaboration bonus!
      onAward({ teamId: 'blue', points: cur.points, correct: true, earnStar: true, concept: cur.concept });
      onAward({ teamId: 'orange', points: cur.points, correct: true, earnStar: true, concept: cur.concept });
      setByteMsg(`💥 DIRECT CO-OP HIT! Both teams earned +${cur.points} pts! ${cur.explanation}`);
    } else {
      onAward({ teamId: 'blue', points: 30, correct: false, concept: cur.concept, misconception: cur.concept });
      onAward({ teamId: 'orange', points: 30, correct: false, concept: cur.concept });
      setByteMsg(`🛡️ THE BUG MASTER blocked! Remember: ${cur.explanation}`);
    }
  };

  if (defeated) {
    const winner = teams.blue.score === teams.orange.score
      ? '🤝 JOINT CHAMPIONS!'
      : teams.blue.score > teams.orange.score
        ? '🤖 TEAM BLUE – CYBER TITANS LEAD!'
        : '🐉 TEAM ORANGE – DATA DRAGONS LEAD!';

    return (
      <div className="glass-panel rounded-3xl p-6 md:p-8 border-2 border-amber-400 text-center space-y-5 animate-pop">
        <div className="text-6xl">🏆🤖🐉✨</div>
        <h2 className="text-3xl md:text-5xl font-black text-amber-300 m-0">
          CONGRATULATIONS! YOU HAVE BECOME RESPONSIBLE AI EXPLORERS!
        </h2>
        <div className="text-2xl font-black text-cyan-300">{winner}</div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto text-left">
          {[teams.blue, teams.orange].map((t) => (
            <div key={t.id} className="rounded-2xl p-4 bg-slate-900/80 border border-slate-700">
              <div className="text-xl font-black text-white">{t.avatar} {t.name}</div>
              <div className="text-3xl font-black text-amber-300 mt-1">{t.score} pts · ⭐ {t.stars}</div>
              <div className="text-sm font-bold text-slate-300 mt-1">
                Missions Completed: {t.completedMissions.length}/7 · Badges: {t.badges.length}
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {t.badges.map((bid) => {
                  const b = BADGE_CATALOG.find((x) => x.id === bid);
                  return b ? (
                    <span key={bid} className="px-2 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/40 text-xs font-bold text-amber-200">
                      {b.icon} {b.name}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={onOpenReport}
            className="touch-btn px-7 py-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-black text-xl flex items-center gap-2 cursor-pointer"
          >
            <Trophy className="w-6 h-6" /> Open Post-Session Assessment &amp; Final Report ▶
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Boss Energy Bar */}
      <div className="rounded-3xl p-4 bg-gradient-to-r from-rose-950 via-purple-950 to-slate-900 border-2 border-rose-500/70 flex flex-wrap items-center gap-4">
        <div className="text-5xl animate-float">👾</div>
        <div className="flex-1 min-w-[220px]">
          <div className="flex items-center justify-between font-black text-lg text-rose-200 mb-1">
            <span className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" /> THE BUG MASTER · Final Boss
            </span>
            <span>{bossEnergy}% Energy</span>
          </div>
          <div className="h-5 rounded-full bg-slate-800 border border-rose-400/40 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-rose-500 via-orange-400 to-amber-300 transition-all duration-500" style={{ width: `${bossEnergy}%` }} />
          </div>
        </div>
        <span className="px-3 py-1.5 rounded-full bg-amber-400/20 border border-amber-400 text-amber-200 font-black text-xs flex items-center gap-1">
          <Users className="w-4 h-4" /> Co-Op Bonus: Both Teams Score!
        </span>
      </div>

      <ByteGuide message={byteMsg} mood="excited" compact />

      <div className="glass-panel rounded-3xl p-6 border-2 border-orange-400/50 space-y-4">
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 rounded-full bg-orange-500/20 border border-orange-400/50 text-orange-200 font-black text-sm">
            {cur.title} ({roundIdx + 1}/{BOSS_CHALLENGES.length})
          </span>
          <span className="font-black text-amber-300 flex items-center gap-1">
            <Flame className="w-4 h-4" /> +{cur.points} Co-Op Pts
          </span>
        </div>

        <p className="text-xl md:text-2xl font-black text-white m-0">{cur.prompt}</p>

        <div className="space-y-2.5">
          {cur.options.map((opt) => (
            <button
              key={opt}
              type="button"
              disabled={resolved}
              onClick={() => strikeBoss(opt)}
              className={`w-full touch-btn p-4 rounded-2xl border-2 text-left font-extrabold text-lg cursor-pointer ${
                resolved && opt === cur.correctAnswer
                  ? 'bg-emerald-500 text-slate-950 border-emerald-300'
                  : 'bg-slate-800/95 text-white border-slate-600 hover:border-cyan-400'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        {resolved && (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => {
                setRoundIdx((i) => i + 1);
                setResolved(false);
              }}
              className="touch-btn px-7 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 font-black text-lg cursor-pointer"
            >
              {roundIdx + 1 < BOSS_CHALLENGES.length ? 'Next Boss Round ▶' : '🏆 Claim Victory!'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
