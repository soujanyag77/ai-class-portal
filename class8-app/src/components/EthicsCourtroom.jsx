import React, { useState } from 'react';
import { Scale, Shield, Award } from 'lucide-react';
import ByteGuide from './ByteGuide.jsx';
import { ETHICS_CASES } from '../data/questionBank.js';
import { SCORE_VALUES } from '../utils/scoring.js';

export default function EthicsCourtroom({ activeTeam, onAward, onSwitchTurn, onCompleteMission }) {
  const [caseIdx, setCaseIdx] = useState(0);
  const [verdictPicked, setVerdictPicked] = useState(false);
  const [actionPicked, setActionPicked] = useState(false);
  const [shields, setShields] = useState(0);
  const [byteMsg, setByteMsg] = useState('Order in the AI Ethics Courtroom! First judge the case, then choose the best ethical action.');

  const cur = ETHICS_CASES[caseIdx];
  const coreCasesCount = 5;

  const chooseVerdict = (v) => {
    if (verdictPicked) return;
    if (v === cur.verdict) {
      setVerdictPicked(true);
      onAward({ teamId: activeTeam, points: SCORE_VALUES.CORRECT, correct: true, concept: cur.principle, aiChapter: 'ai-ch4' });
      setByteMsg(`⚖️ Sound judgement (${cur.verdict})! Now select the best ethical action below.`);
    } else {
      onAward({ teamId: activeTeam, points: 25, correct: false, concept: cur.principle, misconception: `Ethics Case: ${cur.principle}` });
      setByteMsg(`🤔 Re-read carefully: check Privacy, Fairness, Transparency, and Consent. Official ruling: ${cur.verdict}.`);
      setVerdictPicked(true);
    }
  };

  const chooseAction = (act) => {
    if (actionPicked) return;
    setActionPicked(true);
    if (act === cur.bestAction) {
      setShields((s) => s + 1);
      onAward({ teamId: activeTeam, points: SCORE_VALUES.EXPLANATION_BONUS, correct: true, earnStar: true, concept: cur.principle });
      setByteMsg(`🛡️ Ethical Action Confirmed! ${cur.explanation}`);
    } else {
      onAward({ teamId: activeTeam, points: 0, correct: false, concept: cur.principle });
      setByteMsg(`📘 Better action: "${cur.bestAction}". ${cur.explanation}`);
    }
    onSwitchTurn();
  };

  const nextCase = () => {
    if (caseIdx + 1 < coreCasesCount) {
      setCaseIdx((i) => i + 1);
      setVerdictPicked(false);
      setActionPicked(false);
      setByteMsg(`Case ${caseIdx + 2} of ${coreCasesCount} on the bench! Examine the evidence carefully.`);
    } else {
      onCompleteMission(6, 'ethics_judge', true);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-2xl md:text-3xl font-black text-rose-300 m-0">
          ⚖️ Mission 6 · AI Ethics Guardians Courtroom ({caseIdx + 1}/{coreCasesCount})
        </h2>
        <div className="flex gap-2">
          <span className="px-3 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-cyan-200 font-bold text-xs flex items-center gap-1">
            <Shield className="w-4 h-4" /> Privacy Shields: {shields}
          </span>
          <span className="px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-200 font-bold text-xs flex items-center gap-1">
            <Scale className="w-4 h-4" /> Principle: {cur.principle}
          </span>
        </div>
      </div>

      <ByteGuide message={byteMsg} mood="thinking" compact />

      <div className="glass-panel rounded-3xl p-5 md:p-6 border-2 border-rose-400/50 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-200 font-black text-sm">{cur.title}</span>
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1">
            <Award className="w-4 h-4 text-amber-300" /> Accountability &amp; Human Oversight
          </span>
        </div>

        <p className="text-xl md:text-2xl font-black text-white leading-snug m-0">
          "{cur.scenario}"
        </p>

        <div>
          <div className="text-sm font-black uppercase text-cyan-300 mb-2">Step 1 · Judge Verdict</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { v: 'Responsible', cls: 'border-emerald-400 bg-emerald-500/15 text-emerald-200' },
              { v: 'Irresponsible', cls: 'border-rose-400 bg-rose-500/15 text-rose-200' },
              { v: 'Needs More Information', cls: 'border-amber-400 bg-amber-500/15 text-amber-200' }
            ].map((b) => (
              <button
                key={b.v}
                type="button"
                disabled={verdictPicked}
                onClick={() => chooseVerdict(b.v)}
                className={`touch-btn py-3.5 px-4 rounded-2xl border-2 font-black text-lg cursor-pointer ${
                  verdictPicked && b.v === cur.verdict ? 'ring-4 ring-emerald-300 bg-emerald-500 text-slate-950' : b.cls
                }`}
              >
                {b.v.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {verdictPicked && (
          <div className="animate-pop pt-2">
            <div className="text-sm font-black uppercase text-amber-300 mb-2">Step 2 · Choose the Best Ethical Action (+50 Bonus)</div>
            <div className="space-y-2.5">
              {cur.actions.map((a) => (
                <button
                  key={a}
                  type="button"
                  disabled={actionPicked}
                  onClick={() => chooseAction(a)}
                  className={`w-full touch-btn p-4 rounded-2xl border-2 text-left font-bold text-base md:text-lg cursor-pointer ${
                    actionPicked && a === cur.bestAction
                      ? 'bg-emerald-500 text-slate-950 border-emerald-300'
                      : 'bg-slate-800/90 text-slate-100 border-slate-600'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        )}

        {actionPicked && (
          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={nextCase}
              className="touch-btn px-7 py-3 rounded-2xl bg-gradient-to-r from-rose-400 to-orange-400 text-slate-950 font-black text-lg cursor-pointer"
            >
              {caseIdx + 1 < coreCasesCount ? 'Next Courtroom Case ▶' : '⚖️ Court Adjourned! Face THE BUG MASTER ▶'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
