import React, { useState } from 'react';
import { Play, ShieldCheck, Compass, HelpCircle, RotateCcw, Volume2, VolumeX, Sparkles, Maximize2 } from 'lucide-react';
import ByteGuide from './ByteGuide.jsx';
import { MISSIONS } from '../data/activityBank.js';

export default function WelcomeScreen({
  settings,
  onUpdateSettings,
  onStartChampionship,
  onNavigate,
  onResetGame,
  onToggleFullscreen
}) {
  const [showHowTo, setShowHowTo] = useState(false);

  return (
    <div className="min-h-screen ai-arena-bg text-slate-900 p-4 md:p-6 flex flex-col justify-center">
      <div className="max-w-7xl w-full mx-auto space-y-5">
        <div className="glass-panel rounded-3xl p-5 md:p-7 border-sky-300 relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <span className="px-4 py-1.5 rounded-full bg-sky-100 border border-sky-300 text-sky-900 font-black text-sm tracking-wide">
              🏫 PM SHRI KENDRIYA VIDYALAYA · CBSE / KVS AI CLASSROOM
            </span>
            <div className="flex items-center gap-2">
              <a
                href="../index.html"
                className="px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-300 text-slate-800 font-bold text-sm no-underline"
              >
                ← Back to Portal Hub
              </a>
              <button
                type="button"
                onClick={onToggleFullscreen}
                className="px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-300 text-slate-800 font-bold text-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Maximize2 className="w-4 h-4 text-sky-600" /> Fullscreen
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-6 items-center">
            <div>
              <div className="text-sky-700 font-black tracking-widest text-sm md:text-base uppercase">
                AI BATTLE ARENA · CLASS 8 – ARTIFICIAL INTELLIGENCE &amp; COMPUTATIONAL THINKING
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 mt-2 mb-2 leading-tight">
                THE ULTIMATE <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-indigo-600 to-orange-500">AI CHAMPIONSHIP</span>
              </h1>
              <p className="text-xl md:text-2xl font-bold text-orange-600 mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6" /> Think Smart. Play Smart. Become AI Smart!
              </p>

              <ByteGuide
                message="Welcome, AI Explorers! Today, your brains are the ultimate supercomputers!"
                mood="excited"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
                <button
                  type="button"
                  onClick={onStartChampionship}
                  className="touch-btn px-6 py-4 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-black text-xl flex items-center justify-center gap-2.5 shadow-lg animate-glow cursor-pointer"
                >
                  <Play className="w-6 h-6 fill-white" /> START CHAMPIONSHIP
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('teacher')}
                  className="touch-btn px-6 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-black text-xl flex items-center justify-center gap-2.5 shadow-md cursor-pointer"
                >
                  <ShieldCheck className="w-6 h-6" /> TEACHER DASHBOARD
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('concepts')}
                  className="touch-btn px-6 py-4 rounded-2xl bg-emerald-50 border-2 border-emerald-400 text-emerald-900 font-black text-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Compass className="w-6 h-6 text-emerald-600" /> EXPLORE AI CONCEPTS
                </button>
                <button
                  type="button"
                  onClick={() => setShowHowTo((v) => !v)}
                  className="touch-btn px-6 py-4 rounded-2xl bg-orange-50 border-2 border-orange-400 text-orange-900 font-black text-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <HelpCircle className="w-6 h-6 text-orange-600" /> HOW TO PLAY
                </button>
              </div>
            </div>

            <div className="rounded-2xl p-5 bg-slate-50 border-2 border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-sky-700 m-0">⚙️ Session Setup</h2>
                <button
                  type="button"
                  onClick={onResetGame}
                  className="px-3 py-1.5 rounded-xl bg-rose-100 border border-rose-300 text-rose-800 font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset Previous Game
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-xs font-extrabold uppercase text-slate-600">Class &amp; Section</span>
                  <input
                    type="text"
                    value={settings.className}
                    onChange={(e) => onUpdateSettings({ className: e.target.value })}
                    className="mt-1 w-full px-3 py-2.5 rounded-xl bg-white border-2 border-slate-300 text-slate-900 font-bold text-base"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-extrabold uppercase text-slate-600">Teacher Name</span>
                  <input
                    type="text"
                    value={settings.teacherName}
                    onChange={(e) => onUpdateSettings({ teacherName: e.target.value })}
                    className="mt-1 w-full px-3 py-2.5 rounded-xl bg-white border-2 border-slate-300 text-slate-900 font-bold text-base"
                  />
                </label>
              </div>

              <div>
                <span className="text-xs font-extrabold uppercase text-slate-600 block mb-1">Session Mode</span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'full30', label: '⏱️ 30-Min Championship' },
                    { id: 'quick5', label: '⚡ 5-Min Quick Revision' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => onUpdateSettings({ sessionMode: m.id })}
                      className={`py-2.5 px-3 rounded-xl font-extrabold text-sm border-2 cursor-pointer ${
                        settings.sessionMode === m.id
                          ? 'bg-sky-600 text-white border-sky-700'
                          : 'bg-white text-slate-700 border-slate-300'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-extrabold uppercase text-slate-600 block mb-1">Progression Control</span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'manual', label: '👩‍🏫 Manual (Teacher)' },
                    { id: 'auto', label: '⚡ Automatic Timer' }
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => onUpdateSettings({ progression: p.id })}
                      className={`py-2.5 px-3 rounded-xl font-extrabold text-sm border-2 cursor-pointer ${
                        settings.progression === p.id
                          ? 'bg-orange-500 text-white border-orange-600'
                          : 'bg-white text-slate-700 border-slate-300'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2 items-end">
                <label className="block">
                  <span className="text-xs font-extrabold uppercase text-slate-600">Starting Curriculum Module</span>
                  <select
                    value={settings.selectedModule}
                    onChange={(e) => onUpdateSettings({ selectedModule: e.target.value })}
                    className="mt-1 w-full px-3 py-2.5 rounded-xl bg-white border-2 border-slate-300 text-slate-900 font-bold text-base"
                  >
                    <option value="all">All 7 Missions (Full 30-Min Journey)</option>
                    {MISSIONS.map((m) => (
                      <option key={m.id} value={String(m.id)}>
                        M{m.id}: {m.title.replace(`MISSION ${m.id} – `, '')} ({m.minutes}m)
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
                  className="touch-btn px-4 py-2.5 rounded-xl bg-white border-2 border-slate-300 text-slate-800 font-bold text-sm flex items-center gap-1.5 cursor-pointer"
                >
                  {settings.soundEnabled ? <Volume2 className="w-5 h-5 text-sky-600" /> : <VolumeX className="w-5 h-5 text-rose-600" />}
                  {settings.soundEnabled ? 'Sound ON' : 'Muted'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {showHowTo && (
          <div className="glass-panel rounded-2xl p-5 border-orange-300 animate-pop">
            <h3 className="text-2xl font-black text-orange-700 mt-0 mb-3">🎮 How To Play on the Classroom Interactive Panel</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-lg">
              <div className="bg-sky-50 rounded-xl p-4 border border-sky-200">
                <b className="text-sky-800">1. Two-Team Rotation</b>
                <p className="text-slate-700 mt-1 mb-0">Divide the class into <b>TEAM BLUE – CYBER TITANS</b> 🤖 and <b>TEAM ORANGE – DATA DRAGONS</b> 🐉. Teams send students to touch, drag, drop, draw, and explain!</p>
              </div>
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                <b className="text-amber-800">2. Reasoning Over Speed</b>
                <p className="text-slate-700 mt-1 mb-0">Correct answers earn <b>100–150 pts</b>; good explanations &amp; teamwork earn <b>+50 bonus pts</b>! Mistakes trigger instant explanations from BYTE.</p>
              </div>
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                <b className="text-emerald-800">3. Pre/Post Learning Check</b>
                <p className="text-slate-700 mt-1 mb-0">Run the quick 5-question <b>Before &amp; After Assessment</b> in Reports to measure real conceptual growth and export a PDF/CSV summary.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
