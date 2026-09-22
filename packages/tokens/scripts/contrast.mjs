import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(fs.readFileSync(path.join(root, 'dist/json/tokens.json'), 'utf8'));
const pairs = JSON.parse(fs.readFileSync(path.join(root, 'src/contrast-pairs.json'), 'utf8'));

function index(list) {
  return Object.fromEntries(list.map((token) => [token.path, token.value]));
}

const light = index(data.system);
const dark = { ...light, ...index(data.dark) };
const brands = [['ambre', light, dark]];
for (const [id, preset] of Object.entries(data.presets ?? {})) {
  brands.push([id, { ...light, ...index(preset.light) }, { ...dark, ...index(preset.dark) }]);
}

function channels(hex) {
  const value = hex.replace('#', '');
  if (!/^[0-9a-fA-F]{6}$/.test(value)) {
    throw new Error(`Expected a 6-digit hex color, got ${hex}`);
  }
  return [0, 2, 4].map((index) => {
    const channel = parseInt(value.slice(index, index + 2), 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
}

function luminance(hex) {
  const [r, g, b] = channels(hex);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(foreground, background) {
  const lighter = Math.max(luminance(foreground), luminance(background));
  const darker = Math.min(luminance(foreground), luminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}

let failed = 0;
for (const [brand, lightMap, darkMap] of brands) {
  for (const pair of pairs) {
    const map = pair.theme === 'dark' ? darkMap : lightMap;
    const ratio = contrast(map[pair.fg], map[pair.bg]);
    const rounded = Math.round(ratio * 100) / 100;
    if (ratio + 0.001 < pair.min) {
      failed += 1;
      console.error(
        `FAIL ${brand} ${pair.theme} ${pair.fg} on ${pair.bg}: ${rounded} < ${pair.min} (${pair.purpose})`,
      );
    }
  }
}

if (failed > 0) {
  console.error(`${failed} contrast pair${failed === 1 ? '' : 's'} failed`);
  process.exit(1);
}

console.log(
  `${pairs.length} contrast pairs pass for ${brands.map(([brand]) => brand).join(', ')}`,
);
