import React from 'react';
import { Pause, Play, PlusCircle, SkipForward } from 'lucide-react';
import { formatClock } from '../utils/timer.js';

export default function GameTimer({
  missionLeft,
  sessionLeft,
  running,
  progression,
  onToggleRun,
  onExtend,
  onSkip
}) {
  const lowMission = missionLeft <= 20;

  return (
    <div className="glass-panel rounded-2xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 border-slate-700">
      <div className="flex items-center gap-4">
        <div>
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Mission Clock</div>
          <div className={`text-2xl md:text-3xl font-black tabular-nums leading-none ${lowMission ? 'text-rose-400 animate-pulse' : 'text-cyan-300'}`}>
            {formatClock(missionLeft)}
          </div>
        </div>
        <div className="h-8 w-px bg-slate-700" />
        <div>
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">30-Min Session</div>
          <div className="text-xl md:text-2xl font-black tabular-nums leading-none text-slate-100">
            {formatClock(sessionLeft)}
          </div>
        </div>
        <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-slate-800 border border-slate-600 text-xs font-bold text-slate-300">
          {progression === 'auto' ? '⚡ Auto Next' : '👩‍🏫 Teacher Controlled'}
        </span>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={onToggleRun}
          className={`touch-btn px-4 py-2 rounded-xl font-black text-sm flex items-center gap-1.5 cursor-pointer ${
            running ? 'bg-amber-400 text-slate-950' : 'bg-emerald-400 text-slate-950'
          }`}
        >
          {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {running ? 'Pause' : 'Resume'}
        </button>
        <button
          type="button"
          onClick={() => onExtend(60)}
          className="touch-btn px-3 py-2 rounded-xl bg-slate-800 border border-slate-600 text-slate-100 font-bold text-sm flex items-center gap-1 cursor-pointer"
          title="Add 1 minute"
        >
          <PlusCircle className="w-4 h-4 text-cyan-300" /> +1m
        </button>
        <button
          type="button"
          onClick={onSkip}
          className="touch-btn px-3 py-2 rounded-xl bg-slate-800 border border-slate-600 text-slate-100 font-bold text-sm flex items-center gap-1 cursor-pointer"
          title="Advance to next mission"
        >
          <SkipForward className="w-4 h-4 text-orange-300" /> Next
        </button>
      </div>
    </div>
  );
}
