import html2canvas from 'html2canvas';
import { BossBarState } from '../types/constants';

export const convertWebImage = async (imageUrl: string): Promise<string> => {
  console.log('Attempting to convert web image:', imageUrl);
  
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
        img.src = imageUrl;
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
        img.src = imageUrl;
      });
    },
    
    // Approach 3: Use a reliable CORS proxy
    async () => {
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(imageUrl)}`;
      const response = await fetch(proxyUrl);
      if (!response.ok) throw new Error(`Proxy failed: ${response.status}`);
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    },
    
    // Approach 4: Try another CORS proxy
    async () => {
      const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(imageUrl)}`;
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
      const result = await approaches[i]();
      console.log(`Approach ${i + 1} succeeded!`);
      return result;
    } catch (error) {
      console.warn(`Approach ${i + 1} failed:`, error);
      if (i === approaches.length - 1) {
        console.warn('All approaches failed, using original URL');
        return imageUrl;
      }
    }
  }
  
  return imageUrl;
};

export const calculateTargetDimensions = (
  currentWidth: number, 
  currentHeight: number, 
  format: string
): { targetWidth: number; targetHeight: number } => {
  let targetWidth = 1920;
  let targetHeight = 1080;
  
  // If format is video-call, use 16:9 aspect ratio (1920x1080)
  // If format is bar-only, maintain the aspect ratio but scale up to reasonable size
  if (format === 'bar-only') {
    const aspectRatio = currentWidth / currentHeight;
    // Scale up to a reasonable size while maintaining aspect ratio
    // For bar-only, we'll use a height of around 400px and scale width accordingly
    targetHeight = 400;
    targetWidth = Math.round(targetHeight * aspectRatio);
  }
  
  return { targetWidth, targetHeight };
};

export const createCloneForCapture = (
  element: HTMLElement, 
  scale: number, 
  currentWidth: number, 
  currentHeight: number,
  backgroundStyle: React.CSSProperties
): HTMLElement => {
  // Create a hidden clone for screenshot
  const clone = element.cloneNode(true) as HTMLElement;
  clone.style.position = 'absolute';
  clone.style.left = '-9999px';
  clone.style.top = '-9999px';
  clone.style.zIndex = '-9999';
  document.body.appendChild(clone);
  
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
  if (backgroundStyle.backgroundImage) {
    clone.style.backgroundImage = backgroundStyle.backgroundImage as string;
  }
  if (backgroundStyle.backgroundSize) {
    clone.style.backgroundSize = backgroundStyle.backgroundSize as string;
  }
  if (backgroundStyle.backgroundPosition) {
    clone.style.backgroundPosition = backgroundStyle.backgroundPosition as string;
  }
  if (backgroundStyle.backgroundRepeat) {
    clone.style.backgroundRepeat = backgroundStyle.backgroundRepeat as string;
  }
  
  return clone;
};

export const generateFileName = (gameStyle: string, format: string): string => {
  const pageUrl = window.location.href;
  const urlHost = new URL(pageUrl).hostname;
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  return `boss-bar-${gameStyle}-${format}-${urlHost}-${timestamp}.png`;
};

export const downloadCanvas = (canvas: HTMLCanvasElement, fileName: string): void => {
  const link = document.createElement('a');
  link.download = fileName;
  link.href = canvas.toDataURL('image/png');
  link.click();
}; 