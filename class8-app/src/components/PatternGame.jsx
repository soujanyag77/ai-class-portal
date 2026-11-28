import React, { useMemo, useState } from 'react';
import { CheckCircle2, Sparkles } from 'lucide-react';
import ByteGuide from './ByteGuide.jsx';
import { CT_PUZZLES } from '../data/questionBank.js';
import { CT_CHAPTERS } from '../data/ctCurriculum.js';
import AlgorithmBuilder from './AlgorithmBuilder.jsx';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function PatternGame({ activeTeam, onAward, onSwitchTurn, onCompleteMission, revealHint, revealAnswer }) {
  const [gameTab, setGameTab] = useState('A'); // A, B, C, D, BANK
  const patternPuzzles = useMemo(() => CT_PUZZLES.filter((p) => p.game === 'A'), []);
  const [patIdx, setPatIdx] = useState(0);
  const [patSelected, setPatSelected] = useState(null);
  const [patSolved, setPatSolved] = useState(false);

  const decompPuzzle = CT_PUZZLES.find((p) => p.game === 'B');
  const [decompPool] = useState(() => shuffle(decompPuzzle.steps));
  const [decompPlaced, setDecompPlaced] = useState([]);
  const [decompSel, setDecompSel] = useState(null);

  const absPuzzle = CT_PUZZLES.find((p) => p.game === 'D');
  const [absPicked, setAbsPicked] = useState({});

  const bankPuzzles = useMemo(() => CT_PUZZLES.filter((p) => p.game === 'CT-Bank'), []);
  const [bankIdx, setBankIdx] = useState(0);
  const [bankAnswered, setBankAnswered] = useState(false);

  const [byteMsg, setByteMsg] = useState('Game A: Pattern Detectives! Drag or tap the missing tile into the [ ? ] slot.');

  const curPat = patternPuzzles[patIdx];

  const solvePattern = (choice) => {
    if (patSolved) return;
    setPatSelected(null);
    if (choice === curPat.correctAnswer) {
      setPatSolved(true);
      onAward({ teamId: activeTeam, points: curPat.points, correct: true, concept: curPat.concept, ctChapter: curPat.chapter });
      setByteMsg(`✅ ${curPat.chapter}: ${curPat.explanation}`);
      onSwitchTurn();
    } else {
      onAward({ teamId: activeTeam, points: 25, correct: false, concept: curPat.concept, misconception: curPat.concept });
      setByteMsg(`❌ Not ${choice}! Look carefully at how each step changes.`);
    }
  };

  const placeDecompStep = (stepText, slotIdx) => {
    if (decompPlaced[slotIdx]) return;
    setDecompSel(null);
    const expected = decompPuzzle.steps[slotIdx];
    if (stepText === expected) {
      const next = [...decompPlaced];
      next[slotIdx] = stepText;
      setDecompPlaced(next);
      onAward({ teamId: activeTeam, points: 50, correct: true, concept: 'Decomposition', ctChapter: decompPuzzle.chapter });
      setByteMsg(`✅ Step ${slotIdx + 1} in place: "${stepText}"`);
      if (next.filter(Boolean).length === decompPuzzle.steps.length) {
        onAward({ teamId: activeTeam, points: 100, correct: true, earnStar: true, concept: 'Decomposition' });
        setByteMsg(`🎉 Decomposition complete! ${decompPuzzle.explanation}`);
        onSwitchTurn();
      }
    } else {
      onAward({ teamId: activeTeam, points: 0, correct: false, concept: 'Decomposition', misconception: 'Task Sequencing' });
      setByteMsg(`❌ Think: what must happen at Step ${slotIdx + 1} before the next task?`);
    }
  };

  const toggleClue = (clue) => {
    if (absPicked[clue.id]) return;
    if (clue.essential) {
      const next = { ...absPicked, [clue.id]: true };
      setAbsPicked(next);
      onAward({ teamId: activeTeam, points: 50, correct: true, concept: 'Abstraction', ctChapter: absPuzzle.chapter });
      setByteMsg(`✅ Essential clue found: "${clue.text}"`);
      const essentialTotal = absPuzzle.clues.filter((c) => c.essential).length;
      if (Object.keys(next).length === essentialTotal) {
        onCompleteMission(2, 'ct_master');
        setByteMsg(`🏆 Abstraction Mastered! ${absPuzzle.explanation}`);
      }
    } else {
      onAward({ teamId: activeTeam, points: 0, correct: false, concept: 'Abstraction', misconception: 'Irrelevant details' });
      setByteMsg(`🚫 "${clue.text}" is irrelevant noise! Abstraction ignores details that don't affect bus count.`);
    }
  };

  const curBank = bankPuzzles[bankIdx];
  const answerBank = (opt) => {
    if (bankAnswered) return;
    setBankAnswered(true);
    if (opt === curBank.correctAnswer) {
      onAward({ teamId: activeTeam, points: curBank.points, correct: true, concept: curBank.concept, ctChapter: curBank.chapter });
      setByteMsg(`✅ ${curBank.chapter}: ${curBank.explanation}`);
      onSwitchTurn();
    } else {
      onAward({ teamId: activeTeam, points: 25, correct: false, concept: curBank.concept, misconception: curBank.concept });
      setByteMsg(`❌ Answer: ${curBank.correctAnswer}. ${curBank.explanation}`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-2xl md:text-3xl font-black text-indigo-300 m-0">
          🧩 Mission 2 · Computational Thinking Challenge
        </h2>
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'A', label: 'A. Patterns' },
            { id: 'B', label: 'B. Break It Down!' },
            { id: 'C', label: 'C. Algorithm Robot' },
            { id: 'D', label: 'D. Essential Clue' },
            { id: 'BANK', label: '📚 7 CT Chapters' }
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setGameTab(t.id)}
              className={`px-3.5 py-2 rounded-xl font-black text-sm border-2 cursor-pointer ${
                gameTab === t.id ? 'bg-indigo-400 text-slate-950 border-indigo-200' : 'bg-slate-800 text-slate-200 border-slate-600'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <ByteGuide message={byteMsg} mood="happy" compact />

      {gameTab === 'A' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/50 text-indigo-200 font-bold text-sm">
              Chapter: {curPat.chapter} · Puzzle {patIdx + 1}/{patternPuzzles.length}
            </span>
            {revealHint && <span className="text-amber-300 font-bold text-sm">💡 {curPat.explanation.split('.')[0]}</span>}
            {revealAnswer && <span className="text-emerald-300 font-bold text-sm">👩‍🏫 Answer: {curPat.correctAnswer}</span>}
          </div>

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const val = e.dataTransfer.getData('text/plain') || patSelected;
              if (val) solvePattern(val);
            }}
            onClick={() => patSelected && solvePattern(patSelected)}
            className="glass-panel rounded-3xl p-6 text-center border-2 border-indigo-400/50 cursor-pointer"
          >
            <div className="text-lg font-bold text-slate-300 mb-2">{curPat.instructions}</div>
            <div className="text-2xl md:text-4xl font-black text-white tracking-wide py-3">
              {patSolved ? `${curPat.prompt.replace('?', curPat.correctAnswer)}` : curPat.prompt}
            </div>
            <div className="text-sm font-bold text-cyan-300">
              {patSolved ? '✅ Pattern Solved!' : 'Drop or tap a tile below into this panel!'}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {curPat.options.map((opt) => (
              <button
                key={opt}
                type="button"
                draggable={!patSolved}
                onDragStart={(e) => { e.dataTransfer.setData('text/plain', opt); setPatSelected(opt); }}
                onClick={() => solvePattern(opt)}
                disabled={patSolved}
                className={`touch-btn py-4 px-4 rounded-2xl border-2 font-black text-xl cursor-pointer ${
                  patSolved && opt === curPat.correctAnswer
                    ? 'bg-emerald-500 text-slate-950 border-emerald-300'
                    : 'bg-slate-800 text-white border-slate-600 hover:border-cyan-400'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          {patSolved && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => {
                  if (patIdx + 1 < patternPuzzles.length) {
                    setPatIdx((i) => i + 1);
                    setPatSolved(false);
                  } else {
                    setGameTab('B');
                    setByteMsg('Game B: Decomposition! Break "Organise a school science exhibition" into 5 ordered steps!');
                  }
                }}
                className="touch-btn px-6 py-3 rounded-2xl bg-cyan-400 text-slate-950 font-black text-lg cursor-pointer"
              >
                {patIdx + 1 < patternPuzzles.length ? 'Next Pattern Puzzle ▶' : 'Move to Game B: Decomposition ▶'}
              </button>
            </div>
          )}
        </div>
      )}

      {gameTab === 'B' && (
        <div className="space-y-4">
          <div className="p-3 rounded-2xl bg-indigo-500/20 border border-indigo-400/50 text-center text-xl font-black text-white">
            🎯 Big Problem: "Organise a school science exhibition."
          </div>
          <div className="glass-panel rounded-2xl p-3 flex flex-wrap gap-2 justify-center">
            {decompPool.filter((s) => !decompPlaced.includes(s)).map((s) => (
              <button
                key={s}
                type="button"
                draggable
                onDragStart={(e) => { e.dataTransfer.setData('text/plain', s); setDecompSel(s); }}
                onClick={() => setDecompSel(decompSel === s ? null : s)}
                className={`touch-btn px-4 py-2.5 rounded-2xl border-2 font-black text-base cursor-grab ${
                  decompSel === s ? 'bg-cyan-400 text-slate-950 border-white' : 'bg-slate-800 text-white border-slate-600'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
            {decompPuzzle.steps.map((_, idx) => (
              <div
                key={idx}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const val = e.dataTransfer.getData('text/plain') || decompSel;
                  if (val) placeDecompStep(val, idx);
                }}
                onClick={() => decompSel && placeDecompStep(decompSel, idx)}
                className={`rounded-2xl p-3 border-2 border-dashed min-h-[100px] flex flex-col justify-center items-center text-center cursor-pointer ${
                  decompPlaced[idx] ? 'border-emerald-400 bg-emerald-500/15 border-solid' : 'border-slate-600 bg-slate-900/60'
                }`}
              >
                <span className="text-xs font-black text-cyan-300">STEP {idx + 1}</span>
                <span className="font-extrabold text-base text-white mt-1">
                  {decompPlaced[idx] || 'Drop task here'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {gameTab === 'C' && (
        <AlgorithmBuilder
          activeTeam={activeTeam}
          onAward={onAward}
          onSwitchTurn={onSwitchTurn}
          onNextGame={() => setGameTab('D')}
        />
      )}

      {gameTab === 'D' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900/80 border-2 border-cyan-400/50 text-center">
            <h3 className="text-xl md:text-2xl font-black text-cyan-300 m-0">
              🚌 Find the Essential Clue (Abstraction)
            </h3>
            <p className="text-lg text-slate-200 mt-1 mb-0">
              Tap ONLY the essential clues needed to allocate school buses (ignore distracting facts!).
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {absPuzzle.clues.map((c) => {
              const picked = absPicked[c.id];
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => toggleClue(c)}
                  className={`touch-btn p-4 rounded-2xl border-2 text-left font-bold text-lg flex items-center justify-between gap-2 cursor-pointer ${
                    picked ? 'bg-emerald-500/20 border-emerald-400 text-emerald-100' : 'bg-slate-800/90 border-slate-600 text-slate-100'
                  }`}
                >
                  <span>{c.text}</span>
                  {picked && <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />}
                </button>
              );
            })}
          </div>
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => onCompleteMission(2, 'ct_master', true)}
              className="touch-btn px-6 py-3 rounded-2xl bg-emerald-400 text-slate-950 font-black text-lg flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-5 h-5" /> Complete Mission 2 ▶
            </button>
          </div>
        </div>
      )}

      {gameTab === 'BANK' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-1.5">
            {CT_CHAPTERS.map((ch) => (
              <span key={ch.id} className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-600 text-xs font-bold text-slate-200">
                {ch.icon} {ch.number}. {ch.title}
              </span>
            ))}
          </div>
          <div className="glass-panel rounded-2xl p-5 border-indigo-400/50">
            <div className="text-sm font-black text-cyan-300 mb-1">
              Chapter: {curBank.chapter} · Challenge {bankIdx + 1}/{bankPuzzles.length}
            </div>
            <div className="text-xl md:text-2xl font-black text-white mb-4">{curBank.instructions}</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {curBank.options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  disabled={bankAnswered}
                  onClick={() => answerBank(opt)}
                  className={`touch-btn p-4 rounded-2xl border-2 font-black text-lg cursor-pointer ${
                    bankAnswered && opt === curBank.correctAnswer
                      ? 'bg-emerald-500 text-slate-950 border-emerald-300'
                      : 'bg-slate-800 text-white border-slate-600'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            {bankAnswered && (
              <div className="mt-4 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setBankIdx((i) => (i + 1) % bankPuzzles.length);
                    setBankAnswered(false);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-cyan-400 text-slate-950 font-black cursor-pointer"
                >
                  Next CT Chapter Puzzle ▶
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
