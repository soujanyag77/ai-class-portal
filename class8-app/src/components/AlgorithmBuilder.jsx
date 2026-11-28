import React, { useMemo, useState } from 'react';
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

export default function AlgorithmBuilder({ activeTeam, onAward, onSwitchTurn, onNextGame }) {
  const puzzle = CT_PUZZLES.find((p) => p.game === 'C');
  const correctSteps = puzzle.steps;
  const [sequence, setSequence] = useState(() => shuffle(correctSteps));
  const [runIndex, setRunIndex] = useState(-1);
  const [simResult, setSimResult] = useState(null); // { ok, msg }

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
          ? '🤖 Oops! BYTE tried to pour or mix before boiling water!'
          : `🤖 Debug alert at Step ${step + 1}: "${sequence[step]}" happened too early or too late!`;
        setSimResult({ ok: false, msg: bugHint });
        onAward({ teamId: activeTeam, points: 25, correct: false, concept: 'Algorithm Debugging', misconception: 'Algorithm Step Sequence' });
        return;
      }
      step++;
      if (step >= sequence.length) {
        clearInterval(iv);
        setSimResult({ ok: true, msg: '☕ Perfect! BYTE followed every step cleanly and served warm tea! (+150 pts)' });
        onAward({ teamId: activeTeam, points: 150, correct: true, earnStar: true, concept: 'Algorithm Design & Sequence', ctChapter: 'Algorithm Design' });
        onSwitchTurn();
      }
    }, 520);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-xl md:text-2xl font-black text-cyan-300 m-0">
            🤖 Game C · Algorithm Builder ("Make a Cup of Tea")
          </h3>
          <p className="text-base text-slate-300 m-0">
            Use ↑ / ↓ buttons to arrange BYTE&apos;s instructions, then press <b>Run Robot</b> to test &amp; debug!
          </p>
        </div>
        <button
          type="button"
          onClick={() => { setSequence(shuffle(correctSteps)); setSimResult(null); setRunIndex(-1); }}
          className="px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-600 text-slate-200 font-bold text-sm flex items-center gap-1 cursor-pointer"
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
                  ? 'border-rose-400 bg-rose-500/20 animate-shake'
                  : isMatch
                    ? 'border-emerald-400 bg-emerald-500/20'
                    : active
                      ? 'border-cyan-400 bg-cyan-500/20'
                      : 'border-slate-600 bg-slate-900/75'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-600 flex items-center justify-center font-black text-cyan-300">
                  {idx + 1}
                </span>
                <span className="font-extrabold text-base md:text-lg text-white">{stepText}</span>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => moveStep(idx, -1)}
                  disabled={idx === 0}
                  className="p-2.5 rounded-xl bg-slate-800 border border-slate-600 text-slate-100 disabled:opacity-30 cursor-pointer"
                  aria-label="Move step up"
                >
                  <ArrowUp className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => moveStep(idx, 1)}
                  disabled={idx === sequence.length - 1}
                  className="p-2.5 rounded-xl bg-slate-800 border border-slate-600 text-slate-100 disabled:opacity-30 cursor-pointer"
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
        <div className={`p-4 rounded-2xl border-2 text-center font-black text-lg ${simResult.ok ? 'border-emerald-400 bg-emerald-500/15 text-emerald-200' : 'border-rose-400 bg-rose-500/15 text-rose-200'}`}>
          {simResult.msg}
        </div>
      )}

      <div className="flex justify-center gap-3 flex-wrap">
        <button
          type="button"
          onClick={runRobot}
          className="touch-btn px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black text-lg flex items-center gap-2 cursor-pointer"
        >
          <Play className="w-5 h-5 fill-slate-950" /> Run Robot BYTE
        </button>
        {simResult?.ok && (
          <button
            type="button"
            onClick={onNextGame}
            className="touch-btn px-6 py-3 rounded-2xl bg-emerald-400 text-slate-950 font-black text-lg cursor-pointer"
          >
            Next: Game D (Essential Clue) ▶
          </button>
        )}
      </div>
    </div>
  );
}
