import React, { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import logo from './logo.svg';
import './App.css';
import { bossBars } from './bossBars';

const GAME_STYLES = Object.entries(bossBars).map(([value, config]) => ({ name: config.label, value }));

const BACKGROUNDS = [
  { name: 'Transparent', value: 'transparent' },
  { name: 'Dark', value: '#222' },
  { name: 'Light', value: '#eee' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Red', value: '#ef4444' },
];

const LOCAL_STORAGE_KEY = 'boss-bar-generator';

type BossBarState = {
  gameStyle: string;
  background: string;
  format: string;
  scale: number;
  [key: string]: string | number | undefined;
};

// Dynamically generate defaultState using bossBars config
const defaultState: BossBarState = (() => {
  const style = 'genshin';
  const config = bossBars[style];
  const state: BossBarState = {
    gameStyle: style,
    background: 'transparent',
    format: 'video-call',
    scale: 5,
  };
  if (config) {
    config.fields.forEach(f => {
      state[f.key] = f.default ?? '';
    });
  }
  return state;
})();

// Map game styles to font families
const STYLE_FONTS: Record<string, string> = {
  genshin: 'GenshinFont, sans-serif',
  demonsouls: 'serif', // Replace with actual font if available
};

type BossBarProps = {
  gameStyle: string;
  text1: string;
  text2: string;
  text3: string;
  scale: number;
};

const BossBar: React.FC<BossBarProps> = ({ gameStyle, text1, text2, text3, scale }) => {
  // Scale factor: 1 = 0.5x, 5 = 1x, 10 = 2x
  const scaleFactor = scale / 5;
  // For now, only genshin is supported
  if (gameStyle !== 'genshin') return null;
  const barHeight = Math.round(32 * scaleFactor);
  const overlap = Math.round(2 * scaleFactor); // always at least 2px overlap, scaled
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', marginTop: 24 * scaleFactor }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 * scaleFactor }}>
        <div style={{ fontSize: 32 * scaleFactor, fontFamily: 'GenshinFont, sans-serif', fontWeight: 700 }}>{text1}</div>
        <div style={{ fontSize: 20 * scaleFactor, fontFamily: 'GenshinFont, sans-serif', fontWeight: 400, opacity: 0.7 }}>{text2}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 12 * scaleFactor, width: '80%' }}>
        <div style={{ fontSize: 16 * scaleFactor, fontFamily: 'GenshinFont, sans-serif', fontWeight: 400, marginRight: 12 * scaleFactor, whiteSpace: 'nowrap' }}>{text3}</div>
        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <img src={process.env.PUBLIC_URL + '/bars/genshin/bbg-l.png'} alt="bar left" style={{ height: barHeight }} />
          <div style={{ flex: 1, height: barHeight, background: 'none', display: 'flex' }}>
            <img
              src={process.env.PUBLIC_URL + '/bars/genshin/bbg-c.png'}
              alt="bar center"
              style={{
                width: `calc(100% + ${overlap * 2}px)`,
                height: barHeight,
                objectFit: 'fill',
                marginLeft: -overlap,
                marginRight: -overlap,
                display: 'block',
              }}
            />
          </div>
          <img src={process.env.PUBLIC_URL + '/bars/genshin/bbg-r.png'} alt="bar right" style={{ height: barHeight }} />
        </div>
      </div>
    </div>
  );
};

