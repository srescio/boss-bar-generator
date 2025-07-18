import React from 'react';

export interface DemonsSoulsBarProps {
  scale: number;
  [key: string]: any;
}

const DemonsSoulsBar: React.FC<DemonsSoulsBarProps> = (props) => {
  const scaleFactor = props.scale / 5;
  // Find the boss name key
  const bossNameKey = Object.keys(props).find(k => k.toLowerCase().includes('bossname'));
  const bossName = bossNameKey ? props[bossNameKey] : '';

  const barHeight = Math.round(32 * scaleFactor);
  const overlap = Math.round(2 * scaleFactor);

  return (
    <div 
      id="demons-souls-bar"
      className="boss-bar"
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 24 * scaleFactor,
        fontFamily: 'serif',
      }}
    >
      <div style={{
        fontSize: 40 * scaleFactor,
        fontWeight: 700,
        color: '#e9e7e1',
        textShadow: '2px 2px 8px #000',
        marginBottom: 16 * scaleFactor,
      }}>{bossName}</div>
      <div style={{ display: 'flex', alignItems: 'center', width: '80%' }}>
        <img src={process.env.PUBLIC_URL + '/bars/demonssouls/bbg-l.png'} alt="bar left" style={{ height: barHeight }} />
        <div style={{ flex: 1, height: barHeight, background: 'none', display: 'flex' }}>
          <img
            src={process.env.PUBLIC_URL + '/bars/demonssouls/bbg-c.png'}
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
        <img src={process.env.PUBLIC_URL + '/bars/demonssouls/bbg-r.png'} alt="bar right" style={{ height: barHeight }} />
      </div>
    </div>
  );
};

export default DemonsSoulsBar; 