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
      {/* Top bar */}
      <div className="honkai-top-bar"></div>
      
      {/* Bottom bar with multiplier */}
      <div className="honkai-bottom-bar">
        <div className="honkai-segment"></div>
        <div className="honkai-segment"></div>
        <div className="honkai-segment"></div>
        <div className="honkai-multiplier">{multiplier}</div>
      </div>
      
      {/* Boss title row */}
      <div className="honkai-boss-name">{bossName}</div>
    </div>
  );
};

export default HonkaiImpactBar; 