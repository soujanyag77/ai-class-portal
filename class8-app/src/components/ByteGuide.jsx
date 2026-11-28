import React from 'react';

const MOOD_FACE = {
  happy: { eyes: 'bg-cyan-300', mouth: 'rounded-b-full h-3 w-7 bg-cyan-300', glow: 'border-cyan-400/70' },
  excited: { eyes: 'bg-amber-300', mouth: 'rounded-full h-4 w-8 bg-amber-300', glow: 'border-amber-400/80' },
  thinking: { eyes: 'bg-violet-300', mouth: 'rounded-full h-1.5 w-6 bg-violet-300', glow: 'border-violet-400/70' },
  alert: { eyes: 'bg-rose-400', mouth: 'rounded-t-full h-2.5 w-6 bg-rose-400', glow: 'border-rose-400/80' }
};

export default function ByteGuide({
  message = 'Welcome, AI Explorers! Today, your brains are the ultimate supercomputers!',
  mood = 'happy',
  compact = false
}) {
  const style = MOOD_FACE[mood] || MOOD_FACE.happy;

  return (
    <div className={`flex items-center gap-4 ${compact ? 'py-2 px-3' : 'p-4'} glass-panel rounded-2xl border-2 ${style.glow} animate-pop`}>
      <div className={`relative shrink-0 ${compact ? 'w-14 h-14' : 'w-20 h-20'} rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 border-2 border-cyan-400/70 flex flex-col items-center justify-center shadow-lg animate-float`}>
        <div className="absolute -top-2.5 w-1.5 h-3 bg-cyan-300 rounded-full" />
        <div className="absolute -top-4 w-3 h-3 rounded-full bg-cyan-300 shadow-[0_0_10px_#22d3ee]" />
        <div className="flex gap-2.5 mb-1.5">
          <span className={`w-2.5 h-2.5 rounded-full ${style.eyes} shadow-[0_0_8px_currentColor]`} />
          <span className={`w-2.5 h-2.5 rounded-full ${style.eyes} shadow-[0_0_8px_currentColor]`} />
        </div>
        <div className={style.mouth} />
        <span className="mt-1 text-[10px] font-black tracking-widest text-cyan-300">BYTE</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-black uppercase tracking-wider text-cyan-300 mb-0.5">
          🤖 BYTE · AI Lab Guide
        </div>
        <p className={`${compact ? 'text-base md:text-lg' : 'text-xl md:text-2xl'} font-bold text-slate-100 leading-snug m-0`}>
          {message}
        </p>
      </div>
    </div>
  );
}
