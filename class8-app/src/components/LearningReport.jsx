import React, { useMemo, useState } from 'react';
import { Download, Printer, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { BEFORE_ASSESSMENT, AFTER_ASSESSMENT } from '../data/questionBank.js';
import { buildLearningSummary, exportReportCSV } from '../utils/assessment.js';
import { shuffle } from '../utils/shuffle.js';

export default function LearningReport({
  state,
  onSaveBefore,
  onSaveAfter,
  onSaveNotes,
  onBack
}) {
  const [tab, setTab] = useState('report');
  const summary = buildLearningSummary(state, BEFORE_ASSESSMENT, AFTER_ASSESSMENT);

  const beforeShuffled = useMemo(
    () => BEFORE_ASSESSMENT.map((q) => ({ ...q, shuffled: shuffle(q.options.map((t, i) => ({ t, origIdx: i }))) })),
    []
  );
  const afterShuffled = useMemo(
    () => AFTER_ASSESSMENT.map((q) => ({ ...q, shuffled: shuffle(q.options.map((t, i) => ({ t, origIdx: i }))) })),
    []
  );

  const renderQuiz = (title, qs, answers, onAnswer) => (
    <div className="space-y-4">
      <h2 className="text-2xl font-black text-sky-800 m-0">{title}</h2>
      {qs.map((q) => (
        <div key={q.id} className="glass-panel rounded-2xl p-4 space-y-2">
          <div className="text-xs font-black uppercase text-orange-700">{q.concept}</div>
          <div className="text-lg font-extrabold text-slate-900">{q.prompt}</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {q.shuffled.map(({ t, origIdx }) => {
              const selected = answers[q.id] === origIdx;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => onAnswer(q.id, origIdx)}
                  className={`p-3 rounded-xl border-2 text-left font-bold text-sm flex items-center gap-2 cursor-pointer ${
                    selected ? 'bg-sky-600 text-white border-sky-700' : 'bg-slate-50 text-slate-800 border-slate-300'
                  }`}
                >
                  {selected && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                  <span>{t}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen ai-arena-bg p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="no-print glass-panel rounded-2xl p-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex gap-2 flex-wrap">
            <button type="button" onClick={onBack} className="px-4 py-2 rounded-xl bg-slate-100 border border-slate-300 text-slate-800 font-bold text-sm flex items-center gap-1 cursor-pointer">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            {[
              { id: 'before', label: `1. Before Quiz (${summary.before.score}/5)` },
              { id: 'after', label: `2. After Quiz (${summary.after.score}/5)` },
              { id: 'report', label: '3. Final Learning Report' }
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`px-4 py-2 rounded-xl font-black text-sm cursor-pointer ${
                  tab === t.id ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-800 border border-slate-300'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => exportReportCSV(state, summary)} className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center gap-1.5 cursor-pointer">
              <Download className="w-4 h-4" /> Export CSV
            </button>
            <button type="button" onClick={() => window.print()} className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-black text-sm flex items-center gap-1.5 cursor-pointer">
              <Printer className="w-4 h-4" /> Print / Save PDF
            </button>
          </div>
        </div>

        {tab === 'before' && renderQuiz('📝 Pre-Session Baseline Assessment (5 Questions)', beforeShuffled, state.beforeAssessment, onSaveBefore)}
        {tab === 'after' && renderQuiz('🎓 Post-Session Learning Assessment (5 Questions)', afterShuffled, state.afterAssessment, onSaveAfter)}

        {tab === 'report' && (
          <div className="glass-panel print-card rounded-3xl p-6 space-y-5 border-2 border-sky-300">
            <div className="flex flex-wrap justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-sky-800 m-0">📊 Class 8 AI Championship – Learning Report</h1>
                <p className="text-sm text-slate-600 m-0">
                  {state.settings.schoolName} · {state.settings.className} · Teacher: {state.settings.teacherName} · {new Date().toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold uppercase text-slate-500">Learning Improvement</div>
                <div className="text-3xl font-black text-emerald-700">
                  {summary.deltaPct >= 0 ? `+${summary.deltaPct}%` : `${summary.deltaPct}%`}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-slate-50 print-card border border-slate-200">
                <div className="text-xs font-bold uppercase text-slate-500">Before Assessment</div>
                <div className="text-2xl font-black text-slate-900">{summary.before.score} / 5 ({summary.before.pct}%)</div>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50 print-card border border-emerald-200">
                <div className="text-xs font-bold uppercase text-slate-600">After Assessment</div>
                <div className="text-2xl font-black text-emerald-800">{summary.after.score} / 5 ({summary.after.pct}%)</div>
              </div>
              <div className="p-4 rounded-2xl bg-sky-50 print-card border border-sky-200">
                <div className="text-xs font-bold uppercase text-slate-600">Team Blue (Cyber Titans)</div>
                <div className="text-2xl font-black text-sky-800">{state.teams.blue.score} pts · {state.teams.blue.correctCount}✓</div>
              </div>
              <div className="p-4 rounded-2xl bg-orange-50 print-card border border-orange-200">
                <div className="text-xs font-bold uppercase text-slate-600">Team Orange (Data Dragons)</div>
                <div className="text-2xl font-black text-orange-800">{state.teams.orange.score} pts · {state.teams.orange.correctCount}✓</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 print-card border border-slate-200 space-y-2">
                <h3 className="text-lg font-black text-emerald-800 m-0">✅ AI Concepts Understood</h3>
                <div className="flex flex-wrap gap-1.5">
                  {summary.conceptsUnderstood.length ? summary.conceptsUnderstood.map((c) => (
                    <span key={c} className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">{c}</span>
                  )) : <span className="text-sm text-slate-500">Play missions to populate concepts mastered.</span>}
                </div>
                <h4 className="text-base font-black text-violet-800 pt-2 m-0">🧩 CT Skills Demonstrated</h4>
                <div className="flex flex-wrap gap-1.5">
                  {summary.ctSkills.length ? summary.ctSkills.map((c) => (
                    <span key={c} className="px-2.5 py-1 rounded-full bg-violet-100 text-violet-900 text-xs font-bold">{c}</span>
                  )) : <span className="text-sm text-slate-500">Play Mission 2 CT activities to record skills.</span>}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 print-card border border-slate-200 space-y-2">
                <h3 className="text-lg font-black text-amber-800 m-0">⚠️ Common Misconceptions Flagged</h3>
                <div className="flex flex-wrap gap-1.5">
                  {summary.misconceptions.length ? summary.misconceptions.map((m) => (
                    <span key={m} className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-900 text-xs font-bold">{m}</span>
                  )) : <span className="text-sm text-slate-500">None flagged so far!</span>}
                </div>
                <h4 className="text-base font-black text-sky-800 pt-2 m-0">🎤 Individual Student Participation ({state.participation.length})</h4>
                <div className="text-xs text-slate-700">
                  {state.participation.length ? state.participation.map((p) => `${p.student} (${p.team})`).join(', ') : 'No individual turns logged yet.'}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 print-card border border-slate-200 space-y-2">
              <label className="block">
                <span className="text-sm font-black text-sky-800">👩‍🏫 Teacher Observation Notes</span>
                <textarea
                  value={state.teacherNotes}
                  onChange={(e) => onSaveNotes(e.target.value)}
                  rows={3}
                  placeholder="Record student reasoning highlights, teamwork observations, or follow-up plans..."
                  className="mt-1 w-full p-3 rounded-xl bg-white border-2 border-slate-300 text-slate-900 text-sm"
                />
              </label>
              <div className="text-sm font-bold text-amber-900">
                💡 Suggested Follow-Up Activity: <span className="font-normal text-slate-800">{summary.followUp}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
