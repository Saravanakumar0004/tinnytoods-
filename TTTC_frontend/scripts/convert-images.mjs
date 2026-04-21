import sharp from "sharp";
import { statSync, existsSync } from "fs";
import path from "path";

const images = [
  { input: "public/images/banner1.jpeg",          output: "public/images/banner1.webp",          width: 1920 },
  { input: "public/images/banner.jpeg",           output: "public/images/banner.webp",           width: 1920 },
  { input: "public/images/social.jpg",            output: "public/images/social.webp",           width: 620  },
  { input: "public/images/web-applications.jpg",  output: "public/images/web-applications.webp", width: 620  },
  { input: "public/images/sales-and-growth.jpg",  output: "public/images/sales-and-growth.webp", width: 740  },
  { input: "public/images/website-design.PNG",    output: "public/images/website-design.webp",   width: 928  },
];

for (const { input, output, width } of images) {
  if (!existsSync(input)) {
    console.warn(`Skipping (not found): ${input}`);
    continue;
  }
  try {
    const inputSize = Math.round(statSync(input).size / 1024);
    const info = await sharp(input)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(output);
    const outputSize = Math.round(info.size / 1024);
    console.log(`OK  ${path.basename(input)} => ${path.basename(output)}  ${inputSize}KB => ${outputSize}KB  (saved ${inputSize - outputSize}KB)`);
  } catch (err) {
    console.error(`FAIL: ${input} — ${err.message}`);
  }
}
