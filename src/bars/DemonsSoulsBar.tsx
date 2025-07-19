import React from 'react';
import './DemonsSoulsBar.css';

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
      className="boss-bar demons-souls-bar"
      style={{
        marginTop: 24 * scaleFactor,
      }}
    >
      <div 
        className="demons-souls-boss-name"
        style={{
        fontSize: 40 * scaleFactor,
        marginBottom: 16 * scaleFactor,
        }}
      >
        {bossName}
      </div>
      <div className="demons-souls-bar-container">
        <img 
          src={process.env.PUBLIC_URL + '/bars/demonssouls/bbg-l.png'} 
          alt="Demon's Souls boss bar left edge" 
          className="demons-souls-bar-side"
          style={{ height: barHeight }} 
        />
        <div className="demons-souls-bar-center" style={{ height: barHeight }}>
          <img
            src={process.env.PUBLIC_URL + '/bars/demonssouls/bbg-c.png'}
            alt="Demon's Souls boss bar center section"
            className="demons-souls-bar-center-img"
            style={{
              width: `calc(100% + ${overlap * 2}px)`,
              height: barHeight,
              marginLeft: -overlap,
              marginRight: -overlap,
            }}
          />
        </div>
        <img 
          src={process.env.PUBLIC_URL + '/bars/demonssouls/bbg-r.png'} 
          alt="Demon's Souls boss bar right edge" 
          className="demons-souls-bar-side"
          style={{ height: barHeight }} 
        />
      </div>
    </div>
  );
};

export default DemonsSoulsBar; 