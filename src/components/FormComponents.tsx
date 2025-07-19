import React from 'react';
import { bossBars } from '../bossBars';
import { BossBarState, GAME_STYLES, BACKGROUNDS, BACKGROUND_SIZE_OPTIONS, FORMAT_OPTIONS, TEKKEN_COLORS } from '../types/constants';
import './FormComponents.css';

interface FormComponentsProps {
  state: BossBarState;
  onFieldChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onBackgroundChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onDownload: () => void;
  onClear: () => void;
}

const GameStyleSelect: React.FC<{ value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void }> = ({ value, onChange }) => (
  <label>
    Game Style:<br />
    <select name="gameStyle" value={value} onChange={onChange}>
      {GAME_STYLES.map((g) => (
        <option key={g.value} value={g.value}>{g.name}</option>
      ))}
    </select>
  </label>
);

const ScaleSlider: React.FC<{ scale: number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ scale, onChange }) => (
  <label>
    Scale: {scale}
    <input
      type="range"
      min={1}
      max={10}
      name="scale"
      value={scale}
      onChange={onChange}
      className="scale-slider"
    />
  </label>
);

const BackgroundSelect: React.FC<{ value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void }> = ({ value, onChange }) => (
  <label>
    Background:<br />
    <select name="background" value={value} onChange={onChange}>
      {BACKGROUNDS.map((b) => (
        <option key={b.value} value={b.value}>{b.name}</option>
      ))}
    </select>
  </label>
);

const BackgroundSizeSelect: React.FC<{ value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; show: boolean }> = ({ value, onChange, show }) => {
  if (!show) return null;
  
  return (
    <label>
      Background Size:<br />
      <select name="backgroundSize" value={value} onChange={onChange}>
        {BACKGROUND_SIZE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
  );
};

const FormatSelect: React.FC<{ value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void }> = ({ value, onChange }) => (
  <label>
    Format:<br />
    <select name="format" value={value} onChange={onChange}>
      {FORMAT_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  </label>
);

const ActionButtons: React.FC<{ onDownload: () => void; onClear: () => void }> = ({ onDownload, onClear }) => (
  <div className="action-buttons">
    <button onClick={onDownload}>⬇️ Download</button>
    <button onClick={onClear}>🔄 Reset</button>
  </div>
);

const FormComponents: React.FC<FormComponentsProps> = ({ 
  state, 
  onFieldChange, 
  onBackgroundChange, 
  onDownload, 
  onClear 
}) => {
  return (
    <div className="form-container">
      <GameStyleSelect value={state.gameStyle} onChange={onFieldChange} />
      
      {bossBars[state.gameStyle]?.fields.map((field, idx, arr) => {
        // For Tekken 2, render color select next to player input
        if (state.gameStyle === 'tekken2' && field.label.includes('Player') && !field.label.includes('Color')) {
          const colorField = arr[idx + 1];
          return (
            <div key={field.key} className="tekken-field-group">
              <label className="tekken-player-label">
                {field.label}:<br />
                <input
                  name={field.key}
                  value={state[field.key] !== undefined ? state[field.key] : field.default ?? ''}
                  onChange={onFieldChange}
                  maxLength={100}
                />
              </label>
              {colorField && colorField.label.includes('Color') && (
                <label className="tekken-color-label">
                  Color:<br />
                  <select
                    name={colorField.key}
                    value={state[colorField.key] !== undefined ? state[colorField.key] : colorField.default ?? 'red'}
                    onChange={onFieldChange}
                  >
                    {TEKKEN_COLORS.map((color) => (
                      <option key={color.value} value={color.value}>{color.label}</option>
                    ))}
                  </select>
                </label>
              )}
            </div>
          );
        }
        // Hide color fields for Tekken2 (handled above)
        if (state.gameStyle === 'tekken2' && field.label.includes('Color')) {
          return null;
        }
        // Default rendering for other fields
        return (
          <label key={field.key}>
            {field.label}:<br />
            <input
              name={field.key}
              value={state[field.key] !== undefined ? state[field.key] : field.default ?? ''}
              onChange={onFieldChange}
              maxLength={100}
            />
          </label>
        );
      })}
      
      <ScaleSlider scale={state.scale} onChange={onFieldChange} />
      <BackgroundSelect value={state.background} onChange={onBackgroundChange} />
      <BackgroundSizeSelect 
        value={state.backgroundSize} 
        onChange={onFieldChange} 
        show={state.background !== 'transparent'} 
      />
      <FormatSelect value={state.format} onChange={onFieldChange} />
      <ActionButtons onDownload={onDownload} onClear={onClear} />
    </div>
  );
};

export default FormComponents; 