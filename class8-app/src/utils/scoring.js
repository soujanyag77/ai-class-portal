export const SCORE_VALUES = {
  CORRECT: 100,
  PUZZLE: 150,
  CREATIVE: 150,
  EXPLANATION_BONUS: 50,
  COLLABORATION_BONUS: 50,
  PARTIAL_LEARNING: 50
};

export const BADGE_CATALOG = [
  { id: 'ai_spotter', name: 'AI Spotter', icon: '🕵️', reason: 'Reasoning in Human vs AI' },
  { id: 'ct_master', name: 'Logic Architect', icon: '🧩', reason: 'Computational Thinking mastery' },
  { id: 'cycle_builder', name: 'Lifecycle Builder', icon: '🔄', reason: 'Problem Solving in AI Lifecycle' },
  { id: 'city_explorer', name: 'AI City Explorer', icon: '🏙️', reason: 'Mastered AI Domains' },
  { id: 'creative_spark', name: 'Creative Thinker', icon: '🎨', reason: 'Creative AI Art & Design' },
  { id: 'fairness_champion', name: 'Fairness Guardian', icon: '⚖️', reason: 'Fairness & Bias repair' },
  { id: 'ethics_judge', name: 'Ethics Judge', icon: '🛡️', reason: 'Responsible AI Judgement' },
  { id: 'bug_slayer', name: 'Team Collaborator', icon: '🤝', reason: 'Collaboration against The Bug Master' }
];

export function createInitialTeams() {
  return {
    blue: {
      id: 'blue',
      name: 'TEAM BLUE – CYBER TITANS',
      shortName: 'CYBER TITANS',
      avatar: '🤖',
      score: 0,
      stars: 0,
      streak: 0,
      badges: [],
      completedMissions: [],
      correctCount: 0,
      attemptCount: 0
    },
    orange: {
      id: 'orange',
      name: 'TEAM ORANGE – DATA DRAGONS',
      shortName: 'DATA DRAGONS',
      avatar: '🐉',
      score: 0,
      stars: 0,
      streak: 0,
      badges: [],
      completedMissions: [],
      correctCount: 0,
      attemptCount: 0
    }
  };
}

export function applyScore(teams, teamId, { points = 100, correct = true, earnStar = false, badgeId = null, missionId = null }) {
  const target = teams[teamId];
  if (!target) return teams;
  const nextStreak = correct ? target.streak + 1 : 0;
  const nextBadges = badgeId && !target.badges.includes(badgeId) ? [...target.badges, badgeId] : target.badges;
  const nextCompleted = missionId && !target.completedMissions.includes(missionId)
    ? [...target.completedMissions, missionId]
    : target.completedMissions;

  return {
    ...teams,
    [teamId]: {
      ...target,
      score: Math.max(0, target.score + points),
      stars: target.stars + (earnStar || (correct && nextStreak > 0 && nextStreak % 3 === 0) ? 1 : 0),
      streak: nextStreak,
      badges: nextBadges,
      completedMissions: nextCompleted,
      correctCount: target.correctCount + (correct ? 1 : 0),
      attemptCount: target.attemptCount + 1
    }
  };
}
