import { useGame } from './hooks/useGameState.js';
import { useSaveSlots } from './hooks/useSaveSlots.js';
import { useEffect } from 'react';

import TitleScreen     from './components/screens/TitleScreen.jsx';
import PlayersScreen   from './components/screens/PlayersScreen.jsx';
import PresetsScreen   from './components/screens/PresetsScreen.jsx';
import CharacterScreen from './components/screens/CharacterScreen.jsx';
import QuestScreen     from './components/screens/QuestScreen.jsx';
import WorldScreen     from './components/screens/WorldScreen.jsx';
import GameScreen      from './components/game/GameScreen.jsx';
import LoadScreen      from './components/screens/LoadScreen.jsx';
import CelebrateScreen from './components/screens/CelebrateScreen.jsx';
import Notification    from './components/ui/Notification.jsx';

// Screen order: title → players → presets/character (repeats per player) → quest → world → game
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

export default function App() {
  const { state, set } = useGame();
  const { getLatestSlot } = useSaveSlots();
  const screen = state.screen || 'title';

  // Apply mode class to root for CSS variable theming
  useEffect(() => {
    const root = document.getElementById('root');
    root.className = state.mode ? `mode-${state.mode}` : '';
  }, [state.mode]);

  // Check for quick-continue save on mount
  useEffect(() => {
    const { data } = getLatestSlot();
    if (data) set({ hasSave: true, latestSave: data });
  }, []);

  const Screen = SCREENS[screen] || TitleScreen;

  return (
    <div className="app-root">
      <Screen />
      <Notification />
    </div>
  );
}
