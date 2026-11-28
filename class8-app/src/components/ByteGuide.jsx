import React from 'react';

const MOOD_FACE = {
  happy: { eyes: 'bg-sky-400', mouth: 'rounded-b-full h-3 w-7 bg-sky-400', glow: 'border-sky-400 bg-sky-50/95' },
  excited: { eyes: 'bg-amber-400', mouth: 'rounded-full h-4 w-8 bg-amber-400', glow: 'border-amber-400 bg-amber-50/95' },
  thinking: { eyes: 'bg-violet-400', mouth: 'rounded-full h-1.5 w-6 bg-violet-400', glow: 'border-violet-400 bg-violet-50/95' },
  alert: { eyes: 'bg-rose-400', mouth: 'rounded-t-full h-2.5 w-6 bg-rose-400', glow: 'border-rose-400 bg-rose-50/95' }
};

export default function ByteGuide({
  message = 'Welcome, AI Explorers! Today, your brains are the ultimate supercomputers!',
  mood = 'happy',
  compact = false
}) {
  const style = MOOD_FACE[mood] || MOOD_FACE.happy;

  return (
    <div className={`flex items-center gap-4 ${compact ? 'py-2.5 px-3.5' : 'p-4'} rounded-2xl border-2 shadow-sm animate-pop ${style.glow}`}>
      <div className={`relative shrink-0 ${compact ? 'w-14 h-14' : 'w-20 h-20'} rounded-2xl bg-gradient-to-br from-indigo-700 to-slate-900 border-2 border-sky-400 flex flex-col items-center justify-center shadow-md animate-float`}>
        <div className="absolute -top-2.5 w-1.5 h-3 bg-sky-500 rounded-full" />
        <div className="absolute -top-4 w-3 h-3 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8]" />
        <div className="flex gap-2.5 mb-1.5">
          <span className={`w-2.5 h-2.5 rounded-full ${style.eyes}`} />
          <span className={`w-2.5 h-2.5 rounded-full ${style.eyes}`} />
        </div>
        <div className={style.mouth} />
        <span className="mt-1 text-[10px] font-black tracking-widest text-sky-200">BYTE</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-black uppercase tracking-wider text-sky-700 mb-0.5">
          🤖 BYTE · AI Lab Guide
        </div>
        <p className={`${compact ? 'text-base md:text-lg' : 'text-xl md:text-2xl'} font-bold text-slate-900 leading-snug m-0`}>
          {message}
        </p>
      </div>
    </div>
  );
}
