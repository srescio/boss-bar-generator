import React, { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import './App.css';
import { BossBarState } from './types/constants';
import { generateDefaultState, loadStateFromStorage, saveStateToStorage, clearStateFromStorage } from './utils/stateUtils';
import { validateImageUrl, createFileInput } from './utils/backgroundUtils';
import { 
  convertWebImage, 
  calculateTargetDimensions, 
  createCloneForCapture, 
  generateFileName, 
  downloadCanvas 
} from './utils/downloadUtils';
import LoadingOverlay from './components/LoadingOverlay';
import Preview from './components/Preview';
import FormComponents from './components/FormComponents';

function App() {
  const [state, setState] = useState<BossBarState>(loadStateFromStorage);
  const [isLoading, setIsLoading] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Persist state (including scale) to localStorage
  useEffect(() => {
    saveStateToStorage(state);
  }, [state]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setState((prev) => ({ ...prev, [name]: name === 'scale' ? Number(value) : value }));
  };

  const handleClear = () => {
    setState(generateDefaultState());
    clearStateFromStorage();
  };

  const handleBackgroundChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    
    if (value === 'web-image') {
      const url = prompt('Enter image URL:');
      if (url) {
        // Basic URL validation
        if (validateImageUrl(url)) {
          setState((prev) => ({ 
            ...prev, 
            background: value,
            backgroundImageUrl: url,
            // Ensure backgroundSize is preserved or set to cover if not present
            backgroundSize: prev.backgroundSize || 'cover'
          }));
        } else {
          alert('Please enter a valid URL');
          setState((prev) => ({ ...prev, background: 'transparent' }));
        }
      } else {
        setState((prev) => ({ ...prev, background: 'transparent' }));
      }
    } else if (value === 'disk-image') {
      createFileInput((file) => {
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
      });
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
        convertedBackgroundUrl = await convertWebImage(state.backgroundImageUrl);
      }
      
      // Get the actual rendered dimensions of the preview container
      const rect = canvasRef.current.getBoundingClientRect();
      const currentWidth = rect.width;
      const currentHeight = rect.height;
      
      // Calculate target dimensions for high-res output
      const { targetWidth, targetHeight } = calculateTargetDimensions(currentWidth, currentHeight, state.format);
      
      // Calculate the scale factor needed
      const scaleX = targetWidth / currentWidth;
      const scaleY = targetHeight / currentHeight;
      const scale = Math.min(scaleX, scaleY); // Use the smaller scale to maintain aspect ratio
      
      // Create a hidden clone for screenshot
      const clone = createCloneForCapture(
        canvasRef.current, 
        scale, 
        currentWidth, 
        currentHeight,
        { backgroundImage: `url('${convertedBackgroundUrl}')` }
      );
      
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
      
      const fileName = generateFileName(state.gameStyle, state.format);
      downloadCanvas(canvas, fileName);
    } finally {
      // Hide loading overlay
      setIsLoading(false);
    }
  };

  return (
    <div
      className="app-background"
      style={{
        '--bg-image': `url('${process.env.PUBLIC_URL}/assets/3dragons.jpg')`
      } as React.CSSProperties}
    >
      <LoadingOverlay isLoading={isLoading} />
      
      <h1>Boss Bar Generator</h1>
      <div className='main-container'>
        <FormComponents
          state={state}
          onFieldChange={handleChange}
          onBackgroundChange={handleBackgroundChange}
          onDownload={handleDownload}
          onClear={handleClear}
        />
        <Preview state={state} canvasRef={canvasRef} />
      </div>
      <p style={{ marginTop: 32, color: '#aaa', fontSize: 14 }}>
        Made by <a href="https://simonerescio.it" style={{ color: '#3b82f6' }}>Simone Rescio</a>
      </p>
    </div>
  );
}

export default App;
