// Generates PWA icons as SVG then converts to PNG-like base64
// Since we don't have canvas, we'll create SVG icons and use them directly
import { writeFileSync } from "fs";

function createIconSVG(size) {
  const pad = size * 0.15;
  const inner = size - pad * 2;
  const r = size * 0.22;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${r}" fill="#8B6914"/>
  <rect x="${pad}" y="${pad}" width="${inner}" height="${inner}" rx="${r * 0.5}" fill="#C4972A" opacity="0.3"/>

  <!-- Kitchen cabinet silhouette -->
  <rect x="${size*0.2}" y="${size*0.25}" width="${size*0.6}" height="${size*0.08}" rx="3" fill="white" opacity="0.9"/>
  <rect x="${size*0.2}" y="${size*0.36}" width="${size*0.28}" height="${size*0.35}" rx="3" fill="white" opacity="0.85"/>
  <rect x="${size*0.52}" y="${size*0.36}" width="${size*0.28}" height="${size*0.35}" rx="3" fill="white" opacity="0.85"/>

  <!-- Door handles -->
  <circle cx="${size*0.315}" cy="${size*0.535}" r="${size*0.025}" fill="#8B6914"/>
  <circle cx="${size*0.685}" cy="${size*0.535}" r="${size*0.025}" fill="#8B6914"/>

  <!-- Counter top line -->
  <rect x="${size*0.18}" y="${size*0.74}" width="${size*0.64}" height="${size*0.04}" rx="2" fill="white" opacity="0.7"/>

  <!-- IA spark -->
  <text x="${size*0.72}" y="${size*0.28}" font-size="${size*0.15}" fill="#FFD700">✦</text>
</svg>`;
}

// Write SVG icons (iPhones support SVG for web app icons via meta tag)
writeFileSync("public/icon.svg", createIconSVG(512));
writeFileSync("public/apple-touch-icon.svg", createIconSVG(180));

console.log("Icons generated successfully");
