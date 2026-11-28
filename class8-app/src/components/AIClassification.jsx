import React, { useMemo, useState } from 'react';
import { CheckCircle2, ArrowLeft, Eye } from 'lucide-react';
import ByteGuide from './ByteGuide.jsx';
import ColouringCanvas from './ColouringCanvas.jsx';
import {
  AI_CITY_LOCATIONS,
  FARM_DATASET,
  CV_IMAGE_ITEMS,
  NLP_SENTENCES
} from '../data/questionBank.js';
import { shuffle } from '../utils/shuffle.js';

const teamLabel = (t) => (t === 'blue' ? 'TEAM BLUE (CYBER TITANS)' : 'TEAM ORANGE (DATA DRAGONS)');
const otherTeam = (t) => (t === 'blue' ? 'orange' : 'blue');

const CLUSTER_OBJECTS_BASE = [
  { id: 'cl1', label: 'Apple', icon: '🍎' },
  { id: 'cl2', label: 'Mango', icon: '🥭' },
  { id: 'cl3', label: 'Cat', icon: '🐱' },
  { id: 'cl4', label: 'Dog', icon: '🐶' },
  { id: 'cl5', label: 'Bus', icon: '🚌' },
  { id: 'cl6', label: 'Bicycle', icon: '🚲' }
];

