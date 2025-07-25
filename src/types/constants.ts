export const BACKGROUNDS = [
  { name: '🫥 Transparent', value: 'transparent' },
  { name: '🌐 Image from Web (URL)', value: 'web-image' },
  { name: '💽 Image from Disk', value: 'disk-image' },
];

export const LOCAL_STORAGE_KEY = 'boss-bar-generator';

export type BossBarState = {
  gameStyle: string;
  background: string;
  backgroundImageUrl?: string;
  backgroundImageFile?: File;
  backgroundSize: string;
  format: string;
  scale: number;
  [key: string]: string | number | undefined | File | any;
};

export const TEKKEN_COLORS = [
  { value: 'red', label: 'Red' },
  { value: 'darkred', label: 'Dark Red' },
  { value: 'brightred', label: 'Bright Red' },
  { value: 'blue', label: 'Blue' },
];

export const BACKGROUND_SIZE_OPTIONS = [
  { value: 'cover', label: 'Cover (fills container, may crop)' },
  { value: 'contain', label: 'Contain (fits in container, may show gaps)' },
  { value: 'auto', label: 'Auto (original size)' },
];

export const FORMAT_OPTIONS = [
  { value: 'bar-only', label: 'Bar Only' },
  { value: 'video-call', label: 'Video Call (16:9 Full HD)' },
]; 