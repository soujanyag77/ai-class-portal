import React, { useEffect, useRef, useState } from 'react';
import { Eraser, Palette, Sparkles, Download } from 'lucide-react';
import { SCORE_VALUES } from '../utils/scoring.js';

const PALETTE = [
  { name: 'Sky Blue', hex: '#0284c7' },
  { name: 'Orange', hex: '#f97316' },
  { name: 'Gold', hex: '#eab308' },
  { name: 'Emerald', hex: '#10b981' },
  { name: 'Violet', hex: '#7c3aed' },
  { name: 'Rose', hex: '#e11d48' },
  { name: 'White', hex: '#ffffff' },
  { name: 'Navy', hex: '#0f172a' }
];

export default function ColouringCanvas({ activeTeam, onAward }) {
  const canvasRef = useRef(null);
  const drawingRef = useRef(false);
  const [color, setColor] = useState('#0284c7');
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
      ctx.strokeRect(175, 70, 170, 125);
      ctx.beginPath(); ctx.moveTo(260, 70); ctx.lineTo(260, 38); ctx.stroke();
      ctx.beginPath(); ctx.arc(260, 30, 10, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(225, 118, 16, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(295, 118, 16, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeRect(225, 155, 70, 18);
      ctx.strokeRect(150, 208, 220, 115);
      ctx.beginPath(); ctx.arc(260, 265, 28, 0, Math.PI * 2); ctx.stroke();
    } else if (tpl === 'circuit') {
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
          <h3 className="text-xl font-black text-violet-700 m-0 flex items-center gap-2">
            <Palette className="w-5 h-5" /> Creative AI Colouring &amp; Design Studio
          </h3>
          <p className="text-sm text-slate-700 m-0">
            Touch &amp; colour BYTE or design your own helpful school AI robot to earn <b>+150 creative points</b> &amp; a Bonus Star!
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
                template === t.id ? 'bg-violet-600 text-white border-violet-700' : 'bg-slate-100 text-slate-800 border-slate-300'
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
              color === c.hex ? 'border-slate-900 scale-110 shadow-md' : 'border-slate-300'
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
                brush === sz ? 'bg-sky-600 text-white border-sky-700' : 'bg-slate-100 text-slate-800 border-slate-300'
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
          className="rounded-2xl border-4 border-slate-300 bg-white max-w-full touch-none cursor-crosshair shadow-md"
        />
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => drawTemplate(template)}
          className="px-4 py-2.5 rounded-xl bg-slate-100 border border-slate-300 text-slate-800 font-bold text-sm flex items-center gap-1.5 cursor-pointer"
        >
          <Eraser className="w-4 h-4" /> Clear
        </button>
        <button
          type="button"
          onClick={downloadPNG}
          className="px-4 py-2.5 rounded-xl bg-slate-100 border border-slate-300 text-slate-800 font-bold text-sm flex items-center gap-1.5 cursor-pointer"
        >
          <Download className="w-4 h-4" /> Save Art
        </button>
        <button
          type="button"
          onClick={submitArt}
          disabled={awarded}
          className="touch-btn px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-base flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-sm"
        >
          <Sparkles className="w-5 h-5" /> {awarded ? 'Creative Points Awarded! ⭐' : 'Award Creative +150 pts & Star ⭐'}
        </button>
      </div>
    </div>
  );
}
