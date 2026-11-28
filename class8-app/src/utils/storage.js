import { createInitialTeams } from './scoring.js';

const STORAGE_KEY = 'kv_class8_ai_championship_v1';

export function getDefaultState() {
  return {
    settings: {
      className: 'Class VIII – A',
      schoolName: 'PM SHRI Kendriya Vidyalaya',
      teacherName: 'PGT Computer Science',
      sessionMode: 'full30',
      progression: 'manual', // 'auto' | 'manual'
      selectedModule: 'all',
      soundEnabled: true,
      teacherPin: '4178'
    },
    teams: createInitialTeams(),
    activeTeam: 'blue',
    currentMission: 1,
    sessionLeft: 1800,
    missionLeft: 180,
    timerRunning: false,
    bossEnergy: 100,
    bossResolved: [],
    participation: [], // { student, team, mission, concept, note, time }
    conceptLog: [],    // { concept, correct, team }
    misconceptions: [],
    curriculumCoverage: {
      ai: [],
      ct: []
    },
    beforeAssessment: {}, // { qId: selectedIndex }
    afterAssessment: {},  // { qId: selectedIndex }
    teacherNotes: ''
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultState();
    const parsed = JSON.parse(raw);
    const def = getDefaultState();
    return {
      ...def,
      ...parsed,
      settings: { ...def.settings, ...(parsed.settings || {}) },
      teams: {
        blue: { ...def.teams.blue, ...(parsed.teams?.blue || {}) },
        orange: { ...def.teams.orange, ...(parsed.teams?.orange || {}) }
      },
      curriculumCoverage: {
        ai: parsed.curriculumCoverage?.ai || [],
        ct: parsed.curriculumCoverage?.ct || []
      }
    };
  } catch {
    return getDefaultState();
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota errors
  }
}

export function clearStoredState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore
  }
  return getDefaultState();
}
