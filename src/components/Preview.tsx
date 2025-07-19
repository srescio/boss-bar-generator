import React from 'react';
import { bossBars } from '../bossBars';
import { BossBarState } from '../types/constants';
import { getBarStyle, getBackgroundStyle } from '../utils/backgroundUtils';

interface PreviewProps {
  state: BossBarState;
  canvasRef: React.RefObject<HTMLDivElement | null>;
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
          const config = bossBars[state.gameStyle];
          if (!config) return null;
          const BarComponent = config.component;
          // Pass only the fields this bar expects
          const barProps: any = { scale: state.scale };
          config.fields.forEach(f => {
            let val = state[f.key];
            if (val === undefined) {
              val = f.default ?? '';
            }
            barProps[f.key] = val;
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