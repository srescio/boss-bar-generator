import React, { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import './App.css';
import { bossBars } from './bossBars';

const GAME_STYLES = Object.entries(bossBars).map(([value, config]) => ({ name: config.label, value }));

const BACKGROUNDS = [
  { name: 'Transparent', value: 'transparent' },
  { name: 'Image from Web (URL)', value: 'web-image' },
  { name: 'Image from Disk', value: 'disk-image' },
];

const LOCAL_STORAGE_KEY = 'boss-bar-generator';

type BossBarState = {
  gameStyle: string;
  background: string;
  backgroundImageUrl?: string;
  backgroundImageFile?: File;
  backgroundSize: string;
  format: string;
  scale: number;
  [key: string]: string | number | undefined | File | any;
};

// Dynamically generate defaultState using bossBars config
const defaultState: BossBarState = (() => {
  const style = 'genshin';
  const config = bossBars[style];
  const state: BossBarState = {
    gameStyle: style,
    background: 'transparent',
    backgroundSize: 'cover', // Default to cover
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

function App() {
  const [state, setState] = useState<BossBarState>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    let loaded = saved ? JSON.parse(saved) : { ...defaultState };
    
    console.log('Loading state from localStorage:', saved);
    console.log('Parsed state:', loaded);
    
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
    // Ensure backgroundSize is set to cover by default if not present
    if (loaded.backgroundSize === undefined) {
      loaded.backgroundSize = 'cover';
    }
    
    console.log('Final loaded state:', loaded);
    return loaded;
  });
  const [isLoading, setIsLoading] = useState(false);
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

  // Force reset backgroundSize to cover for debugging
  const forceResetBackgroundSize = () => {
    setState((prev) => ({ ...prev, backgroundSize: 'cover' }));
    console.log('Forced backgroundSize reset to cover');
  };

  const handleBackgroundChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    
    if (value === 'web-image') {
      const url = prompt('Enter image URL:');
      if (url) {
        // Basic URL validation
        try {
          new URL(url);
          setState((prev) => ({ 
            ...prev, 
            background: value,
            backgroundImageUrl: url,
            // Ensure backgroundSize is preserved or set to cover if not present
            backgroundSize: prev.backgroundSize || 'cover'
          }));
        } catch {
          alert('Please enter a valid URL');
          setState((prev) => ({ ...prev, background: 'transparent' }));
        }
      } else {
        setState((prev) => ({ ...prev, background: 'transparent' }));
      }
    } else if (value === 'disk-image') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/jpeg,image/jpg,image/png,image/gif,image/webp';
      input.onchange = (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
          // Create object URL and store it
          const objectUrl = URL.createObjectURL(file);
          setState((prev) => ({ 
            ...prev, 
            background: value,
            backgroundImageFile: file,
            backgroundImageUrl: objectUrl,
            // Ensure backgroundSize is preserved or set to cover if not present
            backgroundSize: prev.backgroundSize || 'cover'
          }));
        } else {
          setState((prev) => ({ ...prev, background: 'transparent' }));
        }
      };
      input.click();
    } else {
      // Clear image data when switching to transparent
      setState((prev) => ({ 
        ...prev, 
        background: value,
        backgroundImageUrl: undefined, 
        backgroundImageFile: undefined 
      }));
    }
  };

  const handleDownload = async () => {
    if (!canvasRef.current) return;
    
    // Show loading overlay for external images
    if (state.background === 'web-image' && state.backgroundImageUrl) {
      setIsLoading(true);
    }
    
    try {
      // For web images, try multiple approaches to avoid CORS issues
      let convertedBackgroundUrl = state.backgroundImageUrl;
      if (state.background === 'web-image' && state.backgroundImageUrl) {
        console.log('Attempting to convert web image:', state.backgroundImageUrl);
        
        // Try multiple approaches in sequence
        const approaches = [
          // Approach 1: Direct canvas conversion with crossOrigin
          async () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            return new Promise<string>((resolve, reject) => {
              img.onload = () => {
                try {
                  canvas.width = img.width;
                  canvas.height = img.height;
                  ctx?.drawImage(img, 0, 0);
                  const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                  resolve(dataUrl);
                } catch (error) {
                  reject(error);
                }
              };
              img.onerror = () => reject(new Error('Canvas conversion failed'));
              img.src = state.backgroundImageUrl!;
            });
          },
          
          // Approach 2: Try with different crossOrigin values
          async () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            img.crossOrigin = 'use-credentials';
            
            return new Promise<string>((resolve, reject) => {
              img.onload = () => {
                try {
                  canvas.width = img.width;
                  canvas.height = img.height;
                  ctx?.drawImage(img, 0, 0);
                  const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                  resolve(dataUrl);
                } catch (error) {
                  reject(error);
                }
              };
              img.onerror = () => reject(new Error('Canvas conversion failed'));
              img.src = state.backgroundImageUrl!;
            });
          },
          
          // Approach 3: Use a reliable CORS proxy
          async () => {
            const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(state.backgroundImageUrl!)}`;
            const response = await fetch(proxyUrl);
            if (!response.ok) throw new Error(`Proxy failed: ${response.status}`);
            const blob = await response.blob();
            return URL.createObjectURL(blob);
          },
          
          // Approach 4: Try another CORS proxy
          async () => {
            const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(state.backgroundImageUrl!)}`;
            const response = await fetch(proxyUrl);
            if (!response.ok) throw new Error(`Proxy failed: ${response.status}`);
            const blob = await response.blob();
            return URL.createObjectURL(blob);
          }
        ];
        
        // Try each approach until one works
        for (let i = 0; i < approaches.length; i++) {
          try {
            console.log(`Trying approach ${i + 1}...`);
            convertedBackgroundUrl = await approaches[i]();
            console.log(`Approach ${i + 1} succeeded!`);
            break;
          } catch (error) {
            console.warn(`Approach ${i + 1} failed:`, error);
            if (i === approaches.length - 1) {
              console.warn('All approaches failed, using original URL');
            }
          }
        }
      }
      
      // Get the actual rendered dimensions of the preview container
      const rect = canvasRef.current.getBoundingClientRect();
      const currentWidth = rect.width;
      const currentHeight = rect.height;
      
      // Calculate target dimensions for high-res output
      let targetWidth = 1920;
      let targetHeight = 1080;
      
      // If format is video-call, use 16:9 aspect ratio (1920x1080)
      // If format is bar-only, maintain the aspect ratio but scale up to reasonable size
      if (state.format === 'bar-only') {
        const aspectRatio = currentWidth / currentHeight;
        // Scale up to a reasonable size while maintaining aspect ratio
        // For bar-only, we'll use a height of around 400px and scale width accordingly
        targetHeight = 400;
        targetWidth = Math.round(targetHeight * aspectRatio);
      }
      
      // Calculate the scale factor needed
      const scaleX = targetWidth / currentWidth;
      const scaleY = targetHeight / currentHeight;
      const scale = Math.min(scaleX, scaleY); // Use the smaller scale to maintain aspect ratio
      
      // Create a hidden clone for screenshot
      const clone = canvasRef.current.cloneNode(true) as HTMLElement;
      clone.style.position = 'absolute';
      clone.style.left = '-9999px';
      clone.style.top = '-9999px';
      clone.style.zIndex = '-9999';
      document.body.appendChild(clone);
      
      // Get the current background style from React state
      const currentBackgroundStyle = getBackgroundStyle();
      
      // Create a modified background style with the converted URL if available
      let captureBackgroundStyle = { ...currentBackgroundStyle };
      if (state.background === 'web-image' && convertedBackgroundUrl && convertedBackgroundUrl !== state.backgroundImageUrl) {
        captureBackgroundStyle.backgroundImage = `url('${convertedBackgroundUrl}')`;
      }
      
      // Find and hide the silhouette figure in the clone
      const silhouetteFigure = clone.querySelector('.silhouette-figure') as HTMLElement;
      if (silhouetteFigure) {
        silhouetteFigure.style.display = 'none';
      }
      
      // Apply high-res capture styles to the clone
      clone.style.border = 'none';
      clone.style.transform = `scale(${scale})`;
      clone.style.transformOrigin = 'top left';
      clone.style.width = currentWidth + 'px';
      clone.style.height = currentHeight + 'px';
      clone.style.color = '#fff'; // Ensure white text color
      
      // Apply background styles to the clone
      if (captureBackgroundStyle.backgroundImage) {
        clone.style.backgroundImage = captureBackgroundStyle.backgroundImage as string;
      }
      if (captureBackgroundStyle.backgroundSize) {
        clone.style.backgroundSize = captureBackgroundStyle.backgroundSize as string;
      }
      if (captureBackgroundStyle.backgroundPosition) {
        clone.style.backgroundPosition = captureBackgroundStyle.backgroundPosition as string;
      }
      if (captureBackgroundStyle.backgroundRepeat) {
        clone.style.backgroundRepeat = captureBackgroundStyle.backgroundRepeat as string;
      }
      
      // Wait for browser to apply styles
      await new Promise((r) => setTimeout(r, 50));
      
      const canvas = await html2canvas(clone, {
        backgroundColor: null,
        width: targetWidth,
        height: targetHeight,
        scale: 1,
        allowTaint: true,
        useCORS: true,
      });
      
      // Remove the clone from DOM
      document.body.removeChild(clone);
      
      // Clean up converted URL if it was created (only for blob URLs)
      if (convertedBackgroundUrl && convertedBackgroundUrl !== state.backgroundImageUrl && convertedBackgroundUrl.startsWith('blob:')) {
        URL.revokeObjectURL(convertedBackgroundUrl);
      }
      
      const gameStyle = state.gameStyle;
      const format = state.format;
      const pageUrl = window.location.href;
      const urlHost = new URL(pageUrl).hostname;
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const link = document.createElement('a');
      link.download = `boss-bar-${gameStyle}-${format}-${urlHost}-${timestamp}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } finally {
      // Hide loading overlay
      setIsLoading(false);
    }
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

  const getBackgroundStyle = (): React.CSSProperties => {
    if (state.background === 'transparent') {
      return { background: 'transparent' };
    } else if ((state.background === 'web-image' || state.background === 'disk-image') && state.backgroundImageUrl) {
      console.log('Background style applied:', {
        background: state.background,
        backgroundSize: state.backgroundSize,
        url: state.backgroundImageUrl
      });
      return { 
        backgroundImage: `url('${state.backgroundImageUrl}')`,
        backgroundSize: state.backgroundSize,
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat'
      };
    }
    return { background: 'transparent' };
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `linear-gradient(rgba(24,24,27,0.85), rgba(24,24,27,0.85)), url('${process.env.PUBLIC_URL}/assets/3dragons.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        color: '#fff',
        padding: 24,
      }}
    >
      {/* Loading Overlay */}
      {isLoading && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            color: '#fff',
          }}
        >
          <div
            style={{
              width: '50px',
              height: '50px',
              border: '4px solid #3b82f6',
              borderTop: '4px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
          <p style={{ marginTop: '16px', fontSize: '18px', textAlign: 'center' }}>
            Processing external image...
            <br />
            <span style={{ fontSize: '14px', opacity: 0.8 }}>
              This may take a few seconds
            </span>
          </p>
        </div>
      )}
      
      <h1>Boss Bar Generator</h1>
      <div className='main-container'>
        <div className="form-container">
          <label>
            Game Style:<br />
            <select name="gameStyle" value={state.gameStyle} onChange={handleChange}>
              {GAME_STYLES.map((g) => (
                <option key={g.value} value={g.value}>{g.name}</option>
              ))}
            </select>
          </label>
          {bossBars[state.gameStyle]?.fields.map((field, idx, arr) => {
            // For Tekken 2, render color select next to player input
            if (state.gameStyle === 'tekken2' && field.label.includes('Player') && !field.label.includes('Color')) {
              const colorField = arr[idx + 1];
              return (
                <div key={field.key} style={{ display: 'flex', gap: 8, alignItems: 'center', width: '100%' }}>
                  <label style={{ flex: 2 }}>
                    {field.label}:<br />
                    <input
                      name={field.key}
                      value={state[field.key] !== undefined ? state[field.key] : field.default ?? ''}
                      onChange={handleChange}
                      maxLength={32}
                    />
                  </label>
                  {colorField && colorField.label.includes('Color') && (
                    <label style={{ flex: 1 }}>
                      Color:<br />
                      <select
                        name={colorField.key}
                        value={state[colorField.key] !== undefined ? state[colorField.key] : colorField.default ?? 'red'}
                        onChange={handleChange}
                      >
                        <option value="red">Red</option>
                        <option value="darkred">Dark Red</option>
                        <option value="brightred">Bright Red</option>
                        <option value="blue">Blue</option>
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
                  onChange={handleChange}
                  maxLength={32}
                />
              </label>
            );
          })}
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
            <select name="background" value={state.background} onChange={handleBackgroundChange}>
              {BACKGROUNDS.map((b) => (
                <option key={b.value} value={b.value}>{b.name}</option>
              ))}
            </select>
          </label>
          {state.background !== 'transparent' && (
            <label>
              Background Size:<br />
              <select name="backgroundSize" value={state.backgroundSize} onChange={handleChange}>
                <option value="cover">Cover (fills container, may crop)</option>
                <option value="contain">Contain (fits in container, may show gaps)</option>
                <option value="auto">Auto (original size)</option>
              </select>
            </label>
          )}
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
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={forceResetBackgroundSize} style={{ fontSize: '0.8rem', padding: '0.3em' }}>
              Force Reset Background Size
            </button>
          </div>
        </div>
        <div className='preview-container-wrapper'>
          <h2>Live Preview</h2>
          <div className={`preview-container ${state.format === 'video-call' ? 'video-call' : ''}`}
            ref={canvasRef}
            style={{
              ...getBackgroundStyle(),
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
            <figure className="silhouette-figure">
              <img 
                src={`${process.env.PUBLIC_URL}/assets/silhouette.png`}
                alt="Silhouette"
                className="silhouette-image"
              />
            </figure>
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
