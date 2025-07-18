import React from 'react';

export interface GenshinBarProps {
  scale: number;
  [key: string]: any;
}

const GenshinBar: React.FC<GenshinBarProps> = (props) => {
  const scaleFactor = props.scale / 5;
  const barHeight = Math.round(32 * scaleFactor);
  const overlap = Math.round(2 * scaleFactor);

  // Dynamically get the keys for the fields
  // For Genshin, we expect 3 fields: Boss Name, Title lore, Level
  // Find keys by label
  const bossNameKey = Object.keys(props).find(k => k.toLowerCase().includes('bossname'));
  const titleLoreKey = Object.keys(props).find(k => k.toLowerCase().includes('titlelore'));
  const levelKey = Object.keys(props).find(k => k.toLowerCase().includes('level'));

  const bossName = bossNameKey ? props[bossNameKey] : '';
  const titleLore = titleLoreKey ? props[titleLoreKey] : '';
  const level = levelKey ? props[levelKey] : '';

  return (
    <div 
      id="genshin-bar"
      className="boss-bar"
      style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', marginTop: 24 * scaleFactor }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 * scaleFactor }}>
        <div style={{ fontSize: 32 * scaleFactor, fontFamily: 'GenshinFont, sans-serif', fontWeight: 700 }}>{bossName}</div>
        <div style={{ fontSize: 20 * scaleFactor, fontFamily: 'GenshinFont, sans-serif', fontWeight: 400, opacity: 0.7 }}>{titleLore}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 12 * scaleFactor, width: '80%' }}>
        <div style={{ fontSize: 16 * scaleFactor, fontFamily: 'GenshinFont, sans-serif', fontWeight: 400, marginRight: 12 * scaleFactor, whiteSpace: 'nowrap' }}>{level}</div>
        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <img src={process.env.PUBLIC_URL + '/bars/genshin/bbg-l.png'} alt="bar left" style={{ height: barHeight }} />
          <div style={{ flex: 1, height: barHeight, background: 'none', display: 'flex' }}>
            <img
              src={process.env.PUBLIC_URL + '/bars/genshin/bbg-c.png'}
              alt="bar center"
              style={{
                width: `calc(100% + ${overlap * 2}px)`,
                height: barHeight,
                objectFit: 'fill',
                marginLeft: -overlap,
                marginRight: -overlap,
                display: 'block',
              }}
            />
          </div>
          <img src={process.env.PUBLIC_URL + '/bars/genshin/bbg-r.png'} alt="bar right" style={{ height: barHeight }} />
        </div>
      </div>
    </div>
  );
};

export default GenshinBar; 