import React, { useState } from 'react';
import { Lock, Play, Pause, RotateCcw, Plus, Minus, Eye, Lightbulb, SkipForward, Clock, Users, BookOpen } from 'lucide-react';
import { AI_CHAPTERS } from '../data/aiCurriculum.js';
import { CT_CHAPTERS } from '../data/ctCurriculum.js';
import { MISSIONS } from '../data/activityBank.js';

export default function TeacherDashboard({
  state,
  onUpdateSettings,
  onSwitchTeam,
  onAdjustPoints,
  onToggleTimer,
  onExtendTimer,
  onSelectMission,
  onResetMission,
  onStartMode,
  onReplayMission,
  revealHint,
  revealAnswer,
  onToggleHint,
  onToggleAnswer,
  onBackToGame
}) {
  const [unlocked, setUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [newPin, setNewPin] = useState(state.settings.teacherPin || '4178');
  const [conceptModal, setConceptModal] = useState(null);

  const tryUnlock = (e) => {
    e.preventDefault();
    if (pinInput === (state.settings.teacherPin || '4178')) {
      setUnlocked(true);
      setPinError('');
    } else {
      setPinError('Incorrect PIN (default is 4178).');
    }
  };

  if (!unlocked) {
    return (
      <div className="min-h-screen ai-arena-bg p-6 flex items-center justify-center">
        <form onSubmit={tryUnlock} className="glass-panel rounded-3xl p-8 max-w-md w-full border-2 border-indigo-300 text-center space-y-4">
          <Lock className="w-12 h-12 text-sky-600 mx-auto" />
          <h2 className="text-2xl font-black text-slate-900 m-0">👩‍🏫 Teacher Dashboard</h2>
          <p className="text-sm text-slate-600 m-0">Enter Teacher PIN to access classroom controls, answer keys, and curriculum coverage. (Default PIN: <b>4178</b>)</p>
          <input
            type="password"
            inputMode="numeric"
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            placeholder="Enter 4-digit PIN"
            className="w-full px-4 py-3 rounded-xl bg-white border-2 border-slate-300 text-center text-2xl font-black tracking-widest text-slate-900"
          />
          {pinError && <div className="text-rose-600 font-bold text-sm">{pinError}</div>}
          <div className="flex gap-2 justify-center">
            <button type="button" onClick={onBackToGame} className="px-4 py-3 rounded-xl bg-slate-200 text-slate-800 font-bold cursor-pointer">
              ← Back
            </button>
            <button type="submit" className="px-6 py-3 rounded-xl bg-sky-600 text-white font-black cursor-pointer">
              Unlock Controls
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen ai-arena-bg p-4 md:p-6 space-y-5">
      <div className="max-w-7xl mx-auto space-y-5">
        <div className="glass-panel rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 border-indigo-300">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-indigo-800 m-0">👩‍🏫 PGT CS Teacher Control Center</h1>
            <p className="text-sm text-slate-600 m-0">{state.settings.schoolName} · {state.settings.className} · {state.settings.teacherName}</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button type="button" onClick={() => onStartMode('full30')} className="px-4 py-2.5 rounded-xl bg-sky-600 text-white font-black text-sm cursor-pointer">
              ⏱️ Start 30-Min Championship
            </button>
            <button type="button" onClick={() => onStartMode('quick5')} className="px-4 py-2.5 rounded-xl bg-orange-500 text-white font-black text-sm cursor-pointer">
              ⚡ Start 5-Min Quick Revision
            </button>
            <button type="button" onClick={onBackToGame} className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-black text-sm cursor-pointer">
              ▶ Return to Arena
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="glass-panel rounded-2xl p-4 space-y-3">
            <h3 className="text-lg font-black text-slate-900 m-0">⏱️ Timer &amp; Mission Controls</h3>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={onToggleTimer} className="px-3.5 py-2 rounded-xl bg-amber-400 text-slate-950 font-black text-sm flex items-center gap-1 cursor-pointer">
                {state.timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {state.timerRunning ? 'Pause Timer' : 'Start / Resume'}
              </button>
              <button type="button" onClick={() => onExtendTimer(60)} className="px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-300 text-slate-800 font-bold text-sm flex items-center gap-1 cursor-pointer">
                <Clock className="w-4 h-4 text-sky-600" /> +1 Min
              </button>
              <button type="button" onClick={onReplayMission} className="px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-300 text-slate-800 font-bold text-sm flex items-center gap-1 cursor-pointer">
                <RotateCcw className="w-4 h-4 text-violet-600" /> Replay / Reset Mission
              </button>
              <button
                type="button"
                onClick={() => onSelectMission(Math.min(7, state.currentMission + 1))}
                className="px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-300 text-slate-800 font-bold text-sm flex items-center gap-1 cursor-pointer"
              >
                <SkipForward className="w-4 h-4 text-orange-600" /> Skip Mission
              </button>
            </div>
            <label className="block pt-2">
              <span className="text-xs font-bold uppercase text-slate-600">Jump to Mission / Chapter</span>
              <select
                value={state.currentMission}
                onChange={(e) => onSelectMission(Number(e.target.value))}
                className="mt-1 w-full px-3 py-2 rounded-xl bg-white border-2 border-slate-300 text-slate-900 font-bold"
              >
                {MISSIONS.map((m) => (
                  <option key={m.id} value={m.id}>{m.title} ({m.minutes}m)</option>
                ))}
              </select>
            </label>
          </div>

          <div className="glass-panel rounded-2xl p-4 space-y-3">
            <h3 className="text-lg font-black text-slate-900 m-0">🏆 Team Turn &amp; Score Controls</h3>
            <div className="flex items-center justify-between bg-slate-100 p-2.5 rounded-xl border border-slate-300">
              <span className="font-bold text-sm">Active Turn: <b className={state.activeTeam === 'blue' ? 'text-sky-700' : 'text-orange-700'}>{state.teams[state.activeTeam].shortName}</b></span>
              <button type="button" onClick={onSwitchTeam} className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-bold text-xs cursor-pointer">
                Change Team Turn
              </button>
            </div>
            {['blue', 'orange'].map((tid) => (
              <div key={tid} className="flex items-center justify-between gap-2 bg-slate-100 p-2.5 rounded-xl border border-slate-300">
                <span className="font-black text-sm text-slate-900">{state.teams[tid].avatar} {state.teams[tid].shortName} ({state.teams[tid].score})</span>
                <div className="flex gap-1.5">
                  <button type="button" onClick={() => onAdjustPoints(tid, 50)} className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center gap-0.5 cursor-pointer"><Plus className="w-3 h-3" />50</button>
                  <button type="button" onClick={() => onAdjustPoints(tid, -50)} className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-black text-xs flex items-center gap-0.5 cursor-pointer"><Minus className="w-3 h-3" />50</button>
                </div>
              </div>
            ))}
          </div>

          <div className="glass-panel rounded-2xl p-4 space-y-3">
            <h3 className="text-lg font-black text-slate-900 m-0">💡 Hints, Answers &amp; PIN</h3>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={onToggleHint} className={`px-3.5 py-2 rounded-xl font-bold text-sm flex items-center gap-1.5 border cursor-pointer ${revealHint ? 'bg-amber-400 text-slate-950 border-amber-500' : 'bg-slate-100 text-slate-800 border-slate-300'}`}>
                <Lightbulb className="w-4 h-4" /> {revealHint ? 'Hint Shown' : 'Reveal Hint'}
              </button>
              <button type="button" onClick={onToggleAnswer} className={`px-3.5 py-2 rounded-xl font-bold text-sm flex items-center gap-1.5 border cursor-pointer ${revealAnswer ? 'bg-emerald-600 text-white border-emerald-700' : 'bg-slate-100 text-slate-800 border-slate-300'}`}>
                <Eye className="w-4 h-4" /> {revealAnswer ? 'Answer Shown' : 'Display Answer'}
              </button>
            </div>
            <div className="flex gap-2 items-center pt-1">
              <input
                type="text"
                maxLength={6}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                className="w-28 px-3 py-1.5 rounded-xl bg-white border-2 border-slate-300 text-slate-900 font-bold text-sm"
              />
              <button
                type="button"
                onClick={() => onUpdateSettings({ teacherPin: newPin || '4178' })}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs cursor-pointer"
              >
                Save PIN
              </button>
              <button
                type="button"
                onClick={onResetMission}
                className="px-3 py-1.5 rounded-xl bg-rose-100 border border-rose-300 text-rose-800 font-bold text-xs cursor-pointer"
              >
                Reset All Scores
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="glass-panel rounded-2xl p-4 space-y-2.5">
            <h3 className="text-lg font-black text-sky-800 m-0 flex items-center gap-2">
              <BookOpen className="w-5 h-5" /> AI Curriculum Coverage (4 Chapters)
            </h3>
            {AI_CHAPTERS.map((ch) => {
              const covered = state.curriculumCoverage.ai.includes(ch.id);
              return (
                <div key={ch.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
                  <div>
                    <div className="font-black text-slate-900">{ch.icon} Ch {ch.number}: {ch.title}</div>
                    <div className="text-xs text-slate-600">{ch.sampleOutcome}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-black ${covered ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-200 text-slate-600'}`}>
                      {covered ? 'Covered ✓' : 'Pending'}
                    </span>
                    <button type="button" onClick={() => setConceptModal(ch)} className="px-2.5 py-1 rounded-lg bg-sky-100 text-sky-800 font-bold text-xs cursor-pointer">
                      Explain
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="glass-panel rounded-2xl p-4 space-y-2">
            <h3 className="text-lg font-black text-violet-800 m-0">🧩 CT Curriculum Coverage (7 Chapters)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CT_CHAPTERS.map((ch) => {
                const covered = state.curriculumCoverage.ct.includes(ch.title);
                return (
                  <div key={ch.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-bold text-sm text-slate-900 truncate">{ch.icon} {ch.number}. {ch.title}</div>
                      <div className="text-[11px] text-slate-600 truncate">{ch.skill}</div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-black shrink-0 ${covered ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                      {covered ? '✓' : '—'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 space-y-2">
          <h3 className="text-lg font-black text-orange-700 m-0 flex items-center gap-2">
            <Users className="w-5 h-5" /> Individual Student Participation ({state.participation.length})
          </h3>
          {state.participation.length === 0 ? (
            <p className="text-sm text-slate-600 m-0">Use the "Student Turn" button in the Arena header whenever a student comes to the panel.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {state.participation.map((p, idx) => (
                <span key={idx} className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-300 text-xs font-bold text-slate-800">
                  🎤 <b>{p.student}</b> ({p.team}) · M{p.mission} · {p.time}
                </span>
              ))}
            </div>
          )}
        </div>

        {conceptModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4" onClick={() => setConceptModal(null)}>
            <div className="glass-panel rounded-3xl p-6 max-w-xl w-full border-2 border-sky-400 space-y-3" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-2xl font-black text-sky-800 m-0">{conceptModal.icon} {conceptModal.title}</h3>
              <p className="text-slate-700 text-base">{conceptModal.summary}</p>
              <div className="space-y-2">
                {conceptModal.keyConcepts.map((kc) => (
                  <div key={kc.term} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <b className="text-orange-700">{kc.term}:</b> <span className="text-slate-800">{kc.desc}</span>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => setConceptModal(null)} className="px-5 py-2.5 rounded-xl bg-sky-600 text-white font-black cursor-pointer">
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
