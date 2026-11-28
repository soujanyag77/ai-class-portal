import React, { useEffect, useRef, useState } from 'react';
import { Eraser, Palette, Sparkles, Download } from 'lucide-react';
import { SCORE_VALUES } from '../utils/scoring.js';

const PALETTE = [
  { name: 'Cyan', hex: '#22d3ee' },
  { name: 'Orange', hex: '#fb923c' },
  { name: 'Gold', hex: '#facc15' },
  { name: 'Emerald', hex: '#34d399' },
  { name: 'Violet', hex: '#a78bfa' },
  { name: 'Rose', hex: '#fb7185' },
  { name: 'White', hex: '#f8fafc' },
  { name: 'Dark', hex: '#0f172a' }
];

export default function ColouringCanvas({ activeTeam, onAward }) {
  const canvasRef = useRef(null);
  const drawingRef = useRef(false);
  const [color, setColor] = useState('#22d3ee');
  const [brush, setBrush] = useState(10);
  const [template, setTemplate] = useState('robot');
  const [awarded, setAwarded] = useState(false);

  const drawTemplate = (tpl) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 4;
    if (tpl === 'robot') {
      // Colouring outline of BYTE Robot
      ctx.strokeRect(175, 70, 170, 125); // head
      ctx.beginPath();
      ctx.moveTo(260, 70); ctx.lineTo(260, 38); ctx.stroke();
      ctx.beginPath(); ctx.arc(260, 30, 10, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(225, 118, 16, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(295, 118, 16, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeRect(225, 155, 70, 18); // mouth
      ctx.strokeRect(150, 208, 220, 115); // body
      ctx.beginPath(); ctx.arc(260, 265, 28, 0, Math.PI * 2); ctx.stroke(); // core
    } else if (tpl === 'circuit') {
      // Smart AI Brain / Circuit grid
      ctx.beginPath(); ctx.arc(260, 175, 90, 0, Math.PI * 2); ctx.stroke();
      [[100, 100, 185, 130], [100, 250, 185, 220], [420, 100, 335, 130], [420, 250, 335, 220]].forEach(([x1, y1, x2, y2]) => {
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
        ctx.beginPath(); ctx.arc(x1, y1, 14, 0, Math.PI * 2); ctx.stroke();
      });
    }
    setAwarded(false);
  };

  useEffect(() => {
    drawTemplate(template);
  }, [template]);

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height
    };
  };

  const onDown = (e) => {
    e.currentTarget.setPointerCapture?.(e.pointerId);
    drawingRef.current = true;
    const ctx = canvasRef.current.getContext('2d');
    const p = getPos(e);
    ctx.beginPath();
    ctx.arc(p.x, p.y, brush / 2, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  };

  const onMove = (e) => {
    if (!drawingRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    const p = getPos(e);
    ctx.lineTo(p.x, p.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = brush;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const onUp = () => {
    drawingRef.current = false;
  };

  const submitArt = () => {
    if (awarded) return;
    setAwarded(true);
    onAward({
      teamId: activeTeam,
      points: SCORE_VALUES.CREATIVE,
      correct: true,
      earnStar: true,
      badgeId: 'creative_spark',
      concept: 'Creative AI Design'
    });
  };

  const downloadPNG = () => {
    const a = document.createElement('a');
    a.href = canvasRef.current.toDataURL('image/png');
    a.download = `AI_Robot_Design_${Date.now()}.png`;
    a.click();
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-xl font-black text-violet-300 m-0 flex items-center gap-2">
            <Palette className="w-5 h-5" /> Creative AI Colouring &amp; Design Studio
          </h3>
          <p className="text-sm text-slate-300 m-0">
            Touch &amp; colour BYTE or design your own helpful school AI robot to earn +150 creative points &amp; a Bonus Star!
          </p>
        </div>
        <div className="flex gap-1.5">
          {[
            { id: 'robot', label: '🤖 BYTE Robot' },
            { id: 'circuit', label: '🧠 AI Circuit' },
            { id: 'blank', label: '✨ Free Draw' }
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTemplate(t.id)}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs border cursor-pointer ${
                template === t.id ? 'bg-violet-400 text-slate-950 border-violet-200' : 'bg-slate-800 text-slate-200 border-slate-600'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {PALETTE.map((c) => (
          <button
            key={c.hex}
            type="button"
            onClick={() => setColor(c.hex)}
            style={{ backgroundColor: c.hex }}
            className={`w-10 h-10 rounded-full border-4 cursor-pointer transition-transform ${
              color === c.hex ? 'border-white scale-110' : 'border-slate-700'
            }`}
            title={c.name}
          />
        ))}
        <div className="flex gap-1 ml-2">
          {[6, 12, 20].map((sz) => (
            <button
              key={sz}
              type="button"
              onClick={() => setBrush(sz)}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs border cursor-pointer ${
                brush === sz ? 'bg-cyan-400 text-slate-950 border-cyan-200' : 'bg-slate-800 text-slate-200 border-slate-600'
              }`}
            >
              {sz === 6 ? 'Thin' : sz === 12 ? 'Med' : 'Thick'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          width={520}
          height={340}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          className="rounded-2xl border-4 border-slate-600 bg-white max-w-full touch-none cursor-crosshair shadow-xl"
        />
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => drawTemplate(template)}
          className="px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-600 text-slate-200 font-bold text-sm flex items-center gap-1.5 cursor-pointer"
        >
          <Eraser className="w-4 h-4" /> Clear
        </button>
        <button
          type="button"
          onClick={downloadPNG}
          className="px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-600 text-slate-200 font-bold text-sm flex items-center gap-1.5 cursor-pointer"
        >
          <Download className="w-4 h-4" /> Save Art
        </button>
        <button
          type="button"
          onClick={submitArt}
          disabled={awarded}
          className="touch-btn px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-base flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <Sparkles className="w-5 h-5" /> {awarded ? 'Creative Points Awarded! ⭐' : 'Award Creative +150 pts & Star ⭐'}
        </button>
      </div>
    </div>
  );
}
