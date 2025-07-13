import React from 'react';

export interface Tekken2BarProps {
  scale: number;
  [key: string]: any;
}

// Full mapping for Tekken sprite font (first color row)
const CHAR_MAP: Record<string, string> = {
  '0': 'tekken-char-0', '1': 'tekken-char-1', '2': 'tekken-char-2', '3': 'tekken-char-3', '4': 'tekken-char-4',
  '5': 'tekken-char-5', '6': 'tekken-char-6', '7': 'tekken-char-7', '8': 'tekken-char-8', '9': 'tekken-char-9',
  'A': 'tekken-char-A', 'B': 'tekken-char-B', 'C': 'tekken-char-C', 'D': 'tekken-char-D', 'E': 'tekken-char-E',
  'F': 'tekken-char-F', 'G': 'tekken-char-G', 'H': 'tekken-char-H', 'I': 'tekken-char-I', 'J': 'tekken-char-J',
  'K': 'tekken-char-K', 'L': 'tekken-char-L', 'M': 'tekken-char-M', 'N': 'tekken-char-N', 'O': 'tekken-char-O',
  'P': 'tekken-char-P', 'Q': 'tekken-char-Q', 'R': 'tekken-char-R', 'S': 'tekken-char-S', 'T': 'tekken-char-T',
  'U': 'tekken-char-U', 'V': 'tekken-char-V', 'W': 'tekken-char-W', 'X': 'tekken-char-X', 'Y': 'tekken-char-Y',
  'Z': 'tekken-char-Z', '!': 'tekken-char-em', '?': 'tekken-char-qm', '.': 'tekken-char-fs', '-': 'tekken-char-dh', "'": 'tekken-char-qt'
};

function renderTekkenSpriteText(text: string) {
  const baseSize = 32; // px, original sprite cell size
  return (
    <span className="tekken-sprite-text" style={{ flexWrap: 'wrap', lineHeight: 1 }}>
      {text.split('').map((char, i) => {
        const upper = char.toUpperCase();
        const className = CHAR_MAP[upper] ? `tekken-sprite-char ${CHAR_MAP[upper]}` : '';
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

const Tekken2Bar: React.FC<Tekken2BarProps> = (props) => {
  const scaleFactor = props.scale / 5;
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
          {renderTekkenSpriteText(p1)}
        </div>
        <div style={{ maxWidth: '48%', wordBreak: 'break-word', whiteSpace: 'pre-wrap', textAlign: 'right', display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'flex-end', transform: `scale(${scaleFactor})`, transformOrigin: 'right bottom' }}>
          {renderTekkenSpriteText(p2)}
        </div>
      </div>
    </div>
  );
};

export default Tekken2Bar; 