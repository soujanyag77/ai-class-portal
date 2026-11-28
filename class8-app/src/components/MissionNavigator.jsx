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
          className="px-3 py-2 rounded-xl bg-slate-100 border border-slate-300 text-slate-800 font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer"
        >
          <Home className="w-4 h-4 text-sky-600" /> Start
        </button>
        <a
          href="../index.html"
          className="px-3 py-2 rounded-xl bg-slate-100 border border-slate-300 text-slate-800 font-bold text-xs sm:text-sm no-underline"
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
                  ? 'bg-sky-600 text-white border-sky-700 scale-105 shadow-sm'
                  : isDone
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                    : 'bg-slate-100 text-slate-700 border-slate-300'
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
          className="px-3 py-2 rounded-xl bg-slate-100 border border-slate-300 text-slate-800 font-bold text-xs sm:text-sm flex items-center gap-1 cursor-pointer"
        >
          <Compass className="w-4 h-4 text-emerald-600" /> Concepts
        </button>
        <button
          type="button"
          onClick={() => onNavigate('reports')}
          className="px-3 py-2 rounded-xl bg-slate-100 border border-slate-300 text-slate-800 font-bold text-xs sm:text-sm flex items-center gap-1 cursor-pointer"
        >
          <FileBarChart2 className="w-4 h-4 text-amber-600" /> Report
        </button>
        <button
          type="button"
          onClick={() => onNavigate('teacher')}
          className="px-3 py-2 rounded-xl bg-indigo-100 border border-indigo-300 text-indigo-900 font-bold text-xs sm:text-sm flex items-center gap-1 cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4 text-indigo-700" /> Teacher
        </button>
        <button
          type="button"
          onClick={onToggleSound}
          className="px-2.5 py-2 rounded-xl bg-slate-100 border border-slate-300 text-slate-800 cursor-pointer"
          title={soundEnabled ? 'Mute sound' : 'Unmute sound'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-sky-600" /> : <VolumeX className="w-4 h-4 text-rose-600" />}
        </button>
        <button
          type="button"
          onClick={onFullscreen}
          className="px-2.5 py-2 rounded-xl bg-slate-100 border border-slate-300 text-slate-800 cursor-pointer"
          title="Toggle Fullscreen"
        >
          <Maximize2 className="w-4 h-4 text-slate-700" />
        </button>
      </div>
    </div>
  );
}
