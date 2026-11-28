import React, { useState } from 'react';
import { ArrowDown, ArrowUp, Play, RotateCcw } from 'lucide-react';
import { CT_PUZZLES } from '../data/questionBank.js';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const teamLabel = (t) => (t === 'blue' ? 'TEAM BLUE (CYBER TITANS)' : 'TEAM ORANGE (DATA DRAGONS)');

export default function AlgorithmBuilder({ activeTeam, onAward, onSwitchTurn, onNextGame }) {
  const puzzle = CT_PUZZLES.find((p) => p.game === 'C');
  const correctSteps = puzzle.steps;
  const [sequence, setSequence] = useState(() => shuffle(correctSteps));
  const [runIndex, setRunIndex] = useState(-1);
  const [simResult, setSimResult] = useState(null);

  const moveStep = (idx, dir) => {
    const target = idx + dir;
    if (target < 0 || target >= sequence.length) return;
    const copy = [...sequence];
    [copy[idx], copy[target]] = [copy[target], copy[idx]];
    setSequence(copy);
    setSimResult(null);
    setRunIndex(-1);
  };

  const runRobot = () => {
    setSimResult(null);
    let step = 0;
    const iv = setInterval(() => {
      setRunIndex(step);
      if (sequence[step] !== correctSteps[step]) {
        clearInterval(iv);
        const bugHint = step === 0
          ? '🤖 Oops! BYTE tried to pour or mix before boiling water! (+25 learning pts)'
          : `🤖 Debug alert at Step ${step + 1}: "${sequence[step]}" happened too early or too late! (+25 learning pts)`;
        setSimResult({ ok: false, msg: bugHint });
        onAward({ teamId: activeTeam, points: 25, correct: false, concept: 'Algorithm Debugging', misconception: 'Algorithm Step Sequence' });
        return;
      }
      step++;
      if (step >= sequence.length) {
        clearInterval(iv);
        setSimResult({ ok: true, msg: `☕ Perfect! ${teamLabel(activeTeam)} earned +150 pts! BYTE served warm tea!` });
        onAward({ teamId: activeTeam, points: 150, correct: true, earnStar: true, concept: 'Algorithm Design & Sequence', ctChapter: 'Algorithm Design' });
        onSwitchTurn();
      }
    }, 520);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-xl md:text-2xl font-black text-sky-700 m-0">
            🤖 Game C · Algorithm Builder ("Make a Cup of Tea") <span className="text-emerald-700 text-base">Worth +150 pts</span>
          </h3>
          <p className="text-base text-slate-700 m-0">
            Use ↑ / ↓ buttons to arrange BYTE&apos;s instructions, then press <b>Run Robot</b> to test &amp; debug!
          </p>
        </div>
        <button
          type="button"
          onClick={() => { setSequence(shuffle(correctSteps)); setSimResult(null); setRunIndex(-1); }}
          className="px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-300 text-slate-800 font-bold text-sm flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" /> Scramble
        </button>
      </div>

      <div className="space-y-2.5 max-w-3xl mx-auto">
        {sequence.map((stepText, idx) => {
          const active = runIndex === idx;
          const isMatch = simResult?.ok || (active && stepText === correctSteps[idx]);
          const isBug = simResult && !simResult.ok && active;
          return (
            <div
              key={stepText}
              className={`p-3 rounded-2xl border-2 flex items-center justify-between gap-3 transition-all ${
                isBug
                  ? 'border-rose-500 bg-rose-50 animate-shake'
                  : isMatch
                    ? 'border-emerald-500 bg-emerald-50'
                    : active
                      ? 'border-sky-500 bg-sky-50'
                      : 'border-slate-300 bg-white shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-sky-100 border border-sky-300 flex items-center justify-center font-black text-sky-800">
                  {idx + 1}
                </span>
                <span className="font-extrabold text-base md:text-lg text-slate-900">{stepText}</span>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => moveStep(idx, -1)}
                  disabled={idx === 0}
                  className="p-2.5 rounded-xl bg-slate-100 border border-slate-300 text-slate-800 disabled:opacity-30 cursor-pointer"
                  aria-label="Move step up"
                >
                  <ArrowUp className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => moveStep(idx, 1)}
                  disabled={idx === sequence.length - 1}
                  className="p-2.5 rounded-xl bg-slate-100 border border-slate-300 text-slate-800 disabled:opacity-30 cursor-pointer"
                  aria-label="Move step down"
                >
                  <ArrowDown className="w-5 h-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {simResult && (
        <div className={`p-4 rounded-2xl border-2 text-center font-black text-lg ${simResult.ok ? 'border-emerald-500 bg-emerald-50 text-emerald-900' : 'border-rose-500 bg-rose-50 text-rose-900'}`}>
          {simResult.msg}
        </div>
      )}

      <div className="flex justify-center gap-3 flex-wrap">
        <button
          type="button"
          onClick={runRobot}
          className="touch-btn px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-black text-lg flex items-center gap-2 cursor-pointer"
        >
          <Play className="w-5 h-5 fill-white" /> Run Robot BYTE
        </button>
        {simResult?.ok && (
          <button
            type="button"
            onClick={onNextGame}
            className="touch-btn px-6 py-3 rounded-2xl bg-emerald-600 text-white font-black text-lg cursor-pointer"
          >
            Next: Game D (Essential Clue) ▶
          </button>
        )}
      </div>
    </div>
  );
}
