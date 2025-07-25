import React from 'react';
import { BOSS_BARS_DATA } from '../bossBarsData';
import { BossBarState, BACKGROUNDS, BACKGROUND_SIZE_OPTIONS, FORMAT_OPTIONS, TEKKEN_COLORS } from '../types/constants';
import './FormComponents.css';

function generateFieldKey(componentName: string, label: string) {
  return `${componentName}_${label.replace(/\s+/g, '').toLowerCase()}`;
}

interface FormComponentsProps {
  state: BossBarState;
  onFieldChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onBackgroundChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onDownload: () => void;
  onClear: () => void;
}

const GameStyleSelect: React.FC<{ value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void }> = ({ value, onChange }) => (
  <fieldset>
    <legend>Game Style</legend>
    <select 
      name="gameStyle" 
      value={value} 
      onChange={onChange}
      aria-label="Select game style for boss bar"
    >
      {BOSS_BARS_DATA.map((g) => (
        <option key={g.value} value={g.value}>{g.label}</option>
      ))}
    </select>
  </fieldset>
);

const ScaleSlider: React.FC<{ scale: number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ scale, onChange }) => (
  <fieldset>
    <legend>Scale: {scale}</legend>
    <input
      type="range"
      min={1}
      max={10}
      name="scale"
      value={scale}
      onChange={onChange}
      className="scale-slider"
      aria-label={`Scale slider, current value: ${scale}`}
      aria-valuemin={1}
      aria-valuemax={10}
      aria-valuenow={scale}
    />
  </fieldset>
);

const BackgroundSelect: React.FC<{ value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void }> = ({ value, onChange }) => (
  <fieldset>
    <legend>Background Image</legend>
    <select 
      name="background" 
      value={value} 
      onChange={onChange}
      aria-label="Select background image"
    >
      {BACKGROUNDS.map((b) => (
        <option key={b.value} value={b.value}>{b.name}</option>
      ))}
    </select>
  </fieldset>
);

const BackgroundSizeSelect: React.FC<{ value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; show: boolean }> = ({ value, onChange, show }) => {
  if (!show) return null;
  
  return (
    <fieldset>
      <legend>Background Size</legend>
      <select 
        name="backgroundSize" 
        value={value} 
        onChange={onChange}
        aria-label="Select background size"
      >
        {BACKGROUND_SIZE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </fieldset>
  );
};

const FormatSelect: React.FC<{ value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void }> = ({ value, onChange }) => (
  <fieldset>
    <legend>Format</legend>
    <select 
      name="format" 
      value={value} 
      onChange={onChange}
      aria-label="Select output format"
    >
      {FORMAT_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  </fieldset>
);

const ActionButtons: React.FC<{ onDownload: () => void; onClear: () => void }> = ({ onDownload, onClear }) => (
  <div className="action-buttons" role="group" aria-label="Boss bar actions">
    <button 
      type="button"
      onClick={onDownload}
      aria-label="Download boss bar image"
    >
      ⬇️ Download
    </button>
    <button 
      type="button"
      onClick={onClear}
      aria-label="Reset all settings to default"
    >
      🔄 Reset
    </button>
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
    <form className="form-container" aria-label="Boss bar configuration form">
      <GameStyleSelect value={state.gameStyle} onChange={onFieldChange} />
      
      {BOSS_BARS_DATA.find(g => g.value === state.gameStyle)?.fields.map((field, idx, arr) => {
        const componentName = state.gameStyle.charAt(0).toUpperCase() + state.gameStyle.slice(1) + 'Bar';
        const fieldKey = generateFieldKey(componentName, field.label);
        // For Tekken 2, render color select next to player input
        if (state.gameStyle === 'tekken2' && field.label.includes('Player') && !field.label.includes('Color')) {
          const colorField = arr[idx + 1];
          const colorFieldKey = colorField ? generateFieldKey(componentName, colorField.label) : '';
          return (
            <fieldset key={fieldKey} className="tekken-field-group">
              <legend>{field.label}</legend>
              <div className="tekken-input-group">
                <label className="tekken-player-label">
                  Player Name:
                  <input
                    name={fieldKey}
                    value={state[fieldKey] !== undefined ? state[fieldKey] : field.default ?? ''}
                    onChange={onFieldChange}
                    maxLength={100}
                    aria-label={`${field.label} player name`}
                  />
                </label>
                {colorField && colorField.label.includes('Color') && (
                  <label className="tekken-color-label">
                    Color:
                    <select
                      name={colorFieldKey}
                      value={state[colorFieldKey] !== undefined ? state[colorFieldKey] : colorField.default ?? 'red'}
                      onChange={onFieldChange}
                      aria-label={`${field.label} color selection`}
                    >
                      {TEKKEN_COLORS.map((color) => (
                        <option key={color.value} value={color.value}>{color.label}</option>
                      ))}
                    </select>
                  </label>
                )}
              </div>
            </fieldset>
          );
        }
        // Hide color fields for Tekken2 (handled above)
        if (state.gameStyle === 'tekken2' && field.label.includes('Color')) {
          return null;
        }
        // Default rendering for other fields
        return (
          <fieldset key={fieldKey}>
            <legend>{field.label}</legend>
            <input
              name={fieldKey}
              value={state[fieldKey] !== undefined ? state[fieldKey] : field.default ?? ''}
              onChange={onFieldChange}
              maxLength={100}
              aria-label={field.label}
            />
          </fieldset>
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
    </form>
  );
};

export default FormComponents; 