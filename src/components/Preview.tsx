import React from 'react';
import { BOSS_BARS_DATA } from '../bossBarsData';
import GenshinBar from '../bars/GenshinBar';
import DemonsSoulsBar from '../bars/DemonsSoulsBar';
import Tekken2Bar from '../bars/Tekken2Bar';
import HonkaiImpactBar from '../bars/HonkaiImpactBar';
import { BossBarState } from '../types/constants';
import { getBarStyle, getBackgroundStyle } from '../utils/backgroundUtils';

interface PreviewProps {
  state: BossBarState;
  canvasRef: React.RefObject<HTMLDivElement | null>;
}

const BAR_COMPONENTS: Record<string, React.FC<any>> = {
  genshin: GenshinBar,
  demonsouls: DemonsSoulsBar,
  tekken2: Tekken2Bar,
  honkaiimpact: HonkaiImpactBar,
};

function generateFieldKey(componentName: string, label: string) {
  return `${componentName}_${label.replace(/\s+/g, '').toLowerCase()}`;
}

const Preview: React.FC<PreviewProps> = ({ state, canvasRef }) => {
  return (
    <section className='preview-container-wrapper' aria-labelledby="preview-title">
      <h2 id="preview-title">Live Preview</h2>
      <div 
        className={`preview-container ${state.format === 'video-call' ? 'video-call' : ''}`}
        ref={canvasRef}
        style={{
          ...getBackgroundStyle(state),
          ...getBarStyle(state.gameStyle),
        }}
        role="img"
        aria-label={`Boss bar preview in ${state.gameStyle} style`}
      >
        {(() => {
          const config = BOSS_BARS_DATA.find(g => g.value === state.gameStyle);
          if (!config) return null;
          const BarComponent = BAR_COMPONENTS[state.gameStyle];
          if (!BarComponent) return null;
          // Pass only the fields this bar expects
          const barProps: any = { scale: state.scale };
          config.fields.forEach(f => {
            const componentName = state.gameStyle.charAt(0).toUpperCase() + state.gameStyle.slice(1) + 'Bar';
            const key = generateFieldKey(componentName, f.label);
            let val = state[key];
            if (val === undefined) {
              val = f.default ?? '';
            }
            barProps[key] = val;
          });
          return <BarComponent {...barProps} />;
        })()}
        <figure className="silhouette-figure" role="img" aria-label="Character silhouette">
          <img 
            src={`${process.env.PUBLIC_URL}/assets/silhouette.png`}
            alt="Character silhouette for boss bar preview"
            className="silhouette-image"
            loading="lazy"
          />
        </figure>
      </div>
    </section>
  );
};

export default Preview; 