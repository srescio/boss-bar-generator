import React from 'react';
import './GenshinBar.css';

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
      className="boss-bar genshin-bar"
      style={{ marginTop: 24 * scaleFactor }}
    >
      <div 
        className="genshin-text-container"
        style={{ gap: 4 * scaleFactor }}
      >
        <div 
          className="genshin-boss-name"
          style={{ fontSize: 32 * scaleFactor }}
        >
          {bossName}
        </div>
        <div 
          className="genshin-title-lore"
          style={{ fontSize: 20 * scaleFactor }}
        >
          {titleLore}
        </div>
      </div>
      <div 
        className="genshin-bar-row"
        style={{ marginTop: 12 * scaleFactor }}
      >
        <div 
          className="genshin-level"
          style={{ 
            fontSize: 16 * scaleFactor, 
            marginRight: 12 * scaleFactor 
          }}
        >
          {level}
        </div>
        <div className="genshin-bar-container">
          <img 
            src={process.env.PUBLIC_URL + '/bars/genshin/bbg-l.png'} 
            alt="bar left" 
            className="genshin-bar-side"
            style={{ height: barHeight }} 
          />
          <div className="genshin-bar-center" style={{ height: barHeight }}>
            <img
              src={process.env.PUBLIC_URL + '/bars/genshin/bbg-c.png'}
              alt="bar center"
              className="genshin-bar-center-img"
              style={{
                width: `calc(100% + ${overlap * 2}px)`,
                height: barHeight,
                marginLeft: -overlap,
                marginRight: -overlap,
              }}
            />
          </div>
          <img 
            src={process.env.PUBLIC_URL + '/bars/genshin/bbg-r.png'} 
            alt="bar right" 
            className="genshin-bar-side"
            style={{ height: barHeight }} 
          />
        </div>
      </div>
    </div>
  );
};

export default GenshinBar; 