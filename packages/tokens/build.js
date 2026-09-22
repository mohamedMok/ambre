import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import StyleDictionary from 'style-dictionary';

const root = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(root, 'dist');

function abs(rel) {
  return path.join(root, rel);
}

function record(token) {
  const cssName = token.name?.startsWith('--') ? token.name : `--${token.name}`;
  return {
    path: token.path.join('.'),
    css: token.isSource === false ? null : cssName,
    value: token.$value ?? token.value,
    type: token.$type ?? token.type ?? null,
    description: token.$description ?? token.original?.$description ?? '',
  };
}

async function load(source, include = []) {
  const sd = new StyleDictionary({
    include,
    source,
    platforms: {
      css: {
        transformGroup: 'css',
        prefix: 'amb',
        buildPath: path.join(dist, 'css', 'parts') + path.sep,
        files: [
          {
            destination: 'unused.css',
            format: 'css/variables',
            filter: () => false,
          },
        ],
      },
    },
    log: { verbosity: 'silent' },
  });
  await sd.hasInitialized;
  const dictionary = await sd.getPlatformTokens('css');
  return dictionary.allTokens.map(record).sort((a, b) => a.path.localeCompare(b.path));
}

function cssBlock(selector, tokens, extras = []) {
  const lines = tokens
    .filter((token) => token.css)
    .map((token) => {
      const comment = token.description ? ` /* ${token.description.replace(/\*\//g, '')} */` : '';
      return `  ${token.css}: ${token.value};${comment}`;
    });
  const body = [...extras.map((line) => `  ${line};`), ...lines];
  return `${selector} {\n${body.join('\n')}\n}`;
}

function expandColors(node) {
  if (!node || typeof node !== 'object') return node;
  if (node.$type === 'color' && typeof node.$value === 'string') {
    const hex = node.$value.toLowerCase();
    if (!/^#[0-9a-f]{6}$/.test(hex)) {
      throw new Error(`Preset color must be a 6-digit hex, got ${node.$value}`);
    }
    const channels = [1, 3, 5].map((index) => parseInt(hex.slice(index, index + 2), 16) / 255);
    return {
      ...node,
      $value: {
        colorSpace: 'srgb',
        components: channels.map((channel) => Math.round(channel * 10000) / 10000),
        hex,
      },
    };
  }
  if (Array.isArray(node)) return node.map((item) => expandColors(item));
  return Object.fromEntries(Object.entries(node).map(([key, value]) => [key, expandColors(value)]));
}

function scssFile(tokens) {
  return tokens
    .filter((token) => token.css)
    .map((token) => {
      const name = token.css.replace(/^--/, '$');
      const comment = token.description ? `/* ${token.description.replace(/\*\//g, '')} */\n` : '';
      return `${comment}${name}: ${token.value};`;
    })
    .join('\n');
}

function nest(tokens) {
  const tree = {};
  for (const token of tokens) {
    if (!token.css) continue;
    const segments = token.path.split('.');
    let cursor = tree;
    for (const segment of segments.slice(0, -1)) {
      cursor[segment] ??= {};
      cursor = cursor[segment];
    }
    cursor[segments.at(-1)] = token.value;
  }
  return tree;
}

const include = [abs('src/reference/**/*.json')];
const reference = await load([abs('src/reference/**/*.json')]);
const system = (await load([abs('src/system/**/*.json'), abs('src/theme/light/**/*.json')], include)).filter(
  (token) => token.css,
);
const dark = (await load([abs('src/theme/dark/**/*.json')], include)).filter((token) => token.css);

const presetDir = abs('src/preset');
const presetFiles = fs.existsSync(presetDir)
  ? fs.readdirSync(presetDir).filter((name) => name.endsWith('.json')).sort()
  : [];
const presetBlocks = [];
const presets = {};
const presetList = [];

for (const file of presetFiles) {
  const id = path.basename(file, '.json');
  if (!/^[a-z][a-z0-9-]*$/.test(id)) throw new Error(`Preset file name must be a brand id: ${file}`);
  const source = JSON.parse(fs.readFileSync(path.join(presetDir, file), 'utf8'));
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'ambre-preset-'));
  const lightPath = path.join(temp, 'light.json');
  const darkPath = path.join(temp, 'dark.json');
  fs.writeFileSync(lightPath, JSON.stringify(expandColors({ ...(source.shared ?? {}), ...(source.light ?? {}) })));
  fs.writeFileSync(darkPath, JSON.stringify(expandColors({ ...(source.shared ?? {}), ...(source.dark ?? {}) })));
  const lightTokens = (await load([lightPath], include)).filter((token) => token.css);
  const darkTokens = (await load([darkPath], include)).filter((token) => token.css);
  fs.rmSync(temp, { recursive: true, force: true });
  const name = typeof source.name === 'string' && source.name ? source.name : id;
  presetBlocks.push(
    cssBlock(`[data-brand="${id}"]:not([data-theme="dark"])`, lightTokens, ['color-scheme: light']),
  );
  presetBlocks.push(cssBlock(`[data-brand="${id}"][data-theme="dark"]`, darkTokens, ['color-scheme: dark']));
  presets[id] = { name, light: lightTokens, dark: darkTokens };
  presetList.push({ id, name });
}

for (const token of reference) token.css = null;

fs.mkdirSync(path.join(dist, 'css'), { recursive: true });
fs.mkdirSync(path.join(dist, 'scss'), { recursive: true });
fs.mkdirSync(path.join(dist, 'js'), { recursive: true });
fs.mkdirSync(path.join(dist, 'json'), { recursive: true });

const header = `/* Generated from packages/tokens/src by Style Dictionary. Do not edit. */`;
const css = [
  header,
  ':root { color-scheme: light; }',
  '[data-theme="dark"] { color-scheme: dark; }',
  cssBlock(':root, [data-theme="light"]', system),
  cssBlock('[data-theme="dark"]', dark),
  '',
].join('\n');

fs.writeFileSync(path.join(dist, 'css', 'tokens.css'), css);
fs.writeFileSync(path.join(dist, 'css', 'presets.css'), [header, ...presetBlocks, ''].join('\n'));
fs.writeFileSync(
  path.join(dist, 'scss', '_tokens.scss'),
  `${header}\n${scssFile(system)}\n`,
);
fs.writeFileSync(
  path.join(dist, 'scss', '_tokens-dark.scss'),
  `${header}\n${scssFile(dark)}\n`,
);
fs.writeFileSync(
  path.join(dist, 'js', 'tokens.js'),
  `${header}\nexport const tokens = ${JSON.stringify(nest(system), null, 2)};\nexport const dark = ${JSON.stringify(nest(dark), null, 2)};\nexport const presetList = ${JSON.stringify(presetList, null, 2)};\n`,
);
fs.writeFileSync(
  path.join(dist, 'json', 'tokens.json'),
  JSON.stringify({ reference, system, dark, presets }, null, 2) + '\n',
);

fs.rmSync(path.join(dist, 'css', 'parts'), { recursive: true, force: true });

console.log(
  `tokens: ${reference.length} reference, ${system.length} public, ${dark.length} dark overrides, ${presetList.length} presets`,
);
