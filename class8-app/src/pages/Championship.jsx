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
  lastAward,
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
  const activeTeamObj = state.teams[state.activeTeam];

  return (
    <div className="min-h-screen ai-arena-bg text-slate-900 p-3 md:p-4 flex flex-col gap-3">
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

      {/* High-visibility Active Turn + Last Question Points Banner */}
      <div
        className={`rounded-2xl px-4 py-2.5 border-2 flex flex-wrap items-center justify-between gap-3 shadow-sm ${
          state.activeTeam === 'blue'
            ? 'bg-sky-100 border-sky-500 text-sky-950'
            : 'bg-orange-100 border-orange-500 text-orange-950'
        }`}
      >
        <div className="flex items-center gap-2.5 text-lg md:text-xl font-black">
          <span className="text-2xl">{activeTeamObj.avatar}</span>
          <span>
            NOW PLAYING: {activeTeamObj.name}
          </span>
        </div>

        {lastAward ? (
          <div
            key={lastAward.id}
            className={`animate-pop px-4 py-1.5 rounded-full font-black text-sm md:text-base border-2 ${
              lastAward.correct
                ? 'bg-emerald-600 text-white border-emerald-700'
                : 'bg-amber-200 text-amber-950 border-amber-500'
            }`}
          >
            {lastAward.points > 0 ? `+${lastAward.points} pts` : '0 pts'} awarded to{' '}
            {lastAward.teamId === 'blue' ? 'CYBER TITANS' : 'DATA DRAGONS'} ({lastAward.concept})
          </div>
        ) : (
          <div className="px-4 py-1.5 rounded-full bg-white/80 border border-slate-300 font-bold text-sm text-slate-700">
            Correct: +100 pts · Challenging Puzzle: +150 pts · Explanation Bonus: +50 pts
          </div>
        )}
      </div>

      <main className="glass-panel rounded-3xl p-4 md:p-6 flex-1">
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