function App() {
  const [state, setState] = useState<BossBarState>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    let loaded = saved ? JSON.parse(saved) : { ...defaultState };
    // Ensure all keys from the current config are present
    const style = loaded.gameStyle || defaultState.gameStyle;
    const config = bossBars[style];
    if (config) {
      config.fields.forEach(f => {
        if (loaded[f.key] === undefined) {
          loaded[f.key] = f.default ?? '';
        }
      });
    }
    return loaded;
  });
  const scale = state.scale;
  const canvasRef = useRef<HTMLDivElement>(null);

  // Persist state (including scale) to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setState((prev) => ({ ...prev, [name]: name === 'scale' ? Number(value) : value }));
  };

  const handleClear = () => {
    setState(defaultState);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  const handleDownload = async () => {
    if (!canvasRef.current) return;
    let scale = 1;
    let width = 800;
    let height = 160;
    let originalStyle: Partial<CSSStyleDeclaration> = {};
    if (state.format === 'video-call') {
      scale = 3; // 640*3=1920, 360*3=1080
      width = 640;
      height = 360;
      // Apply scale transform
      canvasRef.current.style.transform = `scale(${scale})`;
      canvasRef.current.style.transformOrigin = 'top left';
      canvasRef.current.style.width = width + 'px';
      canvasRef.current.style.height = height + 'px';
    }
    // Remove border and padding for download
    originalStyle.border = canvasRef.current.style.border;
    originalStyle.padding = canvasRef.current.style.padding;
    originalStyle.background = canvasRef.current.style.background;
    canvasRef.current.style.border = 'none';
    canvasRef.current.style.padding = '0';
    if (state.background === 'transparent') {
      canvasRef.current.style.background = 'transparent';
    }
    // Wait for browser to apply styles
    await new Promise((r) => setTimeout(r, 50));
    const canvas = await html2canvas(canvasRef.current, {
      backgroundColor: null,
      width: width * scale,
      height: height * scale,
      scale: 1,
    });
    // Revert scale and styles
    if (state.format === 'video-call') {
      canvasRef.current.style.transform = '';
      canvasRef.current.style.transformOrigin = '';
      canvasRef.current.style.width = '';
      canvasRef.current.style.height = '';
    }
    canvasRef.current.style.border = originalStyle.border || '';
    canvasRef.current.style.padding = originalStyle.padding || '';
    canvasRef.current.style.background = originalStyle.background || '';
    const gameStyle = state.gameStyle;
    const format = state.format;
    const pageUrl = window.location.href;
    const urlHost = new URL(pageUrl).hostname;
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const link = document.createElement('a');
    link.download = `boss-bar-${gameStyle}-${format}-${urlHost}-${timestamp}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Simple style simulation for demo
  const getBarStyle = () => {
    const config = bossBars[state.gameStyle];
    let style: React.CSSProperties = { fontWeight: 'bold' };
    if (config && config.fontFamily) {
      style.fontFamily = config.fontFamily;
    }
    return style;
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `linear-gradient(rgba(24,24,27,0.85), rgba(24,24,27,0.85)), url('${process.env.PUBLIC_URL}/meme/3dragons.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        color: '#fff',
        padding: 24,
      }}
    >
      <h1>Boss Bar Generator</h1>
      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
        <div className="form-container">
          <label>
            Game Style:<br />
            <select name="gameStyle" value={state.gameStyle} onChange={handleChange}>
              {GAME_STYLES.map((g) => (
                <option key={g.value} value={g.value}>{g.name}</option>
              ))}
            </select>
          </label>
          {bossBars[state.gameStyle]?.fields.map(field => (
            <label key={field.key}>
              {field.label}:<br />
              <input
                name={field.key}
                value={
                  state[field.key] !== undefined
                    ? state[field.key]
                    : field.default ?? ''
                }
                onChange={handleChange}
                maxLength={32}
              />
            </label>
          ))}
          <label>
            Scale: {scale}
            <input
              type="range"
              min={1}
              max={10}
              name="scale"
              value={scale}
              onChange={handleChange}
              style={{ width: '100%' }}
            />
          </label>
          <label>
            Background:<br />
            <select name="background" value={state.background} onChange={handleChange}>
              {BACKGROUNDS.map((b) => (
                <option key={b.value} value={b.value}>{b.name}</option>
              ))}
            </select>
          </label>
          <label>
            Format:<br />
            <select name="format" value={state.format} onChange={handleChange}>
              <option value="bar-only">Bar Only</option>
              <option value="video-call">Video Call (16:9 Full HD)</option>
            </select>
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleDownload}>Download PNG</button>
            <button onClick={handleClear}>Clear All</button>
          </div>
        </div>
        <div>
          <h2>Live Preview</h2>
          <div
            ref={canvasRef}
            style={{
              minWidth: state.format === 'video-call' ? 640 : 400,
              minHeight: state.format === 'video-call' ? 360 : 80,
              width: state.format === 'video-call' ? 640 : 400,
              height: state.format === 'video-call' ? 360 : 80,
              padding: 16,
              background: state.background === 'transparent' ? 'transparent' : state.background,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: 8,
              border: '2px solid #bfa76a',
              ...getBarStyle(),
            }}
          >
            {(() => {
              const config = bossBars[state.gameStyle];
              if (!config) return null;
              const BarComponent = config.component;
              // Pass only the fields this bar expects
              const barProps: any = { scale };
              config.fields.forEach(f => {
                let val = state[f.key];
                if (val === undefined) {
                  val = f.default ?? '';
                }
                barProps[f.key] = val;
              });
              return <BarComponent {...barProps} />;
            })()}
          </div>
        </div>
      </div>
      <p style={{ marginTop: 32, color: '#aaa', fontSize: 14 }}>
        Made by <a href="https://simonerescio.it" style={{ color: '#3b82f6' }}>Simone Rescio</a>
      </p>
    </div>
  );
}

export default App;
