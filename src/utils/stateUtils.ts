import { BOSS_BARS_DATA } from '../bossBarsData';
import { BossBarState, LOCAL_STORAGE_KEY } from '../types/constants';

function generateFieldKey(componentName: string, label: string) {
  return `${componentName}_${label.replace(/\s+/g, '').toLowerCase()}`;
}

// Dynamically generate defaultState using bossBars config
export const generateDefaultState = (): BossBarState => {
  const style = 'genshin';
  const config = BOSS_BARS_DATA.find(g => g.value === style);
  const state: BossBarState = {
    gameStyle: style,
    background: 'transparent',
    backgroundSize: 'cover', // Default to cover
    format: 'video-call',
    scale: 5,
  };
  if (config) {
    const componentName = style.charAt(0).toUpperCase() + style.slice(1) + 'Bar';
    config.fields.forEach(f => {
      const key = generateFieldKey(componentName, f.label);
      state[key] = f.default ?? '';
    });
  }
  return state;
};

export const loadStateFromStorage = (): BossBarState => {
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
  let loaded = saved ? JSON.parse(saved) : { ...generateDefaultState() };
  
  // Ensure all keys from the current config are present
  const style = loaded.gameStyle || generateDefaultState().gameStyle;
  const config = BOSS_BARS_DATA.find(g => g.value === style);
  if (config) {
    const componentName = style.charAt(0).toUpperCase() + style.slice(1) + 'Bar';
    config.fields.forEach(f => {
      const key = generateFieldKey(componentName, f.label);
      if (loaded[key] === undefined) {
        loaded[key] = f.default ?? '';
      }
    });
  }
  // Ensure backgroundSize is set to cover by default if not present
  if (loaded.backgroundSize === undefined) {
    loaded.backgroundSize = 'cover';
  }
  
  return loaded;
};

export const saveStateToStorage = (state: BossBarState): void => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
};

export const clearStateFromStorage = (): void => {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
}; 