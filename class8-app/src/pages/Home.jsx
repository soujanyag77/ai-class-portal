import React from 'react';
import WelcomeScreen from '../components/WelcomeScreen.jsx';

export default function Home({
  settings,
  onUpdateSettings,
  onStartChampionship,
  onNavigate,
  onResetGame,
  onToggleFullscreen
}) {
  return (
    <WelcomeScreen
      settings={settings}
      onUpdateSettings={onUpdateSettings}
      onStartChampionship={onStartChampionship}
      onNavigate={onNavigate}
      onResetGame={onResetGame}
      onToggleFullscreen={onToggleFullscreen}
    />
  );
}
