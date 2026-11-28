export const SESSION_MODES = {
  full30: {
    id: 'full30',
    label: '30-Minute Full Championship',
    totalSeconds: 1800,
    missionDurations: { 1: 180, 2: 300, 3: 300, 4: 300, 5: 300, 6: 240, 7: 180 }
  },
  quick5: {
    id: 'quick5',
    label: '5-Minute Quick Revision',
    totalSeconds: 300,
    missionDurations: { 1: 40, 2: 45, 3: 45, 4: 45, 5: 45, 6: 40, 7: 40 }
  }
};

export function formatClock(seconds) {
  const s = Math.max(0, Math.floor(seconds));
  const m = String(Math.floor(s / 60)).padStart(2, '0');
  const rem = String(s % 60).padStart(2, '0');
  return `${m}:${rem}`;
}
