import React from 'react';
import MissionNavigator from '../components/MissionNavigator.jsx';
import TeamScoreboard from '../components/TeamScoreboard.jsx';
import GameTimer from '../components/GameTimer.jsx';
import { Mission1Warmup, Mission3Lifecycle } from '../components/DragDropGame.jsx';
import PatternGame from '../components/PatternGame.jsx';
import AIClassification from '../components/AIClassification.jsx';
import DataDetective from '../components/DataDetective.jsx';
import EthicsCourtroom from '../components/EthicsCourtroom.jsx';
import BossBattle from '../components/BossBattle.jsx';

export default function Championship({
  state,
  revealHint,
  revealAnswer,
  onSelectTeam,
  onLogStudent,
  onToggleTimer,
  onExtendTimer,
  onSelectMission,
  onToggleSound,
  onNavigate,
  onFullscreen,
  onAward,
  onCompleteMission,
  onDamageBoss
}) {
  const switchTurn = () => onSelectTeam(state.activeTeam === 'blue' ? 'orange' : 'blue');
  const completedUnion = Array.from(new Set([...state.teams.blue.completedMissions, ...state.teams.orange.completedMissions]));

  return (
    <div className="min-h-screen ai-arena-bg text-slate-100 p-3 md:p-4 flex flex-col gap-3">
      <MissionNavigator
        currentMission={state.currentMission}
        completedMissions={completedUnion}
        soundEnabled={state.settings.soundEnabled}
        onSelectMission={onSelectMission}
        onToggleSound={onToggleSound}
        onNavigate={onNavigate}
        onFullscreen={onFullscreen}
      />

      <TeamScoreboard
        teams={state.teams}
        activeTeam={state.activeTeam}
        onSelectTeam={onSelectTeam}
        onLogStudent={onLogStudent}
        participationCount={state.participation.length}
      />

      <GameTimer
        missionLeft={state.missionLeft}
        sessionLeft={state.sessionLeft}
        running={state.timerRunning}
        progression={state.settings.progression}
        onToggleRun={onToggleTimer}
        onExtend={onExtendTimer}
        onSkip={() => onSelectMission(Math.min(7, state.currentMission + 1))}
      />

      <main className="glass-panel rounded-3xl p-4 md:p-6 flex-1 border-2 border-slate-700/80">
        {state.currentMission === 1 && (
          <Mission1Warmup
            activeTeam={state.activeTeam}
            onAward={onAward}
            onSwitchTurn={switchTurn}
            onCompleteMission={onCompleteMission}
            revealHint={revealHint}
            revealAnswer={revealAnswer}
          />
        )}
        {state.currentMission === 2 && (
          <PatternGame
            activeTeam={state.activeTeam}
            onAward={onAward}
            onSwitchTurn={switchTurn}
            onCompleteMission={onCompleteMission}
            revealHint={revealHint}
            revealAnswer={revealAnswer}
          />
        )}
        {state.currentMission === 3 && (
          <Mission3Lifecycle
            activeTeam={state.activeTeam}
            onAward={onAward}
            onSwitchTurn={switchTurn}
            onCompleteMission={onCompleteMission}
          />
        )}
        {state.currentMission === 4 && (
          <AIClassification
            activeTeam={state.activeTeam}
            onAward={onAward}
            onSwitchTurn={switchTurn}
            onCompleteMission={onCompleteMission}
          />
        )}
        {state.currentMission === 5 && (
          <DataDetective
            activeTeam={state.activeTeam}
            onAward={onAward}
            onSwitchTurn={switchTurn}
            onCompleteMission={onCompleteMission}
          />
        )}
        {state.currentMission === 6 && (
          <EthicsCourtroom
            activeTeam={state.activeTeam}
            onAward={onAward}
            onSwitchTurn={switchTurn}
            onCompleteMission={onCompleteMission}
          />
        )}
        {state.currentMission === 7 && (
          <BossBattle
            teams={state.teams}
            bossEnergy={state.bossEnergy}
            onDamageBoss={onDamageBoss}
            onAward={onAward}
            onOpenReport={() => onNavigate('reports')}
          />
        )}
      </main>
    </div>
  );
}
