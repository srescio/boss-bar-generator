import React, { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import logo from './logo.svg';
import './App.css';

const GAME_STYLES = [
  { name: 'Minecraft', value: 'minecraft' },
  { name: 'World of Warcraft', value: 'wow' },
  { name: 'Final Fantasy', value: 'ff' },
];

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
  text1: string;
  text2: string;
  text3: string;
  background: string;
  format: string;
};

const defaultState: BossBarState = {
  gameStyle: 'minecraft',
  text1: '',
  text2: '',
  text3: '',
  background: 'transparent',
  format: 'bar-only',
};

function App() {
  const [state, setState] = useState<BossBarState>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultState;
  });
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setState((prev) => ({ ...prev, [name]: value }));
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
    // Wait for browser to apply styles
    await new Promise((r) => setTimeout(r, 50));
    const canvas = await html2canvas(canvasRef.current, {
      backgroundColor: null,
      width: width * scale,
      height: height * scale,
      scale: 1, // html2canvas will capture the scaled-up DOM
    });
    // Revert scale
    if (state.format === 'video-call') {
      canvasRef.current.style.transform = '';
      canvasRef.current.style.transformOrigin = '';
      canvasRef.current.style.width = '';
      canvasRef.current.style.height = '';
    }
    const link = document.createElement('a');
    const gameStyle = state.gameStyle;
    const format = state.format;
    const pageUrl = window.location.href;
    const urlHost = new URL(pageUrl).hostname;
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    link.download = `boss-bar-${gameStyle}-${format}-${urlHost}-${timestamp}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Simple style simulation for demo
  const getBarStyle = () => {
    switch (state.gameStyle) {
      case 'minecraft':
        return { border: '2px solid #333', borderRadius: 6, background: '#222', color: '#fff', fontFamily: 'monospace', fontWeight: 'bold' };
      case 'wow':
        return { border: '2px solid gold', borderRadius: 12, background: '#2a1a0a', color: 'gold', fontFamily: 'serif', fontWeight: 'bold' };
      case 'ff':
        return { border: '2px solid #aaf', borderRadius: 8, background: '#222244', color: '#aaf', fontFamily: 'sans-serif', fontWeight: 'bold' };
      default:
        return {};
    }
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
          <label>
            Text 1:<br />
            <input name="text1" value={state.text1} onChange={handleChange} maxLength={32} />
          </label>
          <label>
            Text 2:<br />
            <input name="text2" value={state.text2} onChange={handleChange} maxLength={32} />
          </label>
          <label>
            Text 3:<br />
            <input name="text3" value={state.text3} onChange={handleChange} maxLength={32} />
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
              justifyContent: 'center',
              gap: 8,
              ...getBarStyle(),
            }}
          >
            <div style={{ fontSize: 24 }}>{state.text1}</div>
            <div style={{ fontSize: 18 }}>{state.text2}</div>
            <div style={{ fontSize: 14 }}>{state.text3}</div>
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
