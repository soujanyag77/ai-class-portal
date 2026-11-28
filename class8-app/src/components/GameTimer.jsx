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
    <div className="glass-panel rounded-2xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-4">
        <div>
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Mission Clock</div>
          <div className={`text-2xl md:text-3xl font-black tabular-nums leading-none ${lowMission ? 'text-rose-600 animate-pulse' : 'text-sky-700'}`}>
            {formatClock(missionLeft)}
          </div>
        </div>
        <div className="h-8 w-px bg-slate-300" />
        <div>
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">30-Min Session</div>
          <div className="text-xl md:text-2xl font-black tabular-nums leading-none text-slate-900">
            {formatClock(sessionLeft)}
          </div>
        </div>
        <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-slate-100 border border-slate-300 text-xs font-bold text-slate-700">
          {progression === 'auto' ? '⚡ Auto Next' : '👩‍🏫 Teacher Controlled'}
        </span>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={onToggleRun}
          className={`touch-btn px-4 py-2 rounded-xl font-black text-sm flex items-center gap-1.5 cursor-pointer ${
            running ? 'bg-amber-400 text-slate-950' : 'bg-emerald-600 text-white'
          }`}
        >
          {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {running ? 'Pause' : 'Resume'}
        </button>
        <button
          type="button"
          onClick={() => onExtend(60)}
          className="touch-btn px-3 py-2 rounded-xl bg-slate-100 border-2 border-slate-300 text-slate-800 font-bold text-sm flex items-center gap-1 cursor-pointer"
          title="Add 1 minute"
        >
          <PlusCircle className="w-4 h-4 text-sky-600" /> +1m
        </button>
        <button
          type="button"
          onClick={onSkip}
          className="touch-btn px-3 py-2 rounded-xl bg-slate-100 border-2 border-slate-300 text-slate-800 font-bold text-sm flex items-center gap-1 cursor-pointer"
          title="Advance to next mission"
        >
          <SkipForward className="w-4 h-4 text-orange-600" /> Next
        </button>
      </div>
    </div>
  );
}
