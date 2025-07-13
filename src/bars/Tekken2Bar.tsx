import React from 'react';

export interface Tekken2BarProps {
  scale: number;
  [key: string]: any;
}

const Tekken2Bar: React.FC<Tekken2BarProps> = (props) => {
  const scaleFactor = props.scale / 5;
  // Find the player name keys
  const p1Key = Object.keys(props).find(k => k.toLowerCase().includes('player1'));
  const p2Key = Object.keys(props).find(k => k.toLowerCase().includes('player2'));
  const p1 = p1Key ? props[p1Key] : '';
  const p2 = p2Key ? props[p2Key] : '';
  const barHeight = Math.round(32 * scaleFactor);

  return (
    <div style={{
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8 * scaleFactor,
      marginTop: 24 * scaleFactor,
      fontFamily: 'sans-serif',
    }}>
      {/* Bars row */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'row', gap: 16 * scaleFactor }}>
        {/* Player 1 Bar */}
        <div style={{ flex: 1 }}>
          <div style={{ width: '100%', height: barHeight, background: 'linear-gradient(90deg, #1e90ff 0%, #fff 100%)', borderRadius: 8 * scaleFactor, boxShadow: '0 2px 8px #000a' }} />
        </div>
        {/* Player 2 Bar */}
        <div style={{ flex: 1 }}>
          <div style={{ width: '100%', height: barHeight, background: 'linear-gradient(90deg, #fff 0%, #e10600 100%)', borderRadius: 8 * scaleFactor, boxShadow: '0 2px 8px #000a' }} />
        </div>
      </div>
      {/* Names row below bars */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 * scaleFactor }}>
        <div style={{ fontSize: 24 * scaleFactor, fontWeight: 700, color: '#fff', textAlign: 'left' }}>{p1}</div>
        <div style={{ fontSize: 24 * scaleFactor, fontWeight: 700, color: '#fff', textAlign: 'right' }}>{p2}</div>
      </div>
    </div>
  );
};

export default Tekken2Bar; 