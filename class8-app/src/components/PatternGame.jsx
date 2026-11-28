import React, { useMemo, useState } from 'react';
import { CheckCircle2, Sparkles, Eye } from 'lucide-react';
import ByteGuide from './ByteGuide.jsx';
import { CT_PUZZLES } from '../data/questionBank.js';
import { CT_CHAPTERS } from '../data/ctCurriculum.js';
import AlgorithmBuilder from './AlgorithmBuilder.jsx';
import { shuffle, shuffleDifferent } from '../utils/shuffle.js';

const teamLabel = (t) => (t === 'blue' ? 'TEAM BLUE (CYBER TITANS)' : 'TEAM ORANGE (DATA DRAGONS)');
const otherTeam = (t) => (t === 'blue' ? 'orange' : 'blue');

export default function PatternGame({ activeTeam, onAward, onSwitchTurn, onCompleteMission, revealHint, revealAnswer }) {
  const [gameTab, setGameTab] = useState('A');

  // Game A: Shuffled puzzles + shuffled options per puzzle
  const patternPuzzles = useMemo(
    () => shuffle(CT_PUZZLES.filter((p) => p.game === 'A')).map((p) => ({ ...p, shuffledOpts: shuffle(p.options) })),
    []
  );
  const [patIdx, setPatIdx] = useState(0);
  const [patSelected, setPatSelected] = useState(null);
  const [patSolved, setPatSolved] = useState(false);
  const [patTriedWrong, setPatTriedWrong] = useState([]);
  const [patMissTeams, setPatMissTeams] = useState([]);
  const [patTeacherWait, setPatTeacherWait] = useState(false);

  // Game B: Decomposition
  const decompPuzzle = CT_PUZZLES.find((p) => p.game === 'B');
  const [decompPool] = useState(() => shuffleDifferent(decompPuzzle.steps));
  const [decompPlaced, setDecompPlaced] = useState([]);
  const [decompSel, setDecompSel] = useState(null);
  const [decompMisses, setDecompMisses] = useState({});
  const [decompTeacherSlot, setDecompTeacherSlot] = useState(null);

  // Game D: Abstraction (shuffled clues)
  const absPuzzle = CT_PUZZLES.find((p) => p.game === 'D');
  const [absClues] = useState(() => shuffle(absPuzzle.clues));
  const [absPicked, setAbsPicked] = useState({});

  // CT Bank (shuffled puzzles + shuffled options)
  const bankPuzzles = useMemo(
    () => shuffle(CT_PUZZLES.filter((p) => p.game === 'CT-Bank')).map((p) => ({ ...p, shuffledOpts: shuffle(p.options) })),
    []
  );
  const [bankIdx, setBankIdx] = useState(0);
  const [bankAnswered, setBankAnswered] = useState(false);
  const [bankTriedWrong, setBankTriedWrong] = useState([]);
  const [bankMissTeams, setBankMissTeams] = useState([]);
  const [bankTeacherWait, setBankTeacherWait] = useState(false);

  const [byteMsg, setByteMsg] = useState('Game A: Pattern Detectives! Drag or tap the missing tile into the [ ? ] slot.');

  const curPat = patternPuzzles[patIdx];

  const solvePattern = (choice) => {
    if (patSolved || patTeacherWait || patTriedWrong.includes(choice)) return;
    setPatSelected(null);
    if (choice === curPat.correctAnswer) {
      setPatSolved(true);
      onAward({ teamId: activeTeam, points: curPat.points, correct: true, concept: curPat.concept, ctChapter: curPat.chapter });
      setByteMsg(`✅ ${teamLabel(activeTeam)} +${curPat.points} pts! ${curPat.chapter}: ${curPat.explanation}`);
      onSwitchTurn();
    } else {
      const nextWrong = [...patTriedWrong, choice];
      const nextMiss = patMissTeams.includes(activeTeam) ? patMissTeams : [...patMissTeams, activeTeam];
      setPatTriedWrong(nextWrong);
      setPatMissTeams(nextMiss);
      onAward({ teamId: activeTeam, points: 0, correct: false, concept: curPat.concept, misconception: curPat.concept });
      if (nextMiss.length >= 2) {
        setPatTeacherWait(true);
        setByteMsg('👩‍🏫 Both teams missed! Answer stays hidden — Teacher, click below to reveal & explain!');
      } else {
        onSwitchTurn();
        setByteMsg(`❌ "${choice}" is not right! Turn passes to ${teamLabel(otherTeam(activeTeam))} without revealing the answer!`);
      }
    }
  };

  const teacherRevealPat = () => {
    setPatTeacherWait(false);
    setPatSolved(true);
    setByteMsg(`👩‍🏫 Teacher Reveal: ${curPat.correctAnswer}. ${curPat.explanation}`);
    onSwitchTurn();
  };

  const nextPattern = () => {
    if (patIdx + 1 < patternPuzzles.length) {
      setPatIdx((i) => i + 1);
      setPatSolved(false);
      setPatTriedWrong([]);
      setPatMissTeams([]);
      setPatTeacherWait(false);
      setByteMsg('Next pattern puzzle! Watch the sequence carefully.');
    } else {
      setGameTab('B');
      setByteMsg('Game B (+50 pts/step + 100 bonus): Decomposition! Break "Organise a school science exhibition" into 5 ordered steps!');
    }
  };

  const placeDecompStep = (stepText, slotIdx) => {
    if (decompPlaced[slotIdx] || decompTeacherSlot !== null) return;
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
      const prev = decompMisses[slotIdx] || [];
      const nextM = prev.includes(activeTeam) ? prev : [...prev, activeTeam];
      setDecompMisses({ ...decompMisses, [slotIdx]: nextM });
      onAward({ teamId: activeTeam, points: 0, correct: false, concept: 'Decomposition', misconception: 'Task Sequencing' });
      if (nextM.length >= 2) {
        setDecompTeacherSlot(slotIdx);
        setByteMsg(`👩‍🏫 Both teams missed Step ${slotIdx + 1}! Teacher, click below to reveal Step ${slotIdx + 1}!`);
      } else {
        onSwitchTurn();
        setByteMsg(`❌ Not Step ${slotIdx + 1}! Turn passes to ${teamLabel(otherTeam(activeTeam))}!`);
      }
    }
  };

  const teacherRevealDecomp = () => {
    const idx = decompTeacherSlot;
    if (idx === null) return;
    const next = [...decompPlaced];
    next[idx] = decompPuzzle.steps[idx];
    setDecompPlaced(next);
    setDecompTeacherSlot(null);
    setByteMsg(`👩‍🏫 Teacher Reveal — Step ${idx + 1} is "${decompPuzzle.steps[idx]}".`);
    onSwitchTurn();
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
      onSwitchTurn();
      setByteMsg(`🚫 "${clue.text}" is irrelevant noise! Turn passes to ${teamLabel(otherTeam(activeTeam))}!`);
    }
  };

  const curBank = bankPuzzles[bankIdx];
  const answerBank = (opt) => {
    if (bankAnswered || bankTeacherWait || bankTriedWrong.includes(opt)) return;
    if (opt === curBank.correctAnswer) {
      setBankAnswered(true);
      onAward({ teamId: activeTeam, points: curBank.points, correct: true, concept: curBank.concept, ctChapter: curBank.chapter });
      setByteMsg(`✅ ${teamLabel(activeTeam)} +${curBank.points} pts! ${curBank.chapter}: ${curBank.explanation}`);
      onSwitchTurn();
    } else {
      const nextW = [...bankTriedWrong, opt];
      const nextM = bankMissTeams.includes(activeTeam) ? bankMissTeams : [...bankMissTeams, activeTeam];
      setBankTriedWrong(nextW);
      setBankMissTeams(nextM);
      onAward({ teamId: activeTeam, points: 0, correct: false, concept: curBank.concept, misconception: curBank.concept });
      if (nextM.length >= 2) {
        setBankTeacherWait(true);
        setByteMsg('👩‍🏫 Both teams missed! Teacher, click below to reveal & explain the answer!');
      } else {
        onSwitchTurn();
        setByteMsg(`❌ Not "${opt}"! Turn passes to ${teamLabel(otherTeam(activeTeam))} — answer still hidden!`);
      }
    }
  };

  const teacherRevealBank = () => {
    setBankTeacherWait(false);
    setBankAnswered(true);
    setByteMsg(`👩‍🏫 Teacher Reveal: ${curBank.correctAnswer}. ${curBank.explanation}`);
    onSwitchTurn();
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

      <ByteGuide message={byteMsg} mood={patTeacherWait || bankTeacherWait || decompTeacherSlot !== null ? 'alert' : 'happy'} compact />

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
              {patSolved ? '✅ Pattern Solved!' : 'Drop or tap a shuffled tile below into this panel!'}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {curPat.shuffledOpts.map((opt) => {
              const wrongTried = patTriedWrong.includes(opt);
              const isRight = patSolved && opt === curPat.correctAnswer;
              return (
                <button
                  key={opt}
                  type="button"
                  draggable={!patSolved && !patTeacherWait && !wrongTried}
                  onDragStart={(e) => { e.dataTransfer.setData('text/plain', opt); setPatSelected(opt); }}
                  onClick={() => solvePattern(opt)}
                  disabled={patSolved || patTeacherWait || wrongTried}
                  className={`touch-btn py-4 px-4 rounded-2xl border-2 border-b-4 font-black text-xl cursor-pointer shadow-sm ${
                    isRight
                      ? 'bg-emerald-600 text-white border-emerald-700'
                      : wrongTried
                        ? 'bg-rose-100 text-rose-700 border-rose-300 opacity-60 line-through'
                        : 'bg-white text-slate-900 border-slate-300 hover:border-sky-500'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {patTeacherWait && (
            <div className="flex justify-center">
              <button type="button" onClick={teacherRevealPat} className="touch-btn px-6 py-3 rounded-2xl bg-indigo-600 text-white font-black text-lg flex items-center gap-2 cursor-pointer">
                <Eye className="w-5 h-5" /> 👩‍🏫 Teacher: Reveal Answer &amp; Explain
              </button>
            </div>
          )}

          {patSolved && (
            <div className="flex justify-center">
              <button type="button" onClick={nextPattern} className="touch-btn px-6 py-3 rounded-2xl bg-sky-600 text-white font-black text-lg cursor-pointer">
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
          {decompTeacherSlot !== null && (
            <div className="flex justify-center">
              <button type="button" onClick={teacherRevealDecomp} className="touch-btn px-6 py-3 rounded-2xl bg-indigo-600 text-white font-black text-lg flex items-center gap-2 cursor-pointer">
                <Eye className="w-5 h-5" /> 👩‍🏫 Teacher: Reveal Step {decompTeacherSlot + 1}
              </button>
            </div>
          )}
          <div className="rounded-2xl p-3 bg-slate-100 border-2 border-dashed border-slate-300 flex flex-wrap gap-2 justify-center">
            {decompPool.filter((s) => !decompPlaced.includes(s)).map((s) => (
              <button
                key={s}
                type="button"
                draggable={decompTeacherSlot === null}
                onDragStart={(e) => { e.dataTransfer.setData('text/plain', s); setDecompSel(s); }}
                onClick={() => setDecompSel(decompSel === s ? null : s)}
                className={`touch-btn px-4 py-2.5 rounded-2xl border-2 border-b-4 font-black text-base cursor-grab ${
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
              Tap ONLY the essential clues needed to allocate school buses (clues are shuffled!).
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {absClues.map((c) => {
              const picked = absPicked[c.id];
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => toggleClue(c)}
                  className={`touch-btn p-4 rounded-2xl border-2 border-b-4 text-left font-bold text-lg flex items-center justify-between gap-2 cursor-pointer ${
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
          <div className="rounded-2xl p-5 bg-indigo-50 border-2 border-indigo-300 space-y-4">
            <div className="text-sm font-black text-sky-800">
              Chapter: {curBank.chapter} · Challenge {bankIdx + 1}/{bankPuzzles.length} · <span className="text-emerald-700">Worth +{curBank.points} pts</span>
            </div>
            <div className="text-xl md:text-2xl font-black text-slate-900">{curBank.instructions}</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {curBank.shuffledOpts.map((opt) => {
                const wrongTried = bankTriedWrong.includes(opt);
                const isRight = bankAnswered && opt === curBank.correctAnswer;
                return (
                  <button
                    key={opt}
                    type="button"
                    disabled={bankAnswered || bankTeacherWait || wrongTried}
                    onClick={() => answerBank(opt)}
                    className={`touch-btn p-4 rounded-2xl border-2 border-b-4 font-black text-lg cursor-pointer shadow-sm ${
                      isRight
                        ? 'bg-emerald-600 text-white border-emerald-700'
                        : wrongTried
                          ? 'bg-rose-100 text-rose-700 border-rose-300 opacity-60 line-through'
                          : 'bg-white text-slate-900 border-slate-300'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            {bankTeacherWait && (
              <div className="flex justify-center">
                <button type="button" onClick={teacherRevealBank} className="touch-btn px-6 py-3 rounded-2xl bg-indigo-600 text-white font-black text-lg flex items-center gap-2 cursor-pointer">
                  <Eye className="w-5 h-5" /> 👩‍🏫 Teacher: Reveal Answer &amp; Explain
                </button>
              </div>
            )}
            {bankAnswered && (
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setBankIdx((i) => (i + 1) % bankPuzzles.length);
                    setBankAnswered(false);
                    setBankTriedWrong([]);
                    setBankMissTeams([]);
                    setBankTeacherWait(false);
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
