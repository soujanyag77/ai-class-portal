import React, { useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, Wrench } from 'lucide-react';
import ByteGuide from './ByteGuide.jsx';
import { SPORTS_BIASED_DATASET, FAIRNESS_SCENARIOS } from '../data/questionBank.js';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const teamLabel = (t) => (t === 'blue' ? 'TEAM BLUE (CYBER TITANS)' : 'TEAM ORANGE (DATA DRAGONS)');

export default function DataDetective({ activeTeam, onAward, onSwitchTurn, onCompleteMission }) {
  const [tab, setTab] = useState('A');
  const [flaggedIds, setFlaggedIds] = useState({});
  const scenarios = useMemo(() => shuffle(FAIRNESS_SCENARIOS).slice(0, 6), []);
  const [placed, setPlaced] = useState({});
  const [selId, setSelId] = useState(null);
  const [repaired, setRepaired] = useState({ girls: false, rural: false, para: false });
  const [byteMsg, setByteMsg] = useState('Investigation Room (+100 pts/clue): Examine the fictional Sports AI dataset and tap the biased / excluded rows!');

  const biasedRows = SPORTS_BIASED_DATASET.filter((r) => r.selected !== 'Selected');
  const diversityScore = 25 + (repaired.girls ? 25 : 0) + (repaired.rural ? 25 : 0) + (repaired.para ? 25 : 0);

  const flagRow = (row) => {
    if (flaggedIds[row.id]) return;
    if (row.selected !== 'Selected') {
      const next = { ...flaggedIds, [row.id]: true };
      setFlaggedIds(next);
      onAward({ teamId: activeTeam, points: 100, correct: true, concept: 'Spotting Data Bias', aiChapter: 'ai-ch4' });
      setByteMsg(`🔍 ${teamLabel(activeTeam)} +100 pts! ${row.id} (${row.category}) had ${row.attendance} attendance & score ${row.pastScore}, yet was excluded due to missing representation!`);
      onSwitchTurn();
      if (Object.keys(next).length === biasedRows.length) {
        setTimeout(() => {
          setTab('B');
          setByteMsg('Activity B (+100/+150 pts): Drag each scenario card into FAIR or NEEDS IMPROVEMENT!');
        }, 1100);
      }
    } else {
      setByteMsg(`ℹ️ ${row.id} (${row.category}) was already represented and selected—look at who was left out!`);
    }
  };

  const placeScenario = (id, bucket) => {
    if (placed[id]) return;
    setSelId(null);
    const sc = scenarios.find((s) => s.id === id);
    if (sc && sc.label === bucket) {
      const next = { ...placed, [id]: bucket };
      setPlaced(next);
      onAward({ teamId: activeTeam, points: sc.points, correct: true, concept: sc.concept, aiChapter: 'ai-ch4' });
      setByteMsg(`⚖️ ${teamLabel(activeTeam)} +${sc.points} pts! ${sc.concept}: ${sc.explanation}`);
      onSwitchTurn();
      if (Object.keys(next).length === scenarios.length) {
        setTimeout(() => {
          setTab('C');
          setByteMsg('🛠️ Activity C (+100 pts each): Repair the Sports Dataset by adding balanced representation!');
        }, 1100);
      }
    } else {
      onAward({ teamId: activeTeam, points: 20, correct: false, concept: sc?.concept || 'Fairness', misconception: 'Identifying AI Fairness vs Bias' });
      setByteMsg(`❌ ${teamLabel(activeTeam)} (+20 learning pts) — Ask: Does this give every group an equal, inclusive chance?`);
    }
  };

  const addCategory = (key, label) => {
    if (repaired[key]) return;
    const next = { ...repaired, [key]: true };
    setRepaired(next);
    onAward({
      teamId: activeTeam,
      points: 100,
      correct: true,
      earnStar: next.girls && next.rural && next.para,
      concept: 'Dataset Repair & Inclusion',
      aiChapter: 'ai-ch4'
    });
    setByteMsg(`✅ ${teamLabel(activeTeam)} +100 pts! Added ${label}! Dataset representation improved!`);
    if (next.girls && next.rural && next.para) {
      onCompleteMission(5, 'fairness_champion');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-2xl md:text-3xl font-black text-orange-700 m-0">
          🔍 Mission 5 · Data Detectives &amp; Fairness
        </h2>
        <div className="flex gap-2 flex-wrap">
          {[
            { id: 'A', label: `A. Spot Bias (${Object.keys(flaggedIds).length}/${biasedRows.length})` },
            { id: 'B', label: `B. Fair or Unfair? (${Object.keys(placed).length}/${scenarios.length})` },
            { id: 'C', label: `C. Repair Data (${diversityScore}%)` }
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`px-3.5 py-2 rounded-xl font-black text-sm border-2 cursor-pointer ${
                tab === t.id ? 'bg-orange-500 text-white border-orange-600' : 'bg-slate-100 text-slate-800 border-slate-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <ByteGuide message={byteMsg} mood="thinking" compact />

      {tab === 'A' && (
        <div className="space-y-3">
          <div className="p-3 rounded-2xl bg-amber-100 border-2 border-amber-400 text-lg font-bold text-amber-950">
            📁 Fictional Case: An AI selects students for a school sports event using past records. Tap the rows showing unfair exclusion! <span className="text-emerald-800">(+100 pts/row)</span>
          </div>
          <div className="overflow-x-auto rounded-2xl p-3 bg-white border-2 border-slate-200">
            <table className="w-full text-left border-collapse text-base md:text-lg">
              <thead>
                <tr className="border-b-2 border-slate-300 text-orange-800 bg-orange-50">
                  <th className="p-2.5">Student ID</th>
                  <th className="p-2.5">Attendance</th>
                  <th className="p-2.5">Past Score</th>
                  <th className="p-2.5">Sports Category</th>
                  <th className="p-2.5">AI Selection Result</th>
                </tr>
              </thead>
              <tbody>
                {SPORTS_BIASED_DATASET.map((r) => {
                  const hit = flaggedIds[r.id];
                  return (
                    <tr
                      key={r.id}
                      onClick={() => flagRow(r)}
                      className={`border-b border-slate-200 cursor-pointer ${hit ? 'bg-rose-50' : 'hover:bg-slate-50'}`}
                    >
                      <td className="p-2.5 font-black text-slate-900">{r.id}</td>
                      <td className="p-2.5 text-slate-800">{r.attendance}</td>
                      <td className="p-2.5 font-bold text-slate-900">{r.pastScore}</td>
                      <td className="p-2.5 font-bold text-sky-800">{r.category}</td>
                      <td className="p-2.5 flex items-center gap-1.5 font-bold text-slate-800">
                        {hit ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-orange-600" />}
                        {r.selected}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'B' && (
        <div className="space-y-3">
          <div className="rounded-2xl p-3 bg-slate-100 border-2 border-dashed border-slate-300 flex flex-wrap gap-2 justify-center">
            {scenarios.filter((s) => !placed[s.id]).map((s) => (
              <button
                key={s.id}
                type="button"
                draggable
                onDragStart={(e) => { e.dataTransfer.setData('text/plain', s.id); setSelId(s.id); }}
                onClick={() => setSelId(selId === s.id ? null : s.id)}
                className={`touch-btn px-4 py-2.5 rounded-2xl border-2 font-bold text-base text-left max-w-md cursor-grab ${
                  selId === s.id ? 'bg-orange-500 text-white border-orange-700' : 'bg-white text-slate-900 border-slate-300 shadow-sm'
                }`}
              >
                {s.text} <span className="ml-1 text-xs font-black text-emerald-700">(+{s.points})</span>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['Fair', 'Needs Improvement'].map((bucket) => (
              <div
                key={bucket}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const id = e.dataTransfer.getData('text/plain') || selId;
                  if (id) placeScenario(id, bucket);
                }}
                onClick={() => selId && placeScenario(selId, bucket)}
                className={`rounded-3xl p-4 border-4 border-dashed min-h-[170px] cursor-pointer ${
                  bucket === 'Fair' ? 'border-emerald-500 bg-emerald-50' : 'border-rose-500 bg-rose-50'
                }`}
              >
                <div className={`text-xl font-black mb-2 ${bucket === 'Fair' ? 'text-emerald-800' : 'text-rose-800'}`}>
                  {bucket === 'Fair' ? '⚖️ FAIR & INCLUSIVE' : '🚨 NEEDS IMPROVEMENT (BIAS)'}
                </div>
                <div className="space-y-2">
                  {scenarios.filter((s) => placed[s.id] === bucket).map((s) => (
                    <div key={s.id} className="p-2 rounded-xl bg-white text-sm font-bold text-slate-800 border border-slate-300">
                      ✅ {s.text}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'C' && (
        <div className="rounded-3xl p-6 space-y-4 bg-emerald-50 border-2 border-emerald-400">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-2xl font-black text-emerald-900 m-0 flex items-center gap-2">
              <Wrench className="w-6 h-6" /> Repair Representation in the Sports Dataset <span className="text-base">(+100 pts each)</span>
            </h3>
            <span className="text-xl font-black text-sky-800">Dataset Fairness: {diversityScore}%</span>
          </div>
          <div className="h-4 bg-slate-200 rounded-full overflow-hidden border border-slate-300">
            <div className="h-full bg-gradient-to-r from-orange-400 to-emerald-500 transition-all duration-300" style={{ width: `${diversityScore}%` }} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { key: 'girls', label: '🏃‍♀️ Add Girls Athletics Trials (+25%)' },
              { key: 'rural', label: '🌾 Add Rural Zone Kabaddi Records (+25%)' },
              { key: 'para', label: '♿ Add Para-Sports Inclusive Trials (+25%)' }
            ].map((btn) => (
              <button
                key={btn.key}
                type="button"
                disabled={repaired[btn.key]}
                onClick={() => addCategory(btn.key, btn.label)}
                className={`touch-btn p-4 rounded-2xl border-2 font-black text-lg cursor-pointer shadow-sm ${
                  repaired[btn.key]
                    ? 'bg-emerald-600 border-emerald-700 text-white'
                    : 'bg-white border-orange-400 text-slate-900'
                }`}
              >
                {repaired[btn.key] ? `✅ ${btn.label.replace('Add ', 'Added ')}` : btn.label}
              </button>
            ))}
          </div>

          {diversityScore === 100 && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => onCompleteMission(5, 'fairness_champion', true)}
                className="touch-btn px-6 py-3 rounded-2xl bg-emerald-600 text-white font-black text-lg cursor-pointer"
              >
                ⚖️ Dataset Repaired (100%)! Proceed to Ethics Courtroom ▶
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
