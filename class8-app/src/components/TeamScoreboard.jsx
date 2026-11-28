import React, { useState } from 'react';
import { Award, Flame, Star, UserPlus, ArrowLeftRight } from 'lucide-react';
import { BADGE_CATALOG } from '../utils/scoring.js';

export default function TeamScoreboard({
  teams,
  activeTeam,
  onSelectTeam,
  onLogStudent,
  participationCount = 0
}) {
  const [studentInput, setStudentInput] = useState('');
  const [showQuickLog, setShowQuickLog] = useState(false);

  const renderTeam = (team, isBlue) => {
    const isActive = activeTeam === team.id;
    const progressPct = Math.min(100, Math.round((team.completedMissions.length / 7) * 100));
    const ring = isBlue
      ? isActive
        ? 'border-cyan-400 shadow-[0_0_24px_rgba(34,211,238,0.45)] scale-[1.01]'
        : 'border-cyan-500/30 opacity-85'
      : isActive
        ? 'border-orange-400 shadow-[0_0_24px_rgba(251,146,60,0.45)] scale-[1.01]'
        : 'border-orange-500/30 opacity-85';

    const accent = isBlue ? 'text-cyan-300' : 'text-orange-300';
    const bar = isBlue ? 'bg-gradient-to-r from-cyan-400 to-blue-500' : 'bg-gradient-to-r from-amber-400 to-orange-500';

    return (
      <button
        type="button"
        onClick={() => onSelectTeam(team.id)}
        className={`text-left glass-panel rounded-2xl p-3 border-2 transition-all cursor-pointer touch-btn ${ring}`}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-3xl">{team.avatar}</span>
            <div className="min-w-0">
              <div className={`text-sm md:text-base font-black tracking-wide truncate ${accent}`}>
                {team.name}
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                <span className="inline-flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" /> {team.stars}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-rose-400" /> Streak {team.streak}
                </span>
                <span>Missions {team.completedMissions.length}/7</span>
              </div>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className={`text-3xl font-black tabular-nums leading-none ${accent}`}>{team.score}</div>
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-300 mt-1">
              {isActive ? '● ACTIVE TURN' : 'Tap to Activate'}
            </div>
          </div>
        </div>

        <div className="mt-2 h-2 rounded-full bg-slate-800 overflow-hidden">
          <div className={`h-full ${bar} transition-all duration-300`} style={{ width: `${progressPct}%` }} />
        </div>

        {team.badges.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {team.badges.map((bid) => {
              const b = BADGE_CATALOG.find((x) => x.id === bid);
              return b ? (
                <span key={bid} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-900/80 border border-amber-400/40 text-xs font-bold text-amber-200">
                  {b.icon} {b.name}
                </span>
              ) : null;
            })}
          </div>
        )}
      </button>
    );
  };

  const handleLog = (e) => {
    e.preventDefault();
    if (!studentInput.trim()) return;
    onLogStudent(studentInput.trim());
    setStudentInput('');
    setShowQuickLog(false);
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 items-stretch">
        {renderTeam(teams.blue, true)}
        <div className="flex flex-row md:flex-col items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => onSelectTeam(activeTeam === 'blue' ? 'orange' : 'blue')}
            className="touch-btn px-4 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 border-2 border-slate-600 text-slate-100 font-extrabold text-sm flex items-center gap-1.5 cursor-pointer"
            title="Switch Active Team"
          >
            <ArrowLeftRight className="w-4 h-4 text-cyan-300" /> Switch Turn
          </button>
          <button
            type="button"
            onClick={() => setShowQuickLog((v) => !v)}
            className="touch-btn px-4 py-2 rounded-xl bg-indigo-900/80 border-2 border-indigo-400/50 text-indigo-100 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" /> Student Turn ({participationCount})
          </button>
        </div>
        {renderTeam(teams.orange, false)}
      </div>

      {showQuickLog && (
        <form onSubmit={handleLog} className="glass-panel rounded-xl p-3 flex flex-wrap items-center gap-2 border-indigo-400/50 animate-pop">
          <Award className="w-5 h-5 text-amber-300 shrink-0" />
          <span className="text-sm font-bold text-slate-200">
            Log student at panel for {activeTeam === 'blue' ? 'Cyber Titans' : 'Data Dragons'}:
          </span>
          <input
            type="text"
            value={studentInput}
            onChange={(e) => setStudentInput(e.target.value)}
            placeholder="Student Name or Roll No."
            className="flex-1 min-w-[180px] px-3 py-2 rounded-xl bg-slate-900 border border-slate-600 text-white font-semibold text-base"
          />
          <button type="submit" className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-black cursor-pointer">
            Record Participation
          </button>
        </form>
      )}
    </div>
  );
}
