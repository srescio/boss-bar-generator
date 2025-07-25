// This file provides a pure data version of the boss bar styles, including default field values.
// It is used by both the app and Cypress tests to keep game style options and defaults in sync, without React or CSS dependencies.

export const BOSS_BARS_DATA = [
  {
    value: 'genshin',
    label: 'Genshin Impact',
    fields: [
      { label: 'Boss Name', default: 'Boss Name' },
      { label: 'Title lore', default: 'Title lore' },
      { label: 'Level', default: 'Lv. 100' },
    ],
  },
  {
    value: 'demonsouls',
    label: "Demon's Souls",
    fields: [
      { label: 'Boss Name', default: 'Boss Name' },
    ],
  },
  {
    value: 'tekken2',
    label: 'Tekken 2',
    fields: [
      { label: 'Player 1', default: 'Player 1' },
      { label: 'Player 1 Color', default: 'red' },
      { label: 'Player 2', default: 'Player 2' },
      { label: 'Player 2 Color', default: 'red' },
    ],
  },
  {
    value: 'honkaiimpact',
    label: 'Honkai Impact 3rd',
    fields: [
      { label: 'Boss Name', default: 'Husk - Mysticism' },
      { label: 'Multiplier', default: 'x8' },
    ],
  },
]; 