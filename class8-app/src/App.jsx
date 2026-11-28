import React, { useEffect, useState } from 'react';
import Home from './pages/Home.jsx';
import Championship from './pages/Championship.jsx';
import Teacher from './pages/Teacher.jsx';
import CurriculumExplorer from './pages/CurriculumExplorer.jsx';
import Reports from './pages/Reports.jsx';
import { loadState, saveState, clearStoredState } from './utils/storage.js';
import { applyScore, createInitialTeams } from './utils/scoring.js';
import { SESSION_MODES } from './utils/timer.js';
import { launchConfetti, sfx } from './utils/sfx.js';

export default function App() {
  const [state, setState] = useState(() => loadState());
  const [page, setPage] = useState('home'); // home | championship | teacher | concepts | reports
  const [revealHint, setRevealHint] = useState(false);
  const [revealAnswer, setRevealAnswer] = useState(false);

  useEffect(() => {
    saveState(state);
    sfx.setMuted(!state.settings.soundEnabled);
  }, [state]);

  // Countdown tick during Championship
  useEffect(() => {
    if (page !== 'championship' || !state.timerRunning) return;
    const id = setInterval(() => {
      setState((prev) => {
        if (!prev.timerRunning) return prev;
        const nextSession = Math.max(0, prev.sessionLeft - 1);
        const nextMissionLeft = Math.max(0, prev.missionLeft - 1);

        if (nextMissionLeft === 0 && prev.settings.progression === 'auto' && prev.currentMission < 7) {
          const nextM = prev.currentMission + 1;
          const modeCfg = SESSION_MODES[prev.settings.sessionMode] || SESSION_MODES.full30;
          sfx.bonus();
          return {
            ...prev,
            currentMission: nextM,
            missionLeft: modeCfg.missionDurations[nextM] || 180,
            sessionLeft: nextSession
          };
        }
        return {
          ...prev,
          sessionLeft: nextSession,
          missionLeft: nextMissionLeft
        };
      });
    }, 1000);
    return () => clearInterval(id);
  }, [page, state.timerRunning]);

  const updateSettings = (patch) => {
    setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...patch }
    }));
  };

  const startMode = (modeId, startMissionOverride = null) => {
    const modeCfg = SESSION_MODES[modeId] || SESSION_MODES.full30;
    const modSel = state.settings.selectedModule;
    const startM = startMissionOverride || (modSel !== 'all' ? Number(modSel) : 1);
    setRevealHint(false);
    setRevealAnswer(false);
    sfx.bonus();
    setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, sessionMode: modeId },
      currentMission: startM,
      sessionLeft: modeCfg.totalSeconds,
      missionLeft: modeCfg.missionDurations[startM] || 180,
      timerRunning: true
    }));
    setPage('championship');
  };

  const handleStartChampionship = () => {
    startMode(state.settings.sessionMode);
  };

  const selectMission = (mId) => {
    const modeCfg = SESSION_MODES[state.settings.sessionMode] || SESSION_MODES.full30;
    setRevealHint(false);
    setRevealAnswer(false);
    sfx.pop();
    setState((prev) => ({
      ...prev,
      currentMission: mId,
      missionLeft: modeCfg.missionDurations[mId] || 180
    }));
  };

  const handleAward = ({
    teamId,
    points = 100,
    correct = true,
    earnStar = false,
    badgeId = null,
    concept = null,
    misconception = null,
    aiChapter = null,
    ctChapter = null
  }) => {
    if (correct) {
      sfx.good();
      if (earnStar || points >= 150) launchConfetti(20);
    } else {
      sfx.bad();
    }

    setState((prev) => ({
      ...prev,
      teams: applyScore(prev.teams, teamId, { points, correct, earnStar, badgeId }),
      conceptLog: concept ? [...prev.conceptLog, { concept, correct, team: teamId }].slice(-60) : prev.conceptLog,
      misconceptions: misconception && !prev.misconceptions.includes(misconception)
        ? [...prev.misconceptions, misconception]
        : prev.misconceptions,
      curriculumCoverage: {
        ai: aiChapter && !prev.curriculumCoverage.ai.includes(aiChapter)
          ? [...prev.curriculumCoverage.ai, aiChapter]
          : prev.curriculumCoverage.ai,
        ct: ctChapter && !prev.curriculumCoverage.ct.includes(ctChapter)
          ? [...prev.curriculumCoverage.ct, ctChapter]
          : prev.curriculumCoverage.ct
      }
    }));
  };

  const handleCompleteMission = (missionId, badgeId, advance = false) => {
    sfx.victory();
    launchConfetti(32, ['🏆', '⭐', '🎉', '🤖']);
    setRevealHint(false);
    setRevealAnswer(false);
    setState((prev) => {
      const nextTeams = applyScore(
        applyScore(prev.teams, 'blue', { points: 0, correct: true, badgeId, missionId }),
        'orange',
        { points: 0, correct: true, badgeId, missionId }
      );
      const nextM = advance && missionId < 7 ? missionId + 1 : prev.currentMission;
      const modeCfg = SESSION_MODES[prev.settings.sessionMode] || SESSION_MODES.full30;
      return {
        ...prev,
        teams: nextTeams,
        currentMission: nextM,
        missionLeft: advance && missionId < 7 ? (modeCfg.missionDurations[nextM] || 180) : prev.missionLeft
      };
    });
  };

  const handleLogStudent = (studentName) => {
    sfx.pop();
    setState((prev) => ({
      ...prev,
      participation: [
        ...prev.participation,
        {
          student: studentName,
          team: prev.teams[prev.activeTeam].shortName,
          mission: prev.currentMission,
          concept: `Mission ${prev.currentMission}`,
          note: 'Interactive panel turn',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    }));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  const resetGame = () => {
    const fresh = clearStoredState();
    setState(fresh);
    setRevealHint(false);
    setRevealAnswer(false);
    sfx.pop();
  };

  if (page === 'teacher') {
    return (
      <Teacher
        state={state}
        onUpdateSettings={updateSettings}
        onSwitchTeam={() => setState((p) => ({ ...p, activeTeam: p.activeTeam === 'blue' ? 'orange' : 'blue' }))}
        onAdjustPoints={(tid, pts) => setState((p) => ({ ...p, teams: applyScore(p.teams, tid, { points: pts, correct: pts > 0 }) }))}
        onToggleTimer={() => setState((p) => ({ ...p, timerRunning: !p.timerRunning }))}
        onExtendTimer={(sec) => setState((p) => ({ ...p, missionLeft: p.missionLeft + sec, sessionLeft: p.sessionLeft + sec }))}
        onSelectMission={(m) => { selectMission(m); setPage('championship'); }}
        onReplayMission={() => selectMission(state.currentMission)}
        onResetMission={() => setState((p) => ({ ...p, teams: createInitialTeams(), bossEnergy: 100 }))}
        onStartMode={startMode}
        revealHint={revealHint}
        revealAnswer={revealAnswer}
        onToggleHint={() => setRevealHint((v) => !v)}
        onToggleAnswer={() => setRevealAnswer((v) => !v)}
        onBackToGame={() => setPage('championship')}
      />
    );
  }

  if (page === 'concepts') {
    return <CurriculumExplorer onBack={() => setPage('home')} />;
  }

  if (page === 'reports') {
    return (
      <Reports
        state={state}
        onSaveBefore={(qid, idx) => setState((p) => ({ ...p, beforeAssessment: { ...p.beforeAssessment, [qid]: idx } }))}
        onSaveAfter={(qid, idx) => setState((p) => ({ ...p, afterAssessment: { ...p.afterAssessment, [qid]: idx } }))}
        onSaveNotes={(notes) => setState((p) => ({ ...p, teacherNotes: notes }))}
        onBack={() => setPage('championship')}
      />
    );
  }

  if (page === 'championship') {
    return (
      <Championship
        state={state}
        revealHint={revealHint}
        revealAnswer={revealAnswer}
        onSelectTeam={(tid) => setState((p) => ({ ...p, activeTeam: tid }))}
        onLogStudent={handleLogStudent}
        onToggleTimer={() => setState((p) => ({ ...p, timerRunning: !p.timerRunning }))}
        onExtendTimer={(sec) => setState((p) => ({ ...p, missionLeft: p.missionLeft + sec, sessionLeft: p.sessionLeft + sec }))}
        onSelectMission={selectMission}
        onToggleSound={() => updateSettings({ soundEnabled: !state.settings.soundEnabled })}
        onNavigate={setPage}
        onFullscreen={toggleFullscreen}
        onAward={handleAward}
        onCompleteMission={handleCompleteMission}
        onDamageBoss={(dmg) => setState((p) => ({ ...p, bossEnergy: Math.max(0, p.bossEnergy - dmg) }))}
      />
    );
  }

  return (
    <Home
      settings={state.settings}
      onUpdateSettings={updateSettings}
      onStartChampionship={handleStartChampionship}
      onNavigate={setPage}
      onResetGame={resetGame}
      onToggleFullscreen={toggleFullscreen}
    />
  );
}
