import React, { useMemo, useState } from 'react';
import { Flame, ShieldAlert, Trophy, Users, Eye } from 'lucide-react';
import ByteGuide from './ByteGuide.jsx';
import { BOSS_CHALLENGES } from '../data/questionBank.js';
import { BADGE_CATALOG } from '../utils/scoring.js';
import { shuffle } from '../utils/shuffle.js';

const teamLabel = (t) => (t === 'blue' ? 'TEAM BLUE (CYBER TITANS)' : 'TEAM ORANGE (DATA DRAGONS)');
const otherTeam = (t) => (t === 'blue' ? 'orange' : 'blue');

export default function BossBattle({
  activeTeam,
  teams,
  bossEnergy,
  onDamageBoss,
  onAward,
  onSwitchTurn,
  onOpenReport
}) {
  const rounds = useMemo(
    () => shuffle(BOSS_CHALLENGES).map((c) => ({ ...c, shuffledOpts: shuffle(c.options) })),
    []
  );
  const [roundIdx, setRoundIdx] = useState(0);
  const [resolved, setResolved] = useState(false);
  const [triedWrong, setTriedWrong] = useState([]);
  const [missTeams, setMissTeams] = useState([]);
  const [teacherWait, setTeacherWait] = useState(false);
  const [byteMsg, setByteMsg] = useState('FINAL BOSS BATTLE! Teams take turns striking THE BUG MASTER — co-op points go to BOTH teams on every hit!');

  const defeated = bossEnergy <= 0 || roundIdx >= rounds.length;
  const cur = rounds[Math.min(roundIdx, rounds.length - 1)];

  const strikeBoss = (opt) => {
    if (resolved || defeated || teacherWait || triedWrong.includes(opt)) return;
    if (opt === cur.correctAnswer) {
      setResolved(true);
      onDamageBoss(20);
      onAward({ teamId: 'blue', points: cur.points, correct: true, earnStar: true, concept: cur.concept });
      onAward({ teamId: 'orange', points: cur.points, correct: true, earnStar: true, concept: cur.concept });
      setByteMsg(`💥 DIRECT CO-OP HIT by ${teamLabel(activeTeam)}! BOTH teams earned +${cur.points} pts! ${cur.explanation}`);
      onSwitchTurn();
    } else {
      const nextW = [...triedWrong, opt];
      const nextM = missTeams.includes(activeTeam) ? missTeams : [...missTeams, activeTeam];
      setTriedWrong(nextW);
      setMissTeams(nextM);
      onAward({ teamId: activeTeam, points: 0, correct: false, concept: cur.concept, misconception: cur.concept });
      if (nextM.length >= 2) {
        setTeacherWait(true);
        setByteMsg('👩‍🏫 Both teams missed this Boss Strike! Answer hidden — Teacher, click below to reveal & explain!');
      } else {
        onSwitchTurn();
        setByteMsg(`🛡️ Missed! Turn passes to ${teamLabel(otherTeam(activeTeam))} without revealing the answer!`);
      }
    }
  };

  const teacherReveal = () => {
    setTeacherWait(false);
    setResolved(true);
    setByteMsg(`👩‍🏫 Teacher Reveal: "${cur.correctAnswer}". ${cur.explanation}`);
    onSwitchTurn();
  };

  if (defeated) {
    const winner = teams.blue.score === teams.orange.score
      ? '🤝 JOINT CHAMPIONS!'
      : teams.blue.score > teams.orange.score
        ? '🤖 TEAM BLUE – CYBER TITANS LEAD!'
        : '🐉 TEAM ORANGE – DATA DRAGONS LEAD!';

    return (
      <div className="rounded-3xl p-6 md:p-8 bg-amber-50 border-3 border-amber-400 text-center space-y-5 animate-pop">
        <div className="text-6xl">🏆🤖🐉✨</div>
        <h2 className="text-3xl md:text-5xl font-black text-amber-800 m-0">
          CONGRATULATIONS! YOU HAVE BECOME RESPONSIBLE AI EXPLORERS!
        </h2>
        <div className="text-2xl font-black text-sky-700">{winner}</div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto text-left">
          {[teams.blue, teams.orange].map((t) => (
            <div key={t.id} className="rounded-2xl p-4 bg-white border-2 border-slate-300 shadow-sm">
              <div className="text-xl font-black text-slate-900">{t.avatar} {t.name}</div>
              <div className="text-3xl font-black text-sky-700 mt-1">{t.score} pts · ⭐ {t.stars}</div>
              <div className="text-sm font-bold text-slate-600 mt-1">
                Missions Completed: {t.completedMissions.length}/7 · Badges: {t.badges.length}
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {t.badges.map((bid) => {
                  const b = BADGE_CATALOG.find((x) => x.id === bid);
                  return b ? (
                    <span key={bid} className="px-2 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-xs font-bold text-amber-900">
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
            className="touch-btn px-7 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-sky-600 text-white font-black text-xl flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Trophy className="w-6 h-6" /> Open Post-Session Assessment &amp; Final Report ▶
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-3xl p-4 bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 text-white border-2 border-rose-400 flex flex-wrap items-center gap-4 shadow-md">
        <div className="text-5xl animate-float">👾</div>
        <div className="flex-1 min-w-[220px]">
          <div className="flex items-center justify-between font-black text-lg text-white mb-1">
            <span className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-300" /> THE BUG MASTER · Final Boss
            </span>
            <span>{bossEnergy}% Energy</span>
          </div>
          <div className="h-5 rounded-full bg-white/25 border border-white/40 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-300 to-rose-300 transition-all duration-500" style={{ width: `${bossEnergy}%` }} />
          </div>
        </div>
        <span className="px-3 py-1.5 rounded-full bg-white text-rose-900 font-black text-xs flex items-center gap-1">
          <Users className="w-4 h-4" /> Co-Op Bonus: Both Teams Score!
        </span>
      </div>

      <ByteGuide message={byteMsg} mood={teacherWait ? 'alert' : 'excited'} compact />

      <div className="rounded-3xl p-6 bg-orange-50/70 border-2 border-orange-300 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="px-3 py-1 rounded-full bg-orange-200 border border-orange-400 text-orange-950 font-black text-sm">
            {cur.title} ({roundIdx + 1}/{rounds.length})
          </span>
          <span className="font-black text-emerald-700 flex items-center gap-1">
            <Flame className="w-4 h-4 text-orange-600" /> +{cur.points} Co-Op Pts Each Team
          </span>
        </div>

        <p className="text-xl md:text-2xl font-black text-slate-900 m-0">{cur.prompt}</p>

        <div className="space-y-2.5">
          {cur.shuffledOpts.map((opt) => {
            const wrongTried = triedWrong.includes(opt);
            const isRight = resolved && opt === cur.correctAnswer;
            return (
              <button
                key={opt}
                type="button"
                disabled={resolved || teacherWait || wrongTried}
                onClick={() => strikeBoss(opt)}
                className={`w-full touch-btn p-4 rounded-2xl border-2 border-b-4 text-left font-extrabold text-lg cursor-pointer shadow-sm ${
                  isRight
                    ? 'bg-emerald-600 text-white border-emerald-700'
                    : wrongTried
                      ? 'bg-rose-100 text-rose-700 border-rose-300 opacity-55 line-through'
                      : 'bg-white text-slate-900 border-slate-300 hover:border-sky-500'
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {teacherWait && (
          <div className="flex justify-center">
            <button type="button" onClick={teacherReveal} className="touch-btn px-6 py-3 rounded-2xl bg-indigo-600 text-white font-black text-lg flex items-center gap-2 cursor-pointer">
              <Eye className="w-5 h-5" /> 👩‍🏫 Teacher: Reveal Answer &amp; Explain
            </button>
          </div>
        )}

        {resolved && (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => {
                setRoundIdx((i) => i + 1);
                setResolved(false);
                setTriedWrong([]);
                setMissTeams([]);
                setTeacherWait(false);
              }}
              className="touch-btn px-7 py-3 rounded-2xl bg-gradient-to-r from-sky-600 to-emerald-600 text-white font-black text-lg cursor-pointer"
            >
              {roundIdx + 1 < rounds.length ? 'Next Boss Round ▶' : '🏆 Claim Victory!'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
