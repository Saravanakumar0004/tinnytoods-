import sharp from 'sharp';
import { mkdirSync, existsSync } from 'fs';
import path from 'path';

const inputDir = './public/images';
const outputDir = './public/images';

const images = [
  { file: 'banner.jpeg',  width: 1440 },
  { file: 'banner1.jpeg', width: 1440 },
  { file: 'banner2.jpeg', width: 1440 },
  { file: 'banner3.png',  width: 1440 },
  { file: 'banner4.jpeg', width: 1440 },
  { file: 'banner5.jpeg', width: 1440 },
  { file: 'social.jpg',              width: 800 },
  { file: 'web-applications.jpg',    width: 800 },
  { file: 'website-design.PNG',      width: 800 },
  { file: 'sales-and-growth.jpg',    width: 800 },
];

for (const img of images) {
  const input = path.join(inputDir, img.file);
  const outputName = img.file.replace(/\.(jpeg|jpg|PNG|png)$/i, '.webp');
  const output = path.join(outputDir, outputName);

  try {
    await sharp(input)
      .resize({ width: img.width, withoutEnlargement: true })
      .webp({ quality: 75 })
      .toFile(output);
    console.log(`✅ ${img.file} → ${outputName}`);
  } catch (e) {
    console.log(`⚠️  Skipped ${img.file}: ${e.message}`);
  }
}

console.log('\n🎉 Done! All images converted to WebP.');