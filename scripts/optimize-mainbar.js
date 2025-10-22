import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const src = path.join(__dirname, '..', 'public', 'images', 'Mainbar.png');
const outDir = path.join(__dirname, '..', 'public', 'images', 'optimized');
const widths = [320, 640, 1024, 1600];
const quality = 78;

async function ensureDir(d){ await fs.mkdir(d, { recursive: true }); }

(async () => {
  await ensureDir(outDir);
  for (const w of widths) {
    const base = path.join(outDir, `mainbar-${w}`);
    await sharp(src).resize({ width: w, withoutEnlargement: true }).avif({ quality }).toFile(base + '.avif');
    await sharp(src).resize({ width: w, withoutEnlargement: true }).webp({ quality }).toFile(base + '.webp');
    await sharp(src).resize({ width: w, withoutEnlargement: true }).jpeg({ quality }).toFile(base + '.jpg');
    console.log('wrote', base);
  }
  console.log('mainbar optimized');
})().catch(e => { console.error(e); process.exit(1); });