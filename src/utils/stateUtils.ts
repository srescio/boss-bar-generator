import { bossBars } from '../bossBars';
import { BossBarState, LOCAL_STORAGE_KEY } from '../types/constants';

// Dynamically generate defaultState using bossBars config
export const generateDefaultState = (): BossBarState => {
  const style = 'genshin';
  const config = bossBars[style];
  const state: BossBarState = {
    gameStyle: style,
    background: 'transparent',
    backgroundSize: 'cover', // Default to cover
    format: 'video-call',
    scale: 5,
  };
  if (config) {
    config.fields.forEach(f => {
      state[f.key] = f.default ?? '';
    });
  }
  return state;
};

export const loadStateFromStorage = (): BossBarState => {
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
  let loaded = saved ? JSON.parse(saved) : { ...generateDefaultState() };
  
  console.log('Loading state from localStorage:', saved);
  console.log('Parsed state:', loaded);
  
  // Ensure all keys from the current config are present
  const style = loaded.gameStyle || generateDefaultState().gameStyle;
  const config = bossBars[style];
  if (config) {
    config.fields.forEach(f => {
      if (loaded[f.key] === undefined) {
        loaded[f.key] = f.default ?? '';
      }
    });
  }
  // Ensure backgroundSize is set to cover by default if not present
  if (loaded.backgroundSize === undefined) {
    loaded.backgroundSize = 'cover';
  }
  
  console.log('Final loaded state:', loaded);
  return loaded;
};

export const saveStateToStorage = (state: BossBarState): void => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
};

export const clearStateFromStorage = (): void => {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
}; 