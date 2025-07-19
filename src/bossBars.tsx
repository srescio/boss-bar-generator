import GenshinBar from './bars/GenshinBar';
import DemonsSoulsBar from './bars/DemonsSoulsBar';
import Tekken2Bar from './bars/Tekken2Bar';
import HonkaiImpactBar from './bars/HonkaiImpactBar';
import React from 'react';

export interface BossBarFieldRaw {
  label: string;
  default?: string;
}

export interface BossBarField extends BossBarFieldRaw {
  key: string;
}

export interface BossBarConfigRaw {
  label: string;
  component: React.FC<any>;
  fields: BossBarFieldRaw[];
  fontFamily: string;
}

export interface BossBarConfig extends Omit<BossBarConfigRaw, 'fields'> {
  fields: BossBarField[];
}

function generateFieldKey(componentName: string, label: string) {
  return `${componentName}_${label.replace(/\s+/g, '').toLowerCase()}`;
}

const bossBarsRaw: Record<string, BossBarConfigRaw> = {
  genshin: {
    label: 'Genshin Impact',
    component: GenshinBar,
    fields: [
      { label: 'Boss Name', default: 'Boss Name' },
      { label: 'Title lore', default: 'Title lore' },
      { label: 'Level', default: 'Lv. 100' },
    ],
    fontFamily: 'GenshinFont, sans-serif',
  },
  demonsouls: {
    label: "Demon's Souls",
    component: DemonsSoulsBar,
    fields: [
      { label: 'Boss Name', default: 'Boss Name' },
    ],
    fontFamily: 'serif', // Replace with actual font if available
  },
  // Add more styles here
  tekken2: {
    label: 'Tekken 2',
    component: Tekken2Bar,
    fields: [
      { label: 'Player 1', default: 'Player 1' },
      { label: 'Player 1 Color', default: 'red' },
      { label: 'Player 2', default: 'Player 2' },
      { label: 'Player 2 Color', default: 'red' },
    ],
    fontFamily: 'sans-serif',
  },
  honkaiimpact: {
    label: 'Honkai Impact 3rd',
    component: HonkaiImpactBar,
    fields: [
      { label: 'Boss Name', default: 'Husk - Mysticism' },
      { label: 'Multiplier', default: 'x8' },
    ],
    fontFamily: 'sans-serif',
  },
};

export const bossBars: Record<string, BossBarConfig> = Object.fromEntries(
  Object.entries(bossBarsRaw).map(([key, config]) => {
    const componentName = config.component.displayName || config.component.name || key;
    const fields = config.fields.map(f => ({
      ...f,
      key: generateFieldKey(componentName, f.label),
    }));
    return [key, { ...config, fields }];
  })
); 