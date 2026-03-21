import { useGame } from './hooks/useGameState.jsx';
import { useSaveSlots } from './hooks/useSaveSlots.js';
import { useEffect } from 'react';
import { AppErrorBoundary, GameErrorBoundary } from './components/ui/ErrorBoundary.jsx';
import OfflineBanner from './components/ui/OfflineBanner.jsx';
import Notification from './components/ui/Notification.jsx';

import TitleScreen     from './components/screens/TitleScreen.jsx';
import PlayersScreen   from './components/screens/PlayersScreen.jsx';
import PresetsScreen   from './components/screens/PresetsScreen.jsx';
import CharacterScreen from './components/screens/CharacterScreen.jsx';
import QuestScreen     from './components/screens/QuestScreen.jsx';
import WorldScreen     from './components/screens/WorldScreen.jsx';
import GameScreen      from './components/game/GameScreen.jsx';
import LoadScreen      from './components/screens/LoadScreen.jsx';
import CelebrateScreen from './components/screens/CelebrateScreen.jsx';

const SCREENS = {
  title:     TitleScreen,
  players:   PlayersScreen,
  presets:   PresetsScreen,
  character: CharacterScreen,
  quest:     QuestScreen,
  world:     WorldScreen,
  game:      GameScreen,
  load:      LoadScreen,
  celebrate: CelebrateScreen,
};

function AppContent() {
  const { state, set } = useGame();
  const { getLatestSlot } = useSaveSlots();
  const screen = state.screen || 'title';

  useEffect(() => {
    const root = document.getElementById('root');
    if (root) root.className = state.mode ? `mode-${state.mode}` : '';
  }, [state.mode]);

  useEffect(() => {
    getLatestSlot().then(({ data }) => {
      if (data) set({ hasSave: true, latestSave: data });
    }).catch(() => {});
  }, []);

  const Screen = SCREENS[screen] || TitleScreen;
  const isGame = screen === 'game';

  return (
    <div className="app-root">
      <OfflineBanner />
      {isGame ? (
        <GameErrorBoundary onReset={() => set({ screen: 'title' })}>
          <Screen />
        </GameErrorBoundary>
      ) : (
        <Screen />
      )}
      <Notification />
    </div>
  );
}

export default function App() {
  return (
    <AppErrorBoundary>
      <AppContent />
    </AppErrorBoundary>
  );
}
