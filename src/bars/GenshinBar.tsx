import React from 'react';

export interface GenshinBarProps {
  text1: string;
  text2: string;
  text3: string;
  scale: number;
}

const GenshinBar: React.FC<GenshinBarProps> = ({ text1, text2, text3, scale }) => {
  const scaleFactor = scale / 5;
  const barHeight = Math.round(32 * scaleFactor);
  const overlap = Math.round(2 * scaleFactor);
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', marginTop: 24 * scaleFactor }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 * scaleFactor }}>
        <div style={{ fontSize: 32 * scaleFactor, fontFamily: 'GenshinFont, sans-serif', fontWeight: 700 }}>{text1}</div>
        <div style={{ fontSize: 20 * scaleFactor, fontFamily: 'GenshinFont, sans-serif', fontWeight: 400, opacity: 0.7 }}>{text2}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 12 * scaleFactor, width: '80%' }}>
        <div style={{ fontSize: 16 * scaleFactor, fontFamily: 'GenshinFont, sans-serif', fontWeight: 400, marginRight: 12 * scaleFactor, whiteSpace: 'nowrap' }}>{text3}</div>
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