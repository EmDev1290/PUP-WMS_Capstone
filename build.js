/**
 * Build script to copy Lucide icons to dist folder
 */
const fs = require('fs');
const path = require('path');

const distDir = './dist';
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy Lucide package files
const lucideSource = './node_modules/lucide/dist';
const lucideDest = './dist/lucide';

if (fs.existsSync(lucideSource)) {
  if (!fs.existsSync(lucideDest)) {
    fs.mkdirSync(lucideDest, { recursive: true });
  }
  
  // Copy umd bundle
  if (fs.existsSync(path.join(lucideSource, 'umd/lucide.js'))) {
    fs.copyFileSync(
      path.join(lucideSource, 'umd/lucide.js'),
      path.join(lucideDest, 'lucide.js')
    );
    console.log('✓ Lucide icons bundled successfully');
  }
}

console.log('✓ Build complete');
