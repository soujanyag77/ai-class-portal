import React from 'react';
import { Home, Maximize2, ShieldCheck, Volume2, VolumeX, FileBarChart2, Compass } from 'lucide-react';
import { MISSIONS } from '../data/activityBank.js';

export default function MissionNavigator({
  currentMission,
  completedMissions = [],
  soundEnabled,
  onSelectMission,
  onToggleSound,
  onNavigate,
  onFullscreen
}) {
  return (
    <div className="no-print flex flex-wrap items-center justify-between gap-2 glass-panel rounded-2xl px-3 py-2">
      <div className="flex items-center gap-1.5 flex-wrap">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-600 text-slate-100 font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer"
        >
          <Home className="w-4 h-4 text-cyan-300" /> Start
        </button>
        <a
          href="../index.html"
          className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-600 text-slate-200 font-bold text-xs sm:text-sm no-underline"
        >
          🏫 Portal Hub
        </a>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap justify-center">
        {MISSIONS.map((m) => {
          const isCur = currentMission === m.id;
          const isDone = completedMissions.includes(m.id);
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onSelectMission(m.id)}
              className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-black border-2 transition-all cursor-pointer ${
                isCur
                  ? 'bg-cyan-400 text-slate-950 border-cyan-300 scale-105'
                  : isDone
                    ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/60'
                    : 'bg-slate-900/70 text-slate-300 border-slate-700'
              }`}
              title={m.title}
            >
              {m.icon} M{m.id}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        <button
          type="button"
          onClick={() => onNavigate('concepts')}
          className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-600 text-slate-100 font-bold text-xs sm:text-sm flex items-center gap-1 cursor-pointer"
        >
          <Compass className="w-4 h-4 text-emerald-300" /> Concepts
        </button>
        <button
          type="button"
          onClick={() => onNavigate('reports')}
          className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-600 text-slate-100 font-bold text-xs sm:text-sm flex items-center gap-1 cursor-pointer"
        >
          <FileBarChart2 className="w-4 h-4 text-amber-300" /> Report
        </button>
        <button
          type="button"
          onClick={() => onNavigate('teacher')}
          className="px-3 py-2 rounded-xl bg-indigo-900/80 border border-indigo-400/60 text-indigo-100 font-bold text-xs sm:text-sm flex items-center gap-1 cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4 text-cyan-300" /> Teacher
        </button>
        <button
          type="button"
          onClick={onToggleSound}
          className="px-2.5 py-2 rounded-xl bg-slate-800 border border-slate-600 text-slate-100 cursor-pointer"
          title={soundEnabled ? 'Mute sound' : 'Unmute sound'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-300" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
        </button>
        <button
          type="button"
          onClick={onFullscreen}
          className="px-2.5 py-2 rounded-xl bg-slate-800 border border-slate-600 text-slate-100 cursor-pointer"
          title="Toggle Fullscreen"
        >
          <Maximize2 className="w-4 h-4 text-slate-200" />
        </button>
      </div>
    </div>
  );
}
