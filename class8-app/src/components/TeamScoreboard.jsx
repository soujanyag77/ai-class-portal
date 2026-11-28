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
        ? 'border-sky-500 bg-sky-50 shadow-[0_8px_22px_rgba(14,165,233,0.22)] scale-[1.01]'
        : 'border-sky-200 bg-white opacity-90'
      : isActive
        ? 'border-orange-500 bg-orange-50 shadow-[0_8px_22px_rgba(249,115,22,0.22)] scale-[1.01]'
        : 'border-orange-200 bg-white opacity-90';

    const accent = isBlue ? 'text-sky-700' : 'text-orange-700';
    const bar = isBlue ? 'bg-gradient-to-r from-sky-500 to-blue-600' : 'bg-gradient-to-r from-amber-500 to-orange-600';

    return (
      <button
        type="button"
        onClick={() => onSelectTeam(team.id)}
        className={`text-left rounded-2xl p-3 border-3 transition-all cursor-pointer touch-btn ${ring}`}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-3xl">{team.avatar}</span>
            <div className="min-w-0">
              <div className={`text-sm md:text-base font-black tracking-wide truncate ${accent}`}>
                {team.name}
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                <span className="inline-flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" /> {team.stars}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-rose-500" /> Streak {team.streak}
                </span>
                <span>Missions {team.completedMissions.length}/7</span>
              </div>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className={`text-3xl font-black tabular-nums leading-none ${accent}`}>{team.score}</div>
            <div className={`text-[11px] font-black uppercase tracking-wider mt-1 ${isActive ? accent : 'text-slate-500'}`}>
              {isActive ? '● ACTIVE TURN' : 'Tap to Activate'}
            </div>
          </div>
        </div>

        <div className="mt-2 h-2.5 rounded-full bg-slate-200 overflow-hidden">
          <div className={`h-full ${bar} transition-all duration-300`} style={{ width: `${progressPct}%` }} />
        </div>

        {team.badges.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {team.badges.map((bid) => {
              const b = BADGE_CATALOG.find((x) => x.id === bid);
              return b ? (
                <span key={bid} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-xs font-bold text-amber-900">
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
            className="touch-btn px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border-2 border-slate-300 text-slate-800 font-extrabold text-sm flex items-center gap-1.5 cursor-pointer shadow-sm"
            title="Switch Active Team"
          >
            <ArrowLeftRight className="w-4 h-4 text-sky-600" /> Switch Turn
          </button>
          <button
            type="button"
            onClick={() => setShowQuickLog((v) => !v)}
            className="touch-btn px-4 py-2 rounded-xl bg-indigo-50 border-2 border-indigo-300 text-indigo-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" /> Student Turn ({participationCount})
          </button>
        </div>
        {renderTeam(teams.orange, false)}
      </div>

      {showQuickLog && (
        <form onSubmit={handleLog} className="glass-panel rounded-xl p-3 flex flex-wrap items-center gap-2 border-indigo-300 animate-pop">
          <Award className="w-5 h-5 text-amber-500 shrink-0" />
          <span className="text-sm font-bold text-slate-800">
            Log student at panel for {activeTeam === 'blue' ? 'Cyber Titans' : 'Data Dragons'}:
          </span>
          <input
            type="text"
            value={studentInput}
            onChange={(e) => setStudentInput(e.target.value)}
            placeholder="Student Name or Roll No."
            className="flex-1 min-w-[180px] px-3 py-2 rounded-xl bg-white border-2 border-slate-300 text-slate-900 font-semibold text-base"
          />
          <button type="submit" className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-black cursor-pointer">
            Record Participation
          </button>
        </form>
      )}
    </div>
  );
}