export default function AIClassification({ activeTeam, onAward, onSwitchTurn, onCompleteMission }) {
  const [activeLoc, setActiveLoc] = useState(null);
  const [doneLocs, setDoneLocs] = useState({});
  const [byteMsg, setByteMsg] = useState('Welcome to AI City! Tap any of the 5 smart buildings to explore Data Science, CV, NLP & Clustering!');

  const farmRows = useMemo(() => shuffle(FARM_DATASET), []);
  const [farmDone, setFarmDone] = useState({});
  const [farmMisses, setFarmMisses] = useState({});
  const [farmTeacherPlot, setFarmTeacherPlot] = useState(null);

  const cvPool = useMemo(() => shuffle(CV_IMAGE_ITEMS), []);
  const [cvPlaced, setCvPlaced] = useState({});
  const [cvSel, setCvSel] = useState(null);
  const [cvMisses, setCvMisses] = useState({});
  const [cvTeacherId, setCvTeacherId] = useState(null);

  const nlpList = useMemo(() => shuffle(NLP_SENTENCES), []);
  const [nlpIdx, setNlpIdx] = useState(0);
  const [nlpDone, setNlpDone] = useState(false);
  const [nlpTriedWrong, setNlpTriedWrong] = useState([]);
  const [nlpMissTeams, setNlpMissTeams] = useState([]);
  const [nlpTeacherWait, setNlpTeacherWait] = useState(false);

  const [hospDone, setHospDone] = useState(false);
  const hospOptions = useMemo(() => shuffle([
    { id: 'doc', ok: true, text: '✅ Use AI as a fast assistant, and have a licensed Doctor verify the scan & decide treatment.' },
    { id: 'auto', ok: false, text: '🤖 Let the AI automatically prescribe medicine with zero doctor review.' }
  ]), []);

  const [schoolMode, setSchoolMode] = useState('cluster');
  const clusterObjects = useMemo(() => shuffle(CLUSTER_OBJECTS_BASE), []);
  const [clusters, setClusters] = useState({ c1: [], c2: [], c3: [] });
  const [clSel, setClSel] = useState(null);

  const markLocDone = (locId) => {
    const next = { ...doneLocs, [locId]: true };
    setDoneLocs(next);
    if (Object.keys(next).length === AI_CITY_LOCATIONS.length) {
      onCompleteMission(4, 'city_explorer');
    }
  };

  const predictFarm = (plot, choice) => {
    if (farmDone[plot.plot] || farmTeacherPlot) return;
    if (choice === plot.needsWater) {
      const next = { ...farmDone, [plot.plot]: true };
      setFarmDone(next);
      onAward({ teamId: activeTeam, points: 100, correct: true, concept: 'Data Science Prediction', aiChapter: 'ai-ch3' });
      setByteMsg(`🌾 ${teamLabel(activeTeam)} +100 pts! ${plot.plot}: ${plot.reason}`);
      onSwitchTurn();
      if (Object.keys(next).length === farmRows.length) markLocDone('farm');
    } else {
      const prev = farmMisses[plot.plot] || [];
      const nextM = prev.includes(activeTeam) ? prev : [...prev, activeTeam];
      setFarmMisses({ ...farmMisses, [plot.plot]: nextM });
      onAward({ teamId: activeTeam, points: 0, correct: false, concept: 'Data Science Prediction', misconception: 'Reading weather & soil moisture tables' });
      if (nextM.length >= 2) {
        setFarmTeacherPlot(plot.plot);
        setByteMsg(`👩‍🏫 Both teams missed ${plot.plot}! Teacher, click below to reveal & explain!`);
      } else {
        onSwitchTurn();
        setByteMsg(`❌ Not right for ${plot.plot}! Turn passes to ${teamLabel(otherTeam(activeTeam))} without revealing the answer!`);
      }
    }
  };

  const teacherRevealFarm = () => {
    const p = farmRows.find((x) => x.plot === farmTeacherPlot);
    if (!p) return;
    const next = { ...farmDone, [p.plot]: true };
    setFarmDone(next);
    setFarmTeacherPlot(null);
    setByteMsg(`👩‍🏫 Teacher Reveal — ${p.plot}: ${p.needsWater}. ${p.reason}`);
    onSwitchTurn();
    if (Object.keys(next).length === farmRows.length) markLocDone('farm');
  };

  const placeCV = (id, cat) => {
    if (cvPlaced[id] || cvTeacherId) return;
    setCvSel(null);
    const item = cvPool.find((x) => x.id === id);
    if (item && item.category === cat) {
      const next = { ...cvPlaced, [id]: cat };
      setCvPlaced(next);
      onAward({ teamId: activeTeam, points: 50, correct: true, concept: 'Computer Vision Classification', aiChapter: 'ai-ch3' });
      setByteMsg(`👁️ ${teamLabel(activeTeam)} +50 pts! CV matched ${item.icon} ${item.label} → ${cat}!`);
      if (Object.keys(next).length === cvPool.length) {
        markLocDone('transport');
        onSwitchTurn();
      }
    } else {
      const prev = cvMisses[id] || [];
      const nextM = prev.includes(activeTeam) ? prev : [...prev, activeTeam];
      setCvMisses({ ...cvMisses, [id]: nextM });
      onAward({ teamId: activeTeam, points: 0, correct: false, concept: 'Computer Vision Classification' });
      if (nextM.length >= 2) {
        setCvTeacherId(id);
        setByteMsg(`👩‍🏫 Both teams missed ${item?.label}! Teacher, click below to reveal its category!`);
      } else {
        onSwitchTurn();
        setByteMsg(`❌ Not ${cat}! Turn passes to ${teamLabel(otherTeam(activeTeam))}!`);
      }
    }
  };

  const teacherRevealCV = () => {
    const item = cvPool.find((x) => x.id === cvTeacherId);
    if (!item) return;
    const next = { ...cvPlaced, [item.id]: item.category };
    setCvPlaced(next);
    setCvTeacherId(null);
    setByteMsg(`👩‍🏫 Teacher Reveal: ${item.icon} ${item.label} belongs to ${item.category}.`);
    onSwitchTurn();
    if (Object.keys(next).length === cvPool.length) markLocDone('transport');
  };

  const classifyNLP = (sent, tone) => {
    if (nlpTeacherWait || nlpTriedWrong.includes(tone)) return;
    if (sent.sentiment === tone) {
      onAward({ teamId: activeTeam, points: 100, correct: true, concept: 'NLP Sentiment Classification', aiChapter: 'ai-ch3' });
      setByteMsg(`💬 ${teamLabel(activeTeam)} +100 pts! ${sent.explanation}`);
      onSwitchTurn();
      advanceNLP();
    } else {
      const nextW = [...nlpTriedWrong, tone];
      const nextM = nlpMissTeams.includes(activeTeam) ? nlpMissTeams : [...nlpMissTeams, activeTeam];
      setNlpTriedWrong(nextW);
      setNlpMissTeams(nextM);
      onAward({ teamId: activeTeam, points: 0, correct: false, concept: 'NLP Sentiment Classification', misconception: 'Distinguishing Neutral facts vs Negative/Positive tone' });
      if (nextM.length >= 2) {
        setNlpTeacherWait(true);
        setByteMsg('👩‍🏫 Both teams missed! Teacher, click below to reveal & explain the tone!');
      } else {
        onSwitchTurn();
        setByteMsg(`❌ Not "${tone}"! Turn passes to ${teamLabel(otherTeam(activeTeam))} without revealing the answer!`);
      }
    }
  };

  const advanceNLP = () => {
    setNlpTriedWrong([]);
    setNlpMissTeams([]);
    setNlpTeacherWait(false);
    if (nlpIdx + 1 < nlpList.length) {
      setNlpIdx((i) => i + 1);
    } else {
      setNlpDone(true);
      markLocDone('comms');
    }
  };

  const teacherRevealNLP = () => {
    const s = nlpList[nlpIdx];
    setByteMsg(`👩‍🏫 Teacher Reveal: "${s.text}" is ${s.sentiment}. ${s.explanation}`);
    onSwitchTurn();
    advanceNLP();
  };

  const assignCluster = (objId, clKey) => {
    setClSel(null);
    const clean = {
      c1: clusters.c1.filter((x) => x !== objId),
      c2: clusters.c2.filter((x) => x !== objId),
      c3: clusters.c3.filter((x) => x !== objId)
    };
    clean[clKey] = [...clean[clKey], objId];
    setClusters(clean);
  };

  const verifyClustering = () => {
    const total = clusters.c1.length + clusters.c2.length + clusters.c3.length;
    if (total < clusterObjects.length) {
      setByteMsg('Group all 6 objects into similarity clusters first!');
      return;
    }
    const groups = [clusters.c1, clusters.c2, clusters.c3].filter((g) => g.length > 0);
    const valid = groups.every((g) => {
      const hasFruit = g.some((id) => id === 'cl1' || id === 'cl2');
      const hasAnimal = g.some((id) => id === 'cl3' || id === 'cl4');
      const hasVeh = g.some((id) => id === 'cl5' || id === 'cl6');
      return (hasFruit + hasAnimal + hasVeh) === 1;
    });
    if (valid && groups.length === 3) {
      onAward({ teamId: activeTeam, points: 150, correct: true, earnStar: true, concept: 'Unsupervised Clustering', aiChapter: 'ai-ch3' });
      markLocDone('school');
      setByteMsg(`🧩 Awesome! ${teamLabel(activeTeam)} +150 pts! You discovered 3 natural groups by similarity WITHOUT labels—that is Clustering!`);
      onSwitchTurn();
    } else {
      onAward({ teamId: activeTeam, points: 0, correct: false, concept: 'Unsupervised Clustering' });
      onSwitchTurn();
      setByteMsg(`❌ Check the groups! Turn passes to ${teamLabel(otherTeam(activeTeam))} to group fruits, pets, and vehicles separately!`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {activeLoc && (
            <button
              type="button"
              onClick={() => setActiveLoc(null)}
              className="px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-300 text-slate-800 font-bold text-sm flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> AI City Map
            </button>
          )}
          <h2 className="text-2xl md:text-3xl font-black text-emerald-700 m-0">
            🏙️ Mission 4 · Interactive AI City ({Object.keys(doneLocs).length}/5)
          </h2>
        </div>
        {Object.keys(doneLocs).length >= 3 && (
          <button
            type="button"
            onClick={() => onCompleteMission(4, 'city_explorer', true)}
            className="touch-btn px-5 py-2.5 rounded-2xl bg-emerald-600 text-white font-black text-base cursor-pointer"
          >
            Finish AI City ▶
          </button>
        )}
      </div>

      <ByteGuide message={byteMsg} mood={farmTeacherPlot || cvTeacherId || nlpTeacherWait ? 'alert' : 'happy'} compact />

      {!activeLoc && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {AI_CITY_LOCATIONS.map((loc) => {
            const done = doneLocs[loc.id];
            return (
              <button
                key={loc.id}
                type="button"
                onClick={() => setActiveLoc(loc.id)}
                className={`touch-btn text-left rounded-3xl p-5 border-2 border-b-4 transition-all cursor-pointer hover:scale-[1.02] shadow-sm ${
                  done ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-5xl animate-float">{loc.icon}</span>
                  {done && <CheckCircle2 className="w-7 h-7 text-emerald-600" />}
                </div>
                <div className="text-xl font-black text-slate-900 mt-3">{loc.name}</div>
                <div className="text-xs font-extrabold uppercase tracking-wider text-sky-700 mt-0.5">{loc.domain}</div>
                <p className="text-sm text-slate-600 mt-2 mb-0">{loc.summary}</p>
              </button>
            );
          })}
        </div>
      )}

      {activeLoc === 'farm' && (
        <div className="space-y-3">
          <h3 className="text-xl font-black text-emerald-700 m-0">🌾 Smart Farm · Data Science Pattern &amp; Prediction <span className="text-base">(+100 pts/plot)</span></h3>
          {farmTeacherPlot && (
            <div className="flex justify-center">
              <button type="button" onClick={teacherRevealFarm} className="touch-btn px-6 py-3 rounded-2xl bg-indigo-600 text-white font-black text-lg flex items-center gap-2 cursor-pointer">
                <Eye className="w-5 h-5" /> 👩‍🏫 Teacher: Reveal {farmTeacherPlot} Prediction
              </button>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {farmRows.map((p) => (
              <div key={p.plot} className={`rounded-2xl p-4 border-2 bg-white shadow-sm ${farmDone[p.plot] ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300'}`}>
                <div className="text-lg font-black text-slate-900 mb-2">{p.plot}</div>
                <div className="space-y-2 text-xs font-bold text-slate-700 mb-3">
                  <div>
                    <div className="flex justify-between"><span>🌡️ Temp</span><span>{p.temp}°C</span></div>
                    <div className="h-2.5 bg-slate-200 rounded-full"><div className="h-full bg-orange-500 rounded-full" style={{ width: `${Math.min(100, p.temp * 2.2)}%` }} /></div>
                  </div>
                  <div>
                    <div className="flex justify-between"><span>🌧️ Rainfall</span><span>{p.rainfall} mm</span></div>
                    <div className="h-2.5 bg-slate-200 rounded-full"><div className="h-full bg-sky-500 rounded-full" style={{ width: `${Math.min(100, p.rainfall * 4)}%` }} /></div>
                  </div>
                  <div>
                    <div className="flex justify-between"><span>💧 Soil Moisture</span><span>{p.moisture}%</span></div>
                    <div className="h-2.5 bg-slate-200 rounded-full"><div className="h-full bg-emerald-500 rounded-full" style={{ width: `${p.moisture}%` }} /></div>
                  </div>
                </div>
                {farmDone[p.plot] ? (
                  <div className="p-2 rounded-xl bg-emerald-600 text-white font-black text-center">✅ {p.needsWater}</div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" disabled={Boolean(farmTeacherPlot)} onClick={() => predictFarm(p, 'Yes – Water Now')} className="py-2 rounded-xl bg-sky-600 text-white font-black text-xs cursor-pointer disabled:opacity-40">💧 Water Now</button>
                    <button type="button" disabled={Boolean(farmTeacherPlot)} onClick={() => predictFarm(p, 'No – Soil Moist')} className="py-2 rounded-xl bg-slate-200 text-slate-900 font-black text-xs cursor-pointer disabled:opacity-40">🌿 Soil Moist</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeLoc === 'transport' && (
        <div className="space-y-3">
          <h3 className="text-xl font-black text-orange-700 m-0">🚦 Smart Transport · Computer Vision Image Classification <span className="text-base text-emerald-700">(+50 pts/image)</span></h3>
          {cvTeacherId && (
            <div className="flex justify-center">
              <button type="button" onClick={teacherRevealCV} className="touch-btn px-6 py-3 rounded-2xl bg-indigo-600 text-white font-black text-lg flex items-center gap-2 cursor-pointer">
                <Eye className="w-5 h-5" /> 👩‍🏫 Teacher: Reveal Image Category
              </button>
            </div>
          )}
          <div className="rounded-2xl p-3 bg-slate-100 border-2 border-dashed border-slate-300 flex flex-wrap gap-2 justify-center">
            {cvPool.filter((c) => !cvPlaced[c.id]).map((c) => (
              <button
                key={c.id}
                type="button"
                disabled={Boolean(cvTeacherId)}
                draggable={!cvTeacherId}
                onDragStart={(e) => { e.dataTransfer.setData('text/plain', c.id); setCvSel(c.id); }}
                onClick={() => setCvSel(cvSel === c.id ? null : c.id)}
                className={`touch-btn px-4 py-2 rounded-2xl border-2 border-b-4 font-black text-base cursor-grab ${
                  cvSel === c.id ? 'bg-sky-600 text-white border-sky-800' : 'bg-white text-slate-900 border-slate-300 shadow-sm'
                }`}
              >
                <span className="text-2xl mr-1">{c.icon}</span> {c.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {['Animals', 'Fruits', 'Vehicles'].map((cat) => (
              <div
                key={cat}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const id = e.dataTransfer.getData('text/plain') || cvSel;
                  if (id) placeCV(id, cat);
                }}
                onClick={() => cvSel && placeCV(cvSel, cat)}
                className="rounded-2xl p-4 border-2 border-dashed border-orange-400 bg-orange-50/70 min-h-[140px] cursor-pointer"
              >
                <div className="font-black text-lg text-orange-800 mb-2">{cat}</div>
                <div className="flex flex-wrap gap-1.5">
                  {cvPool.filter((c) => cvPlaced[c.id] === cat).map((c) => (
                    <span key={c.id} className="px-2.5 py-1 rounded-xl bg-white border border-emerald-400 text-emerald-900 font-bold text-sm">
                      {c.icon} {c.label}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeLoc === 'comms' && (
        <div className="space-y-4">
          <h3 className="text-xl font-black text-sky-700 m-0">📡 Smart Communication Centre · NLP Sentiment Analysis <span className="text-base text-emerald-700">(+100 pts/sentence)</span></h3>
          {nlpDone ? (
            <div className="rounded-2xl p-6 bg-emerald-50 border-2 border-emerald-400 text-center text-2xl font-black text-emerald-800">
              🎉 All 6 Sentences Classified! NLP Mastered!
            </div>
          ) : (
            <div className="rounded-3xl p-6 text-center bg-sky-50 border-2 border-sky-300 space-y-4">
              <div className="text-xs font-black uppercase text-sky-800">Sentence {nlpIdx + 1}/{nlpList.length}</div>
              <div className="text-2xl md:text-3xl font-black text-slate-900">"{nlpList[nlpIdx].text}"</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
                {[
                  { tone: 'Positive', ico: '😊', cls: 'bg-emerald-600 text-white' },
                  { tone: 'Neutral', ico: '😐', cls: 'bg-white text-slate-900 border-2 border-slate-400' },
                  { tone: 'Negative', ico: '😟', cls: 'bg-rose-600 text-white' }
                ].map((btn) => {
                  const wrongTried = nlpTriedWrong.includes(btn.tone);
                  return (
                    <button
                      key={btn.tone}
                      type="button"
                      disabled={nlpTeacherWait || wrongTried}
                      onClick={() => classifyNLP(nlpList[nlpIdx], btn.tone)}
                      className={`touch-btn py-4 rounded-2xl font-black text-xl cursor-pointer shadow-sm disabled:opacity-40 ${wrongTried ? 'line-through' : ''} ${btn.cls}`}
                    >
                      {btn.ico} {btn.tone}
                    </button>
                  );
                })}
              </div>
              {nlpTeacherWait && (
                <div className="flex justify-center">
                  <button type="button" onClick={teacherRevealNLP} className="touch-btn px-6 py-3 rounded-2xl bg-indigo-600 text-white font-black text-lg flex items-center gap-2 cursor-pointer">
                    <Eye className="w-5 h-5" /> 👩‍🏫 Teacher: Reveal Tone &amp; Next Sentence
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeLoc === 'hospital' && (
        <div className="rounded-3xl p-6 space-y-4 bg-rose-50 border-2 border-rose-300">
          <h3 className="text-2xl font-black text-rose-800 m-0">🏥 Smart Hospital · AI Benefits &amp; Limitations <span className="text-base text-emerald-700">(Worth +150 pts)</span></h3>
          <p className="text-lg md:text-xl text-slate-800 font-semibold">
            An AI scan detector flags an unusual shadow on an X-ray in 2 seconds. What should happen next?
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {hospOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                disabled={hospDone}
                onClick={() => {
                  if (opt.ok) {
                    setHospDone(true);
                    markLocDone('hospital');
                    onAward({ teamId: activeTeam, points: 150, correct: true, concept: 'Human Oversight in Healthcare AI', aiChapter: 'ai-ch3' });
                    setByteMsg(`🏥 ${teamLabel(activeTeam)} +150 pts! AI speeds up scan screening, while a qualified doctor confirms the diagnosis!`);
                    onSwitchTurn();
                  } else {
                    onAward({ teamId: activeTeam, points: 0, correct: false, concept: 'AI Limitations', misconception: 'Blindly trusting medical AI' });
                    onSwitchTurn();
                    setByteMsg(`❌ Not safe! Turn passes to ${teamLabel(otherTeam(activeTeam))} without revealing the answer!`);
                  }
                }}
                className={`touch-btn p-4 rounded-2xl border-2 text-left font-bold text-lg cursor-pointer shadow-sm ${
                  hospDone && opt.ok ? 'bg-emerald-600 text-white border-emerald-700' : 'bg-white border-slate-300 text-slate-900'
                }`}
              >
                {opt.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {activeLoc === 'school' && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setSchoolMode('cluster')}
              className={`px-4 py-2 rounded-xl font-black text-sm cursor-pointer ${schoolMode === 'cluster' ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-800 border border-slate-300'}`}
            >
              🧩 Unsupervised Clustering Game (+150 pts)
            </button>
            <button
              type="button"
              onClick={() => setSchoolMode('art')}
              className={`px-4 py-2 rounded-xl font-black text-sm cursor-pointer ${schoolMode === 'art' ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-800 border border-slate-300'}`}
            >
              🎨 AI Robot Colouring Studio (+150 pts)
            </button>
          </div>

          {schoolMode === 'cluster' ? (
            <div className="space-y-3">
              <div className="rounded-2xl p-3 bg-slate-100 border-2 border-dashed border-slate-300 flex flex-wrap gap-2 justify-center">
                {clusterObjects.filter((o) => ![...clusters.c1, ...clusters.c2, ...clusters.c3].includes(o.id)).map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    draggable
                    onDragStart={(e) => { e.dataTransfer.setData('text/plain', o.id); setClSel(o.id); }}
                    onClick={() => setClSel(clSel === o.id ? null : o.id)}
                    className={`touch-btn px-4 py-2 rounded-2xl border-2 font-black text-lg cursor-grab ${
                      clSel === o.id ? 'bg-violet-600 text-white border-violet-800' : 'bg-white text-slate-900 border-slate-300 shadow-sm'
                    }`}
                  >
                    {o.icon} {o.label}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {['c1', 'c2', 'c3'].map((ck, idx) => (
                  <div
                    key={ck}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const id = e.dataTransfer.getData('text/plain') || clSel;
                      if (id) assignCluster(id, ck);
                    }}
                    onClick={() => clSel && assignCluster(clSel, ck)}
                    className="rounded-2xl p-4 border-2 border-dashed border-violet-400 bg-violet-50 min-h-[120px] cursor-pointer"
                  >
                    <div className="font-black text-violet-800">Unlabelled Cluster {idx + 1}</div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {clusters[ck].map((oid) => {
                        const o = clusterObjects.find((x) => x.id === oid);
                        return o ? (
                          <span key={oid} className="px-2.5 py-1 rounded-xl bg-white border border-violet-400 text-slate-900 font-bold">
                            {o.icon} {o.label}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center">
                <button type="button" onClick={verifyClustering} className="touch-btn px-6 py-3 rounded-2xl bg-emerald-600 text-white font-black text-lg cursor-pointer">
                  ✅ Verify Similarity Clusters (+150 pts)
                </button>
              </div>
            </div>
          ) : (
            <ColouringCanvas activeTeam={activeTeam} onAward={onAward} />
          )}
        </div>
      )}
    </div>
  );
}
