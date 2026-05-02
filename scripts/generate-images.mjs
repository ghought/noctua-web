// Generates raster images from SVG sources.
// Run once: node scripts/generate-images.mjs
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pub = (f) => resolve(__dirname, '..', 'public', f);

// OG image — 1200×630
await sharp(readFileSync(pub('og-image.svg')))
  .resize(1200, 630)
  .png({ compressionLevel: 9 })
  .toFile(pub('og-image.png'));
console.log('✓  og-image.png');

// Apple touch icon — 180×180 (from the square favicon)
await sharp(readFileSync(pub('favicon.svg')))
  .resize(180, 180)
  .png({ compressionLevel: 9 })
  .toFile(pub('apple-touch-icon.png'));
console.log('✓  apple-touch-icon.png');
