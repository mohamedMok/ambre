import fs from 'node:fs';
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

function cssBlock(selector, tokens) {
  const lines = tokens
    .filter((token) => token.css)
    .map((token) => {
      const comment = token.description ? ` /* ${token.description.replace(/\*\//g, '')} */` : '';
      return `  ${token.css}: ${token.value};${comment}`;
    });
  return `${selector} {\n${lines.join('\n')}\n}`;
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
  `${header}\nexport const tokens = ${JSON.stringify(nest(system), null, 2)};\nexport const dark = ${JSON.stringify(nest(dark), null, 2)};\n`,
);
fs.writeFileSync(
  path.join(dist, 'json', 'tokens.json'),
  JSON.stringify({ reference, system, dark }, null, 2) + '\n',
);

fs.rmSync(path.join(dist, 'css', 'parts'), { recursive: true, force: true });

console.log(
  `tokens: ${reference.length} reference, ${system.length} public, ${dark.length} dark overrides`,
);
