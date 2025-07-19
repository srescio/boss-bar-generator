import React from 'react';
import './HonkaiImpactBar.css';

interface HonkaiImpactBarProps {
  bossName: string;
  multiplier: string;
  scale: number;
}

const HonkaiImpactBar: React.FC<HonkaiImpactBarProps> = ({ bossName, multiplier, scale }) => {
  return (
    <div className="honkai-impact-bar">
      {/* Top slim bar */}
      <div className="honkai-top-bar"></div>
      
      {/* Bottom segmented bar */}
      <div className="honkai-bottom-bar">
        <div className="honkai-segment"></div>
        <div className="honkai-segment"></div>
        <div className="honkai-segment"></div>
      </div>
      
      {/* Boss name on bottom right */}
      <div className="honkai-boss-name">{bossName}</div>
      
      {/* Multiplier on right of segmented bar */}
      <div className="honkai-multiplier">{multiplier}</div>
    </div>
  );
};

export default HonkaiImpactBar; 