import fs from 'fs';
import path from 'path';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

function compareScreenshotsPixelLevel(currentFiles, baselineDir, tolerance = 0.1) {
  const results = [];
  
  // Determine if this is a UI screenshot comparison or boss bar download comparison
  const isUIScreenshot = currentFiles.some(file => file.startsWith('app-'));
  const currentDir = isUIScreenshot ? 'cypress/screenshots/App.cy.tsx' : 'cypress/downloads';
  
  for (const currentFile of currentFiles) {
    const currentPath = path.join(currentDir, currentFile);
    
    // Find matching baseline file
    let baselineFile = null;
    if (fs.existsSync(baselineDir)) {
      const baselineFiles = fs.readdirSync(baselineDir);
      baselineFile = baselineFiles.find(file => {
        // For UI screenshots, exact match
        if (isUIScreenshot) {
          return file === currentFile;
        }
        // For boss bar downloads, match by removing timestamp part
        const currentBase = currentFile.replace(/localhost-\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}/, '');
        const baselineBase = file.replace(/localhost-\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}/, '');
        return currentBase === baselineBase;
      });
    }
    
    if (!baselineFile) {
      results.push({
        file: currentFile,
        success: false,
        error: `No matching baseline file found for: ${currentFile}`
      });
      continue;
    }
    
    const baselinePath = path.join(baselineDir, baselineFile);
    
    try {
      // Read PNG files
      const currentPng = PNG.sync.read(fs.readFileSync(currentPath));
      const baselinePng = PNG.sync.read(fs.readFileSync(baselinePath));
      
      // Check dimensions
      if (currentPng.width !== baselinePng.width || currentPng.height !== baselinePng.height) {
        results.push({
          file: currentFile,
          success: false,
          error: `Size mismatch: current ${currentPng.width}x${currentPng.height}, baseline ${baselinePng.width}x${baselinePng.height}`
        });
        continue;
      }
      
      // Create diff image
      const diff = new PNG({ width: currentPng.width, height: currentPng.height });
      
      // Compare images with pixelmatch
      const numDiffPixels = pixelmatch(
        currentPng.data,
        baselinePng.data,
        diff.data,
        currentPng.width,
        currentPng.height,
        { threshold: 0.1 }
      );
      
      const totalPixels = currentPng.width * currentPng.height;
      const diffPercentage = (numDiffPixels / totalPixels) * 100;
      
      // Check if difference is within tolerance
      const passed = diffPercentage <= (tolerance * 100);
      
      results.push({
        file: currentFile,
        baselineFile: baselineFile,
        success: passed,
        diffPixels: numDiffPixels,
        totalPixels: totalPixels,
        diffPercentage: diffPercentage.toFixed(2),
        tolerance: tolerance * 100,
        identical: numDiffPixels === 0,
        message: passed ? 
          (numDiffPixels === 0 ? 'Files are identical' : `Files are similar (${diffPercentage.toFixed(2)}% different)`) : 
          `Files differ significantly (${diffPercentage.toFixed(2)}% different)`,
        comparisonType: 'pixel'
      });
      
      // Save diff image if there are differences and they exceed tolerance
      if (!passed) {
        const diffPath = path.join(currentDir, `diff-${currentFile}`);
        fs.writeFileSync(diffPath, PNG.sync.write(diff));
      }
      
    } catch (error) {
      results.push({
        file: currentFile,
        success: false,
        error: `Pixel comparison failed: ${error.message}`
      });
    }
  }
  
  const allPassed = results.every(r => r.success);
  
  return {
    success: allPassed,
    results: results,
    summary: {
      total: results.length,
      passed: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length
    }
  };
}

// Allow direct execution
if (process.argv[1] === new URL(import.meta.url).pathname) {
  const args = process.argv.slice(2);
  if (args.length >= 2) {
    const currentFiles = JSON.parse(args[0]);
    const baselineDir = args[1];
    const tolerance = args[2] || 0.1;
    
    const result = compareScreenshotsPixelLevel(currentFiles, baselineDir, tolerance);
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log('Usage: node pixel-compare.mjs <currentFiles> <baselineDir> [tolerance]');
  }
}

export { compareScreenshotsPixelLevel }; 