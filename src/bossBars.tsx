import GenshinBar from './bars/GenshinBar';
import React from 'react';

export interface BossBarField {
  key: string;
  label: string;
  default?: string;
}

export interface BossBarConfig {
  label: string;
  component: React.FC<any>;
  fields: BossBarField[];
  fontFamily: string;
}

export const bossBars: Record<string, BossBarConfig> = {
  genshin: {
    label: 'Genshin Impact',
    component: GenshinBar,
    fields: [
      { key: 'text1', label: 'Text 1', default: '' },
      { key: 'text2', label: 'Text 2', default: '' },
      { key: 'text3', label: 'Text 3', default: '' },
    ],
    fontFamily: 'GenshinFont, sans-serif',
  },
  // Add more styles here
}; 