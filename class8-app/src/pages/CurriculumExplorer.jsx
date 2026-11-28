import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Cpu } from 'lucide-react';
import { AI_CHAPTERS } from '../data/aiCurriculum.js';
import { CT_CHAPTERS } from '../data/ctCurriculum.js';
import { AI_CONCEPT_QUESTIONS } from '../data/questionBank.js';

export default function CurriculumExplorer({ onBack }) {
  const [tab, setTab] = useState('ai');
  const [quizAnswer, setQuizAnswer] = useState({});

  return (
    <div className="min-h-screen ai-arena-bg text-slate-900 p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-5">
        <div className="glass-panel rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button type="button" onClick={onBack} className="px-4 py-2 rounded-xl bg-slate-100 border border-slate-300 text-slate-800 font-bold text-sm flex items-center gap-1 cursor-pointer">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <h1 className="text-2xl font-black text-sky-800 m-0">🧭 Explore Class 8 AI &amp; CT Concepts</h1>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setTab('ai')} className={`px-4 py-2 rounded-xl font-black text-sm cursor-pointer ${tab === 'ai' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-800 border border-slate-300'}`}>
              <BookOpen className="w-4 h-4 inline mr-1" /> 4 AI Chapters
            </button>
            <button type="button" onClick={() => setTab('ct')} className={`px-4 py-2 rounded-xl font-black text-sm cursor-pointer ${tab === 'ct' ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-800 border border-slate-300'}`}>
              <Cpu className="w-4 h-4 inline mr-1" /> 7 CT Chapters
            </button>
            <button type="button" onClick={() => setTab('bank')} className={`px-4 py-2 rounded-xl font-black text-sm cursor-pointer ${tab === 'bank' ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-800 border border-slate-300'}`}>
              📚 20-Q Practice Bank
            </button>
          </div>
        </div>

        {tab === 'ai' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {AI_CHAPTERS.map((ch) => (
              <div key={ch.id} className="glass-panel rounded-3xl p-5 space-y-3">
                <div className="text-2xl font-black text-slate-900">{ch.icon} Chapter {ch.number}: {ch.title}</div>
                <p className="text-slate-700 text-base m-0">{ch.summary}</p>
                <div className="space-y-2">
                  {ch.keyConcepts.map((kc) => (
                    <div key={kc.term} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <b className="text-sky-800">{kc.term}:</b> <span className="text-slate-800">{kc.desc}</span>
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
              <div key={ch.id} className="glass-panel rounded-3xl p-5 border-violet-300 space-y-2">
                <div className="text-xl font-black text-violet-800">{ch.icon} Ch {ch.number}: {ch.title}</div>
                <div className="text-xs font-extrabold uppercase text-sky-700">{ch.skill}</div>
                <p className="text-slate-700 text-base m-0">{ch.concept}</p>
                <div className="p-3 rounded-xl bg-violet-50 border border-violet-200 text-sm">
                  <b>Try Puzzle:</b> {ch.puzzle.prompt} <br />
                  <span className="text-emerald-800 font-bold">Answer: {ch.puzzle.answer}</span> — {ch.puzzle.explanation}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'bank' && (
          <div className="space-y-3">
            {AI_CONCEPT_QUESTIONS.map((q, idx) => (
              <div key={q.id} className="glass-panel rounded-2xl p-4 space-y-2">
                <div className="flex justify-between text-xs font-black text-sky-700">
                  <span>Q{idx + 1} · {q.concept}</span>
                  <span>{q.difficulty} · {q.points} pts</span>
                </div>
                <div className="text-lg font-extrabold text-slate-900">{q.instructions}</div>
                <div className="flex flex-wrap gap-2">
                  {q.options.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setQuizAnswer((prev) => ({ ...prev, [q.id]: opt }))}
                      className={`px-3.5 py-2 rounded-xl font-bold text-sm border cursor-pointer ${
                        quizAnswer[q.id] === opt
                          ? opt === q.correctAnswer
                            ? 'bg-emerald-600 text-white border-emerald-700'
                            : 'bg-rose-600 text-white border-rose-700'
                          : 'bg-slate-50 text-slate-800 border-slate-300'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {quizAnswer[q.id] && (
                  <div className="text-sm font-bold text-amber-900">💡 {q.explanation}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
