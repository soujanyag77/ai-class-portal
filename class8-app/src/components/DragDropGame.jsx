import React, { useMemo, useState } from 'react';
import { CheckCircle2, Sparkles, AlertTriangle, RotateCcw } from 'lucide-react';
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

export function Mission1Warmup({ activeTeam, onAward, onSwitchTurn, onCompleteMission, revealHint, revealAnswer }) {
  const items = useMemo(() => shuffle(MISSION1_DEVICES), []);
  const [placed, setPlaced] = useState({}); // { id: 'ai' | 'non-ai' }
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
        msg: `✅ ${dev.name}: ${dev.explanation}`,
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
        points: 20, // partial learning points for attempting & learning
        correct: false,
        concept: dev.concept,
        misconception: dev.concept
      });
      setFeedback({
        msg: `🤔 Not quite for ${dev.name}! Hint: ${dev.explanation}`,
        mood: 'thinking',
        canBonus: false
      });
    }
  };

  const handleExplanationBonus = () => {
    if (bonusClaimed) return;
    setBonusClaimed(true);
    onAward({
      teamId: activeTeam === 'blue' ? 'orange' : 'blue',
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
          <h2 className="text-2xl md:text-3xl font-black text-cyan-300 m-0">
            🤖 Mission 1 · Human or Machine? ({Object.keys(placed).length}/{items.length})
          </h2>
          <p className="text-lg md:text-xl text-slate-200 m-0">
            Watch out for tricky automation vs real AI!
          </p>
        </div>
        {Object.keys(placed).length === items.length && (
          <button
            type="button"
            onClick={() => onCompleteMission(1, 'ai_spotter', true)}
            className="touch-btn px-6 py-3 rounded-2xl bg-emerald-400 text-slate-950 font-black text-lg cursor-pointer"
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
            className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-black text-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" /> +50 Explanation Bonus (Student Explained Why!)
          </button>
        </div>
      )}

      {(revealHint || revealAnswer) && remaining[0] && (
        <div className="p-3 rounded-xl bg-indigo-950/80 border border-indigo-400 text-indigo-100 text-base font-bold">
          {revealAnswer
            ? `👩‍🏫 Answer for ${remaining[0].name}: ${remaining[0].correctAnswer}`
            : `💡 Hint for ${remaining[0].name}: Ask — does it learn from data or follow a fixed rule?`}
        </div>
      )}

      {/* Draggable Object Tray */}
      <div className="glass-panel rounded-2xl p-3 border-dashed border-slate-500 flex flex-wrap gap-2.5 justify-center min-h-[86px]">
        {remaining.length === 0 ? (
          <div className="text-xl font-black text-emerald-300 py-3">🎉 All 10 Objects Classified!</div>
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
                className={`touch-btn px-4 py-2.5 rounded-2xl border-2 font-extrabold text-base md:text-lg flex items-center gap-2 cursor-grab transition-all ${
                  isSel
                    ? 'bg-cyan-400 text-slate-950 border-white scale-105 shadow-lg'
                    : 'bg-slate-800/95 text-slate-100 border-slate-600'
                }`}
              >
                <span className="text-2xl">{dev.icon}</span>
                <span>{dev.name}</span>
              </button>
            );
          })
        )}
      </div>

      {/* Two Buckets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { key: 'ai', title: 'BUCKET A: Uses AI', sub: 'Learns patterns, understands speech/vision, adapts', border: 'border-cyan-400 bg-cyan-500/10', head: 'text-cyan-300' },
          { key: 'non-ai', title: 'BUCKET B: Does NOT Necessarily Use AI', sub: 'Fixed timers, simple sensor rules, basic arithmetic', border: 'border-orange-400 bg-orange-500/10', head: 'text-orange-300' }
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
              <div className="text-sm font-bold text-slate-300 mb-3">{b.sub}</div>
              <div className="flex flex-wrap gap-2">
                {list.map((d) => (
                  <span key={d.id} className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-emerald-400/60 text-emerald-200 font-bold text-sm flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {d.icon} {d.name}
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
  const [tab, setTab] = useState('A'); // A = Lifecycle Order, B = School Electricity, C = Data Cleaning
  const [stageOrderCards] = useState(() => shuffle(LIFECYCLE_STAGES));
  const [stageSlots, setStageSlots] = useState({});
  const [selStage, setSelStage] = useState(null);

  const [elecCards] = useState(() => shuffle(SCHOOL_ELECTRICITY_CARDS));
  const [elecPlaced, setElecPlaced] = useState({});
  const [selElec, setSelElec] = useState(null);

  const [cleanedRows, setCleanedRows] = useState({});
  const [byteMsg, setByteMsg] = useState('Activity A: Drag the 4 AI Project Lifecycle stages into their circular order 1 → 4!');

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
      setByteMsg(`✅ Stage ${slotNum} locked: ${stage.title}! ${stage.desc}`);
      onSwitchTurn();
      if (Object.keys(next).length === 4) {
        setTimeout(() => {
          setTab('B');
          setByteMsg('⚡ Great! Now Activity B: Drag each School Electricity Wastage card to its matching Lifecycle stage!');
        }, 1000);
      }
    } else {
      onAward({ teamId: activeTeam, points: 25, correct: false, concept: 'AI Project Lifecycle Order', misconception: 'AI Project Lifecycle Sequence' });
      setByteMsg('❌ Check the cycle order: Define Problem → Collect Data → Test AI Tools → Reflect & Improve!');
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
      setByteMsg(`✅ Correct! ${card.explanation}`);
      onSwitchTurn();
      if (Object.keys(next).length === SCHOOL_ELECTRICITY_CARDS.length) {
        setTimeout(() => {
          setTab('C');
          setByteMsg('🧹 Activity C: Tap the dirty/broken records in the School Electricity Dataset to clean them!');
        }, 1100);
      }
    } else {
      onAward({ teamId: activeTeam, points: 25, correct: false, concept: 'School Electricity AI Mapping' });
      setByteMsg('❌ Match the action carefully with Define, Collect, Test, or Reflect!');
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
      setByteMsg(`🧹 Cleaned ${row.id} (${row.room}): ${row.issue}`);
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
        <h2 className="text-2xl md:text-3xl font-black text-purple-300 m-0">
          🔄 Mission 3 · AI Project Lifecycle
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
                tab === t.id ? 'bg-purple-400 text-slate-950 border-purple-300' : 'bg-slate-800 text-slate-200 border-slate-600'
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
          <div className="glass-panel rounded-2xl p-3 flex flex-wrap gap-2.5 justify-center">
            {stageOrderCards.filter((s) => !Object.values(stageSlots).some((v) => v.id === s.id)).map((s) => (
              <button
                key={s.id}
                type="button"
                draggable
                onDragStart={(e) => { e.dataTransfer.setData('text/plain', s.id); setSelStage(s.id); }}
                onClick={() => setSelStage(selStage === s.id ? null : s.id)}
                className={`touch-btn px-4 py-2.5 rounded-2xl border-2 font-black text-base cursor-grab ${
                  selStage === s.id ? 'bg-cyan-400 text-slate-950 border-white' : 'bg-slate-800 text-white border-slate-600'
                }`}
              >
                {s.icon} {s.title.replace(/^\d+\.\s*/, '')}
              </button>
            ))}
          </div>

          {/* Circular 2x2 Lifecycle Loop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto relative">
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
                    placedStage ? placedStage.color + ' border-solid' : 'border-slate-600 bg-slate-900/60'
                  }`}
                >
                  <div className="text-xs font-black uppercase tracking-widest text-slate-300">
                    Cycle Stage {slotNum} {slotNum === 1 ? '➔ Next' : slotNum === 2 ? '⬇ Next' : slotNum === 3 ? '⬅ Next' : '⬆ Loop'}
                  </div>
                  {placedStage ? (
                    <div className="text-xl font-black text-white mt-1">
                      {placedStage.icon} {placedStage.title}
                    </div>
                  ) : (
                    <div className="text-slate-400 font-bold mt-1">Drop Stage {slotNum} Here</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === 'B' && (
        <div className="space-y-4">
          <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-400/50 text-amber-100 text-lg md:text-xl font-bold text-center">
            💡 School Problem: "Our school wants to reduce electricity wastage in classrooms."
          </div>
          <div className="glass-panel rounded-2xl p-3 flex flex-wrap gap-2.5 justify-center">
            {elecCards.filter((c) => !elecPlaced[c.id]).map((c) => (
              <button
                key={c.id}
                type="button"
                draggable
                onDragStart={(e) => { e.dataTransfer.setData('text/plain', c.id); setSelElec(c.id); }}
                onClick={() => setSelElec(selElec === c.id ? null : c.id)}
                className={`touch-btn px-4 py-2.5 rounded-2xl border-2 font-bold text-base cursor-grab ${
                  selElec === c.id ? 'bg-amber-400 text-slate-950 border-white' : 'bg-slate-800 text-white border-slate-600'
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
                  className={`rounded-2xl p-4 border-2 border-dashed cursor-pointer ${matched ? st.color + ' border-solid' : 'border-slate-600 bg-slate-900/60'}`}
                >
                  <div className="font-black text-lg text-white">{st.icon} {st.title}</div>
                  {matched ? (
                    <div className="mt-2 text-emerald-200 font-bold text-base">✅ {matched.text}</div>
                  ) : (
                    <div className="mt-1 text-slate-400 text-sm font-bold">Drop matching school action here</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === 'C' && (
        <div className="space-y-3">
          <div className="overflow-x-auto glass-panel rounded-2xl p-3">
            <table className="w-full text-left border-collapse text-base md:text-lg">
              <thead>
                <tr className="border-b-2 border-slate-700 text-cyan-300">
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
                      className={`border-b border-slate-800 cursor-pointer transition-colors ${
                        isFixed ? 'bg-emerald-500/20' : 'hover:bg-slate-800/70'
                      }`}
                    >
                      <td className="p-2.5 font-black">{r.id}</td>
                      <td className="p-2.5 font-bold">{r.room}</td>
                      <td className="p-2.5">{r.day}</td>
                      <td className={`p-2.5 font-black ${!isFixed && r.badField === 'kwh' ? 'text-rose-300' : ''}`}>
                        {isFixed && r.badField === 'kwh' ? 'Cleaned ✓' : r.kwh}
                      </td>
                      <td className={`p-2.5 font-bold ${!isFixed && r.badField === 'status' ? 'text-amber-300' : ''}`}>
                        {isFixed && r.badField === 'status' ? 'Deduplicated ✓' : r.status}
                      </td>
                      <td className="p-2.5">
                        {isFixed ? (
                          <span className="px-3 py-1 rounded-full bg-emerald-500 text-slate-950 font-black text-xs">FIXED</span>
                        ) : (
                          <span className="px-3 py-1 rounded-full bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1 w-fit">
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
                className="touch-btn px-6 py-3 rounded-2xl bg-emerald-400 text-slate-950 font-black text-lg cursor-pointer"
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
