import React, { useMemo, useState } from 'react';
import { CheckCircle2, Sparkles, AlertTriangle } from 'lucide-react';
import ByteGuide from './ByteGuide.jsx';
import {
  MISSION1_DEVICES,
  LIFECYCLE_STAGES,
  SCHOOL_ELECTRICITY_CARDS,
  DATA_CLEANING_ROWS
} from '../data/questionBank.js';
import { SCORE_VALUES } from '../utils/scoring.js';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const teamLabel = (t) => (t === 'blue' ? 'TEAM BLUE (CYBER TITANS)' : 'TEAM ORANGE (DATA DRAGONS)');

export function Mission1Warmup({ activeTeam, onAward, onSwitchTurn, onCompleteMission, revealHint, revealAnswer }) {
  const items = useMemo(() => shuffle(MISSION1_DEVICES), []);
  const [placed, setPlaced] = useState({});
  const [selectedId, setSelectedId] = useState(null);
  const [feedback, setFeedback] = useState({
    msg: 'Drag any device into Bucket A (Uses AI) or Bucket B (Does not necessarily use AI) — or tap a device, then tap a bucket!',
    mood: 'happy',
    canBonus: false
  });
  const [bonusClaimed, setBonusClaimed] = useState(false);

  const remaining = items.filter((d) => !placed[d.id]);

  const handlePlace = (deviceId, bucket) => {
    const dev = items.find((d) => d.id === deviceId);
    if (!dev || placed[deviceId]) return;
    setSelectedId(null);

    if (dev.bucket === bucket) {
      const next = { ...placed, [deviceId]: bucket };
      setPlaced(next);
      onAward({
        teamId: activeTeam,
        points: dev.points,
        correct: true,
        concept: dev.concept,
        aiChapter: 'ai-ch1'
      });
      setBonusClaimed(false);
      setFeedback({
        msg: `✅ ${teamLabel(activeTeam)} earned +${dev.points} pts! ${dev.name}: ${dev.explanation}`,
        mood: 'excited',
        canBonus: true
      });
      if (Object.keys(next).length === items.length) {
        onCompleteMission(1, 'ai_spotter');
      } else {
        onSwitchTurn();
      }
    } else {
      onAward({
        teamId: activeTeam,
        points: 20,
        correct: false,
        concept: dev.concept,
        misconception: dev.concept
      });
      setFeedback({
        msg: `🤔 ${teamLabel(activeTeam)} (+20 learning pts) — Not quite for ${dev.name}! Hint: ${dev.explanation}`,
        mood: 'thinking',
        canBonus: false
      });
    }
  };

  const handleExplanationBonus = () => {
    if (bonusClaimed) return;
    setBonusClaimed(true);
    const prevTeam = activeTeam === 'blue' ? 'orange' : 'blue';
    onAward({
      teamId: prevTeam,
      points: SCORE_VALUES.EXPLANATION_BONUS,
      correct: true,
      earnStar: true,
      concept: 'Reasoning Explanation'
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-sky-700 m-0">
            🤖 Mission 1 · Human or Machine? ({Object.keys(placed).length}/{items.length})
          </h2>
          <p className="text-lg md:text-xl text-slate-700 m-0">
            Watch out for tricky automation vs real AI! <span className="font-black text-emerald-700">(+100 / +150 pts per item)</span>
          </p>
        </div>
        {Object.keys(placed).length === items.length && (
          <button
            type="button"
            onClick={() => onCompleteMission(1, 'ai_spotter', true)}
            className="touch-btn px-6 py-3 rounded-2xl bg-emerald-600 text-white font-black text-lg cursor-pointer"
          >
            Mission Complete! Next Mission ▶
          </button>
        )}
      </div>

      <ByteGuide message={feedback.msg} mood={feedback.mood} compact />

      {feedback.canBonus && !bonusClaimed && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleExplanationBonus}
            className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-black text-sm flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Sparkles className="w-4 h-4" /> +50 Explanation Bonus (Student Explained Why!)
          </button>
        </div>
      )}

      {(revealHint || revealAnswer) && remaining[0] && (
        <div className="p-3 rounded-xl bg-indigo-50 border-2 border-indigo-300 text-indigo-950 text-base font-bold">
          {revealAnswer
            ? `👩‍🏫 Answer for ${remaining[0].name}: ${remaining[0].correctAnswer}`
            : `💡 Hint for ${remaining[0].name}: Ask — does it learn from data or follow a fixed rule?`}
        </div>
      )}

      <div className="rounded-2xl p-3 bg-slate-100 border-2 border-dashed border-slate-400 flex flex-wrap gap-2.5 justify-center min-h-[86px]">
        {remaining.length === 0 ? (
          <div className="text-xl font-black text-emerald-700 py-3">🎉 All 10 Objects Classified!</div>
        ) : (
          remaining.map((dev) => {
            const isSel = selectedId === dev.id;
            return (
              <button
                key={dev.id}
                type="button"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', dev.id);
                  setSelectedId(dev.id);
                }}
                onClick={() => setSelectedId(isSel ? null : dev.id)}
                className={`touch-btn px-4 py-2.5 rounded-2xl border-2 font-extrabold text-base md:text-lg flex items-center gap-2 cursor-grab transition-all shadow-sm ${
                  isSel
                    ? 'bg-sky-600 text-white border-sky-800 scale-105'
                    : 'bg-white text-slate-900 border-slate-300'
                }`}
              >
                <span className="text-2xl">{dev.icon}</span>
                <span>{dev.name}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-black ${isSel ? 'bg-white/25 text-white' : 'bg-emerald-100 text-emerald-800'}`}>
                  +{dev.points}
                </span>
              </button>
            );
          })
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { key: 'ai', title: 'BUCKET A: Uses AI', sub: 'Learns patterns, understands speech/vision, adapts', border: 'border-sky-500 bg-sky-50', head: 'text-sky-800' },
          { key: 'non-ai', title: 'BUCKET B: Does NOT Necessarily Use AI', sub: 'Fixed timers, simple sensor rules, basic arithmetic', border: 'border-orange-500 bg-orange-50', head: 'text-orange-800' }
        ].map((b) => {
          const list = items.filter((d) => placed[d.id] === b.key);
          return (
            <div
              key={b.key}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const id = e.dataTransfer.getData('text/plain') || selectedId;
                if (id) handlePlace(id, b.key);
              }}
              onClick={() => {
                if (selectedId) handlePlace(selectedId, b.key);
              }}
              className={`rounded-3xl p-4 border-4 border-dashed min-h-[180px] transition-all cursor-pointer ${b.border}`}
            >
              <div className={`text-xl md:text-2xl font-black ${b.head}`}>{b.title}</div>
              <div className="text-sm font-bold text-slate-600 mb-3">{b.sub}</div>
              <div className="flex flex-wrap gap-2">
                {list.map((d) => (
                  <span key={d.id} className="px-3 py-1.5 rounded-xl bg-white border-2 border-emerald-400 text-emerald-900 font-bold text-sm flex items-center gap-1.5 shadow-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {d.icon} {d.name}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function Mission3Lifecycle({ activeTeam, onAward, onSwitchTurn, onCompleteMission }) {
  const [tab, setTab] = useState('A');
  const [stageOrderCards] = useState(() => shuffle(LIFECYCLE_STAGES));
  const [stageSlots, setStageSlots] = useState({});
  const [selStage, setSelStage] = useState(null);

  const [elecCards] = useState(() => shuffle(SCHOOL_ELECTRICITY_CARDS));
  const [elecPlaced, setElecPlaced] = useState({});
  const [selElec, setSelElec] = useState(null);

  const [cleanedRows, setCleanedRows] = useState({});
  const [byteMsg, setByteMsg] = useState('Activity A (+100 pts each): Drag the 4 AI Project Lifecycle stages into their circular order 1 → 4!');

  const badRowsCount = DATA_CLEANING_ROWS.filter((r) => r.badField).length;
  const fixedCount = Object.keys(cleanedRows).length;

  const placeStage = (cardId, slotNum) => {
    if (stageSlots[slotNum]) return;
    setSelStage(null);
    const stage = LIFECYCLE_STAGES.find((s) => s.id === cardId);
    if (stage && stage.order === slotNum) {
      const next = { ...stageSlots, [slotNum]: stage };
      setStageSlots(next);
      onAward({ teamId: activeTeam, points: 100, correct: true, concept: 'AI Project Lifecycle Order', aiChapter: 'ai-ch2' });
      setByteMsg(`✅ ${teamLabel(activeTeam)} +100 pts! Stage ${slotNum} locked: ${stage.title}! ${stage.desc}`);
      onSwitchTurn();
      if (Object.keys(next).length === 4) {
        setTimeout(() => {
          setTab('B');
          setByteMsg('⚡ Great! Now Activity B (+100 pts each): Drag each School Electricity Wastage card to its matching Lifecycle stage!');
        }, 1000);
      }
    } else {
      onAward({ teamId: activeTeam, points: 25, correct: false, concept: 'AI Project Lifecycle Order', misconception: 'AI Project Lifecycle Sequence' });
      setByteMsg(`❌ ${teamLabel(activeTeam)} (+25 learning pts) — Check the cycle order: Define Problem → Collect Data → Test AI Tools → Reflect & Improve!`);
    }
  };

  const placeElec = (cardId, stageId) => {
    if (elecPlaced[cardId]) return;
    setSelElec(null);
    const card = SCHOOL_ELECTRICITY_CARDS.find((c) => c.id === cardId);
    if (card && card.stage === stageId) {
      const next = { ...elecPlaced, [cardId]: stageId };
      setElecPlaced(next);
      onAward({ teamId: activeTeam, points: 100, correct: true, concept: card.concept, aiChapter: 'ai-ch2' });
      setByteMsg(`✅ ${teamLabel(activeTeam)} +100 pts! ${card.explanation}`);
      onSwitchTurn();
      if (Object.keys(next).length === SCHOOL_ELECTRICITY_CARDS.length) {
        setTimeout(() => {
          setTab('C');
          setByteMsg('🧹 Activity C (+100 pts each): Tap the dirty/broken records in the School Electricity Dataset to clean them!');
        }, 1100);
      }
    } else {
      onAward({ teamId: activeTeam, points: 25, correct: false, concept: 'School Electricity AI Mapping' });
      setByteMsg(`❌ ${teamLabel(activeTeam)} (+25 learning pts) — Match the action carefully with Define, Collect, Test, or Reflect!`);
    }
  };

  const tapRowCell = (row) => {
    if (cleanedRows[row.id]) return;
    if (row.badField) {
      const next = { ...cleanedRows, [row.id]: true };
      setCleanedRows(next);
      onAward({
        teamId: activeTeam,
        points: 100,
        correct: true,
        earnStar: Object.keys(next).length === badRowsCount,
        concept: 'Data Cleaning & Quality',
        aiChapter: 'ai-ch2'
      });
      setByteMsg(`🧹 ${teamLabel(activeTeam)} +100 pts! Cleaned ${row.id} (${row.room}): ${row.issue}`);
      onSwitchTurn();
      if (Object.keys(next).length === badRowsCount) {
        onCompleteMission(3, 'cycle_builder');
      }
    } else {
      onAward({ teamId: activeTeam, points: 0, correct: false, concept: 'Data Cleaning', misconception: 'Distinguishing clean vs dirty records' });
      setByteMsg(`✅ ${row.id} (${row.room}: ${row.kwh} kWh) is already clean and valid! Look for missing, duplicate, or impossible numbers.`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-2xl md:text-3xl font-black text-purple-700 m-0">
          🔄 Mission 3 · AI Project Lifecycle <span className="text-base font-black text-emerald-700">(+100 pts/step)</span>
        </h2>
        <div className="flex gap-2 flex-wrap">
          {[
            { id: 'A', label: 'A. Circular Lifecycle' },
            { id: 'B', label: 'B. School Electricity' },
            { id: 'C', label: `C. Data Cleaning (${fixedCount}/${badRowsCount})` }
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-xl font-black text-sm border-2 cursor-pointer ${
                tab === t.id ? 'bg-purple-600 text-white border-purple-700' : 'bg-slate-100 text-slate-800 border-slate-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <ByteGuide message={byteMsg} mood="happy" compact />

      {tab === 'A' && (
        <div className="space-y-4">
          <div className="rounded-2xl p-3 bg-slate-100 border-2 border-dashed border-slate-300 flex flex-wrap gap-2.5 justify-center">
            {stageOrderCards.filter((s) => !Object.values(stageSlots).some((v) => v.id === s.id)).map((s) => (
              <button
                key={s.id}
                type="button"
                draggable
                onDragStart={(e) => { e.dataTransfer.setData('text/plain', s.id); setSelStage(s.id); }}
                onClick={() => setSelStage(selStage === s.id ? null : s.id)}
                className={`touch-btn px-4 py-2.5 rounded-2xl border-2 font-black text-base cursor-grab ${
                  selStage === s.id ? 'bg-sky-600 text-white border-sky-800' : 'bg-white text-slate-900 border-slate-300 shadow-sm'
                }`}
              >
                {s.icon} {s.title.replace(/^\d+\.\s*/, '')}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {[1, 2, 4, 3].map((slotNum) => {
              const placedStage = stageSlots[slotNum];
              return (
                <div
                  key={slotNum}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const cid = e.dataTransfer.getData('text/plain') || selStage;
                    if (cid) placeStage(cid, slotNum);
                  }}
                  onClick={() => selStage && placeStage(selStage, slotNum)}
                  className={`rounded-3xl p-4 border-4 border-dashed min-h-[110px] flex flex-col justify-center items-center text-center cursor-pointer transition-all ${
                    placedStage ? 'bg-emerald-50 border-emerald-500 border-solid' : 'border-slate-300 bg-slate-50'
                  }`}
                >
                  <div className="text-xs font-black uppercase tracking-widest text-slate-500">
                    Cycle Stage {slotNum} {slotNum === 1 ? '➔ Next' : slotNum === 2 ? '⬇ Next' : slotNum === 3 ? '⬅ Next' : '⬆ Loop'}
                  </div>
                  {placedStage ? (
                    <div className="text-xl font-black text-emerald-900 mt-1">
                      {placedStage.icon} {placedStage.title}
                    </div>
                  ) : (
                    <div className="text-slate-500 font-bold mt-1">Drop Stage {slotNum} Here</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === 'B' && (
        <div className="space-y-4">
          <div className="p-3 rounded-2xl bg-amber-100 border-2 border-amber-400 text-amber-950 text-lg md:text-xl font-bold text-center">
            💡 School Problem: "Our school wants to reduce electricity wastage in classrooms."
          </div>
          <div className="rounded-2xl p-3 bg-slate-100 border-2 border-dashed border-slate-300 flex flex-wrap gap-2.5 justify-center">
            {elecCards.filter((c) => !elecPlaced[c.id]).map((c) => (
              <button
                key={c.id}
                type="button"
                draggable
                onDragStart={(e) => { e.dataTransfer.setData('text/plain', c.id); setSelElec(c.id); }}
                onClick={() => setSelElec(selElec === c.id ? null : c.id)}
                className={`touch-btn px-4 py-2.5 rounded-2xl border-2 font-bold text-base cursor-grab ${
                  selElec === c.id ? 'bg-amber-400 text-slate-950 border-amber-600' : 'bg-white text-slate-900 border-slate-300 shadow-sm'
                }`}
              >
                {c.text}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {LIFECYCLE_STAGES.map((st) => {
              const matched = elecCards.find((c) => elecPlaced[c.id] === st.id);
              return (
                <div
                  key={st.id}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const cid = e.dataTransfer.getData('text/plain') || selElec;
                    if (cid) placeElec(cid, st.id);
                  }}
                  onClick={() => selElec && placeElec(selElec, st.id)}
                  className={`rounded-2xl p-4 border-2 border-dashed cursor-pointer ${matched ? 'bg-emerald-50 border-emerald-500 border-solid' : 'border-slate-300 bg-slate-50'}`}
                >
                  <div className="font-black text-lg text-slate-900">{st.icon} {st.title}</div>
                  {matched ? (
                    <div className="mt-2 text-emerald-800 font-bold text-base">✅ {matched.text}</div>
                  ) : (
                    <div className="mt-1 text-slate-500 text-sm font-bold">Drop matching school action here</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === 'C' && (
        <div className="space-y-3">
          <div className="overflow-x-auto rounded-2xl p-3 bg-white border-2 border-slate-200">
            <table className="w-full text-left border-collapse text-base md:text-lg">
              <thead>
                <tr className="border-b-2 border-slate-300 text-sky-800 bg-sky-50">
                  <th className="p-2.5">Record</th>
                  <th className="p-2.5">Classroom</th>
                  <th className="p-2.5">Day</th>
                  <th className="p-2.5">Energy (kWh)</th>
                  <th className="p-2.5">Status</th>
                  <th className="p-2.5">Action</th>
                </tr>
              </thead>
              <tbody>
                {DATA_CLEANING_ROWS.map((r) => {
                  const isFixed = cleanedRows[r.id];
                  return (
                    <tr
                      key={r.id}
                      onClick={() => tapRowCell(r)}
                      className={`border-b border-slate-200 cursor-pointer transition-colors ${
                        isFixed ? 'bg-emerald-50' : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="p-2.5 font-black text-slate-900">{r.id}</td>
                      <td className="p-2.5 font-bold text-slate-800">{r.room}</td>
                      <td className="p-2.5 text-slate-700">{r.day}</td>
                      <td className={`p-2.5 font-black ${!isFixed && r.badField === 'kwh' ? 'text-rose-600' : 'text-slate-800'}`}>
                        {isFixed && r.badField === 'kwh' ? 'Cleaned ✓' : r.kwh}
                      </td>
                      <td className={`p-2.5 font-bold ${!isFixed && r.badField === 'status' ? 'text-amber-700' : 'text-slate-700'}`}>
                        {isFixed && r.badField === 'status' ? 'Deduplicated ✓' : r.status}
                      </td>
                      <td className="p-2.5">
                        {isFixed ? (
                          <span className="px-3 py-1 rounded-full bg-emerald-600 text-white font-black text-xs">FIXED</span>
                        ) : (
                          <span className="px-3 py-1 rounded-full bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1 w-fit">
                            <AlertTriangle className="w-3.5 h-3.5" /> Inspect Row
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {fixedCount === badRowsCount && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => onCompleteMission(3, 'cycle_builder', true)}
                className="touch-btn px-6 py-3 rounded-2xl bg-emerald-600 text-white font-black text-lg cursor-pointer"
              >
                🎉 Clean Data Unlocked! Proceed to Mission 4 ▶
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
