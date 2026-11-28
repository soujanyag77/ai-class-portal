import React, { useMemo, useState } from 'react';
import { Scale, Shield, Award, Eye } from 'lucide-react';
import ByteGuide from './ByteGuide.jsx';
import { ETHICS_CASES } from '../data/questionBank.js';
import { SCORE_VALUES } from '../utils/scoring.js';
import { shuffle } from '../utils/shuffle.js';

const teamLabel = (t) => (t === 'blue' ? 'TEAM BLUE (CYBER TITANS)' : 'TEAM ORANGE (DATA DRAGONS)');
const otherTeam = (t) => (t === 'blue' ? 'orange' : 'blue');

export default function EthicsCourtroom({ activeTeam, onAward, onSwitchTurn, onCompleteMission }) {
  const cases = useMemo(
    () => shuffle(ETHICS_CASES).slice(0, 5).map((c) => ({ ...c, shuffledActions: shuffle(c.actions) })),
    []
  );
  const [caseIdx, setCaseIdx] = useState(0);

  // Step 1 (Verdict) state
  const [verdictPicked, setVerdictPicked] = useState(false);
  const [verdictWrongTried, setVerdictWrongTried] = useState([]);
  const [verdictMissTeams, setVerdictMissTeams] = useState([]);
  const [verdictTeacherWait, setVerdictTeacherWait] = useState(false);

  // Step 2 (Ethical Action) state
  const [actionPicked, setActionPicked] = useState(false);
  const [actionWrongTried, setActionWrongTried] = useState([]);
  const [actionMissTeams, setActionMissTeams] = useState([]);
  const [actionTeacherWait, setActionTeacherWait] = useState(false);

  const [shields, setShields] = useState(0);
  const [byteMsg, setByteMsg] = useState('Order in the AI Ethics Courtroom! First judge the case (+100 pts), then choose the best ethical action (+50 bonus).');

  const cur = cases[caseIdx];

  const chooseVerdict = (v) => {
    if (verdictPicked || verdictTeacherWait || verdictWrongTried.includes(v)) return;
    if (v === cur.verdict) {
      setVerdictPicked(true);
      onAward({ teamId: activeTeam, points: SCORE_VALUES.CORRECT, correct: true, concept: cur.principle, aiChapter: 'ai-ch4' });
      setByteMsg(`⚖️ ${teamLabel(activeTeam)} +100 pts! Sound judgement (${cur.verdict})! Now select the best ethical action below.`);
    } else {
      const nextW = [...verdictWrongTried, v];
      const nextM = verdictMissTeams.includes(activeTeam) ? verdictMissTeams : [...verdictMissTeams, activeTeam];
      setVerdictWrongTried(nextW);
      setVerdictMissTeams(nextM);
      onAward({ teamId: activeTeam, points: 0, correct: false, concept: cur.principle, misconception: `Ethics Case: ${cur.principle}` });
      if (nextM.length >= 2) {
        setVerdictTeacherWait(true);
        setByteMsg('👩‍🏫 Both teams missed the verdict! Answer hidden — Teacher, click below to reveal the ruling!');
      } else {
        onSwitchTurn();
        setByteMsg(`❌ Not "${v}"! Turn passes to ${teamLabel(otherTeam(activeTeam))} without revealing the ruling!`);
      }
    }
  };

  const teacherRevealVerdict = () => {
    setVerdictTeacherWait(false);
    setVerdictPicked(true);
    setByteMsg(`👩‍🏫 Teacher Reveal — Verdict is "${cur.verdict}". Now choose the best ethical action!`);
    onSwitchTurn();
  };

  const chooseAction = (act) => {
    if (actionPicked || actionTeacherWait || actionWrongTried.includes(act)) return;
    if (act === cur.bestAction) {
      setActionPicked(true);
      setShields((s) => s + 1);
      onAward({ teamId: activeTeam, points: SCORE_VALUES.EXPLANATION_BONUS, correct: true, earnStar: true, concept: cur.principle });
      setByteMsg(`🛡️ ${teamLabel(activeTeam)} +50 bonus pts! ${cur.explanation}`);
      onSwitchTurn();
    } else {
      const nextW = [...actionWrongTried, act];
      const nextM = actionMissTeams.includes(activeTeam) ? actionMissTeams : [...actionMissTeams, activeTeam];
      setActionWrongTried(nextW);
      setActionMissTeams(nextM);
      onAward({ teamId: activeTeam, points: 0, correct: false, concept: cur.principle });
      if (nextM.length >= 2) {
        setActionTeacherWait(true);
        setByteMsg('👩‍🏫 Both teams missed the best ethical action! Teacher, click below to reveal & explain!');
      } else {
        onSwitchTurn();
        setByteMsg(`❌ Not the safest action! Turn passes to ${teamLabel(otherTeam(activeTeam))}!`);
      }
    }
  };

  const teacherRevealAction = () => {
    setActionTeacherWait(false);
    setActionPicked(true);
    setByteMsg(`👩‍🏫 Teacher Reveal: "${cur.bestAction}". ${cur.explanation}`);
    onSwitchTurn();
  };

  const nextCase = () => {
    if (caseIdx + 1 < cases.length) {
      setCaseIdx((i) => i + 1);
      setVerdictPicked(false);
      setVerdictWrongTried([]);
      setVerdictMissTeams([]);
      setVerdictTeacherWait(false);
      setActionPicked(false);
      setActionWrongTried([]);
      setActionMissTeams([]);
      setActionTeacherWait(false);
      setByteMsg(`Case ${caseIdx + 2} of ${cases.length} on the bench! Examine the evidence carefully.`);
    } else {
      onCompleteMission(6, 'ethics_judge', true);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-2xl md:text-3xl font-black text-rose-700 m-0">
          ⚖️ Mission 6 · AI Ethics Guardians Courtroom ({caseIdx + 1}/{cases.length})
        </h2>
        <div className="flex gap-2">
          <span className="px-3 py-1.5 rounded-full bg-sky-100 border border-sky-300 text-sky-900 font-bold text-xs flex items-center gap-1">
            <Shield className="w-4 h-4 text-sky-700" /> Privacy Shields: {shields}
          </span>
          <span className="px-3 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 font-bold text-xs flex items-center gap-1">
            <Scale className="w-4 h-4 text-amber-700" /> Principle: {cur.principle}
          </span>
        </div>
      </div>

      <ByteGuide message={byteMsg} mood={verdictTeacherWait || actionTeacherWait ? 'alert' : 'thinking'} compact />

      <div className="rounded-3xl p-5 md:p-6 bg-rose-50/70 border-2 border-rose-300 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="px-3 py-1 rounded-full bg-rose-200 text-rose-950 font-black text-sm">{cur.title}</span>
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
            <Award className="w-4 h-4 text-amber-600" /> Worth +100 pts Verdict &amp; +50 pts Action
          </span>
        </div>

        <p className="text-xl md:text-2xl font-black text-slate-900 leading-snug m-0">
          "{cur.scenario}"
        </p>

        <div>
          <div className="text-sm font-black uppercase text-sky-800 mb-2">Step 1 · Judge Verdict (+100 pts)</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { v: 'Responsible', cls: 'border-emerald-500 bg-emerald-50 text-emerald-900' },
              { v: 'Irresponsible', cls: 'border-rose-500 bg-rose-50 text-rose-900' },
              { v: 'Needs More Information', cls: 'border-amber-500 bg-amber-50 text-amber-900' }
            ].map((b) => {
              const wrongTried = verdictWrongTried.includes(b.v);
              return (
                <button
                  key={b.v}
                  type="button"
                  disabled={verdictPicked || verdictTeacherWait || wrongTried}
                  onClick={() => chooseVerdict(b.v)}
                  className={`touch-btn py-3.5 px-4 rounded-2xl border-2 border-b-4 font-black text-lg cursor-pointer shadow-sm ${
                    verdictPicked && b.v === cur.verdict
                      ? 'ring-4 ring-emerald-400 bg-emerald-600 text-white'
                      : wrongTried
                        ? 'bg-rose-100 text-rose-700 border-rose-300 opacity-55 line-through'
                        : b.cls
                  }`}
                >
                  {b.v.toUpperCase()}
                </button>
              );
            })}
          </div>
          {verdictTeacherWait && (
            <div className="flex justify-center mt-3">
              <button type="button" onClick={teacherRevealVerdict} className="touch-btn px-6 py-3 rounded-2xl bg-indigo-600 text-white font-black text-lg flex items-center gap-2 cursor-pointer">
                <Eye className="w-5 h-5" /> 👩‍🏫 Teacher: Reveal Verdict
              </button>
            </div>
          )}
        </div>

        {verdictPicked && (
          <div className="animate-pop pt-2">
            <div className="text-sm font-black uppercase text-amber-800 mb-2">Step 2 · Choose the Best Ethical Action (+50 Bonus · Shuffled)</div>
            <div className="space-y-2.5">
              {cur.shuffledActions.map((a) => {
                const wrongTried = actionWrongTried.includes(a);
                return (
                  <button
                    key={a}
                    type="button"
                    disabled={actionPicked || actionTeacherWait || wrongTried}
                    onClick={() => chooseAction(a)}
                    className={`w-full touch-btn p-4 rounded-2xl border-2 border-b-4 text-left font-bold text-base md:text-lg cursor-pointer shadow-sm ${
                      actionPicked && a === cur.bestAction
                        ? 'bg-emerald-600 text-white border-emerald-700'
                        : wrongTried
                          ? 'bg-rose-100 text-rose-700 border-rose-300 opacity-55 line-through'
                          : 'bg-white text-slate-900 border-slate-300'
                    }`}
                  >
                    {a}
                  </button>
                );
              })}
            </div>
            {actionTeacherWait && (
              <div className="flex justify-center mt-3">
                <button type="button" onClick={teacherRevealAction} className="touch-btn px-6 py-3 rounded-2xl bg-indigo-600 text-white font-black text-lg flex items-center gap-2 cursor-pointer">
                  <Eye className="w-5 h-5" /> 👩‍🏫 Teacher: Reveal Ethical Action &amp; Explain
                </button>
              </div>
            )}
          </div>
        )}

        {actionPicked && (
          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={nextCase}
              className="touch-btn px-7 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-orange-500 text-white font-black text-lg cursor-pointer shadow-md"
            >
              {caseIdx + 1 < cases.length ? 'Next Courtroom Case ▶' : '⚖️ Court Adjourned! Face THE BUG MASTER ▶'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
