import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const INPUT_DIRS = ['public', 'src/assets/images'];
const OUTPUT_DIR = 'public/_optimized';
const SIZES = [360, 640, 960, 1280, 1920];
const FORMATS = ['avif','webp','jpeg'];

function ensureDir(p){ if(!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }); }

async function processImage(file){
  const rel = path.relative(process.cwd(), file);
  const name = path.basename(file, path.extname(file));
  for(const size of SIZES){
    const outBase = path.join(OUTPUT_DIR, `${name}-${size}`);
    for(const fmt of FORMATS){
      const out = `${outBase}.${fmt}`;
      await sharp(file).resize({ width: size }).toFormat(fmt, { quality: 80 }).toFile(out);
      console.log('wrote', out);
    }
  }
}

(async ()=>{
  ensureDir(OUTPUT_DIR);
  for(const dir of INPUT_DIRS){
    if(!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir).filter(f => /\.(png|jpe?g|webp)$/i.test(f));
    for(const f of files){
      const file = path.join(dir, f);
      try{ await processImage(file); } catch(e){ console.error('failed', file, e); }
    }
  }
  console.log('done');
})();
