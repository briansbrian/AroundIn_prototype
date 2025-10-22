import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, '..', 'public', 'images');
const outDir = path.join(srcDir, 'optimized');
const widths = [320, 640, 1024, 1600]; // generate responsive sizes
const quality = 75; // adjust (60-85) for smaller size

async function ensureDir(dir){ await fs.mkdir(dir, { recursive: true }); }

async function processFile(file){
  const ext = path.extname(file).toLowerCase();
  if (!['.jpg','.jpeg','.png','.tif','.tiff'].includes(ext)) return;
  const name = path.basename(file, ext);
  const input = path.join(srcDir, file);

  await Promise.all(widths.map(async w => {
    const resizeOpts = { width: w, withoutEnlargement: true }; // don't enlarge if smaller
    // JPEG/PNG optimized baseline
    const outJpeg = path.join(outDir, `${name}-${w}.jpg`);
    await sharp(input).resize(resizeOpts).jpeg({ quality }).toFile(outJpeg);

    // WebP
    const outWebp = path.join(outDir, `${name}-${w}.webp`);
    await sharp(input).resize(resizeOpts).webp({ quality }).toFile(outWebp);

    // AVIF (smaller but slower)
    const outAvif = path.join(outDir, `${name}-${w}.avif`);
    await sharp(input).resize(resizeOpts).avif({ quality }).toFile(outAvif);
  }));

  console.log('Processed', file);
}

(async()=>{
  await ensureDir(outDir);
  const files = await fs.readdir(srcDir);
  for (const f of files) {
    if (f === 'optimized') continue; // skip the output dir
    await processFile(f);
  }
  console.log('Done.');
})().catch(err=>{ console.error(err); process.exit(1); });