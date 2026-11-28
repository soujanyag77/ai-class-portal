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

const teamLabel = (t) => (t === 'blue' ? 'TEAM BLUE (CYBER TITANS)' : 'TEAM ORANGE (DATA DRAGONS)');

export default function PatternGame({ activeTeam, onAward, onSwitchTurn, onCompleteMission, revealHint, revealAnswer }) {
  const [gameTab, setGameTab] = useState('A');
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
      setByteMsg(`✅ ${teamLabel(activeTeam)} +${curPat.points} pts! ${curPat.chapter}: ${curPat.explanation}`);
      onSwitchTurn();
    } else {
      onAward({ teamId: activeTeam, points: 25, correct: false, concept: curPat.concept, misconception: curPat.concept });
      setByteMsg(`❌ ${teamLabel(activeTeam)} (+25 learning pts) — Not ${choice}! Look carefully at how each step changes.`);
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
      setByteMsg(`✅ ${teamLabel(activeTeam)} +50 pts! Step ${slotIdx + 1} in place: "${stepText}"`);
      if (next.filter(Boolean).length === decompPuzzle.steps.length) {
        onAward({ teamId: activeTeam, points: 100, correct: true, earnStar: true, concept: 'Decomposition' });
        setByteMsg(`🎉 Decomposition complete! ${teamLabel(activeTeam)} +100 bonus pts! ${decompPuzzle.explanation}`);
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
      setByteMsg(`✅ ${teamLabel(activeTeam)} +50 pts! Essential clue found: "${clue.text}"`);
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
      setByteMsg(`✅ ${teamLabel(activeTeam)} +${curBank.points} pts! ${curBank.chapter}: ${curBank.explanation}`);
      onSwitchTurn();
    } else {
      onAward({ teamId: activeTeam, points: 25, correct: false, concept: curBank.concept, misconception: curBank.concept });
      setByteMsg(`❌ ${teamLabel(activeTeam)} (+25 learning pts) — Answer: ${curBank.correctAnswer}. ${curBank.explanation}`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-2xl md:text-3xl font-black text-indigo-700 m-0">
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
                gameTab === t.id ? 'bg-indigo-600 text-white border-indigo-700' : 'bg-slate-100 text-slate-800 border-slate-300'
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
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full bg-indigo-100 border border-indigo-300 text-indigo-900 font-bold text-sm">
              Chapter: {curPat.chapter} · Puzzle {patIdx + 1}/{patternPuzzles.length} · <b className="text-emerald-700">Worth +{curPat.points} pts</b>
            </span>
            {revealHint && <span className="text-amber-700 font-bold text-sm">💡 {curPat.explanation.split('.')[0]}</span>}
            {revealAnswer && <span className="text-emerald-700 font-bold text-sm">👩‍🏫 Answer: {curPat.correctAnswer}</span>}
          </div>

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const val = e.dataTransfer.getData('text/plain') || patSelected;
              if (val) solvePattern(val);
            }}
            onClick={() => patSelected && solvePattern(patSelected)}
            className="rounded-3xl p-6 text-center bg-indigo-50 border-2 border-indigo-300 cursor-pointer"
          >
            <div className="text-lg font-bold text-slate-700 mb-2">{curPat.instructions}</div>
            <div className="text-2xl md:text-4xl font-black text-slate-900 tracking-wide py-3">
              {patSolved ? `${curPat.prompt.replace('?', curPat.correctAnswer)}` : curPat.prompt}
            </div>
            <div className="text-sm font-bold text-sky-700">
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
                className={`touch-btn py-4 px-4 rounded-2xl border-2 font-black text-xl cursor-pointer shadow-sm ${
                  patSolved && opt === curPat.correctAnswer
                    ? 'bg-emerald-600 text-white border-emerald-700'
                    : 'bg-white text-slate-900 border-slate-300 hover:border-sky-500'
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
                    setByteMsg('Game B (+50 pts/step + 100 bonus): Decomposition! Break "Organise a school science exhibition" into 5 ordered steps!');
                  }
                }}
                className="touch-btn px-6 py-3 rounded-2xl bg-sky-600 text-white font-black text-lg cursor-pointer"
              >
                {patIdx + 1 < patternPuzzles.length ? 'Next Pattern Puzzle ▶' : 'Move to Game B: Decomposition ▶'}
              </button>
            </div>
          )}
        </div>
      )}

      {gameTab === 'B' && (
        <div className="space-y-4">
          <div className="p-3 rounded-2xl bg-indigo-100 border border-indigo-300 text-center text-xl font-black text-indigo-950">
            🎯 Big Problem: "Organise a school science exhibition." <span className="text-emerald-700 text-base">(+50 pts/step)</span>
          </div>
          <div className="rounded-2xl p-3 bg-slate-100 border-2 border-dashed border-slate-300 flex flex-wrap gap-2 justify-center">
            {decompPool.filter((s) => !decompPlaced.includes(s)).map((s) => (
              <button
                key={s}
                type="button"
                draggable
                onDragStart={(e) => { e.dataTransfer.setData('text/plain', s); setDecompSel(s); }}
                onClick={() => setDecompSel(decompSel === s ? null : s)}
                className={`touch-btn px-4 py-2.5 rounded-2xl border-2 font-black text-base cursor-grab ${
                  decompSel === s ? 'bg-sky-600 text-white border-sky-800' : 'bg-white text-slate-900 border-slate-300 shadow-sm'
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
                  decompPlaced[idx] ? 'border-emerald-500 bg-emerald-50 border-solid' : 'border-slate-300 bg-slate-50'
                }`}
              >
                <span className="text-xs font-black text-sky-700">STEP {idx + 1}</span>
                <span className="font-extrabold text-base text-slate-900 mt-1">
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
          <div className="p-4 rounded-2xl bg-sky-50 border-2 border-sky-300 text-center">
            <h3 className="text-xl md:text-2xl font-black text-sky-800 m-0">
              🚌 Find the Essential Clue (Abstraction) · <span className="text-emerald-700">+50 pts/clue</span>
            </h3>
            <p className="text-lg text-slate-700 mt-1 mb-0">
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
                    picked ? 'bg-emerald-50 border-emerald-500 text-emerald-950' : 'bg-white border-slate-300 text-slate-900 shadow-sm'
                  }`}
                >
                  <span>{c.text}</span>
                  {picked && <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />}
                </button>
              );
            })}
          </div>
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => onCompleteMission(2, 'ct_master', true)}
              className="touch-btn px-6 py-3 rounded-2xl bg-emerald-600 text-white font-black text-lg flex items-center gap-2 cursor-pointer"
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
              <span key={ch.id} className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-300 text-xs font-bold text-slate-800">
                {ch.icon} {ch.number}. {ch.title}
              </span>
            ))}
          </div>
          <div className="rounded-2xl p-5 bg-indigo-50 border-2 border-indigo-300">
            <div className="text-sm font-black text-sky-800 mb-1">
              Chapter: {curBank.chapter} · Challenge {bankIdx + 1}/{bankPuzzles.length} · <span className="text-emerald-700">Worth +{curBank.points} pts</span>
            </div>
            <div className="text-xl md:text-2xl font-black text-slate-900 mb-4">{curBank.instructions}</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {curBank.options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  disabled={bankAnswered}
                  onClick={() => answerBank(opt)}
                  className={`touch-btn p-4 rounded-2xl border-2 font-black text-lg cursor-pointer shadow-sm ${
                    bankAnswered && opt === curBank.correctAnswer
                      ? 'bg-emerald-600 text-white border-emerald-700'
                      : 'bg-white text-slate-900 border-slate-300'
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
                  className="px-5 py-2.5 rounded-xl bg-sky-600 text-white font-black cursor-pointer"
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
