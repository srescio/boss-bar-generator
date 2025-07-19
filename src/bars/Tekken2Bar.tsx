import React from 'react';
import './Tekken2Bar.css';

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
  return (
    <span className="tekken-sprite-text">
      {text.split('').map((char, i) => {
        const upper = char.toUpperCase();
        const charKey = CHAR_MAP[upper];
        const className = charKey ? `tekken-sprite-char tekken-sprite-char-${color} tekken-char-${charKey}-${color}` : '';
        return className ? (
          <span
            key={i}
            className={className}
          />
        ) : char === ' ' ? (
          <span key={i} className="tekken-space"></span>
        ) : null; // Don't render unsupported characters, but keep spaces
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
      className="boss-bar tekken2-bar"
      style={{
        gap: 8 * scaleFactor,
        marginTop: 24 * scaleFactor,
      }}
    >
      {/* Bars row */}
      <div 
        className="tekken2-bars-row"
        style={{ gap: 16 * scaleFactor }}
      >
        {/* Player 1 Bar */}
        <div className="tekken2-bar-container" style={{ height: barHeight }}>
          <img 
            src="/bars/tekken2/bbg-l.png" 
            alt="Tekken 2 boss bar left edge" 
            className="tekken2-bar-side"
          />
          <img 
            src="/bars/tekken2/bbg-c.png" 
            alt="Tekken 2 boss bar center section" 
            className="tekken2-bar-center"
          />
          <img 
            src="/bars/tekken2/bbg-r.png" 
            alt="Tekken 2 boss bar right edge" 
            className="tekken2-bar-side"
          />
        </div>
        {/* Infinity symbol */}
        <img 
          src="/bars/tekken2/infinity.png" 
          alt="Tekken 2 infinity symbol" 
          className="tekken2-infinity"
          style={{ 
            height: barHeight * 1.5, 
            margin: `0 ${0.5 * scaleFactor}px`,
          }} 
        />
        {/* Player 2 Bar */}
        <div className="tekken2-bar-container" style={{ height: barHeight }}>
          <img 
            src="/bars/tekken2/bbg-l.png" 
            alt="Tekken 2 boss bar left edge" 
            className="tekken2-bar-side"
          />
          <img 
            src="/bars/tekken2/bbg-c.png" 
            alt="Tekken 2 boss bar center section" 
            className="tekken2-bar-center"
          />
          <img 
            src="/bars/tekken2/bbg-r.png" 
            alt="Tekken 2 boss bar right edge" 
            className="tekken2-bar-side"
          />
        </div>
      </div>
      {/* Names row below bars */}
      <div 
        className="tekken2-names-row"
        style={{ marginTop: -10 * (scaleFactor * 2) }}
      >
        <div 
          className="tekken2-player-name tekken2-player-name-left"
          style={{ transform: `scale(${scaleFactor})` }}
        >
          {renderTekkenSpriteText(p1, p1Color)}
        </div>
        <div 
          className="tekken2-player-name tekken2-player-name-right"
          style={{ transform: `scale(${scaleFactor})` }}
        >
          {renderTekkenSpriteText(p2, p2Color)}
        </div>
      </div>
    </div>
  );
};

export default Tekken2Bar; 