import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Cpu } from 'lucide-react';
import { AI_CHAPTERS } from '../data/aiCurriculum.js';
import { CT_CHAPTERS } from '../data/ctCurriculum.js';
import { AI_CONCEPT_QUESTIONS } from '../data/questionBank.js';

export default function CurriculumExplorer({ onBack }) {
  const [tab, setTab] = useState('ai');
  const [quizAnswer, setQuizAnswer] = useState({});

  return (
    <div className="min-h-screen ai-arena-bg text-slate-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-5">
        <div className="glass-panel rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button type="button" onClick={onBack} className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-600 text-white font-bold text-sm flex items-center gap-1 cursor-pointer">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <h1 className="text-2xl font-black text-cyan-300 m-0">🧭 Explore Class 8 AI &amp; CT Concepts</h1>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setTab('ai')} className={`px-4 py-2 rounded-xl font-black text-sm cursor-pointer ${tab === 'ai' ? 'bg-cyan-400 text-slate-950' : 'bg-slate-800 text-slate-200'}`}>
              <BookOpen className="w-4 h-4 inline mr-1" /> 4 AI Chapters
            </button>
            <button type="button" onClick={() => setTab('ct')} className={`px-4 py-2 rounded-xl font-black text-sm cursor-pointer ${tab === 'ct' ? 'bg-violet-400 text-slate-950' : 'bg-slate-800 text-slate-200'}`}>
              <Cpu className="w-4 h-4 inline mr-1" /> 7 CT Chapters
            </button>
            <button type="button" onClick={() => setTab('bank')} className={`px-4 py-2 rounded-xl font-black text-sm cursor-pointer ${tab === 'bank' ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-200'}`}>
              📚 20-Q Practice Bank
            </button>
          </div>
        </div>

        {tab === 'ai' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {AI_CHAPTERS.map((ch) => (
              <div key={ch.id} className="glass-panel rounded-3xl p-5 border-2 border-slate-700 space-y-3">
                <div className="text-2xl font-black text-white">{ch.icon} Chapter {ch.number}: {ch.title}</div>
                <p className="text-slate-300 text-base m-0">{ch.summary}</p>
                <div className="space-y-2">
                  {ch.keyConcepts.map((kc) => (
                    <div key={kc.term} className="p-3 rounded-xl bg-slate-900/75 border border-slate-700">
                      <b className="text-cyan-300">{kc.term}:</b> <span className="text-slate-200">{kc.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'ct' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CT_CHAPTERS.map((ch) => (
              <div key={ch.id} className="glass-panel rounded-3xl p-5 border-2 border-violet-400/40 space-y-2">
                <div className="text-xl font-black text-violet-300">{ch.icon} Ch {ch.number}: {ch.title}</div>
                <div className="text-xs font-extrabold uppercase text-cyan-300">{ch.skill}</div>
                <p className="text-slate-200 text-base m-0">{ch.concept}</p>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700 text-sm">
                  <b>Try Puzzle:</b> {ch.puzzle.prompt} <br />
                  <span className="text-emerald-300 font-bold">Answer: {ch.puzzle.answer}</span> — {ch.puzzle.explanation}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'bank' && (
          <div className="space-y-3">
            {AI_CONCEPT_QUESTIONS.map((q, idx) => (
              <div key={q.id} className="glass-panel rounded-2xl p-4 border border-slate-700 space-y-2">
                <div className="flex justify-between text-xs font-black text-cyan-300">
                  <span>Q{idx + 1} · {q.concept}</span>
                  <span>{q.difficulty} · {q.points} pts</span>
                </div>
                <div className="text-lg font-extrabold text-white">{q.instructions}</div>
                <div className="flex flex-wrap gap-2">
                  {q.options.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setQuizAnswer((prev) => ({ ...prev, [q.id]: opt }))}
                      className={`px-3.5 py-2 rounded-xl font-bold text-sm border cursor-pointer ${
                        quizAnswer[q.id] === opt
                          ? opt === q.correctAnswer
                            ? 'bg-emerald-500 text-slate-950 border-emerald-300'
                            : 'bg-rose-500 text-white border-rose-300'
                          : 'bg-slate-900 text-slate-200 border-slate-700'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {quizAnswer[q.id] && (
                  <div className="text-sm font-bold text-amber-200">💡 {q.explanation}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
