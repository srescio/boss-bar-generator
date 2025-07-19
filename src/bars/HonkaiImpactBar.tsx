import React from 'react';
import './HonkaiImpactBar.css';

interface HonkaiImpactBarProps {
  scale: number;
  [key: string]: any;
}

const HonkaiImpactBar: React.FC<HonkaiImpactBarProps> = (props) => {
  // Dynamically get the keys for the fields
  // For Honkai Impact, we expect 2 fields: Boss Name, Multiplier
  // Find keys by label
  const bossNameKey = Object.keys(props).find(k => k.toLowerCase().includes('bossname'));
  const multiplierKey = Object.keys(props).find(k => k.toLowerCase().includes('multiplier'));

  const bossName = bossNameKey ? props[bossNameKey] : '';
  const multiplier = multiplierKey ? props[multiplierKey] : '';
  const scale = props.scale || 1;

  // Calculate scaled values
  const topBarHeight = Math.max(4, Math.round(8 * scale / 5));
  const bottomBarHeight = Math.max(8, Math.round(16 * scale / 5));
  const bossFontSize = Math.max(12, Math.round(16 * scale / 5));
  const multiplierFontSize = Math.max(14, Math.round(18 * scale / 5));
  
  // Calculate multiplier right offset based on font size to prevent overlap
  const multiplierRightOffset = Math.max(30, Math.round(30 + (multiplierFontSize - 18) * 0.8));

  // Calculate tilt amounts based on scale for proper parallelogram shape
  // Bottom segments use more tilt for visual impact, top bar uses reduced tilt
  const bottomTiltAmount = Math.max(2, Math.round(4 * scale / 5));
  const topTiltAmount = Math.max(1, Math.round(1.5 * scale / 5)); // Reduced top bar tilt
  
  // SVG parallelogram points - create proper tilted edges
  // Format: "x1,y1 x2,y2 x3,y3 x4,y4" where points go clockwise from top-left
  const topBarPoints = `${topTiltAmount},0 100,0 ${100 - topTiltAmount},100 0,100`;
  const bottomBarPoints = `${bottomTiltAmount},0 100,0 ${100 - bottomTiltAmount},100 0,100`;

  return (
    <div 
      className="honkai-impact-bar"
      style={{
        '--top-bar-height': `${topBarHeight}px`,
        '--bottom-bar-height': `${bottomBarHeight}px`,
        '--boss-font-size': `${bossFontSize}px`,
        '--multiplier-font-size': `${multiplierFontSize}px`,
        '--multiplier-right-offset': `-${multiplierRightOffset}px`,
      } as React.CSSProperties}
    >
      {/* Top bar using SVG for better canvas compatibility */}
      <div className="honkai-top-bar-container" style={{ width: '100%', height: topBarHeight, marginBottom: 4 }}>
        <svg 
          width="100%" 
          height="100%" 
          viewBox="0 0 100 100" 
          preserveAspectRatio="none"
          style={{ display: 'block' }}
        >
          <defs>
            <linearGradient id="honkai-top-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4ade80" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
            <filter id="honkai-top-shadow">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="rgba(74, 222, 128, 0.3)"/>
            </filter>
          </defs>
          <polygon 
            points={topBarPoints}
            fill="url(#honkai-top-gradient)"
            filter="url(#honkai-top-shadow)"
          />
        </svg>
      </div>
      
      {/* Bottom bar with multiplier */}
      <div className="honkai-bottom-bar">
        {/* SVG segments for better canvas compatibility */}
        <div className="honkai-segments-container" style={{ flex: 1, height: bottomBarHeight, display: 'flex', gap: 2 }}>
          {[0, 1, 2].map((index) => (
            <div key={index} style={{ flex: 1, height: '100%' }}>
              <svg 
                width="100%" 
                height="100%" 
                viewBox="0 0 100 100" 
                preserveAspectRatio="none"
                style={{ display: 'block' }}
              >
                <defs>
                  <linearGradient id={`honkai-segment-gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                  <filter id={`honkai-segment-shadow-${index}`}>
                    <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="rgba(16, 185, 129, 0.4)"/>
                  </filter>
                  <linearGradient id={`honkai-inner-glow-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="transparent" />
                    <stop offset="50%" stopColor="rgba(255, 255, 255, 0.1)" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
                <polygon 
                  points={bottomBarPoints}
                  fill={`url(#honkai-segment-gradient-${index})`}
                  filter={`url(#honkai-segment-shadow-${index})`}
                />
                {/* Inner glow effect */}
                <polygon 
                  points={bottomBarPoints}
                  fill={`url(#honkai-inner-glow-${index})`}
                  opacity="0.1"
                />
              </svg>
            </div>
          ))}
        </div>
        <div className="honkai-multiplier">{multiplier}</div>
      </div>
      
      {/* Boss title row */}
      <div className="honkai-boss-name">{bossName}</div>
    </div>
  );
};

export default HonkaiImpactBar; 