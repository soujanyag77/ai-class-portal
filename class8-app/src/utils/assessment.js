export function gradeAssessment(questions, answers) {
  let score = 0;
  const details = questions.map((q) => {
    const chosen = answers[q.id];
    const isCorrect = chosen === q.answerIndex;
    if (isCorrect) score++;
    return {
      id: q.id,
      concept: q.concept,
      chosen,
      isCorrect,
      correctText: q.options[q.answerIndex]
    };
  });
  return {
    score,
    total: questions.length,
    pct: questions.length ? Math.round((score / questions.length) * 100) : 0,
    details
  };
}

export function buildLearningSummary(state, beforeQs, afterQs) {
  const before = gradeAssessment(beforeQs, state.beforeAssessment || {});
  const after = gradeAssessment(afterQs, state.afterAssessment || {});
  const deltaPct = after.pct - before.pct;

  const conceptsUnderstood = Array.from(
    new Set((state.conceptLog || []).filter((c) => c.correct).map((c) => c.concept))
  );
  const misconceptions = Array.from(
    new Set(state.misconceptions || [])
  );
  const ctSkills = Array.from(
    new Set((state.curriculumCoverage?.ct || []))
  );

  const followUp = misconceptions.length > 0
    ? `Revisit "${misconceptions[0]}" using a 5-minute hands-on board recap in the next CS period.`
    : 'Invite students to design a 1-page AI Project Lifecycle poster linking an SDG to their school!';

  return {
    before,
    after,
    deltaPct,
    conceptsUnderstood,
    misconceptions,
    ctSkills,
    followUp
  };
}

export function exportReportCSV(state, summary) {
  const rows = [
    ['THE ULTIMATE AI CHAMPIONSHIP - CLASS 8 LEARNING REPORT'],
    ['School', state.settings.schoolName],
    ['Class', state.settings.className],
    ['Teacher', state.settings.teacherName],
    ['Date', new Date().toLocaleDateString()],
    [],
    ['TEAM STANDINGS', 'Score', 'Stars', 'Streak', 'Badges', 'Missions Completed'],
    [
      state.teams.blue.name,
      state.teams.blue.score,
      state.teams.blue.stars,
      state.teams.blue.streak,
      state.teams.blue.badges.join(' | '),
      state.teams.blue.completedMissions.join(' | ')
    ],
    [
      state.teams.orange.name,
      state.teams.orange.score,
      state.teams.orange.stars,
      state.teams.orange.streak,
      state.teams.orange.badges.join(' | '),
      state.teams.orange.completedMissions.join(' | ')
    ],
    [],
    ['LEARNING ASSESSMENT', 'Before', 'After', 'Improvement'],
    ['Score', `${summary.before.score}/${summary.before.total}`, `${summary.after.score}/${summary.after.total}`, `${summary.deltaPct >= 0 ? '+' : ''}${summary.deltaPct}%`],
    [],
    ['AI Concepts Understood', summary.conceptsUnderstood.join(' | ') || 'None logged yet'],
    ['Common Misconceptions', summary.misconceptions.join(' | ') || 'None recorded'],
    ['Teacher Notes', state.teacherNotes || 'N/A'],
    ['Suggested Follow-Up', summary.followUp],
    [],
    ['INDIVIDUAL STUDENT PARTICIPATION', 'Team', 'Mission', 'Concept', 'Note', 'Time'],
    ...(state.participation || []).map((p) => [p.student, p.team, p.mission, p.concept, p.note, p.time])
  ];

  const csv = rows
    .map((r) => r.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Class8_AI_Championship_Report_${Date.now()}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
