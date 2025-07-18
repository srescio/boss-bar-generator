import React from 'react';

// Add color type
export type TekkenColor = 'red' | 'darkred' | 'brightred' | 'blue';

// Full mapping for Tekken sprite font (first color row)
const CHAR_MAP: Record<string, string> = {
  '0': '0', '1': '1', '2': '2', '3': '3', '4': '4',
  '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
  'A': 'A', 'B': 'B', 'C': 'C', 'D': 'D', 'E': 'E',
  'F': 'F', 'G': 'G', 'H': 'H', 'I': 'I', 'J': 'J',
  'K': 'K', 'L': 'L', 'M': 'M', 'N': 'N', 'O': 'O',
  'P': 'P', 'Q': 'Q', 'R': 'R', 'S': 'S', 'T': 'T',
  'U': 'U', 'V': 'V', 'W': 'W', 'X': 'X', 'Y': 'Y',
  'Z': 'Z', '!': 'em', '?': 'qm', '.': 'fs', '-': 'dh', "'": 'qt'
};

function renderTekkenSpriteText(text: string, color: TekkenColor = 'red') {
  const baseSize = 32; // px, original sprite cell size
  return (
    <span className={`tekken-sprite-text`} style={{ flexWrap: 'wrap', lineHeight: 1 }}>
      {text.split('').map((char, i) => {
        const upper = char.toUpperCase();
        const charKey = CHAR_MAP[upper];
        const className = charKey ? `tekken-sprite-char tekken-sprite-char-${color} tekken-char-${charKey}-${color}` : '';
        return className ? (
          <span
            key={i}
            className={className}
            style={{
              fontSize: 0,
              display: 'inline-block',
              transform: 'scale(0.5)',
              transformOrigin: 'center',
            }}
          />
        ) : (
          <span key={i} style={{ color: '#fff', fontWeight: 700, fontSize: `${baseSize * 0.4}px` }}>{char}</span>
        );
      })}
    </span>
  );
}

interface Tekken2BarProps {
  scale: number;
  player1: string;
  player2: string;
  player1Color?: TekkenColor;
  player2Color?: TekkenColor;
  [key: string]: any;
}

const Tekken2Bar: React.FC<Tekken2BarProps> = (props) => {
  const scaleFactor = props.scale / 5;
  const p1Key = Object.keys(props).find(k => k.toLowerCase().includes('player1') && !k.toLowerCase().includes('color'));
  const p2Key = Object.keys(props).find(k => k.toLowerCase().includes('player2') && !k.toLowerCase().includes('color'));
  const p1 = p1Key ? props[p1Key] : '';
  const p2 = p2Key ? props[p2Key] : '';
  // Use the generated field keys for color
  const p1ColorKey = Object.keys(props).find(k => k.toLowerCase().includes('player1color'));
  const p2ColorKey = Object.keys(props).find(k => k.toLowerCase().includes('player2color'));
  const p1Color = (p1ColorKey && props[p1ColorKey]) || 'red';
  const p2Color = (p2ColorKey && props[p2ColorKey]) || 'red';
  const barHeight = Math.round(32 * scaleFactor);

  return (
    <div 
      id="tekken2-bar"
      className="boss-bar"
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8 * scaleFactor,
        marginTop: 24 * scaleFactor,
        fontFamily: 'sans-serif',
      }}
    >
      {/* Bars row */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'row', gap: 16 * scaleFactor, alignItems: 'center' }}>
        {/* Player 1 Bar */}
        <div style={{ flex: 1, display: 'flex', height: barHeight }}>
          <img 
            src="/bars/tekken2/bbg-l.png" 
            alt="Left bar" 
            style={{ 
              height: '100%', 
              width: 'auto',
              objectFit: 'contain'
            }} 
          />
          <img 
            src="/bars/tekken2/bbg-c.png" 
            alt="Center bar" 
            style={{ 
              height: '100%', 
              flex: 1,
              objectFit: 'fill'
            }} 
          />
          <img 
            src="/bars/tekken2/bbg-r.png" 
            alt="Right bar" 
            style={{ 
              height: '100%', 
              width: 'auto',
              objectFit: 'contain'
            }} 
          />
        </div>
        {/* Infinity symbol */}
        <img 
          src="/bars/tekken2/infinity.png" 
          alt="Infinity" 
          style={{ 
            height: barHeight * 1.5, 
            width: 'auto',
            margin: `0 ${0.5 * scaleFactor}px`,
            display: 'block',
          }} 
        />
        {/* Player 2 Bar */}
        <div style={{ flex: 1, display: 'flex', height: barHeight }}>
          <img 
            src="/bars/tekken2/bbg-l.png" 
            alt="Left bar" 
            style={{ 
              height: '100%', 
              width: 'auto',
              objectFit: 'contain'
            }} 
          />
          <img 
            src="/bars/tekken2/bbg-c.png" 
            alt="Center bar" 
            style={{ 
              height: '100%', 
              flex: 1,
              objectFit: 'fill'
            }} 
          />
          <img 
            src="/bars/tekken2/bbg-r.png" 
            alt="Right bar" 
            style={{ 
              height: '100%', 
              width: 'auto',
              objectFit: 'contain'
            }} 
          />
        </div>
      </div>
      {/* Names row below bars */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: -10 * (scaleFactor * 2) }}>
        <div style={{ maxWidth: '48%', wordBreak: 'break-word', whiteSpace: 'pre-wrap', textAlign: 'left', display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', transform: `scale(${scaleFactor})`, transformOrigin: 'left bottom' }}>
          {renderTekkenSpriteText(p1, p1Color)}
        </div>
        <div style={{ maxWidth: '48%', wordBreak: 'break-word', whiteSpace: 'pre-wrap', textAlign: 'right', display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'flex-end', transform: `scale(${scaleFactor})`, transformOrigin: 'right bottom' }}>
          {renderTekkenSpriteText(p2, p2Color)}
        </div>
      </div>
    </div>
  );
};

export default Tekken2Bar; 