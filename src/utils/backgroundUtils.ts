import { BOSS_BARS_DATA } from '../bossBarsData';
import { BossBarState } from '../types/constants';

// Simple style simulation for demo
export const getBarStyle = (gameStyle: string): React.CSSProperties => {
  // No fontFamily in BOSS_BARS_DATA, so just return default style
  return { fontWeight: 'bold' };
};

export const getBackgroundStyle = (state: BossBarState): React.CSSProperties => {
  if (state.background === 'transparent') {
    return { background: 'transparent' };
  } else if ((state.background === 'web-image' || state.background === 'disk-image') && state.backgroundImageUrl) {
    console.log('Background style applied:', {
      background: state.background,
      backgroundSize: state.backgroundSize,
      url: state.backgroundImageUrl
    });
    
    const backgroundRepeat = state.backgroundSize === 'auto' ? 'repeat' : 'no-repeat';
    
    return { 
      backgroundImage: `url('${state.backgroundImageUrl}')`,
      backgroundSize: state.backgroundSize,
      backgroundPosition: 'center center',
      backgroundRepeat: backgroundRepeat
    };
  }
  return { background: 'transparent' };
};

export const validateImageUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const createFileInput = (onFileSelect: (file: File) => void): void => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/jpeg,image/jpg,image/png,image/gif,image/webp';
  input.onchange = (event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };
  input.click();
}; 